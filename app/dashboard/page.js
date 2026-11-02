import { getSessionUser } from '@/lib/auth';
import { userRepo, activityRepo } from '@/lib/repositories';
import DashboardOverviewClient from './DashboardOverviewClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const freshUser = await userRepo.findById(user._id);
  const recentActivities = await activityRepo.getRecentByBusiness(user._id, 10);

  const stats = freshUser?.stats || {
    totalVisits: 0,
    draftsGenerated: 0,
    reviewsCopied: 0,
    googleClicks: 0,
  };

  return (
    <DashboardOverviewClient
      initialUser={freshUser || user}
      initialStats={stats}
      recentActivities={recentActivities || []}
    />
  );
}
