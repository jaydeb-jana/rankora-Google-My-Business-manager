import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FaqClient from './FaqClient';

export const metadata = {
  title: 'Frequently Asked Questions & Knowledge Base | Rankaro',
  description:
    'Search our complete knowledge base: Google review policy compliance, countertop QR code printing, NFC cards, AI prompt formulations, and billing FAQs.',
};

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <FaqClient />
      </main>
      <Footer />
    </div>
  );
}
