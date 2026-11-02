import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import ContactClient from './ContactClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Official Contact Desk | Arventa Ventures | RANKORA',
  description: 'Official customer support, enterprise inquiries, and WhatsApp priority desk for RANKORA by Arventa Ventures.',
};

export default async function ContactPage() {
  const user = await getSessionUser();
  const freshUser = user?._id ? await userRepo.findById(user._id) : user;

  return <ContactClient user={freshUser || user} />;
}
