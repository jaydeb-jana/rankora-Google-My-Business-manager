import { NextResponse } from 'next/server';
import { getSessionUser, generateSlug, getUniqueSlug } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: true, profile: user });
  } catch (err) {
    console.error('[Profile GET Error]:', err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const allowedFields = [
      'businessName',
      'ownerName',
      'phone',
      'googleReviewUrl',
      'businessCategory',
      'address',
      'city',
      'website',
      'description',
      'slug',
      'welcomeHeadline',
      'instructions',
      'logoUrl',
      'fallbackReviews',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
      }
    }

    // Google review / business URL: accept any link provided by user
    if (updates.googleReviewUrl !== undefined) {
      if (typeof updates.googleReviewUrl === 'string' && updates.googleReviewUrl.trim()) {
        let urlStr = updates.googleReviewUrl.trim();
        // If protocol is missing, default to https://
        if (!/^https?:\/\//i.test(urlStr)) {
          urlStr = 'https://' + urlStr;
        }
        try {
          const parsed = new URL(urlStr);
          updates.googleReviewUrl = parsed.toString();
        } catch {
          // If URL constructor fails, still accept the raw string
          updates.googleReviewUrl = urlStr;
        }
      } else {
        updates.googleReviewUrl = '';
      }
    }

    // Slug is strictly NOT manually editable.
    // It is automatically generated from businessName (lowercase, symbols removed, random number if collision).
    delete updates.slug;

    if (updates.businessName && updates.businessName !== user.businessName) {
      updates.slug = await getUniqueSlug(updates.businessName, user._id);
    } else if (!user.slug) {
      updates.slug = await getUniqueSlug(user.businessName, user._id);
    }

    const updatedUser = (await userRepo.updateById(user._id, updates)) || user;
    const safeUser = updatedUser ? { ...updatedUser } : {};
    delete safeUser.password;

    return NextResponse.json({
      success: true,
      message: 'Business profile updated successfully.',
      profile: safeUser,
    });
  } catch (err) {
    console.error('[Profile PATCH Error]:', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
