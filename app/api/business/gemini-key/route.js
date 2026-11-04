import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const freshUser = await userRepo.findById(user._id);
    const key = freshUser?.aiKnowledge?.geminiApiKey || '';
    const isVerified = Boolean(freshUser?.aiKnowledge?.isKeyVerified);
    let model = freshUser?.aiKnowledge?.geminiModel || 'gemini-1.5-flash';
    if (model.includes('3.5') || model.includes('2.5')) {
      model = 'gemini-1.5-flash';
    }

    const maskedKey = key
      ? key.length > 10
        ? `${key.slice(0, 6)}...${key.slice(-4)}`
        : '••••••••'
      : '';

    return NextResponse.json({
      success: true,
      hasKey: Boolean(key),
      isKeyVerified: isVerified,
      model,
      maskedKey,
    });
  } catch (err) {
    console.error('[Gemini Key GET Error]:', err);
    return NextResponse.json({ error: 'Failed to fetch Gemini API status' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const apiKey = String(body?.apiKey || '').trim();

    if (!apiKey) {
      return NextResponse.json({ error: 'Please enter a Gemini API Key.' }, { status: 400 });
    }

    // Step 1: Send test prompt "Hi" to Google Gemini REST endpoint.
    // Try official Google models in order: gemini-1.5-flash (fast, standard free tier), gemini-2.0-flash, gemini-1.5-pro
    const CANDIDATE_MODELS = [
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-pro',
    ];

    let verifiedModel = null;
    let testReply = '';
    let lastErrorMsg = '';

    for (const model of CANDIDATE_MODELS) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hi' }] }],
            generationConfig: {
              maxOutputTokens: 60,
              temperature: 0.7,
            },
          }),
          signal: controller.signal,
        });

        const geminiData = await geminiRes.json();
        clearTimeout(timeoutId);

        if (geminiRes.ok && geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
          verifiedModel = model;
          testReply = geminiData.candidates[0].content.parts[0].text.trim();
          break;
        }

        // Check if API key itself is fundamentally invalid
        const errMsg = geminiData?.error?.message || '';
        lastErrorMsg = errMsg;
        if (/api key not valid|api_key_invalid|invalid api key/i.test(errMsg)) {
          return NextResponse.json(
            { error: 'Invalid Google Gemini API key. Please check the key from Google AI Studio and try again.' },
            { status: 400 }
          );
        }
      } catch (netErr) {
        clearTimeout(timeoutId);
        lastErrorMsg = netErr.message;
      }
    }

    if (!verifiedModel) {
      return NextResponse.json(
        { error: `Gemini verification failed: ${lastErrorMsg || 'No supported Gemini model responded. Please verify your API key.'}` },
        { status: 400 }
      );
    }

    // Step 2: Verification succeeded! Save exclusively for this user account
    const freshUser = await userRepo.findById(user._id);
    const existingAiKnowledge = freshUser?.aiKnowledge || {};

    const updatedAiKnowledge = {
      ...existingAiKnowledge,
      geminiApiKey: apiKey,
      geminiModel: verifiedModel,
      isKeyVerified: true,
    };

    await userRepo.updateById(user._id, {
      aiKnowledge: updatedAiKnowledge,
    });

    const maskedKey =
      apiKey.length > 10
        ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`
        : '••••••••';

    return NextResponse.json({
      success: true,
      message: `Gemini API Key verified and saved successfully! Connected to Google Gemini (${verifiedModel}).`,
      verifiedModel,
      testReply,
      maskedKey,
      isKeyVerified: true,
    });
  } catch (err) {
    console.error('[Gemini Key POST Error]:', err);
    return NextResponse.json(
      { error: 'An unexpected server error occurred during verification.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const freshUser = await userRepo.findById(user._id);
    const existingAiKnowledge = freshUser?.aiKnowledge || {};

    const updatedAiKnowledge = {
      ...existingAiKnowledge,
      geminiApiKey: '',
      isKeyVerified: false,
    };

    await userRepo.updateById(user._id, {
      aiKnowledge: updatedAiKnowledge,
    });

    return NextResponse.json({
      success: true,
      message: 'Gemini API Key removed from your account.',
    });
  } catch (err) {
    console.error('[Gemini Key DELETE Error]:', err);
    return NextResponse.json({ error: 'Failed to disconnect Gemini API key' }, { status: 500 });
  }
}
