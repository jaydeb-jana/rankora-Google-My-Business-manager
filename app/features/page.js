import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Sparkles,
  QrCode,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Lock,
  Users,
  Compass,
  RefreshCw,
  Bell,
  Sliders,
  Database,
  Printer,
  ChevronDown,
  Globe2,
  FileCheck
} from 'lucide-react';

export const metadata = {
  title: 'Platform Features & Architecture | Rankaro',
  description:
    'Explore Rankaro’s comprehensive feature suite: AI review formulation, vector QR displays, NFC tap integration, private feedback resolution, and multi-location analytics.',
};

export default function FeaturesPage() {
  const features = [
    {
      id: 'ai-engine',
      title: 'Contextual AI Review Formulation',
      badge: 'Patented Technology',
      desc: 'Solves customer writer’s block in under 10 seconds. Synthesizes genuine, personalized reviews based strictly on the specific service chips selected by the customer.',
      bullets: [
        'Naturally weaves in high-value local SEO keywords',
        '3 selectable sentiment tones: Exceptional, Great, and Concise',
        'Customer maintains 100% editing control before submitting',
        'Zero robotic language: reads with authentic human cadence',
      ],
      icon: Sparkles,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'qr-nfc',
      title: 'Dynamic Vector QR & NFC Tap Engine',
      badge: 'Hardware Ready',
      desc: 'Deploy custom scannable QR codes and instant tap NFC cards on checkout counters, table tents, invoice footers, and front desks.',
      bullets: [
        'Vector SVG & 300 DPI high-resolution print exports',
        'Instant mobile web load (<400ms) with zero app downloads',
        'Customizable brand logo, theme colors, and counter slogans',
        'Compatible with all iOS and Android smartphone cameras',
      ],
      icon: QrCode,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'direct-resolution',
      title: 'Private Feedback Resolution Channel',
      badge: 'FTC & Google Safe',
      desc: 'Displeased customers are provided with a dedicated direct line to management to address grievances privately, without deceptive gating.',
      bullets: [
        'Instant SMS/Email alert to business owner when poor rating is logged',
        'Direct resolution chat before negative reviews hit Google',
        'Maintains full public Google review access (100% compliant)',
        'Resolves customer complaints before public escalation',
      ],
      icon: ShieldCheck,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'deep-link',
      title: 'Native Google Maps Deep-Linking',
      badge: 'Friction-Free',
      desc: 'Bypasses confusing search queries by opening the customer’s native Google Maps app directly to your official 5-star review dialog.',
      bullets: [
        'Auto-copies generated review text to mobile clipboard',
        '1-tap paste directly into the Google review box',
        'Deep-links reliably on both Apple iOS Maps & Google Maps',
        'Eliminates lost customers during the review submission step',
      ],
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'multi-location',
      title: 'Multi-Location & Franchise Management',
      badge: 'Enterprise Tier',
      desc: 'Manage 5, 50, or 500 physical storefronts from a unified dashboard. Compare store performance, review velocity, and staff ratings.',
      bullets: [
        'Centralized brand presets with location-specific service overrides',
        'Comparative benchmarking across regional branches',
        'Role-based permissions for regional managers & store staff',
        'Consolidated executive reporting and CSV/PDF export',
      ],
      icon: Layers,
      color: 'from-sky-600 to-blue-600',
    },
    {
      id: 'staff-attribution',
      title: 'Staff Attribution & Team Leaderboards',
      badge: 'Team Morale',
      desc: 'Identify which team members and service providers generate the most positive customer feedback and review volume.',
      bullets: [
        'Individual staff QR codes or employee selection dropdowns',
        'Monthly internal performance scorecards and tipping boosts',
        'Encourages front-desk staff to ask for reviews organically',
        '100% compliant with FTC employee incentive guidelines',
      ],
      icon: Users,
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'analytics',
      title: 'Real-Time Velocity & Sentiment Analytics',
      badge: 'Live Data',
      desc: 'Track your reputation metrics in real-time. Understand which services generate the highest satisfaction and monitor review pacing.',
      bullets: [
        'Live scan count vs submission conversion rate tracking',
        'Keyword sentiment frequency clouds',
        'Projected Google Maps 3-Pack rank progression',
        'Automated weekly email summaries sent straight to executives',
      ],
      icon: BarChart3,
      color: 'from-rose-600 to-red-600',
    },
    {
      id: 'pos-integration',
      title: 'POS, Webhook & Zapier Ecosystem',
      badge: 'Developer API',
      desc: 'Connect Rankaro with your existing tech stack including Square, Clover, Toast, Shopify, HubSpot, and over 5,000+ apps via Zapier.',
      bullets: [
        'RESTful API for automated QR code generation on digital receipts',
        'Webhook triggers upon customer scan or feedback submission',
        'Automatic customer sync with CRM platforms',
        'Pre-built integrations for leading healthcare & restaurant POS',
      ],
      icon: Cpu,
      color: 'from-blue-700 to-cyan-600',
    },
  ];

  const techSpecs = [
    { label: 'Mobile Scan Load Latency', value: '< 380 ms', detail: 'Edge-cached global CDN nodes' },
    { label: 'Uptime Reliability SLA', value: '99.98%', detail: 'High-availability multi-cloud redundancy' },
    { label: 'Data Encryption Standard', value: 'AES-256 / TLS 1.3', detail: 'End-to-end encrypted transit & rest' },
    { label: 'QR Resolution Quality', value: 'Vector SVG & 300 DPI', detail: 'Crisp vector printing on any surface' },
    { label: 'Regulatory Compliance', value: 'GDPR / CCPA / FTC', detail: '100% anti-gating policy verified' },
    { label: 'Smartphone Compatibility', value: 'iOS 13+ & Android 9+', detail: 'No app download required' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 space-y-24 pb-24">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Cpu className="w-3.5 h-3.5" />
            <span>Complete Platform Feature Suite</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Engineered for Maximum Review Conversion and{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Zero Customer Friction
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Every feature in Rankaro is crafted to solve a specific barrier in the customer feedback loop: eliminating writer’s block, speeding up mobile access, and safeguarding your business with 100% Google policy compliance.
          </p>
        </section>

        {/* 8 COMPREHENSIVE FEATURE MODULES */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-tr ${feat.color} text-white shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {feat.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {feat.desc}
                    </p>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100">
                      {feat.bullets.map((b, i) => (
                        <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600">Available across all plans</span>
                    <a href="/register" className="text-blue-600 font-bold hover:text-blue-700 flex items-center space-x-1">
                      <span>Try this feature</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TECHNICAL SPECIFICATIONS TABLE */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Under the Hood
              </span>
              <h2 className="text-3xl font-extrabold mt-2">
                Technical Architecture & Performance SLA
              </h2>
              <p className="mt-2 text-slate-400 text-sm">
                Built on high-concurrency cloud nodes ensuring instantaneous load times for your patrons.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {techSpecs.map((spec) => (
                <div key={spec.label} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <div className="text-xs text-slate-400 font-semibold">{spec.label}</div>
                  <div className="text-2xl font-black text-white mt-1">{spec.value}</div>
                  <div className="text-[11px] text-blue-400 mt-1">{spec.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY NOT OTHER TOOLS - SUMMARY */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              The Rankaro Difference
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              Built Specifically for the Physical Point of Sale
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Unlike online-only tools that send forgotten email sequences 4 days after the customer has left your store, Rankaro strikes at the exact moment of peak satisfaction &mdash; at the checkout register, dining table, or clinic counter.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/register"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all rk-btn-shine"
              >
                Create Your Custom QR Code Now
              </a>
              <a
                href="/compare"
                className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm border border-slate-200 rounded-xl transition-colors"
              >
                Compare with Birdeye & Podium
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
