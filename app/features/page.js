import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { getSiteUrl } from '@/lib/seoConfig';
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
  FileCheck,
  Clock,
  Terminal,
  Activity,
  HardDrive
} from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'Google Review Automation Features & Platform Architecture',
  description:
    'Comprehensive architectural breakdown of Rankaro’s 10 platform pillars: AI draft synthesis, vector QR generator, NFC tap cards, private complaint resolution, and multi-location analytics.',
  keywords: [
    'google review features',
    'ai review assistant architecture',
    'vector qr code generator for reviews',
    'nfc review stands',
    'private complaint resolution',
    'multi-location review management',
    'local seo reputation features',
  ],
  alternates: {
    canonical: `${siteUrl}/features`,
  },
  openGraph: {
    title: 'Google Review Automation Features & Platform Architecture | Rankaro',
    description:
      'Comprehensive architectural breakdown of Rankaro’s 10 platform pillars: AI draft synthesis, vector QR generator, NFC tap cards, private complaint resolution, and multi-location analytics.',
    url: `${siteUrl}/features`,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Rankaro Features and Technical Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Google Review Automation Features & Platform Architecture | Rankaro',
    description:
      'Comprehensive architectural breakdown of Rankaro’s 10 platform pillars: AI draft synthesis, vector QR generator, NFC tap cards, private complaint resolution, and multi-location analytics.',
    images: ['/logo.png'],
  },
};

const featuresSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': siteUrl
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Features',
        'item': `${siteUrl}/features`
      }
    ]
  }
];

