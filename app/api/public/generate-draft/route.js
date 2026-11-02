import { NextResponse } from 'next/server';
import { userRepo, activityRepo } from '@/lib/repositories';
import { generateReviewDraftsWithAi } from '@/lib/reviewEngine';

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, selectedServiceIds = [], sentiment = 'exceptional', answers = {}, forceLanguage = null } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim();
    const user = await userRepo.findBySlug(cleanSlug);

    if (!user) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Filter to only the services that the customer actually selected
    const allServices = user.services || [];
    const chosenServices = allServices.filter((s) => selectedServiceIds.includes(s.id));

    // Generate authentic review drafts with account-specific Gemini API (or template fallback)
    const drafts = await generateReviewDraftsWithAi({
      businessName: user.businessName,
      businessCategory: user.businessCategory,
      city: user.city,
      address: user.address,
      description: user.description,
      selectedServices: chosenServices,
      sentiment,
      answers,
      aiKnowledge: user.aiKnowledge || null,
      forceLanguage,
    });

    // Record stats and activity in background
    userRepo.incrementStats(user.slug, 'draftsGenerated').catch(() => {});
    activityRepo.recordActivity({
      businessId: user._id,
      slug: user.slug,
      type: 'DRAFT_GENERATED',
      servicesSelected: chosenServices.map((s) => s.name),
      sentiment,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      businessName: user.businessName,
      googleReviewUrl: user.googleReviewUrl || '',
      drafts,
    });
  } catch (err) {
    console.error('[Generate Draft Error]:', err);
    return NextResponse.json({ error: 'Failed to generate review draft' }, { status: 500 });
  }
}
