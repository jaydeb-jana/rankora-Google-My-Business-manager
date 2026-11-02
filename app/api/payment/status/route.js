import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { settingsRepo, orderRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser._id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 });
    }

    let order = await orderRepo.findByOrderId(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Payment order not found.' }, { status: 404 });
    }

    // Ensure the order belongs to this user or user is admin
    if (String(order.userId) !== String(sessionUser._id) && !sessionUser.isAdmin) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    // If order is already completed, return immediately
    if (order.status === 'success') {
      return NextResponse.json({
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
          receiptUrl: order.receiptUrl || `https://famgateway.in/transaction-details.php?id=${order.orderId}&download=pdf`,
        },
      });
    }

    // If status is pending, verify authoritative status with FamGateway
    const settings = await settingsRepo.getSettings();
    const apiKey = settings.famgateway?.apiKey;

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

        if (verifyRes.ok && verifyData?.status === 'success' && verifyData.data) {
          const vd = verifyData.data;
          // Mark as success and upgrade user plan
          const updated = await orderRepo.markSuccess({
            orderId,
            utr: vd.utr,
            transactionId: vd.transaction_id,
            senderName: vd.sender_name,
            amount: vd.amount,
            paidAt: vd.payment_time_ist ? new Date(vd.payment_time_ist) : new Date(),
          });

          return NextResponse.json({
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
          });
        }

        if (verifyData?.status === 'expired') {
          await orderRepo.updateByOrderId(orderId, { status: 'expired' });
          return NextResponse.json({
            success: true,
            status: 'expired',
            isPaid: false,
          });
        }
      } catch (checkErr) {
        console.warn('[FamGateway Verification Check Warning]:', checkErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      status: order.status || 'pending',
      isPaid: false,
    });
  } catch (err) {
    console.error('[Payment Status Check Error]:', err);
    return NextResponse.json({ error: 'Failed to check order status.' }, { status: 500 });
  }
}
