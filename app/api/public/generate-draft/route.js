import { NextResponse } from 'next/server';
import { userRepo, activityRepo, settingsRepo } from '@/lib/repositories';
import { generateReviewDraftsWithAi } from '@/lib/reviewEngine';

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, selectedServiceIds = [], sentiment = 'exceptional', answers = {}, forceLanguage = null } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim();
    const user = await userRepo.findBySlug(cleanSlug);

    if (!user) {
      return NextResponse.json({ success: false, error: 'Business not found' }, { status: 404 });
    }

    // Subscription verification: Review page is restricted if on free plan or expired
    const isPlanExpired =
      user.role !== 'admin' &&
      (user.plan === 'free' || !user.planExpiresAt || new Date(user.planExpiresAt) <= new Date());

    if (isPlanExpired) {
      return NextResponse.json(
        {
          success: false,
          error: 'This review portal is temporarily inactive because the subscription plan has expired or requires renewal.',
          isExpired: true,
          drafts: [],
        },
        { status: 403 }
      );
    }

    // Filter to only the services that the customer actually selected
    const allServices = user.services || [];
    const chosenServices = allServices.filter((s) => selectedServiceIds.includes(s.id));

    // Resolve Gemini API key from account level -> system settings -> environment variables
    const settings = await settingsRepo.getSettings().catch(() => null);
    const effectiveApiKey =
      user.aiKnowledge?.geminiApiKey ||
      settings?.ai?.apiKey ||
      process.env.GEMINI_API_KEY ||
      '';

    if (!effectiveApiKey) {
      console.warn(`[Gemini AI Draft]: Gemini API key is missing for ${user.slug}`);
      return NextResponse.json(
        {
          success: false,
          error: 'A technical issue occurred while generating the review. Please try again later or write your review manually.',
          drafts: [],
        },
        { status: 503 }
      );
    }

    // Strictly generate authentic review drafts with live Google Gemini API (NO TEMPLATES)
    const result = await generateReviewDraftsWithAi({
      apiKey: effectiveApiKey,
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

    if (!result?.success || !Array.isArray(result?.drafts) || result.drafts.length === 0) {
      console.warn(`[Gemini AI Draft Error]:`, result?.error);
      return NextResponse.json(
        {
          success: false,
          error: 'A technical issue occurred while generating the review. Please try again later or write your review manually.',
          drafts: [],
        },
        { status: 500 }
      );
    }

    // Record stats and activity in background
    userRepo.incrementStats(user.slug, 'draftsGenerated').catch(() => {});
    activityRepo
      .recordActivity({
        businessId: user._id,
        slug: user.slug,
        type: 'DRAFT_GENERATED',
        servicesSelected: chosenServices.map((s) => s.name),
        sentiment,
      })
      .catch(() => {});

    return NextResponse.json({
      success: true,
      businessName: user.businessName,
      googleReviewUrl: user.googleReviewUrl || '',
      isAiGenerated: true,
      drafts: result.drafts,
    });
  } catch (err) {
    console.error('[Generate Draft Error]:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'A technical issue occurred while generating the review. Please try again later or write your review manually.',
        drafts: [],
      },
      { status: 500 }
    );
  }
}
