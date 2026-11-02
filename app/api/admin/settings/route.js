import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSessionUser, isAdmin } from '@/lib/auth';
import { settingsRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

function syncEnvFile({ appUrl }) {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) return;

    let content = fs.readFileSync(envPath, 'utf8');

    // Remove any leftover Gmail credentials from .env.local as they are stored in DB
    content = content.replace(/^GMAIL_USER=.*(\r?\n)?/gm, '');
    content = content.replace(/^GMAIL_APP_PASSWORD=.*(\r?\n)?/gm, '');

    if (appUrl !== undefined && appUrl.trim()) {
      if (content.includes('NEXT_PUBLIC_APP_URL=')) {
        content = content.replace(/NEXT_PUBLIC_APP_URL=.*/g, `NEXT_PUBLIC_APP_URL=${appUrl.trim()}`);
      } else {
        content += `\nNEXT_PUBLIC_APP_URL=${appUrl.trim()}`;
      }
    }

    fs.writeFileSync(envPath, content.trim() + '\n', 'utf8');
  } catch (err) {
    console.warn('[SyncEnvFile Warning]: Could not update .env.local:', err.message);
  }
}

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!isAdmin(sessionUser)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const settings = await settingsRepo.getSettings();

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (err) {
    console.error('[Admin Get Settings Error]:', err);
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!isAdmin(sessionUser)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { smtp, ai, general } = body;

    const updates = {};

    if (smtp) {
      updates.smtp = {
        provider: smtp.provider || 'gmail',
        user: smtp.user ? smtp.user.trim().toLowerCase() : '',
        pass: smtp.pass ? smtp.pass.replace(/\s+/g, '').trim() : '',
        host: smtp.host ? smtp.host.trim() : 'smtp.gmail.com',
        port: Number(smtp.port) || 465,
        secure: smtp.secure !== false,
        fromName: smtp.fromName ? smtp.fromName.trim() : 'Rankaro',
      };
    }

    if (ai) {
      updates.ai = {
        provider: ai.provider || 'gemini',
        apiKey: ai.apiKey ? ai.apiKey.trim() : '',
        model: ai.model ? ai.model.trim() : 'gemini-1.5-flash',
      };
    }

    if (general) {
      updates.general = {
        appName: general.appName ? general.appName.trim() : 'Rankaro',
        appUrl: general.appUrl ? general.appUrl.trim() : 'http://localhost:3000',
        supportEmail: general.supportEmail ? general.supportEmail.trim() : '',
        allowPublicRegistration: general.allowPublicRegistration !== false,
      };
    }

    const updated = await settingsRepo.saveSettings(updates);

    // Sync appUrl to .env.local if updated
    if (updates.general?.appUrl) {
      syncEnvFile({ appUrl: updates.general?.appUrl });
    }

    return NextResponse.json({
      success: true,
      settings: updated,
      message: 'System and API settings saved successfully.',
    });
  } catch (err) {
    console.error('[Admin Save Settings Error]:', err);
    return NextResponse.json({ error: 'Failed to save settings.' }, { status: 500 });
  }
}
