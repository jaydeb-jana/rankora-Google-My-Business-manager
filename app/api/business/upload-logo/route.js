import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import path from 'path';
import fs from 'fs/promises';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

// Clean up any legacy disk files if an old URL existed
async function cleanupLegacyFile(oldUrl) {
  if (oldUrl && typeof oldUrl === 'string' && oldUrl.startsWith('/uploads/')) {
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const oldFilename = path.basename(oldUrl);
      const oldPath = path.join(uploadsDir, oldFilename);
      await fs.unlink(oldPath).catch(() => {});
    } catch {
      // Ignore deletion of non-existent or stale file
    }
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    // Handle JSON (Optimized Base64 Data URL or Remove action)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (body.action === 'remove') {
        await cleanupLegacyFile(user.logoUrl);
        await userRepo.updateById(user._id, { logoUrl: '' });
        return NextResponse.json({ success: true, logoUrl: '', message: 'Profile picture removed.' });
      }

      if (body.logoUrl !== undefined) {
        const logoStr = String(body.logoUrl || '').trim();
        if (logoStr && logoStr.length > MAX_FILE_SIZE * 1.4) {
          return NextResponse.json({ error: 'Image exceeds maximum 5 MB limit.' }, { status: 400 });
        }
        await cleanupLegacyFile(user.logoUrl);
        const updatedUser = await userRepo.updateById(user._id, { logoUrl: logoStr });
        return NextResponse.json({
          success: true,
          logoUrl: updatedUser?.logoUrl || logoStr,
          message: 'Profile picture saved directly to database with optimal compression.',
        });
      }
    }

    // Handle Multipart FormData Fallback
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image file size exceeds maximum 5 MB limit.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload PNG, JPG, WEBP, or SVG.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'image/png';
    const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // Clean up any legacy disk file
    await cleanupLegacyFile(user.logoUrl);

    // Save directly in the MongoDB database
    const updatedUser = await userRepo.updateById(user._id, { logoUrl: base64Image });

    return NextResponse.json({
      success: true,
      logoUrl: updatedUser?.logoUrl || base64Image,
      message: 'Profile picture saved directly to database.',
    });
  } catch (error) {
    console.error('[Upload Logo Error]:', error);
    return NextResponse.json({ error: 'Failed to upload profile picture.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await cleanupLegacyFile(user.logoUrl);
    await userRepo.updateById(user._id, { logoUrl: '' });
    return NextResponse.json({ success: true, logoUrl: '', message: 'Profile picture removed.' });
  } catch (error) {
    console.error('[Delete Logo Error]:', error);
    return NextResponse.json({ error: 'Failed to remove profile picture.' }, { status: 500 });
  }
}
