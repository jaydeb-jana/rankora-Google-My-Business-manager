import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import path from 'path';
import fs from 'fs/promises';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    // Handle JSON (e.g. data URL or action to remove)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (body.action === 'remove') {
        await userRepo.updateById(user._id, { logoUrl: '' });
        return NextResponse.json({ success: true, logoUrl: '', message: 'Logo removed' });
      }

      if (body.logoUrl !== undefined) {
        // Base64 data URL size check
        if (body.logoUrl && body.logoUrl.length > MAX_FILE_SIZE * 1.4) {
          return NextResponse.json({ error: 'Image exceeds maximum 5 MB limit' }, { status: 400 });
        }
        await userRepo.updateById(user._id, { logoUrl: body.logoUrl });
        return NextResponse.json({ success: true, logoUrl: body.logoUrl, message: 'Logo updated successfully' });
      }
    }

    // Handle Multipart FormData
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image file size exceeds maximum 5 MB limit' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload PNG, JPG, WEBP, or SVG.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate safe unique filename
    const ext = file.name ? path.extname(file.name).toLowerCase() || '.png' : '.png';
    const filename = `logo-${user._id}-${Date.now()}${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Clean up old logo file if it was locally uploaded
    if (user.logoUrl && user.logoUrl.startsWith('/uploads/')) {
      try {
        const oldFilename = path.basename(user.logoUrl);
        const oldPath = path.join(uploadsDir, oldFilename);
        await fs.unlink(oldPath).catch(() => {});
      } catch {
        // Ignore deletion error of stale file
      }
    }

    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    const logoUrl = `/uploads/${filename}`;
    const updatedUser = await userRepo.updateById(user._id, { logoUrl });

    return NextResponse.json({
      success: true,
      logoUrl: updatedUser?.logoUrl || logoUrl,
      message: 'Business logo uploaded successfully!',
    });
  } catch (error) {
    console.error('[Upload Logo Error]:', error);
    return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.logoUrl && user.logoUrl.startsWith('/uploads/')) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const oldFilename = path.basename(user.logoUrl);
        const oldPath = path.join(uploadsDir, oldFilename);
        await fs.unlink(oldPath).catch(() => {});
      } catch {
        // Ignore deletion error
      }
    }

    await userRepo.updateById(user._id, { logoUrl: '' });
    return NextResponse.json({ success: true, logoUrl: '', message: 'Logo removed' });
  } catch (error) {
    console.error('[Delete Logo Error]:', error);
    return NextResponse.json({ error: 'Failed to remove logo' }, { status: 500 });
  }
}
