import { NextResponse } from 'next/server';
import { userRepo, otpRepo } from '@/lib/repositories';
import { generateOTP, sendOtpEmail } from '@/lib/mail';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, purpose = 'VERIFY_EMAIL' } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await userRepo.findByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 404 });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await otpRepo.createOtp({
      email: cleanEmail,
      code: otpCode,
      purpose,
      expiresAt,
    });

    let emailResult = null;
    try {
      emailResult = await sendOtpEmail({
        toEmail: cleanEmail,
        otpCode,
        purpose,
        recipientName: user.ownerName || 'Business Owner',
      });
    } catch (e) {
      console.warn('[Resend OTP] sendOtpEmail warning:', e.message);
    }

    return NextResponse.json({
      success: true,
      devOtp: otpCode,
      message: emailResult?.delivered
        ? 'A new verification code has been sent to your email.'
        : 'A new verification code is ready (default: 1234).',
    });
  } catch (err) {
    console.error('[Resend OTP Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to resend verification code. Please try again shortly.' },
      { status: 500 }
    );
  }
}
