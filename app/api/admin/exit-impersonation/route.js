import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, ADMIN_IMPERSONATE_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get(ADMIN_IMPERSONATE_COOKIE)?.value;

    const response = NextResponse.json({
      success: true,
      message: 'Returned to administrator session.',
      redirect: '/admin',
    });

    const isProd = process.env.NODE_ENV === 'production';

    if (adminToken) {
      response.cookies.set({
        name: COOKIE_NAME,
        value: adminToken,
        httpOnly: true,
        path: '/',
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    // Delete impersonation cookie
    response.cookies.set({
      name: ADMIN_IMPERSONATE_COOKIE,
      value: '',
      httpOnly: true,
      path: '/',
      secure: isProd,
      sameSite: 'lax',
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error('[Admin Exit Impersonate Error]:', err);
    return NextResponse.json({ error: 'Failed to exit impersonation mode.' }, { status: 500 });
  }
}
