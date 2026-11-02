import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import CustomizerClient from './CustomizerClient';

export const dynamic = 'force-dynamic';

export default async function CustomizerPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const freshUser = await userRepo.findById(user._id);

  return (
    <CustomizerClient user={freshUser || user} />
  );
}
