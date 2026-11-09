import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { settingsRepo, orderRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser._id) {
      return NextResponse.json({ error: 'Please sign in to proceed with payment.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { planId, billingCycle = 'monthly', referralCode = '' } = body;

    if (!['starter', 'pro', 'enterprise'].includes(planId)) {
      return NextResponse.json({ error: 'Invalid plan selected. Please choose a valid plan.' }, { status: 400 });
    }

    const settings = await settingsRepo.getSettings();
    const famgateway = settings.famgateway;

    if (!famgateway?.apiKey) {
      return NextResponse.json(
        {
          error: 'Online payment gateway is temporarily unconfigured. Please contact support or the administrator.',
        },
        { status: 503 }
      );
    }

    // Determine plan pricing and name
    const pricing = settings.pricing || {};
    const planConfig = pricing[planId] || {};
    let amount = 0;
    let planName = '';

    if (planId === 'starter') {
      planName = 'Starter';
      amount = billingCycle === 'yearly' ? Number(planConfig.yearly) || 399 : Number(planConfig.monthly) || 499;
    } else if (planId === 'pro') {
      planName = 'Pro';
      amount = billingCycle === 'yearly' ? Number(planConfig.yearly) || 849 : Number(planConfig.monthly) || 999;
    } else if (planId === 'enterprise') {
      planName = 'Ultra Enterprise';
      amount = billingCycle === 'yearly' ? Number(planConfig.yearly) || 1999 : Number(planConfig.monthly) || 2499;
    }

    // If amount is zero or negative (e.g. promotional free trial)
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Selected plan has zero price. Please select a paid subscription plan.' },
        { status: 400 }
      );
    }

    // Referral Code Evaluation (arventaventures360 -> Instant ₹500 discount)
    const originalAmount = amount;
    let discountApplied = 0;
    const cleanReferral = String(referralCode || '').trim();
    let isReferralValid = false;

    if (cleanReferral) {
      if (cleanReferral.toLowerCase() === 'arventaventures360') {
        isReferralValid = true;
        if (amount > 500) {
          discountApplied = 500;
          amount = amount - 500;
        } else {
          // 100% Free - ₹500 discount completely covers the plan amount!
          discountApplied = amount;
          amount = 0;
        }
      } else {
        return NextResponse.json(
          { error: 'Invalid referral code. Please check and try again.' },
          { status: 400 }
        );
      }
    }

    const customerName = sessionUser.businessName || sessionUser.ownerName || 'Merchant Partner';
    const customerEmail = sessionUser.email;
    const customerPhone = sessionUser.phone || '';

    // If amount is 0 (100% free via referral discount), activate immediately with zero payment required!
    if (amount === 0) {
      const freeOrderId = `REF_FREE_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // Persist free completed order record in database
      await orderRepo.create({
        orderId: freeOrderId,
        userId: sessionUser._id,
        userEmail: sessionUser.email,
        businessName: customerName,
        planId,
        planName,
        billingCycle,
        amount: originalAmount,
        payableAmount: 0,
        currency: 'INR',
        upiId: '',
        qrUrl: '',
        checkoutUrl: '',
        upiIntent: '',
        status: 'pending',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        metadata: {
          referralCode: 'arventaventures360',
          discountApplied,
          originalAmount,
          isFree: true,
        },
      });

      // Atomically mark success and activate user subscription
      await orderRepo.markSuccess({
        orderId: freeOrderId,
        utr: `ARVENTA360_FREE_${Date.now()}`,
        transactionId: freeOrderId,
        senderName: customerName,
        amount: 0,
        paidAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        isFree: true,
        order: {
          orderId: freeOrderId,
          amount: originalAmount,
          payableAmount: 0,
          discountApplied,
          referralCode: 'arventaventures360',
          planId,
          planName,
          billingCycle,
          status: 'success',
          isPaid: true,
        },
      });
    }

    const appUrl = (
      settings.general?.appUrl ||
      process.env.NEXT_PUBLIC_APP_URL ||
      request.headers.get('origin') ||
      'http://localhost:3000'
    ).replace(/\/+$/, '');

    // Call FamGateway Canonical REST API (POST /api/create-order)
    const fgResponse = await fetch('https://famgateway.in/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': famgateway.apiKey,
      },
      body: JSON.stringify({
        amount: Number(amount.toFixed(2)),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        redirect_url: `${appUrl}/dashboard/plans?payment_order_id={order_id}`,
        webhook_url: `${appUrl}/api/webhooks/famgateway`,
      }),
      cache: 'no-store',
    });

    const fgResult = await fgResponse.json().catch(() => null);

    if (!fgResponse.ok || !fgResult || fgResult.status !== 'success' || !fgResult.data) {
      console.error('[FamGateway Create Order Error]:', fgResult);
      return NextResponse.json(
        {
          error:
            fgResult?.message ||
            'Unable to initialize dynamic UPI payment session. Please check your network or try again in a moment.',
        },
        { status: fgResponse.status || 502 }
      );
    }

    const orderData = fgResult.data;

    // Persist pending order record in database
    const savedOrder = await orderRepo.create({
      orderId: orderData.order_id,
      userId: sessionUser._id,
      userEmail: sessionUser.email,
      businessName: customerName,
      planId,
      planName,
      billingCycle,
      amount: originalAmount,
      payableAmount: Number(orderData.payable_amount) || amount,
      currency: 'INR',
      upiId: orderData.upi_id || '',
      qrUrl: orderData.qr_url || '',
      checkoutUrl: orderData.checkout_url || '',
      upiIntent: orderData.upi_intent || '',
      status: 'pending',
      expiresAt: orderData.expires_at_ist
        ? new Date(orderData.expires_at_ist)
        : new Date(Date.now() + 5 * 60 * 1000),
      metadata: {
        createdAtIST: orderData.created_at_ist,
        expiresAtIST: orderData.expires_at_ist,
        referralCode: isReferralValid ? 'arventaventures360' : null,
        discountApplied,
        originalAmount,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        orderId: orderData.order_id,
        amount: originalAmount,
        payableAmount: Number(orderData.payable_amount) || amount,
        discountApplied,
        referralCode: isReferralValid ? 'arventaventures360' : null,
        upiId: orderData.upi_id,
        qrUrl: orderData.qr_url,
        checkoutUrl: orderData.checkout_url,
        upiIntent: orderData.upi_intent,
        planId,
        planName,
        billingCycle,
        expiresAtIST: orderData.expires_at_ist,
        expiresInSeconds: 600,
      },
    });
  } catch (err) {
    console.error('[Create Payment Order Fatal Error]:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating your payment session.' },
      { status: 500 }
    );
  }
}
