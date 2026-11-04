import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { orderRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser._id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const orders = await orderRepo.findByUser(sessionUser._id, 20, sessionUser.email);

    const formatted = orders.map((o) => ({
      orderId: o.orderId,
      planId: o.planId,
      planName: o.planName,
      billingCycle: o.billingCycle || 'monthly',
      amount: o.payableAmount || o.amount,
      currency: o.currency || 'INR',
      status: o.status,
      utr: o.utr || '',
      receiptUrl:
        o.status === 'success'
          ? o.receiptUrl || `https://famgateway.in/transaction-details.php?id=${o.orderId}&download=pdf`
          : null,
      createdAt: o.createdAt,
      paidAt: o.paidAt,
    }));

    return NextResponse.json({
      success: true,
      orders: formatted,
    });
  } catch (err) {
    console.error('[Get Payment Orders Error]:', err);
    return NextResponse.json({ error: 'Failed to retrieve payment records.' }, { status: 500 });
  }
}
