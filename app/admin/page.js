import AdminClient from './AdminClient';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Control Center - Rankaro',
  description: 'Manage users, direct login impersonation, subscription plans, and API / Gmail configurations.',
};

export default async function AdminPage() {
  const user = await getSessionUser();
  return <AdminClient currentUser={user} />;
}
