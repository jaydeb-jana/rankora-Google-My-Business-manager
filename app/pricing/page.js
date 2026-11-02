import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingClient from './PricingClient';
import { settingsRepo } from '@/lib/repositories';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pricing & Plans | Rankaro',
  description:
    'Transparent, honest pricing for local businesses. Unlimited QR scans, AI review generation, and zero review gating starting at ₹0/month.',
};

export default async function PricingPage() {
  const settings = await settingsRepo.getSettings();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <PricingClient pricingConfig={settings?.pricing} />
      </main>
      <Footer />
    </div>
  );
}
