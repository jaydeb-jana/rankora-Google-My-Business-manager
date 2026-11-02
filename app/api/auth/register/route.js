import { NextResponse } from 'next/server';
import { userRepo, otpRepo } from '@/lib/repositories';
import { hashPassword, getUniqueSlug } from '@/lib/auth';
import { generateOTP, sendOtpEmail } from '@/lib/mail';
import { DEFAULT_SERVICES } from '@/lib/presets';

export async function POST(request) {
  try {
    const body = await request.json();
    const { businessName, ownerName, phone, email, password } = body;

    // Validation
    if (!businessName?.trim()) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }
    if (!ownerName?.trim()) {
      return NextResponse.json({ error: 'Owner name is required' }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ error: 'Mobile phone number is required' }, { status: 400 });
    }
    if (!email?.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await userRepo.findByEmail(cleanEmail);

    if (existing && existing.isVerified) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in.' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const baseSlug = await getUniqueSlug(businessName, existing?._id);

    // Clean up any stale unverified account if present from older versions
    if (existing && !existing.isVerified) {
      await userRepo.deleteUserAndData(existing._id);
    }

    // Generate real secure OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // NOTE: DO NOT CREATE USER IN DB YET!
    // Registration data is securely attached to the OTP record.
    // The user account is strictly created ONLY after the OTP is verified.
    await otpRepo.createOtp({
      email: cleanEmail,
      code: otpCode,
      purpose: 'VERIFY_EMAIL',
      expiresAt,
      registrationData: {
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        password: hashedPassword,
        slug: baseSlug,
      },
    });

    // Send OTP via Gmail SMTP with auto-retries
    const emailResult = await sendOtpEmail({
      toEmail: cleanEmail,
      otpCode,
      purpose: 'VERIFY_EMAIL',
      recipientName: ownerName.trim(),
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
      requireOtp: true,
      email: cleanEmail,
      message: 'Verification code sent to your email. Please check your inbox.',
    });
  } catch (err) {
    console.error('[Register API Error]:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
}
