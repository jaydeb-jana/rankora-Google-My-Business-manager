import { NextResponse } from 'next/server';
import { getSessionUser, isAdmin } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!isAdmin(sessionUser)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const plan = searchParams.get('plan') || '';
    const isVerified = searchParams.get('isVerified') || '';
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 50;

    const [userResult, stats] = await Promise.all([
      userRepo.findAll({ search, status, plan, isVerified, page, limit }),
      userRepo.getStatsSummary(),
    ]);

    return NextResponse.json({
      success: true,
      users: userResult.users,
      total: userResult.total,
      page: userResult.page,
      limit: userResult.limit,
      totalPages: userResult.totalPages,
      stats,
    });
  } catch (err) {
    console.error('[Admin Users API Error]:', err);
    return NextResponse.json({ error: 'Failed to fetch user list.' }, { status: 500 });
  }
}