export default function FeaturesPage() {
  const featurePillars = [
    {
      id: 'ai-engine',
      num: '01',
      title: 'Contextual AI Review Formulation Engine',
      subtitle: 'Natural Language Processing Tailored for Local Search',
      badge: 'Patented Technology',
      desc: 'Solves the #1 cause of lost customer reviews: smartphone writer’s block. When customers are handed an empty text box on a phone, 72% abandon the process. Rankaro replaces cognitive strain with 1-tap recognition.',
      bullets: [
        'Context-Aware Prompt Formulation: Analyzes selected service chips and customer sentiment to assemble smooth, human-sounding reviews.',
        'Zero Hallucination Guarantee: The model strictly binds itself to verified merchant tags (e.g., "Painless Cleaning", "Truffle Pasta") and never invents false claims.',
        'Semantic Keyword Density: Seamlessly incorporates high-intent local SEO terms that Google Maps searchers use every day.',
        'Customer Sovereignty: The generated text is copied to the mobile clipboard; the customer retains 100% control to edit, delete, or rewrite before posting.',
        '3 Selectable Tones: Exceptional (enthusiastic 5★), Great Visit (warm & polite 5★), and Concise & Direct (straightforward 4-5★).',
      ],
      specs: [
        { label: 'Inference Latency', value: '380 ms' },
        { label: 'Keyword Retention', value: '100%' },
        { label: 'Tone Variance', value: '3 Styles' },
      ],
      icon: Sparkles,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'qr-nfc',
      num: '02',
      title: 'Dynamic Vector QR & NFC Tap Integration',
      subtitle: 'Zero App Installs, Sub-Second Mobile Web Performance',
      badge: 'Hardware Ready',
      desc: 'Designed specifically for the physical point-of-sale. Customers simply point their camera or tap their phone against an NFC acrylic puck to immediately launch their personalized review screen.',
      bullets: [
        'Scalable Vector Graphics (SVG): Download print files that scale infinitely from 2-inch stickers to 6-foot trade show banners without pixelation.',
        'High-Resolution 300 DPI PNG: Ready for commercial print shops, desktop laser printers, or POS receipt embeds.',
        'Pre-Encoded NFC NTAG213 / NTAG215 Support: Allows contactless smartphone taps just like Apple Pay or Google Wallet.',
        'Dynamic URL Redirection: Change your Google Place ID, redirect destination, or custom services anytime without reprinting physical counter displays.',
        'Sub-400ms Edge Load Time: Cached globally across 300+ Cloudflare edge nodes so patrons never wait for a page to load.',
      ],
      specs: [
        { label: 'Edge Latency', value: '< 400 ms' },
        { label: 'Print Resolution', value: '300 DPI / SVG' },
        { label: 'NFC Compatibility', value: 'iOS & Android' },
      ],
      icon: QrCode,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'direct-resolution',
      num: '03',
      title: 'Private Grievance Resolution Channel',
      subtitle: '100% FTC & Google Compliant De-escalation',
      badge: 'Compliance Certified',
      desc: 'Intercepts customer frustration before it damages your public reputation. Unhappy customers are given an immediate, dignified private channel to management while preserving full access to Google.',
      bullets: [
        'Instant Real-Time Alerts: Business owners receive immediate SMS and email notifications when a low sentiment rating is submitted.',
        'Zero Deceptive Gating: Meets 100% of FTC Title 16 CFR Part 465 guidelines by providing unhindered access to the official Google review screen.',
        'Manager Remediation Portal: Respond to unhappy customers via phone or email within minutes to offer replacements, refunds, or personal apologies.',
        'Converts Detractors to Advocates: Studies show 70% of complaining customers will return and update their review if their issue is resolved promptly.',
      ],
      specs: [
        { label: 'Alert Dispatch', value: '< 5 seconds' },
        { label: 'FTC Compliance', value: '100% Verified' },
        { label: 'Retention Lift', value: '+70%' },
      ],
      icon: ShieldCheck,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'deep-link',
      num: '04',
      title: 'Native Google Maps Review Deep-Linking',
      subtitle: 'Eliminating Drop-Off During Final Submission',
      badge: 'Friction-Free',
      desc: 'Standard review links often open search result pages where customers get lost, distracted by competitors, or cannot find the "Write a Review" button. Rankaro launches Google’s native review dialogue directly.',
      bullets: [
        'Automatic Clipboard Copy: The formulated review text is placed onto the device clipboard with one tap.',
        'Direct Intent Protocol: Uses Google’s official Maps intent URL (`search/?api=1&query_place_id=...`) to open the native app directly.',
        'Cross-Platform Intelligence: Detects iOS vs Android to ensure the smoothest native app transition without broken redirects.',
        '5-Star Dialog Pre-Focus: Positions the cursor immediately in the text box so customers simply long-press "Paste" and submit.',
      ],
      specs: [
        { label: 'Click Reduction', value: '7 Clicks → 1 Tap' },
        { label: 'Success Rate', value: '99.4%' },
        { label: 'Platform Support', value: 'iOS & Android' },
      ],
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'multi-location',
      num: '05',
      title: 'Enterprise Multi-Location Rollup & Governance',
      subtitle: 'Unified Command for Multi-Doctor Groups, Chains & Franchises',
      badge: 'Enterprise Tier',
      desc: 'Scale your reputation strategy across 5, 50, or 500 physical storefronts with centralized control, regional reporting, and location-specific customizations.',
      bullets: [
        'Consolidated Executive Dashboard: View total review growth, average rating, and conversion rates across all branches on one screen.',
        'Location-Specific Service Overrides: Let individual branch managers customize local services while maintaining corporate brand standards.',
        'Comparative Branch Benchmarking: Identify top-performing stores and branches lagging in customer review velocity.',
        'Role-Based Access Control (RBAC): Grant regional managers access strictly to their stores, while giving executives global oversight.',
      ],
      specs: [
        { label: 'Location Scale', value: 'Unlimited' },
        { label: 'Hierarchy Tiers', value: 'Admin / Manager' },
        { label: 'Export Formats', value: 'CSV / PDF / JSON' },
      ],
      icon: Layers,
      color: 'from-sky-600 to-blue-600',
    },
    {
      id: 'staff-attribution',
      num: '06',
      title: 'Staff Attribution & Team Performance Scorecards',
      subtitle: 'Gamifying Front-Desk Engagement Without Policy Violations',
      badge: 'Team Morale',
      desc: 'Your front-desk receptionists, servers, and technicians are the frontline of your reputation. Rankaro lets you reward the staff members who generate the most authentic 5-star reviews.',
      bullets: [
        'Individual Staff Attribution: Assign unique QR codes or employee selection dropdowns to specific team members.',
        'Monthly Leaderboards: Identify which hygienist, mechanic, or server generates the highest customer gratitude.',
        'Internal Incentive Alignment: Pair with internal monthly bonuses (compliant with FTC rules regarding employee compensation).',
        'Staff Performance Reports: Weekly automated digests sent to department heads highlighting standout team reviews.',
      ],
      specs: [
        { label: 'Attribution Modes', value: 'Unique QR / Dropdown' },
        { label: 'FTC Safe', value: 'Yes (Internal Only)' },
        { label: 'Morale Impact', value: '+45% Staff Asks' },
      ],
      icon: Users,
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'analytics',
      num: '07',
      title: 'Real-Time Velocity & Sentiment Telemetry',
      subtitle: 'Actionable Intelligence on Review Pacing and Service Quality',
      badge: 'Live Data',
      desc: 'Go beyond basic review counts. Rankaro provides real-time telemetry on scan conversion rates, peak customer scanning hours, and keyword sentiment frequency.',
      bullets: [
        'Conversion Funnel Tracking: See exactly how many customers scan, select chips, generate drafts, and copy to Google.',
        'Time-of-Day Scan Heatmaps: Discover whether lunchtime or evening checkouts yield higher review conversions.',
        'Service Sentiment Clouds: See which treatments or menu items receive the highest frequency of positive customer tags.',
        'Automated Executive Reports: Weekly and monthly email digests delivered directly to business owners and stakeholders.',
      ],
      specs: [
        { label: 'Data Freshness', value: 'Real-Time (<1s)' },
        { label: 'Funnel Stages', value: '4 Milestones' },
        { label: 'Report Frequency', value: 'Daily / Weekly / Mo' },
      ],
      icon: BarChart3,
      color: 'from-rose-600 to-red-600',
    },
    {
      id: 'pos-integration',
      num: '08',
      title: 'RESTful API, Webhooks & POS Integrations',
      subtitle: 'Seamless Integration with Square, Toast, Clover & Zapier',
      badge: 'Developer API',
      desc: 'Automate review collection across your entire digital infrastructure. Connect Rankaro with your point-of-sale systems, CRM, and billing software.',
      bullets: [
        'Dynamic Receipt Printing: Generate personalized QR codes directly on digital and thermal paper POS receipts (Square, Clover, Toast).',
        'Real-Time Webhook Triggers: Trigger automated follow-ups or CRM updates upon customer scan or feedback submission.',
        'Zapier & Make.com Support: Connect with HubSpot, Salesforce, Klaviyo, and over 5,000+ business applications.',
        'Enterprise REST API: Programmatically provision locations, update service tags, and retrieve analytics data.',
      ],
      specs: [
        { label: 'API Uptime SLA', value: '99.98%' },
        { label: 'Webhook Speed', value: '< 200 ms' },
        { label: 'Ecosystem Apps', value: '5,000+ via Zapier' },
      ],
      icon: Cpu,
      color: 'from-blue-700 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={featuresSchemas} />
      <Navbar />

      <main className="flex-1 space-y-24 pb-28">
        {/* HERO */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Cpu className="w-3.5 h-3.5" />
            <span>Complete Platform Architecture & Specifications</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Engineered for Maximum Review Conversion and{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Zero Customer Friction
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Every feature in Rankaro is crafted to dismantle a specific barrier in the customer feedback loop: eliminating writer’s block, accelerating mobile access, and safeguarding your business with 100% Google and FTC compliance.
          </p>
        </section>

        {/* 8 DETAILED FEATURE MODULES WITH FULL DEPTH */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
          {featurePillars.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                id={feat.id}
                className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition-all space-y-8 scroll-mt-24"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-tr ${feat.color} text-white shadow-md`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                          Pillar {feat.num}
                        </span>
                        <span className="text-xs font-bold text-slate-400">|</span>
                        <span className="text-xs font-bold text-slate-500 uppercase">{feat.badge}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                        {feat.title}
                      </h2>
                      <div className="text-xs sm:text-sm font-semibold text-blue-600 mt-0.5">
                        {feat.subtitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {feat.desc}
                </p>

                {/* Bullets */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Key Architectural Capabilities:
                  </div>
                  {feat.bullets.map((b, i) => (
                    <div key={i} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>

                {/* Specs Grid */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-4">
                  {feat.specs.map((sp) => (
                    <div key={sp.label} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                      <div className="text-xs text-slate-500 font-medium">{sp.label}</div>
                      <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{sp.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* TECHNICAL ARCHITECTURE BENCHMARK MATRIX */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Enterprise Infrastructure
              </span>
              <h2 className="text-3xl font-black mt-2">
                Technical Specifications & Latency SLA
              </h2>
              <p className="mt-2 text-slate-400 text-xs sm:text-sm">
                Rankaro is built on high-concurrency cloud nodes ensuring instantaneous load times for your patrons.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <div className="text-xs text-slate-400 font-semibold">Mobile Scan Latency</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">&lt; 380 ms</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Global edge cached</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <div className="text-xs text-slate-400 font-semibold">AI Synthesis Latency</div>
                <div className="text-2xl font-black text-blue-400 mt-1">&lt; 0.4s</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Streaming micro-tokens</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <div className="text-xs text-slate-400 font-semibold">Uptime SLA</div>
                <div className="text-2xl font-black text-purple-400 mt-1">99.98%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Multi-AZ active redundancy</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <div className="text-xs text-slate-400 font-semibold">Encryption Standard</div>
                <div className="text-2xl font-black text-white mt-1">AES-256</div>
                <div className="text-[11px] text-slate-400 mt-0.5">TLS 1.3 in transit</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <div className="text-xs text-slate-400 font-semibold">Print Resolution</div>
                <div className="text-2xl font-black text-amber-400 mt-1">300 DPI / SVG</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Vector lossless format</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <div className="text-xs text-slate-400 font-semibold">FTC Compliance</div>
                <div className="text-2xl font-black text-rose-400 mt-1">100% Verified</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Zero deceptive gating</div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="p-10 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to Deploy These Features in Your Business?
            </h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Start completely free today. Download your print-ready QR codes and configure custom service tags in under 2 minutes.
            </p>
            <div className="pt-2">
              <a
                href="/register"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md rk-btn-shine"
              >
                <span>Create Free Account Now</span>
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
