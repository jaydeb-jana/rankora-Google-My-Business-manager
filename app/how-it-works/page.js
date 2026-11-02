import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Compass,
  QrCode,
  Smartphone,
  Layers,
  Sparkles,
  Copy,
  Star,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Clock,
  Printer,
  Smile
} from 'lucide-react';

export const metadata = {
  title: 'How It Works - The 7-Step Frictionless Review Flow | Rankaro',
  description:
    'Discover the exact step-by-step architecture behind Rankaro: how physical QR codes and AI assistance convert in-store patrons into authentic 5-star Google reviews in 10 seconds.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      step: 'Step 01',
      title: 'Merchant Onboarding & Service Tagging',
      time: 'Takes 90 seconds',
      desc: 'Connect your official Google Business Profile. Input the signature services, dishes, or procedures your business is known for (e.g. "Pain-Free Cleaning", "Truffle Pasta", "Same-Day Brake Fix").',
      icon: Layers,
      highlight: 'Sets up your local SEO keyword foundation.',
    },
    {
      step: 'Step 02',
      title: 'Dynamic Vector QR & NFC Generation',
      time: 'Instantaneous',
      desc: 'Rankaro instantly outputs customized vector QR codes and NFC chip data. Download print-ready PDF table tents, counter displays, or order durable acrylic pucks.',
      icon: QrCode,
      highlight: '300 DPI high-res print outputs ready for any print shop.',
    },
    {
      step: 'Step 03',
      title: 'Customer Scans at Peak Satisfaction',
      time: 'Takes 2 seconds',
      desc: 'Position displays where satisfaction peaks: checkout registers, check presenters, or waiting lounges. The customer opens their smartphone camera and points it at the code.',
      icon: Smartphone,
      highlight: 'Loads in under 380ms with zero app downloads or logins.',
    },
    {
      step: 'Step 04',
      title: 'Frictionless Experience Chip Selection',
      time: 'Takes 3 seconds',
      desc: 'Rather than facing an intimidating blank text box, customers simply tap 2 or 3 visual chips representing what they enjoyed during their visit.',
      icon: Smile,
      highlight: 'Eliminates 100% of customer writer’s block.',
    },
    {
      step: 'Step 05',
      title: 'On-Device Natural Language Synthesis',
      time: 'Takes 0.4 seconds',
      desc: 'Our contextual AI engine assembles a genuine, beautifully phrased review paragraph incorporating the specific tags picked by the customer.',
      icon: Sparkles,
      highlight: 'Customer can easily adjust, add words, or rewrite.',
    },
    {
      step: 'Step 06',
      title: '1-Tap Copy & Deep-Link to Google Maps',
      time: 'Takes 1 second',
      desc: 'The customer taps "Copy & Open Google". The drafted text copies to their clipboard, and Google Maps launches straight to your business’s 5-star rating screen.',
      icon: Copy,
      highlight: 'Bypasses confusing search queries and lost clicks.',
    },
    {
      step: 'Step 07',
      title: 'Organic Google Local 3-Pack Growth',
      time: 'Continuous',
      desc: 'As Google’s algorithm indexes frequent reviews packed with specific service keywords, your business ascends into the prestigious Google Maps 3-Pack.',
      icon: TrendingUp,
      highlight: 'Drives permanent inbound organic customer phone calls.',
    },
  ];

  const beforeAfter = [
    {
      attribute: 'Time Required',
      before: '4 to 7 minutes of typing on phone',
      after: 'Under 15 seconds total',
    },
    {
      attribute: 'Customer Drop-Off Rate',
      before: '72% abandon due to writer’s block',
      after: 'Less than 8% drop-off',
    },
    {
      attribute: 'Review Quality & Depth',
      before: 'Short: "Good food" or "Nice"',
      after: 'Detailed: 3-4 sentences rich in service keywords',
    },
    {
      attribute: 'Delivery Channel',
      before: 'Annoying SMS blasts days later',
      after: 'In-person at peak customer gratitude',
    },
    {
      attribute: 'Google Policy Compliance',
      before: 'Risky review gating software',
      after: '100% transparent, policy-safe architecture',
    },
  ];

  const placementSpots = [
    {
      title: 'Checkout Counter / Payment Terminal',
      desc: 'The #1 highest converting spot. Customers scan while waiting for their credit card receipt or terminal prompt.',
      conversion: '34% Scan Rate',
    },
    {
      title: 'Dining Table Tents & Check Presenters',
      desc: 'Perfect for restaurants and cafes. Handed directly with the bill when the customer has just enjoyed their meal.',
      conversion: '28% Scan Rate',
    },
    {
      title: 'Reception Desk / Waiting Lounge',
      desc: 'For dental, medical, and beauty clinics. Patients have downtime before leaving to leave their review.',
      conversion: '22% Scan Rate',
    },
    {
      title: 'Vehicle Dashboard / Service Invoices',
      desc: 'For auto mechanics, plumbers, and home contractors. Handed over when reviewing the finished work with the homeowner.',
      conversion: '25% Scan Rate',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 space-y-24 pb-24">
        {/* HERO */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>The Science of Review Conversion</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            How Rankaro Turns a 2-Minute Chore into a{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              10-Second Breeze
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            By removing cognitive friction and leveraging the physical point of sale, Rankaro drives 3x to 5x more detailed Google reviews without annoying SMS reminders.
          </p>
        </section>

        {/* THE 7-STEP ARCHITECTURE */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="space-y-8">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden"
                >
                  <div className="p-5 rounded-2xl bg-blue-50 text-blue-600 flex-shrink-0">
                    <Icon className="w-8 h-8" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        {st.step}
                      </span>
                      <span className="text-xs text-slate-600 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{st.time}</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {st.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {st.desc}
                    </p>

                    <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{st.highlight}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BEFORE VS AFTER TABLE */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Direct Comparison
              </span>
              <h2 className="text-3xl font-black mt-2">
                Traditional Review Asking vs Rankaro
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase">
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4 text-rose-400">Old Manual / SMS Method</th>
                    <th className="py-3 px-4 text-emerald-400">Rankaro Engine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {beforeAfter.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50">
                      <td className="py-4 px-4 font-bold text-white">{row.attribute}</td>
                      <td className="py-4 px-4 text-slate-400">{row.before}</td>
                      <td className="py-4 px-4 font-semibold text-emerald-300">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PHYSICAL COUNTER PLACEMENT HOTSPOTS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              In-Store Strategy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              The 4 Highest-Converting Physical Placement Spots
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Where you position your countertop display makes all the difference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {placementSpots.map((spot) => (
              <div
                key={spot.title}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100/60 px-2.5 py-1 rounded-md">
                    {spot.conversion}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg mt-3 mb-2">
                    {spot.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {spot.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STAFF SCRIPTING PLAYBOOK */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-blue-50/60 border border-blue-200/80 space-y-6">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <Printer className="w-4 h-4" />
              <span>Staff Training & Verbal Scripts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              What to Say at the Register (100% Policy-Safe)
            </h2>
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>Never say:</strong> &ldquo;If you give us 5 stars, I&apos;ll give you 10% off.&rdquo; (This violates Google’s terms and FTC rules).
              </p>
              <div className="p-5 rounded-2xl bg-white border border-blue-200/60 shadow-sm">
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  The Golden 10-Second Script:
                </div>
                <p className="text-slate-800 italic font-medium">
                  &ldquo;Thank you so much for coming in today, [Name]! If you have 10 seconds, tapping this QR code helps our small team tremendously on Google Maps &mdash; you can simply tap the dishes/services you loved!&rdquo;
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Staff script complies with FTC Title 16 CFR Part 255 regarding non-incentivized voluntary customer endorsements.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
