import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import ServicesManagerClient from './ServicesManagerClient';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const user = await getSessionUser();
  const freshUser = await userRepo.findById(user._id);

  return (
    <ServicesManagerClient
      initialServices={freshUser?.services || []}
      initialAiKnowledge={freshUser?.aiKnowledge || null}
    />
  );
}
