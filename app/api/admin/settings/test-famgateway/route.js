import { NextResponse } from 'next/server';
import { getSessionUser, isAdmin } from '@/lib/auth';
import { settingsRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!isAdmin(sessionUser)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    let apiKey = body.apiKey ? body.apiKey.trim() : '';

    if (!apiKey) {
      const settings = await settingsRepo.getSettings();
      apiKey = settings?.famgateway?.apiKey || '';
    }

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Please enter a FamGateway API key first.' },
        { status: 400 }
      );
    }

    // Ping FamGateway verify-order endpoint with a test order ID to test API key authentication
    // FamGateway responds with 401 Unauthorized if the key is invalid, or 404/200 if valid!
    try {
      const res = await fetch(
        `https://famgateway.in/api/verify-order.php?api_key=${encodeURIComponent(apiKey)}&order_id=fg_TESTPINGCHECK`,
        {
          method: 'GET',
          headers: {
            'X-Api-Key': apiKey,
          },
          cache: 'no-store',
        }
      );

      const data = await res.json().catch(() => null);

      if (res.status === 401 || data?.status === 'unauthorized') {
        return NextResponse.json(
          {
            success: false,
            error: data?.message || 'Invalid FamGateway API key. Please verify your key from the FamGateway dashboard.',
          },
          { status: 400 }
        );
      }

      // If status is 404 (order not found) or 200, the key was accepted by FamGateway!
      return NextResponse.json({
        success: true,
        message: 'FamGateway API Key is valid and successfully connected! Ready to accept instant zero-fee UPI payments.',
        details: {
          gateway: 'FamGateway UPI (AryanISPE)',
          operationalStatus: 'Online',
          mode: 'Live Non-Custodial UPI',
        },
      });
    } catch (networkErr) {
      return NextResponse.json(
        {
          success: false,
          error: `Could not connect to FamGateway servers: ${networkErr.message}`,
        },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error('[Admin Test FamGateway Error]:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while testing FamGateway API key.' },
      { status: 500 }
    );
  }
}
