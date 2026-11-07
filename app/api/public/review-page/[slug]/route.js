import { NextResponse } from 'next/server';
import { userRepo, activityRepo } from '@/lib/repositories';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim();
    const user = await userRepo.findBySlug(cleanSlug);

    if (!user || !user.isVerified || user.role === 'admin' || user.email === 'ceo@arventventures.online' || user.email === 'ceo@arventaventures.online') {
      return NextResponse.json({ error: 'Business review page not found.' }, { status: 404 });
    }

    // Subscription verification: Check if plan is expired or on free tier
    const isPlanExpired =
      user.role !== 'admin' &&
      (user.plan === 'free' || !user.planExpiresAt || new Date(user.planExpiresAt) <= new Date());

    if (isPlanExpired) {
      return NextResponse.json(
        {
          error: 'This business review page is currently unavailable because the subscription plan has expired or requires renewal.',
          isExpired: true,
        },
        { status: 403 }
      );
    }

    // Safely record visit in background
    userRepo.incrementStats(user.slug, 'totalVisits').catch(() => {});
    activityRepo.recordActivity({
      businessId: user._id,
      slug: user.slug,
      type: 'VISIT',
    }).catch(() => {});

    // Return only public business data
    return NextResponse.json({
      success: true,
      business: {
        id: user._id,
        businessName: user.businessName,
        slug: user.slug,
        businessCategory: user.businessCategory,
        address: user.address,
        city: user.city,
        website: user.website,
        welcomeHeadline: user.welcomeHeadline || `How was your experience at ${user.businessName}?`,
        instructions: user.instructions || 'Select the services you received below.',
        services: user.services || [],
        customQuestions: user.customQuestions || [],
        googleReviewUrl: user.googleReviewUrl || '',
        logoUrl: user.logoUrl || '',
        aiKnowledge: user.aiKnowledge
          ? {
              shopDetails: user.aiKnowledge.shopDetails || '',
              reviewStyleRules: user.aiKnowledge.reviewStyleRules || '',
              languages: user.aiKnowledge.languages || [],
            }
          : null,
        hasGoogleUrl: Boolean(user.googleReviewUrl && user.googleReviewUrl.startsWith('http')),
      },
    });
  } catch (err) {
    console.error('[Public Review Page API Error]:', err);
    return NextResponse.json({ error: 'Failed to fetch review page' }, { status: 500 });
  }
}
