import { NextResponse } from 'next/server';
import { userRepo } from '@/lib/repositories';
import { verifyPassword, generateToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await userRepo.findByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Check if account is suspended
    if (user.status === 'suspended') {
      const reasonText = user.suspensionReason
        ? `Account suspended by Official Google Partner: "${user.suspensionReason}"`
        : 'Your account has been suspended by the Official Google Partner compliance desk. Please contact support.';
      return NextResponse.json(
        {
          error: reasonText,
        },
        { status: 403 }
      );
    }

    // Check email verification status
    if (!user.isVerified) {
      return NextResponse.json(
        {
          error: 'Your email address is not yet verified. Please verify your account to proceed.',
          requireOtp: true,
          email: user.email,
        },
        { status: 403 }
      );
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      slug: user.slug,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        businessName: user.businessName,
        ownerName: user.ownerName,
        slug: user.slug,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error('[Login API Error]:', err);
    return NextResponse.json({ error: 'Internal login error. Please try again.' }, { status: 500 });
  }
}
