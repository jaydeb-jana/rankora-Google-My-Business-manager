import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) return null;
  const freshUser = await userRepo.findById(user._id);

  return (
    <ProfileClient initialUser={freshUser || user} />
  );
}
