import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { settingsRepo, orderRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-famgateway-signature');

    const settings = await settingsRepo.getSettings();
    const apiKey = settings?.famgateway?.apiKey || process.env.FAMGATEWAY_API_KEY || '';

    // If an API key is configured, verify HMAC-SHA256 signature
    if (apiKey && signature) {
      const expected = crypto.createHmac('sha256', apiKey).update(rawBody).digest('hex');
      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expected);

      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        console.warn('[FamGateway Webhook] Invalid HMAC signature detected.');
        return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
      }
    }

    let payload = null;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload.' }, { status: 400 });
    }

    const {
      event,
      order_id,
      amount,
      payable_amount,
      status,
      transaction_id,
      utr,
      sender_name,
      payment_time,
    } = payload || {};

    if (event === 'payment.success' || status === 'success') {
      if (order_id) {
        console.log(`[FamGateway Webhook] Payment confirmed for Order ${order_id} (UTR: ${utr || 'N/A'}) - Amount: ₹${amount}`);
        await orderRepo.markSuccess({
          orderId: order_id,
          utr,
          transactionId: transaction_id,
          senderName: sender_name,
          amount: payable_amount || amount,
          paidAt: payment_time ? new Date(payment_time) : new Date(),
        });
      }
    }

    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (err) {
    console.error('[FamGateway Webhook Error]:', err);
    return NextResponse.json({ error: 'Webhook processing error.' }, { status: 500 });
  }
}
