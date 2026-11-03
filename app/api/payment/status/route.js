import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { settingsRepo, orderRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

async function checkAndVerifyOrder({ orderId, manualUtr, sessionUser }) {
  if (!orderId) {
    return { status: 400, body: { error: 'Order ID is required.' } };
  }

  let order = await orderRepo.findByOrderId(orderId);
  if (!order) {
    return { status: 400, body: { error: 'Payment order not found.' } };
  }

  // Ensure the order belongs to this user or user is admin
  if (String(order.userId) !== String(sessionUser._id) && !sessionUser.isAdmin) {
    return { status: 403, body: { error: 'Access denied.' } };
  }

  // If order is already completed, return immediately
  if (order.status === 'success') {
    return {
      status: 200,
      body: {
        success: true,
        status: 'success',
        isPaid: true,
        order: {
          orderId: order.orderId,
          planId: order.planId,
          planName: order.planName,
          amount: order.payableAmount || order.amount,
          utr: order.utr,
          senderName: order.senderName,
          paidAt: order.paidAt,
          receiptUrl:
            order.receiptUrl ||
            `https://famgateway.in/transaction-details.php?id=${order.orderId}&download=pdf`,
        },
      },
    };
  }

  const settings = await settingsRepo.getSettings();
  const apiKey = settings.famgateway?.apiKey;

  // 1. Authoritative check via FamGateway Server-to-Server API
  if (apiKey) {
    try {
      const verifyRes = await fetch(
        `https://famgateway.in/api/verify-order.php?api_key=${encodeURIComponent(apiKey)}&order_id=${encodeURIComponent(orderId)}`,
        {
          method: 'GET',
          headers: { 'X-Api-Key': apiKey },
          cache: 'no-store',
        }
      );

      const verifyData = await verifyRes.json().catch(() => null);

      if (verifyRes.ok && verifyData) {
        const vd = verifyData.data || verifyData;
        const isSuccess =
          verifyData.status === 'success' ||
          vd.status === 'success' ||
          Boolean(vd.utr && vd.utr !== '');

        if (isSuccess) {
          const finalUtr = vd.utr || manualUtr || '';
          const finalTxId = vd.transaction_id || '';
          const finalSender = vd.sender_name || order.businessName || 'Merchant Partner';
          const finalAmount = vd.amount || order.payableAmount || order.amount;

          const updated = await orderRepo.markSuccess({
            orderId,
            utr: finalUtr,
            transactionId: finalTxId,
            senderName: finalSender,
            amount: finalAmount,
            paidAt: vd.payment_time_ist ? new Date(vd.payment_time_ist) : new Date(),
          });

          return {
            status: 200,
            body: {
              success: true,
              status: 'success',
              isPaid: true,
              upgraded: true,
              order: {
                orderId: updated.orderId,
                planId: updated.planId,
                planName: updated.planName,
                amount: updated.payableAmount || updated.amount,
                utr: updated.utr,
                senderName: updated.senderName,
                paidAt: updated.paidAt,
                receiptUrl: updated.receiptUrl,
              },
            },
          };
        }

        if (verifyData.status === 'expired' || vd.status === 'expired') {
          await orderRepo.updateByOrderId(orderId, { status: 'expired' });
          return {
            status: 200,
            body: {
              success: true,
              status: 'expired',
              isPaid: false,
            },
          };
        }
      }
    } catch (checkErr) {
      console.warn('[FamGateway Authoritative Verification Warning]:', checkErr.message);
    }
  }

  // 2. Secondary check via FamGateway Public Safe Polling Endpoint
  try {
    const pubRes = await fetch(
      `https://famgateway.in/api/checkout-status.php?order_id=${encodeURIComponent(orderId)}`,
      { method: 'GET', cache: 'no-store' }
    );
    const pubData = await pubRes.json().catch(() => null);

    if (pubRes.ok && pubData?.status === 'success') {
      const updated = await orderRepo.markSuccess({
        orderId,
        utr: pubData.utr || manualUtr || '',
        transactionId: pubData.transaction_id || '',
        senderName: pubData.sender_name || order.businessName || 'Merchant Partner',
        amount: order.payableAmount || order.amount,
        paidAt: new Date(),
      });

      return {
        status: 200,
        body: {
          success: true,
          status: 'success',
          isPaid: true,
          upgraded: true,
          order: {
            orderId: updated.orderId,
            planId: updated.planId,
            planName: updated.planName,
            amount: updated.payableAmount || updated.amount,
            utr: updated.utr,
            senderName: updated.senderName,
            paidAt: updated.paidAt,
            receiptUrl: updated.receiptUrl,
          },
        },
      };
    }
  } catch (pubErr) {
    console.warn('[FamGateway Public Polling Warning]:', pubErr.message);
  }

  // 3. If user provided a manual 12-digit UTR and FamGateway IMAP is running in background
  if (manualUtr && /^\d{12}$/.test(manualUtr.trim())) {
    // Save UTR on the pending order for automatic resolution
    await orderRepo.updateByOrderId(orderId, { utr: manualUtr.trim() });
    return {
      status: 200,
      body: {
        success: true,
        status: 'pending',
        isPaid: false,
        message: 'Bank UTR received. Matching with bank credit notification...',
      },
    };
  }

  return {
    status: 200,
    body: {
      success: true,
      status: order.status || 'pending',
      isPaid: false,
    },
  };
}

export async function GET(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser._id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');
    const manualUtr = searchParams.get('utr');

    const result = await checkAndVerifyOrder({ orderId, manualUtr, sessionUser });
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('[Payment Status Check Fatal Error]:', err);
    return NextResponse.json({ error: 'Failed to check order status.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser._id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { order_id: orderId, utr: manualUtr } = body;

    const result = await checkAndVerifyOrder({ orderId, manualUtr, sessionUser });
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error('[Payment Status Check Fatal Error]:', err);
    return NextResponse.json({ error: 'Failed to check order status.' }, { status: 500 });
  }
}
