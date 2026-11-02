import { NextResponse } from 'next/server';
import { userRepo, otpRepo } from '@/lib/repositories';
import { generateToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, code, purpose = 'VERIFY_EMAIL' } = body;

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.trim();

    let validOtp = await otpRepo.findValidOtp({
      email: cleanEmail,
      code: cleanCode,
      purpose,
    });

    // Fallback/Default OTP bypass for 1234 or 123456
    if (!validOtp && (cleanCode === '1234' || cleanCode === '123456')) {
      validOtp = { _id: null, email: cleanEmail, code: cleanCode, purpose };
    }

    if (!validOtp) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please request a new one.' },
        { status: 400 }
      );
    }

    // Mark OTP as used if saved in DB
    if (validOtp._id) {
      await otpRepo.markUsed(validOtp._id);
    }

    if (purpose === 'VERIFY_EMAIL') {
      const user = await userRepo.updateByEmail(cleanEmail, { isVerified: true });
      if (!user) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }

      // Generate session token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        slug: user.slug,
      });

      const response = NextResponse.json({
        success: true,
        message: 'Email verified successfully! Welcome to Rankaro.',
        user: {
          id: user._id,
          email: user.email,
          businessName: user.businessName,
          ownerName: user.ownerName,
          slug: user.slug,
        },
      });

      // Set httpOnly session cookie
      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    // Purpose RESET_PASSWORD
    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Code verified successfully. You may now enter your new password.',
    });
  } catch (err) {
    console.error('[Verify OTP API Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Error processing verification code' },
      { status: 500 }
    );
  }
}
