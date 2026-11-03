import { NextResponse } from 'next/server';
import { userRepo, otpRepo } from '@/lib/repositories';
import { generateToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, code, purpose = 'VERIFY_EMAIL', checkOnly = false } = body;

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.trim();

    // Strict validation: Only match real, unexpired, unused OTP from the database
    const validOtp = await otpRepo.findValidOtp({
      email: cleanEmail,
      code: cleanCode,
      purpose,
    });

    if (!validOtp) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code.' },
        { status: 400 }
      );
    }

    // Invalidate immediately so OTP cannot be reused (unless checking only, or for RESET_PASSWORD which is consumed in reset-password)
    if (!checkOnly && purpose !== 'RESET_PASSWORD' && validOtp._id) {
      await otpRepo.markUsed(validOtp._id);
    }

    if (purpose === 'VERIFY_EMAIL') {
      if (checkOnly) {
        return NextResponse.json({
          success: true,
          verified: true,
          message: 'Code verified successfully.',
        });
      }
      let user = await userRepo.findByEmail(cleanEmail);

      // If user does not exist in DB yet, create it now from the verified registrationData
      if (!user) {
        const reg = validOtp.registrationData;
        if (!reg) {
          return NextResponse.json(
            { error: 'Registration session expired or invalid. Please submit registration again.' },
            { status: 400 }
          );
        }

        user = await userRepo.create({
          email: cleanEmail,
          password: reg.password,
          businessName: reg.businessName,
          ownerName: reg.ownerName,
          phone: reg.phone,
          slug: reg.slug,
          isVerified: true,
          role: 'user',
          status: 'active',
          plan: 'free',
          services: [],
          welcomeHeadline: `How was your experience at ${reg.businessName}?`,
          instructions:
            'Tap what we helped you with today. We will help draft an authentic review you can review and paste into Google.',
          googleReviewUrl: '',
          stats: {
            totalVisits: 0,
            draftsGenerated: 0,
            reviewsCopied: 0,
            googleClicks: 0,
          },
        });
      } else if (!user.isVerified) {
        user = await userRepo.updateByEmail(cleanEmail, { isVerified: true });
      }

      if (!user) {
        return NextResponse.json({ error: 'Failed to complete account registration.' }, { status: 500 });
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
