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

    const maskedKey = key
      ? key.length > 10
        ? `${key.slice(0, 6)}...${key.slice(-4)}`
        : '••••••••'
      : '';

    return NextResponse.json({
      success: true,
      hasKey: Boolean(key),
      isKeyVerified: isVerified,
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

    // Step 1: Send test prompt "Hi" to Google Gemini REST endpoint
    // Testing with gemini-1.5-flash or gemini-1.5-pro
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let geminiRes;
    let geminiData;
    try {
      geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: 'Hi' }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 60,
            temperature: 0.7,
          },
        }),
        signal: controller.signal,
      });
      geminiData = await geminiRes.json();
    } catch (netErr) {
      clearTimeout(timeoutId);
      const isTimeout = netErr.name === 'AbortError';
      return NextResponse.json(
        {
          error: isTimeout
            ? 'Verification timed out while contacting Google Gemini API. Please check your internet connection.'
            : `Network error contacting Gemini API: ${netErr.message}`,
        },
        { status: 400 }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!geminiRes.ok) {
      const errorMsg =
        geminiData?.error?.message ||
        `Gemini returned HTTP ${geminiRes.status} (${geminiRes.statusText || 'Error'})`;
      return NextResponse.json(
        { error: `Gemini verification failed: ${errorMsg}` },
        { status: 400 }
      );
    }

    const testReply =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      'Hello! How can I help you today?';

    // Step 2: Verification succeeded! Save exclusively for this user account
    const freshUser = await userRepo.findById(user._id);
    const existingAiKnowledge = freshUser?.aiKnowledge || {};

    const updatedAiKnowledge = {
      ...existingAiKnowledge,
      geminiApiKey: apiKey,
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
      message: 'Gemini API Key verified and saved successfully for your account!',
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
