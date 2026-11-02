import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SecurityClient from '../dashboard/security/SecurityClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Data Security & Architecture | Arventa Ventures | RANKORA',
  description: 'Enterprise Data Security, encryption and privacy protocols governed by Arventa Ventures.',
};

export default async function PublicSecurityPage() {
  const user = await getSessionUser();
  if (user) {
    redirect('/dashboard/security');
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <SecurityClient user={null} />
      </main>
      <Footer />
    </div>
  );
}
