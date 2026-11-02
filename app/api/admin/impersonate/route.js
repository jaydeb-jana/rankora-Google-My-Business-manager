import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionUser, isAdmin, generateToken, COOKIE_NAME, ADMIN_IMPERSONATE_COOKIE } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!isAdmin(sessionUser)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Target user ID is required.' }, { status: 400 });
    }

    const targetUser = await userRepo.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ error: 'Target user does not exist.' }, { status: 404 });
    }

    const cookieStore = await cookies();
    const currentAdminToken = cookieStore.get(COOKIE_NAME)?.value;

    const targetUserToken = generateToken({
      userId: targetUser._id.toString(),
      email: targetUser.email,
      slug: targetUser.slug,
    });

    const response = NextResponse.json({
      success: true,
      message: `Now logged in as ${targetUser.businessName}`,
      redirect: '/dashboard',
    });

    const isProd = process.env.NODE_ENV === 'production';

    // Store admin token in impersonation cookie if not already stored
    const existingImpersonator = cookieStore.get(ADMIN_IMPERSONATE_COOKIE)?.value;
    if (!existingImpersonator && currentAdminToken) {
      response.cookies.set({
        name: ADMIN_IMPERSONATE_COOKIE,
        value: currentAdminToken,
        httpOnly: true,
        path: '/',
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    // Switch main session to target user
    response.cookies.set({
      name: COOKIE_NAME,
      value: targetUserToken,
      httpOnly: true,
      path: '/',
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error('[Admin Impersonate Error]:', err);
    return NextResponse.json({ error: 'Failed to log in as user.' }, { status: 500 });
  }
}
