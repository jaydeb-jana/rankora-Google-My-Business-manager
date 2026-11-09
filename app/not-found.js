import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home, Compass, Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found',
  description: 'The requested page could not be found on Rankaro.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
            <Sparkles className="w-4 h-4" />
            <span>404 - Page Not Found</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
            Lost in the Map Pack?
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            The page you are looking for has been relocated or no longer exists. Let&apos;s get you back on track to accelerating your Google reviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all rk-btn-shine"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Explore Features</span>
            </Link>
          </div>

          {/* Popular Links Directory */}
          <div className="pt-8 border-t border-slate-200/80">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Popular Destinations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <Link href="/pricing" className="text-blue-600 hover:underline font-medium">
                Pricing &amp; Plans
              </Link>
              <span className="text-slate-300">&bull;</span>
              <Link href="/blog" className="text-blue-600 hover:underline font-medium">
                SEO Knowledge Base
              </Link>
              <span className="text-slate-300">&bull;</span>
              <Link href="/how-it-works" className="text-blue-600 hover:underline font-medium">
                How It Works
              </Link>
              <span className="text-slate-300">&bull;</span>
              <Link href="/roi-calculator" className="text-blue-600 hover:underline font-medium">
                ROI Calculator
              </Link>
              <span className="text-slate-300">&bull;</span>
              <Link href="/contact" className="text-blue-600 hover:underline font-medium">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
