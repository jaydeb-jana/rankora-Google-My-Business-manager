import { NextResponse } from 'next/server';
import { userRepo, otpRepo } from '@/lib/repositories';
import { generateOTP, sendOtpEmail } from '@/lib/mail';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await userRepo.findByEmail(cleanEmail);

    if (!user) {
      // Do not leak user existence for security, return positive message
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a verification code has been sent.',
      });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await otpRepo.createOtp({
      email: cleanEmail,
      code: otpCode,
      purpose: 'RESET_PASSWORD',
      expiresAt,
    });

    const emailResult = await sendOtpEmail({
      toEmail: cleanEmail,
      otpCode,
      purpose: 'RESET_PASSWORD',
      recipientName: user.ownerName || 'Business Owner',
    });

    if (!emailResult?.delivered) {
      return NextResponse.json(
        {
          error:
            emailResult?.error ||
            'সিস্টেমে সমস্যা আছে, অনুগ্রহ করে পরে চেষ্টা করুন। (System issue, please try again later.)',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'A verification code has been sent to your email. Please check your inbox.',
    });
  } catch (err) {
    console.error('[Forgot Password Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to process request.' }, { status: 500 });
  }
}
