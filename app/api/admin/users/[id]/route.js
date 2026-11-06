import { NextResponse } from 'next/server';
import { getSessionUser, isAdmin } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function PATCH(request, context) {
  try {
    const sessionUser = await getSessionUser();
    if (!isAdmin(sessionUser)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { action, status, plan, role, isVerified } = body;

    const existing = await userRepo.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const updates = {};

    if (action === 'update_status' || status) {
      if (!['active', 'suspended'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status. Must be active or suspended.' }, { status: 400 });
      }
      updates.status = status;
      if (status === 'suspended') {
        updates.suspensionReason = body.suspensionReason ? body.suspensionReason.trim() : 'Suspended by system administrator.';
        updates.suspendedAt = new Date();
      } else {
        updates.suspensionReason = '';
        updates.suspendedAt = null;
      }
    }

    if (action === 'update_plan' || plan) {
      if (!['free', 'starter', 'pro', 'enterprise'].includes(plan)) {
        return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
      }
      updates.plan = plan;
      updates.planUpdatedAt = new Date();
      if (body.planExpiresAt) {
        updates.planExpiresAt = new Date(body.planExpiresAt);
      } else if (plan === 'free') {
        updates.planExpiresAt = new Date();
      } else {
        updates.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
    }

    if (action === 'update_role' || role) {
      if (!['user', 'admin'].includes(role)) {
        return NextResponse.json({ error: 'Invalid role. Must be user or admin.' }, { status: 400 });
      }
      updates.role = role;
    }

    if (typeof isVerified === 'boolean') {
      updates.isVerified = isVerified;
    }

    if (action === 'update_metrics' || body.profileScore !== undefined || body.replyTime !== undefined) {
      if (body.profileScore !== undefined) {
        const scoreNum = Number(body.profileScore);
        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
          return NextResponse.json({ error: 'Profile score must be a number between 0 and 100.' }, { status: 400 });
        }
        updates.profileScore = Math.round(scoreNum);
      }
      if (body.replyTime !== undefined) {
        const replyStr = String(body.replyTime).trim();
        if (!replyStr) {
          return NextResponse.json({ error: 'Reply time cannot be empty.' }, { status: 400 });
        }
        updates.replyTime = replyStr;
      }
    }

    const updatedUser = await userRepo.updateById(id, updates);

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        status: updatedUser.status || 'active',
        suspensionReason: updatedUser.suspensionReason || '',
        plan: updatedUser.plan || 'free',
        role: updatedUser.role || 'user',
        isVerified: updatedUser.isVerified,
        profileScore: updatedUser.profileScore !== undefined ? updatedUser.profileScore : 94,
        replyTime: updatedUser.replyTime || 'Under 2 Hours',
      },
      message: 'User updated successfully.',
    });
  } catch (err) {
    console.error('[Admin User Update Error]:', err);
    return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const sessionUser = await getSessionUser();
    if (!isAdmin(sessionUser)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const { id } = await context.params;

    if (String(sessionUser._id) === String(id)) {
      return NextResponse.json(
        { error: 'Security restriction: You cannot delete your own admin account.' },
        { status: 400 }
      );
    }

    const existing = await userRepo.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    await userRepo.deleteUserAndData(id);

    return NextResponse.json({
      success: true,
      message: `User "${existing.businessName}" (${existing.email}) was completely deleted.`,
    });
  } catch (err) {
    console.error('[Admin Delete User Error]:', err);
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
  }
}
