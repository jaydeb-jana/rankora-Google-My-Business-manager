import { NextResponse } from 'next/server';
import { userRepo, otpRepo } from '@/lib/repositories';
import { hashPassword, generateSlug } from '@/lib/auth';
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
    let baseSlug = generateSlug(businessName);

    // Ensure slug uniqueness
    const slugOwner = await userRepo.findBySlug(baseSlug);
    if (slugOwner && (!existing || slugOwner._id.toString() !== existing._id.toString())) {
      baseSlug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    let user;
    if (existing && !existing.isVerified) {
      // Update existing unverified account
      user = await userRepo.updateByEmail(cleanEmail, {
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        password: hashedPassword,
        slug: baseSlug,
      });
    } else {
      // Create new user with sensible starter services
      user = await userRepo.create({
        email: cleanEmail,
        password: hashedPassword,
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        slug: baseSlug,
        isVerified: false,
        services: DEFAULT_SERVICES,
        welcomeHeadline: `How was your experience at ${businessName.trim()}?`,
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
    }

    // Generate OTP (default: 1234)
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await otpRepo.createOtp({
      email: cleanEmail,
      code: otpCode,
      purpose: 'VERIFY_EMAIL',
      expiresAt,
    });

    // Send OTP via Gmail SMTP (gracefully handles delivery issues)
    let emailResult = null;
    try {
      emailResult = await sendOtpEmail({
        toEmail: cleanEmail,
        otpCode,
        purpose: 'VERIFY_EMAIL',
        recipientName: ownerName.trim(),
      });
    } catch (e) {
      console.warn('[Register] sendOtpEmail warning:', e.message);
    }

    return NextResponse.json({
      success: true,
      requireOtp: true,
      email: cleanEmail,
      devOtp: otpCode,
      message: emailResult?.delivered
        ? 'Verification code sent to your email. Please check your inbox.'
        : 'Verification code generated (default: 1234).',
    });
  } catch (err) {
    console.error('[Register API Error]:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
}
