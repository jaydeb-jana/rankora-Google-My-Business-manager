import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import SecurityClient from './SecurityClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Data Security & Privacy Architecture | RANKORA',
  description: 'Enterprise Data Protection and Security measures governed by Arventa Ventures for RANKORA.',
};

export default async function SecurityPage() {
  const user = await getSessionUser();
  const freshUser = user?._id ? await userRepo.findById(user._id) : user;

  return <SecurityClient user={freshUser || user} />;
}
