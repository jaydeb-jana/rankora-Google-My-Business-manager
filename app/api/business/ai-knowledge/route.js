import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';

const DEFAULT_AI_KNOWLEDGE = {
  shopDetails: '',
  reviewStyleRules: '',
  languages: [{ code: 'en', name: 'English', ratio: 100 }],
};

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const freshUser = await userRepo.findById(user._id);
    const aiKnowledge = freshUser?.aiKnowledge || DEFAULT_AI_KNOWLEDGE;

    return NextResponse.json({
      success: true,
      aiKnowledge,
    });
  } catch (err) {
    console.error('[AI Knowledge GET Error]:', err);
    return NextResponse.json({ error: 'Failed to fetch AI knowledge' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { shopDetails, reviewStyleRules, languages } = body;

    const freshUser = await userRepo.findById(user._id);
    const existingAiKnowledge = freshUser?.aiKnowledge || {};

    // Safely parse languages with fallback to existing or default English
    let sanitizedLanguages = existingAiKnowledge.languages && existingAiKnowledge.languages.length > 0
      ? existingAiKnowledge.languages
      : [{ code: 'en', name: 'English', ratio: 100 }];

    if (Array.isArray(languages) && languages.length > 0) {
      sanitizedLanguages = languages.slice(0, 2).map((lang) => ({
        code: String(lang.code || 'en').trim().toLowerCase(),
        name: String(lang.name || 'English').trim(),
        ratio: Math.max(0, Math.min(100, Math.round(Number(lang.ratio) || 0))),
      }));

      if (sanitizedLanguages.length === 1) {
        sanitizedLanguages[0].ratio = 100;
      } else if (sanitizedLanguages.length === 2) {
        let r1 = sanitizedLanguages[0].ratio;
        let r2 = 100 - r1;
        sanitizedLanguages[1].ratio = r2;
      }
    }

    const shopDetailsStr = typeof shopDetails === 'string'
      ? shopDetails.trim().slice(0, 4000)
      : (existingAiKnowledge.shopDetails || '');

    const reviewStyleRulesStr = typeof reviewStyleRules === 'string'
      ? reviewStyleRules.trim().slice(0, 3000)
      : (existingAiKnowledge.reviewStyleRules || '');

    const aiKnowledgeUpdate = {
      ...existingAiKnowledge,
      shopDetails: shopDetailsStr,
      reviewStyleRules: reviewStyleRulesStr,
      languages: sanitizedLanguages,
    };

    const updatedUser = await userRepo.updateById(user._id, {
      aiKnowledge: aiKnowledgeUpdate,
    });

    return NextResponse.json({
      success: true,
      aiKnowledge: updatedUser?.aiKnowledge || aiKnowledgeUpdate,
      message: 'Shop details and review rules saved successfully!',
    });
  } catch (err) {
    console.error('[AI Knowledge POST Error]:', err);
    return NextResponse.json({ error: 'Failed to save shop details and AI rules' }, { status: 500 });
  }
}
