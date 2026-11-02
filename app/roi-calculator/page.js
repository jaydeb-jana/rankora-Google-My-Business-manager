import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoiCalculatorClient from './RoiCalculatorClient';

export const metadata = {
  title: 'Interactive Review & Revenue ROI Calculator | Rankaro',
  description:
    'Calculate the direct revenue lift and local Google Maps search visibility of turning satisfied patrons into 5-star reviews with Rankaro.',
};

export default function RoiCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <RoiCalculatorClient />
      </main>
      <Footer />
    </div>
  );
}
