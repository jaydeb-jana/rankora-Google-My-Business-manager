import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactClient from '../dashboard/contact/ContactClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Desk | Arventa Ventures | RANKORA',
  description: 'Official customer support and enterprise inquiries desk for RANKORA by Arventa Ventures.',
};

export default async function PublicContactPage() {
  const user = await getSessionUser();
  if (user) {
    redirect('/dashboard/contact');
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <ContactClient user={null} />
      </main>
      <Footer />
    </div>
  );
}
