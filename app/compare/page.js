import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Check,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Zap,
  BarChart3,
  DollarSign,
  Clock,
  Smartphone,
  Layers,
  HelpCircle,
  TrendingDown,
  Lock,
  Scale
} from 'lucide-react';

export const metadata = {
  title: 'Rankaro vs Birdeye & Podium Comparison (2026 Deep-Dive) | Rankaro',
  description:
    'Comprehensive comparison between Rankaro, Birdeye, Podium, and GatherUp. Compare pricing, customer friction, SMS spam regulations, and FTC anti-gating compliance.',
};

export default function ComparePage() {
  const criteria = [
    {
      feature: 'Monthly Starting Price',
      rankaro: 'Free to $29 / mo',
      birdeye: '$299 - $499 / mo',
      podium: '$399 - $599 / mo',
      gatherup: '$149 - $249 / mo',
      manual: 'Free (Heavy Staff Time)',
    },
    {
      feature: '3-Year Total Cost of Ownership',
      rankaro: '$0 - $1,044',
      birdeye: '$10,764 - $17,964',
      podium: '$14,364 - $21,564',
      gatherup: '$5,364 - $8,964',
      manual: '$6,000+ (Wasted Staff Hours)',
    },
    {
      feature: 'Contract Lock-In',
      rankaro: 'Zero (Cancel with 1 Click)',
      birdeye: 'Mandatory 12-Month Lock-in',
      podium: 'Mandatory 12-Month Lock-in',
      gatherup: 'Monthly / Annual',
      manual: 'None',
    },
    {
      feature: 'Point-of-Sale Dwell Time Utilization',
      rankaro: 'Instant Countertop QR / NFC',
      birdeye: 'Delayed Post-Visit SMS Blast',
      podium: 'Delayed Post-Visit SMS Blast',
      gatherup: 'Email / SMS Follow-up',
      manual: 'Verbal Asking (87% Forget)',
    },
    {
      feature: 'Customer Friction & Writer’s Block',
      rankaro: 'Eliminated: 1-Tap Service Chips',
      birdeye: 'High: Blank Box on Mobile',
      podium: 'High: Blank Box on Mobile',
      gatherup: 'High: Rating Survey Form',
      manual: 'High: Customer forgets phrasing',
    },
    {
      feature: 'Contextual AI Review Formulation',
      rankaro: true,
      birdeye: false,
      podium: false,
      gatherup: false,
      manual: false,
    },
    {
      feature: 'Local SEO Keyword Injection',
      rankaro: true,
      birdeye: false,
      podium: false,
      gatherup: false,
      manual: false,
    },
    {
      feature: 'FTC & Google Anti-Gating Compliance',
      rankaro: '100% Policy-Safe (Dual Channel)',
      birdeye: 'High Risk (Gating Filters)',
      podium: 'High Risk (Internal Gating)',
      gatherup: 'Configurable',
      manual: 'Compliant',
    },
    {
      feature: 'Scalable Vector SVG Print Files',
      rankaro: true,
      birdeye: false,
      podium: false,
      gatherup: false,
      manual: false,
    },
    {
      feature: 'Contactless NFC Hardware Payload',
      rankaro: true,
      birdeye: false,
      podium: false,
      gatherup: false,
      manual: false,
    },
    {
      feature: 'TCPA 10DLC Carrier SMS Surcharges',
      rankaro: '$0 (Zero Carrier Fees)',
      birdeye: '$50 - $150 / mo in SMS Fees',
      podium: '$50 - $200 / mo in SMS Fees',
      gatherup: 'Additional SMS Charges',
      manual: '$0',
    },
    {
      feature: 'Direct Management De-escalation',
      rankaro: true,
      birdeye: true,
      podium: true,
      gatherup: true,
      manual: false,
    },
  ];

  const smsFlaws = [
    {
      title: '1. The Death of Customer Trust via SMS Text Blasts',
      desc: 'Consumers receive hundreds of automated spam texts every week. When a dental patient or restaurant patron receives an automated text message at 7:30 PM asking for a review, they feel tracked and annoyed. In 2026, over 48% of SMS review blasts are automatically routed to the "Junk" or "Spam" folder by iOS and Android filters.',
      icon: Smartphone,
    },
    {
      title: '2. Exorbitant $4,000+ Annual Contracts For Basic Software',
      desc: 'Legacy reputation platforms operate like traditional enterprise sales organizations: aggressive cold callers, mandatory product demos, opaque pricing, and restrictive 12-month contract lock-ins with automatic renewal clauses designed to trap small merchants.',
      icon: DollarSign,
    },
    {
      title: '3. Severe FTC Regulatory Fines for Review Gating',
      desc: 'Under the FTC’s 2024 Trade Regulation Rule (16 CFR Part 465), businesses engaging in review gating (diverting unhappy customers away from Google) face civil penalties of up to $51,744 per violation. Many legacy setups still employ illegal sentiment gates that put business owners at legal risk.',
      icon: AlertTriangle,
    },
    {
      title: '4. Lack of Keyword Richness for Local Google Maps SEO',
      desc: 'An SMS link simply opens an empty review box. The few customers who actually click it usually type one sentence like "Good place!" or "Nice service". These empty reviews provide zero keyword ranking signals for Google’s Local 3-Pack search engine.',
      icon: Sparkles,
    },
  ];

  const migrationSteps = [
    {
      step: '1',
      title: 'Create Your Free Rankaro Account in 90 Seconds',
      desc: 'No credit card required. Paste your Google Business Profile name or Place ID and choose your vertical preset.',
    },
    {
      step: '2',
      title: 'Download & Deploy Custom Countertop Displays',
      desc: 'Print our vector 4x6" acrylic templates for your checkout desk and dining tables. Replace old, ignored signage.',
    },
    {
      step: '3',
      title: 'Cancel Your $400/Month Legacy Subscription',
      desc: 'Notify your legacy software rep that you are moving to a modern countertop architecture. Save thousands immediately.',
    },
    {
      step: '4',
      title: 'Watch Your Review Velocity Triple in 30 Days',
      desc: 'Track scans and watch keyword-rich, authentic 5-star reviews climb on Google Maps week after week.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 space-y-24 pb-28">
        {/* HERO */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Scale className="w-4 h-4" />
            <span>Honest, Exhaustive Competitive Breakdown</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Why Modern Storefronts are Replacing{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              $400/Mo Legacy SMS Software
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A side-by-side technical, financial, and legal comparison of Rankaro versus Birdeye, Podium, and GatherUp. Discover why physical countertop QR codes convert 3x higher than intrusive SMS blasts.
          </p>
        </section>

        {/* 12-ROW COMPREHENSIVE COMPARISON TABLE */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-md">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-4 px-6 font-bold text-slate-900 w-2/6">Capability & Feature</th>
                  <th className="py-4 px-4 font-black text-blue-600 text-center bg-blue-50/80 w-1/6">
                    Rankaro
                  </th>
                  <th className="py-4 px-4 font-semibold text-slate-600 text-center w-1/6">
                    Birdeye
                  </th>
                  <th className="py-4 px-4 font-semibold text-slate-600 text-center w-1/6">
                    Podium
                  </th>
                  <th className="py-4 px-4 font-semibold text-slate-500 text-center w-1/6">
                    GatherUp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criteria.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-800">{row.feature}</td>

                    {/* Rankaro Col */}
                    <td className="py-4 px-4 text-center bg-blue-50/30">
                      {typeof row.rankaro === 'boolean' ? (
                        row.rankaro ? (
                          <Check className="w-5 h-5 text-blue-600 font-bold mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs font-black text-blue-700">{row.rankaro}</span>
                      )}
                    </td>

                    {/* Birdeye Col */}
                    <td className="py-4 px-4 text-center">
                      {typeof row.birdeye === 'boolean' ? (
                        row.birdeye ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs text-slate-600">{row.birdeye}</span>
                      )}
                    </td>

                    {/* Podium Col */}
                    <td className="py-4 px-4 text-center">
                      {typeof row.podium === 'boolean' ? (
                        row.podium ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs text-slate-600">{row.podium}</span>
                      )}
                    </td>

                    {/* GatherUp Col */}
                    <td className="py-4 px-4 text-center text-slate-500">
                      {typeof row.gatherup === 'boolean' ? (
                        row.gatherup ? (
                          <Check className="w-4 h-4 text-slate-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs text-slate-500">{row.gatherup}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4 FATAL FLAWS OF SMS SOFTWARE */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Industry Reality Check
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3">
              The 4 Fatal Flaws of Old-School SMS Review Software
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {smsFlaws.map((flaw) => {
              const Icon = flaw.icon;
              return (
                <div key={flaw.title} className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 w-fit">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{flaw.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{flaw.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5-MINUTE MIGRATION GUIDE */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Effortless Transition
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                Switching to Rankaro in Under 5 Minutes
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Zero business interruption, zero database migrations, and immediate savings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {migrationSteps.map((st) => (
                <div key={st.step} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs">
                      {st.step}
                    </span>
                    <h3 className="font-bold text-white text-sm">{st.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-8">{st.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 text-center">
              <a
                href="/register"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md rk-btn-shine"
              >
                <span>Start Free Migration Today</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
