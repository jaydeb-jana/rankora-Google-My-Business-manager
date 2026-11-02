import { NextResponse } from 'next/server';
import { getSessionUser, isAdmin } from '@/lib/auth';
import { testSmtpConnection } from '@/lib/mail';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!isAdmin(sessionUser)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { user, pass, host, port, secure, testRecipient } = body;

    const result = await testSmtpConnection({
      user,
      pass,
      host,
      port,
      secure,
      testRecipient: testRecipient || sessionUser.email,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error('[Admin Test Email Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'SMTP connection verification failed.' },
      { status: 500 }
    );
  }
}
