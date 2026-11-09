import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import { DEFAULT_RAJ_COMPUTER_AUDIT } from '@/lib/gmbAudit';
import AuditClient from './AuditClient';

export const dynamic = 'force-dynamic';

export default async function AuditPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const freshUser = await userRepo.findById(user._id);

  // Do not auto-display audit results on initial page load. Keep initial screen ready for user search.
  return <AuditClient initialUser={freshUser || user} defaultAudit={null} />;
}
