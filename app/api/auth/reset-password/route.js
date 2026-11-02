import { NextResponse } from 'next/server';
import { userRepo, otpRepo } from '@/lib/repositories';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Email, verification code, and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.trim();

    // Strict validation: Only match real, unexpired, unused OTP from the database
    const validOtp = await otpRepo.findValidOtp({
      email: cleanEmail,
      code: cleanCode,
      purpose: 'RESET_PASSWORD',
    });

    if (!validOtp) {
      return NextResponse.json(
        { error: 'ভুল বা মেয়াদোত্তীর্ণ ওটিপি কোড (Invalid or expired verification code).' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await userRepo.updateByEmail(cleanEmail, {
      password: hashedPassword,
    });

    if (validOtp._id) {
      await otpRepo.markUsed(validOtp._id);
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You may now log in with your new password.',
    });
  } catch (err) {
    console.error('[Reset Password Error]:', err);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}
