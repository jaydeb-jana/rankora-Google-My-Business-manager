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
    const latestOtp = await otpRepo.findLatestOtp(cleanEmail, purpose);

    if (!user && !latestOtp) {
      return NextResponse.json({ error: 'No pending registration or account found with this email.' }, { status: 404 });
    }

    const recipientName = user?.ownerName || latestOtp?.registrationData?.ownerName || 'Business Owner';
    const registrationData = latestOtp?.registrationData || null;

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await otpRepo.createOtp({
      email: cleanEmail,
      code: otpCode,
      purpose,
      expiresAt,
      registrationData,
    });

    const emailResult = await sendOtpEmail({
      toEmail: cleanEmail,
      otpCode,
      purpose,
      recipientName,
    });

    if (!emailResult?.delivered) {
      return NextResponse.json(
        {
          error:
            emailResult?.error ||
            'System issue occurred. Please try again later.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'A new verification code has been sent to your email. Please check your inbox.',
    });
  } catch (err) {
    console.error('[Resend OTP Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to resend verification code. Please try again shortly.' },
      { status: 500 }
    );
  }
}
