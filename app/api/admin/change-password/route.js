import { NextResponse } from 'next/server';
import { getSessionUser, isAdmin, verifyPassword, hashPassword } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!isAdmin(sessionUser)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Current password, new password, and confirmation are all required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation do not match.' },
        { status: 400 }
      );
    }

    // Fetch the admin's database record with stored password
    const user = await userRepo.findById(sessionUser.id || sessionUser._id);
    if (!user) {
      return NextResponse.json({ error: 'Admin account not found in database.' }, { status: 404 });
    }

    // Verify current / old password
    const isCurrentValid = await verifyPassword(currentPassword, user.password);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: 'Incorrect current password. Please enter your valid current password.' },
        { status: 400 }
      );
    }

    // Prevent reusing identical password
    const isSamePassword = await verifyPassword(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'New password cannot be identical to your current password. Please choose a different password.' },
        { status: 400 }
      );
    }

    // Hash and update
    const hashed = await hashPassword(newPassword);
    await userRepo.updateById(user._id, { password: hashed });

    return NextResponse.json({
      success: true,
      message: 'Admin password changed successfully. Please remember your new password.',
    });
  } catch (err) {
    console.error('[Admin Change Password Error]:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred while updating password.' },
      { status: 500 }
    );
  }
}
