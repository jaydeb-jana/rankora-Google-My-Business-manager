import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import { DEFAULT_RAJ_COMPUTER_AUDIT } from '@/lib/gmbAudit';
import AuditClient from './AuditClient';

export const dynamic = 'force-dynamic';

export default async function AuditPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const freshUser = await userRepo.findById(user._id);

  let initialAudit = freshUser?.lastAudit;
  if (
    !initialAudit ||
    initialAudit?.summary?.overallScore === 41 ||
    initialAudit?.summary?.businessName?.toLowerCase().includes('raj computer')
  ) {
    initialAudit = DEFAULT_RAJ_COMPUTER_AUDIT;
  }

  return <AuditClient initialUser={freshUser || user} defaultAudit={initialAudit} />;
}
