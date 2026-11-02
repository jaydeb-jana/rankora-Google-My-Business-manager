import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import QRCodeClient from './QRCodeClient';

export const dynamic = 'force-dynamic';

export default async function QRCodePage() {
  const user = await getSessionUser();
  if (!user) return null;
  const freshUser = await userRepo.findById(user._id);

  return (
    <QRCodeClient user={freshUser || user} />
  );
}
