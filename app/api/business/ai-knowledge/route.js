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
    const { shopDetails = '', reviewStyleRules = '', languages = [] } = body;

    // Validate languages (minimum 1, maximum 2)
    if (!Array.isArray(languages) || languages.length < 1 || languages.length > 2) {
      return NextResponse.json(
        { error: 'Please configure between 1 and 2 review languages.' },
        { status: 400 }
      );
    }

    let sanitizedLanguages = languages.map((lang) => ({
      code: String(lang.code || 'en').trim().toLowerCase(),
      name: String(lang.name || 'English').trim(),
      ratio: Math.max(0, Math.min(100, Math.round(Number(lang.ratio) || 0))),
    }));

    if (sanitizedLanguages.length === 1) {
      sanitizedLanguages[0].ratio = 100;
    } else if (sanitizedLanguages.length === 2) {
      let r1 = sanitizedLanguages[0].ratio;
      let r2 = sanitizedLanguages[1].ratio;
      if (r1 + r2 !== 100) {
        // Automatically balance to 100%
        r2 = 100 - r1;
        sanitizedLanguages[1].ratio = r2;
      }
    }

    const aiKnowledgeUpdate = {
      shopDetails: String(shopDetails).slice(0, 4000),
      reviewStyleRules: String(reviewStyleRules).slice(0, 3000),
      languages: sanitizedLanguages,
    };

    const updatedUser = await userRepo.updateById(user._id, {
      aiKnowledge: aiKnowledgeUpdate,
    });

    return NextResponse.json({
      success: true,
      aiKnowledge: updatedUser.aiKnowledge,
      message: 'AI Knowledge saved successfully!',
    });
  } catch (err) {
    console.error('[AI Knowledge POST Error]:', err);
    return NextResponse.json({ error: 'Failed to save AI knowledge' }, { status: 500 });
  }
}
