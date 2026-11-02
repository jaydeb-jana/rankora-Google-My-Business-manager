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
  Layers
} from 'lucide-react';

export const metadata = {
  title: 'Rankaro vs Birdeye & Podium Comparison | Rankaro',
  description:
    'Compare Rankaro with Birdeye, Podium, and GatherUp. Discover why modern storefronts are switching from $400/month SMS spam tools to frictionless countertop QR codes.',
};

export default function ComparePage() {
  const criteria = [
    {
      feature: 'Monthly Starting Price',
      rankaro: 'Free - $29 / mo',
      birdeye: '$299 - $499 / mo',
      podium: '$399 - $599 / mo',
      manual: 'Free (Staff Heavy)',
    },
    {
      feature: 'Contract Requirement',
      rankaro: 'None (Cancel Anytime)',
      birdeye: 'Mandatory 12-Month Lock-in',
      podium: 'Mandatory 12-Month Lock-in',
      manual: 'None',
    },
    {
      feature: 'Setup & Onboarding Time',
      rankaro: '< 2 Minutes',
      birdeye: '2 - 3 Weeks Call Onboarding',
      podium: '2 - 4 Weeks Setup',
      manual: 'Instant',
    },
    {
      feature: 'Customer Friction',
      rankaro: 'Zero: 10s Scan & Tap',
      birdeye: 'High: Invasive SMS Text Blasts',
      podium: 'High: SMS Texts & Marketing Opt-in',
      manual: 'High: 87% Forget by Evening',
    },
    {
      feature: 'Natural Language AI Formulation',
      rankaro: true,
      birdeye: false,
      podium: false,
      manual: false,
    },
    {
      feature: 'Local SEO Keyword Chip Injections',
      rankaro: true,
      birdeye: false,
      podium: false,
      manual: false,
    },
    {
      feature: 'FTC & Google Anti-Gating Compliance',
      rankaro: '100% Policy-Safe',
      birdeye: 'Questionable (Risk of Penalties)',
      podium: 'Questionable (Gating Filters)',
      manual: 'Compliant',
    },
    {
      feature: 'Vector SVG & NFC Tap Hardware',
      rankaro: true,
      birdeye: false,
      podium: false,
      manual: false,
    },
    {
      feature: 'Zero App or Login Required for Patron',
      rankaro: true,
      birdeye: true,
      podium: true,
      manual: true,
    },
    {
      feature: 'Private Management Feedback Channel',
      rankaro: true,
      birdeye: true,
      podium: true,
      manual: false,
    },
    {
      feature: 'Multi-Location Enterprise Rollup',
      rankaro: true,
      birdeye: true,
      podium: true,
      manual: false,
    },
  ];

  const flaws = [
    {
      title: 'Invasive SMS Spam Annoying Customers',
      desc: 'Legacy tools like Podium and Birdeye require taking customer phone numbers and blasting them with text messages hours or days after their visit. Customers find this invasive and increasingly report it as SMS spam under TCPA regulations.',
      icon: Smartphone,
    },
    {
      title: 'Astronomical $3,600 - $6,000 Annual Contracts',
      desc: 'Why pay thousands of dollars every year for simple software? Legacy providers lock small clinics and restaurants into expensive multi-year contracts with aggressive sales reps and auto-renewal traps.',
      icon: DollarSign,
    },
    {
      title: 'Lack of Specific Keyword Injection',
      desc: 'SMS links simply take the customer to an empty text box on Google. The customer doesn’t know what to write, resulting in either total drop-off or low-value one-word reviews ("Great service") that do not improve Google Maps ranking.',
      icon: Sparkles,
    },
    {
      title: 'Delayed Asking Misses the Gratitude Window',
      desc: 'Customer satisfaction peaks at the checkout counter, not 48 hours later while they are cooking dinner or driving. Asking in-person at the moment of payment produces 3x higher conversion rates.',
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 space-y-24 pb-24">
        {/* HERO */}
        <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Honest Head-to-Head Comparison</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Why Modern Storefronts are Replacing{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              $400/Mo Legacy SMS Software
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            See how Rankaro delivers 5x more detailed, keyword-rich Google reviews at a fraction of the cost of Birdeye and Podium &mdash; without invasive SMS spam or long-term contracts.
          </p>
        </section>

        {/* COMPARISON TABLE */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-md">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-4 px-6 font-bold text-slate-900 w-2/6">Feature & Criterion</th>
                  <th className="py-4 px-4 font-extrabold text-blue-600 text-center bg-blue-50/80 w-1/6">
                    Rankaro
                  </th>
                  <th className="py-4 px-4 font-semibold text-slate-600 text-center w-1/6">
                    Birdeye
                  </th>
                  <th className="py-4 px-4 font-semibold text-slate-600 text-center w-1/6">
                    Podium
                  </th>
                  <th className="py-4 px-4 font-semibold text-slate-500 text-center w-1/6">
                    Manual Asking
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

                    {/* Manual Col */}
                    <td className="py-4 px-4 text-center text-slate-400">
                      {typeof row.manual === 'boolean' ? (
                        row.manual ? (
                          <Check className="w-4 h-4 text-slate-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-xs text-slate-500">{row.manual}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4 FLAWS OF LEGACY SMS SOFTWARE */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Why SMS Review Asking Is Dying
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3">
              The 4 Fatal Flaws of Old Review Platforms
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {flaws.map((flaw) => {
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
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Zero-Friction Switch
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Switching from Birdeye or Podium in Under 5 Minutes
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                1. <strong>Create your free Rankaro account:</strong> No credit card required. Paste your Google Place ID or search your business name.
              </p>
              <p>
                2. <strong>Download vector QR code templates:</strong> Replace outdated desktop signage with our high-res vector acrylic counter stands.
              </p>
              <p>
                3. <strong>Cancel your $400/month subscription:</strong> Save thousands of dollars annually while doubling your authentic review velocity.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="/register"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md rk-btn-shine"
              >
                <span>Switch to Rankaro Free</span>
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
