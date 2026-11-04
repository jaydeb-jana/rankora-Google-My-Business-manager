import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { settingsRepo, orderRepo, userRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser._id) {
      return NextResponse.json({ error: 'Please sign in to continue.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { planId, billingCycle = 'monthly', orderId } = body;

    if (!['starter', 'pro', 'enterprise'].includes(planId)) {
      return NextResponse.json({ error: 'Invalid subscription plan selected.' }, { status: 400 });
    }

    const settings = await settingsRepo.getSettings();
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

    const testUtr = '99' + Math.floor(1000000000 + Math.random() * 9000000000);
    const testTxId = 'TEST_FMP_' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const customerName = sessionUser.businessName || sessionUser.ownerName || 'Verified Merchant';

    let targetOrderId = orderId;

    if (!targetOrderId) {
      targetOrderId = 'fg_TEST_' + Math.random().toString(36).substring(2, 9).toUpperCase();
      try {
        await orderRepo.create({
          orderId: targetOrderId,
          userId: sessionUser._id,
          userEmail: sessionUser.email,
          businessName: customerName,
          planId,
          planName,
          billingCycle,
          amount,
          payableAmount: amount,
          currency: 'INR',
          upiId: settings.famgateway?.apiKey ? 'janajaydeb@fam' : 'sandbox@fam',
          qrUrl: '',
          checkoutUrl: '',
          upiIntent: '',
          status: 'pending',
          expiresAt: new Date(Date.now() + 600 * 1000),
        });
      } catch (createErr) {
        console.warn('[Simulate Test] Order creation warning:', createErr?.message);
      }
    }

    // Atomically mark order as confirmed success and upgrade user plan
    let updatedOrder = null;
    try {
      updatedOrder = await orderRepo.markSuccess({
        orderId: targetOrderId,
        utr: testUtr,
        transactionId: testTxId,
        senderName: customerName,
        amount,
        paidAt: new Date(),
      });
    } catch (markErr) {
      console.warn('[Simulate Test] Mark success warning:', markErr?.message);
    }

    // Direct user subscription update guarantee
    const cycleDays = billingCycle === 'yearly' ? 365 : 30;
    const nowMs = Date.now();
    let planExpiresAt;
    if (
      sessionUser.plan === planId &&
      sessionUser.planExpiresAt &&
      new Date(sessionUser.planExpiresAt).getTime() > nowMs
    ) {
      planExpiresAt = new Date(new Date(sessionUser.planExpiresAt).getTime() + cycleDays * 24 * 60 * 60 * 1000);
    } else {
      planExpiresAt = new Date(nowMs + cycleDays * 24 * 60 * 60 * 1000);
    }

    try {
      if (sessionUser._id) {
        await userRepo.updateById(sessionUser._id, {
          plan: planId,
          planUpdatedAt: new Date(),
          planExpiresAt,
        });
      }
      if (sessionUser.email) {
        await userRepo.updateByEmail(sessionUser.email, {
          plan: planId,
          planUpdatedAt: new Date(),
          planExpiresAt,
        });
      }
    } catch (uErr) {
      console.warn('[Simulate Test] Direct user update warning:', uErr?.message);
    }

    const finalOrder = updatedOrder || {
      orderId: targetOrderId,
      planId,
      planName,
      amount,
      payableAmount: amount,
      utr: testUtr,
      senderName: customerName,
      paidAt: new Date(),
      receiptUrl: `https://famgateway.in/transaction-details.php?id=${targetOrderId}&download=pdf`,
    };

    return NextResponse.json({
      success: true,
      status: 'success',
      isPaid: true,
      upgraded: true,
      order: {
        orderId: finalOrder.orderId || targetOrderId,
        planId: finalOrder.planId || planId,
        planName: finalOrder.planName || planName,
        amount: finalOrder.payableAmount || finalOrder.amount || amount,
        utr: finalOrder.utr || testUtr,
        senderName: finalOrder.senderName || customerName,
        paidAt: finalOrder.paidAt || new Date(),
        receiptUrl: finalOrder.receiptUrl || `https://famgateway.in/transaction-details.php?id=${finalOrder.orderId || targetOrderId}&download=pdf`,
      },
      message: 'Test payment simulated successfully! Your subscription is now active.',
    });
  } catch (err) {
    console.error('[Simulate Test Payment Error]:', err);
    return NextResponse.json(
      { error: err?.message || 'An error occurred while simulating test payment.' },
      { status: 500 }
    );
  }
}
