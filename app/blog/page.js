import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogClient from './BlogClient';

export const metadata = {
  title: 'Local SEO Strategy & Knowledge Library | Rankaro',
  description:
    'Authoritative, in-depth strategy guides on Google local ranking algorithms, FTC anti-gating compliance, countertop QR hardware, and review psychology.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <BlogClient />
      </main>
      <Footer />
    </div>
  );
}
