import { NextResponse } from 'next/server';
import { getSessionUser, isAdmin } from '@/lib/auth';
import { settingsRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (!isAdmin(sessionUser)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const settings = await settingsRepo.getSettings();
    return NextResponse.json({
      success: true,
      notes: Array.isArray(settings?.notepad) ? settings.notepad : [],
      scratchpad: typeof settings?.adminNotes === 'string' ? settings.adminNotes : '',
    });
  } catch (err) {
    console.error('[Admin Notes GET Error]:', err);
    return NextResponse.json({ error: 'Failed to fetch admin notes.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!isAdmin(sessionUser)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { action = 'save_note', note, noteId, scratchpad, notes } = body;

    const currentSettings = await settingsRepo.getSettings();
    let currentNotes = Array.isArray(currentSettings?.notepad) ? [...currentSettings.notepad] : [];
    let currentScratchpad = typeof currentSettings?.adminNotes === 'string' ? currentSettings.adminNotes : '';

    if (action === 'save_note' && note) {
      const now = new Date().toISOString();
      const noteItem = {
        id: note.id || `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: (note.title || 'Untitled Note').trim(),
        content: note.content || '',
        category: (note.category || 'General').trim(),
        isPinned: Boolean(note.isPinned),
        createdAt: note.createdAt || now,
        updatedAt: now,
      };

      const existingIndex = currentNotes.findIndex((n) => n.id === noteItem.id);
      if (existingIndex >= 0) {
        currentNotes[existingIndex] = {
          ...currentNotes[existingIndex],
          ...noteItem,
          createdAt: currentNotes[existingIndex].createdAt || noteItem.createdAt,
        };
      } else {
        currentNotes.unshift(noteItem);
      }

      await settingsRepo.saveSettings({ notepad: currentNotes });
      return NextResponse.json({
        success: true,
        message: 'Note saved successfully.',
        note: noteItem,
        notes: currentNotes,
      });
    }

    if (action === 'delete_note' && noteId) {
      currentNotes = currentNotes.filter((n) => n.id !== noteId);
      await settingsRepo.saveSettings({ notepad: currentNotes });
      return NextResponse.json({
        success: true,
        message: 'Note deleted successfully.',
        notes: currentNotes,
      });
    }

    if (action === 'toggle_pin' && noteId) {
      currentNotes = currentNotes.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n));
      await settingsRepo.saveSettings({ notepad: currentNotes });
      return NextResponse.json({
        success: true,
        notes: currentNotes,
      });
    }

    if (action === 'save_scratchpad') {
      const newScratchpad = typeof scratchpad === 'string' ? scratchpad : '';
      await settingsRepo.saveSettings({ adminNotes: newScratchpad });
      return NextResponse.json({
        success: true,
        message: 'Scratchpad saved.',
        scratchpad: newScratchpad,
      });
    }

    if (action === 'save_all') {
      const updates = {};
      if (Array.isArray(notes)) updates.notepad = notes;
      if (typeof scratchpad === 'string') updates.adminNotes = scratchpad;
      await settingsRepo.saveSettings(updates);
      return NextResponse.json({
        success: true,
        message: 'All notes updated successfully.',
        notes: updates.notepad || currentNotes,
        scratchpad: updates.adminNotes ?? currentScratchpad,
      });
    }

    return NextResponse.json({ error: 'Invalid action provided.' }, { status: 400 });
  } catch (err) {
    console.error('[Admin Notes POST Error]:', err);
    return NextResponse.json({ error: 'Failed to process notes request.' }, { status: 500 });
  }
}
