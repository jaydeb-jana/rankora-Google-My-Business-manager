import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
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
  Smile,
  Eye,
  Check,
  X,
  Lightbulb,
  Heart,
  MessageSquare
} from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rankaro.com';

export const metadata = {
  title: 'How It Works - The 7-Step Google Review Conversion Engine | Rankaro',
  description:
    'Step-by-step architecture of in-store review generation: from countertop scan ergonomics and AI draft synthesis to Google Maps 3-Pack rank elevation.',
  keywords: [
    'how to get google reviews',
    'google review process',
    'countertop qr code review steps',
    'ai review generator process',
    'google maps 3-pack optimization',
    'local seo reputation workflow',
  ],
  alternates: {
    canonical: `${siteUrl}/how-it-works`,
  },
  openGraph: {
    title: 'How It Works - The 7-Step Google Review Conversion Engine | Rankaro',
    description:
      'Step-by-step architecture of in-store review generation: from countertop scan ergonomics and AI draft synthesis to Google Maps 3-Pack rank elevation.',
    url: `${siteUrl}/how-it-works`,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'How Rankaro Works - 7-Step Review Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works - The 7-Step Google Review Conversion Engine | Rankaro',
    description:
      'Step-by-step architecture of in-store review generation: from countertop scan ergonomics and AI draft synthesis to Google Maps 3-Pack rank elevation.',
    images: ['/logo.png'],
  },
};

const howToSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': 'How to Collect 5-Star Google Reviews with Countertop QR Codes and AI Drafts',
    'description': 'A 7-step guide to generating authentic, keyword-dense Google reviews from in-store customers.',
    'totalTime': 'PT10S',
    'step': [
      {
        '@type': 'HowToStep',
        'position': 1,
        'name': 'Configure Semantic Service Tags',
        'text': 'Link your verified Google Business Profile and configure your primary high-margin service tags.'
      },
      {
        '@type': 'HowToStep',
        'position': 2,
        'name': 'Generate Vector QR & NFC Hardware',
        'text': 'Download ready-to-print vector SVG and 300 DPI templates for countertop acrylic stands, check folios, and NFC badges.'
      },
      {
        '@type': 'HowToStep',
        'position': 3,
        'name': 'Customer Scans at Point of Sale',
        'text': 'Customer scans the QR code or taps the NFC badge with their smartphone camera at checkout.'
      },
      {
        '@type': 'HowToStep',
        'position': 4,
        'name': 'Tap Service Highlights',
        'text': 'Customer taps 2 or 3 service chips highlighting what they enjoyed during their visit.'
      },
      {
        '@type': 'HowToStep',
        'position': 5,
        'name': 'AI Formulates Authentic Draft',
        'text': 'Contextual AI synthesizes a natural, articulate review incorporating those exact service keywords.'
      },
      {
        '@type': 'HowToStep',
        'position': 6,
        'name': '1-Tap Copy & Post to Google Maps',
        'text': 'Customer taps Copy & Open Google, pasting the review directly into Google Maps rating box.'
      },
      {
        '@type': 'HowToStep',
        'position': 7,
        'name': 'Google Maps 3-Pack Elevation',
        'text': 'Google algorithms index high review velocity and keyword density, elevating the business to the local top 3.'
      }
    ]
  },
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
        'name': 'How It Works',
        'item': `${siteUrl}/how-it-works`
      }
    ]
  }
];

export default function HowItWorksPage() {
  const masterSteps = [
    {
      step: 'Step 01',
      title: 'Merchant Onboarding & Semantic Tag Configuration',
      time: '90 Seconds',
      psychology: 'Pre-seeds the algorithmic keywords that Google Maps searchers type every day.',
      desc: 'Link your verified Google Business Profile. Select your vertical (e.g., Dental Practice, Auto Repair, Italian Dining) or customize your own signature services and dishes. These tags form the structured semantic vocabulary that our natural language engine uses to generate keyword-rich reviews.',
      actions: [
        'Select 4 to 8 primary service tags that reflect your highest-margin offerings',
        'Upload your brand logo and select custom interface accent colors',
        'Auto-resolve your official Google Place ID for instant direct linking',
      ],
      icon: Layers,
    },
    {
      step: 'Step 02',
      title: 'Vector QR & Contactless NFC Hardware Generation',
      time: 'Instantaneous',
      psychology: 'Provides a tangible, tactile physical anchor at the point of sale.',
      desc: 'Rankaro instantly renders vector SVG and 300 DPI print-ready templates sized for standard 4x6" acrylic counter stands, leather check folios, and POS receipts. Download your files immediately or encode standard NFC NTAG213 smart tags.',
      actions: [
        'Download pre-formatted PDF templates ready for desktop printing or commercial print shops',
        'Optional: Program NFC pucks so patrons can simply tap their phone without opening the camera',
        'Ensure displays are placed directly adjacent to your credit card terminal',
      ],
      icon: QrCode,
    },
    {
      step: 'Step 03',
      title: 'Customer Scans at the Moment of Peak Gratitude',
      time: '1 to 2 Seconds',
      psychology: 'Replaces forgotten evening requests with immediate in-person action.',
      desc: 'The customer points their smartphone camera at the code or taps the NFC badge while their card payment processes. The page loads in under 380ms on their native browser with zero app downloads, account creation, or login friction.',
      actions: [
        'No app store download required; runs natively on Safari and Chrome',
        'Zero logins, passwords, or personal email signups required from the customer',
        'Mobile web interface loads cleanly even on slow 3G cellular connections',
      ],
      icon: Smartphone,
    },
    {
      step: 'Step 04',
      title: 'Recognition-Over-Recall: 1-Tap Service Chip Selection',
      time: '2 to 3 Seconds',
      psychology: 'Eliminates 100% of customer writer’s block through cognitive recognition.',
      desc: 'Rather than facing a daunting blank text box, the customer simply taps 2 or 3 visual chips representing what they enjoyed during their visit (e.g., "Painless Cleaning", "Zero Waiting Delay", "Friendly Hygienist").',
      actions: [
        'Cognitive load is reduced by 90% compared to typing from scratch',
        'Customer chooses their preferred sentiment tone (Exceptional 5★, Great 5★, or Concise)',
        'Selected chips automatically highlight for immediate tactile feedback',
      ],
      icon: Smile,
    },
    {
      step: 'Step 05',
      title: 'On-Device Natural Language Review Formulation',
      time: '0.4 Seconds',
      psychology: 'Provides an articulate, polished voice reflecting the customer’s true sentiment.',
      desc: 'Our contextual AI engine synthesizes a genuine, personalized review paragraph weaving in the exact service chips picked by the customer. It sounds natural, authentic, and grammatically flawless.',
      actions: [
        'Formulates human-cadence phrasing without repetitive robotic templates',
        'Naturally incorporates high-value local SEO keywords into the review body',
        'Customer can freely edit individual sentences, add personal details, or rewrite completely',
      ],
      icon: Sparkles,
    },
    {
      step: 'Step 06',
      title: '1-Tap Copy & Native Google Maps Launch',
      time: '1 Second',
      psychology: 'Removes the final friction barrier of navigating Google’s review interface.',
      desc: 'The customer taps "Copy & Open Google". The drafted text copies to their clipboard, and Google Maps launches straight to your business’s 5-star rating screen. The customer long-presses to paste and taps "Post".',
      actions: [
        'Automatically copies the review text to the mobile device clipboard',
        'Deep-links directly into Google Maps, bypassing search query distractions',
        'Customer voluntarily submits from their own personal Google account',
      ],
      icon: Copy,
    },
    {
      step: 'Step 07',
      title: 'Google Local 3-Pack Elevation & Inbound Customer Growth',
      time: 'Continuous',
      psychology: 'Permanent, compounding organic visibility that competitors cannot easily displace.',
      desc: 'As Google’s algorithm indexes frequent reviews packed with specific service keywords, your business ascends into the prestigious Google Maps 3-Pack, attracting high-intent organic calls 24/7.',
      actions: [
        'Consistent weekly review velocity signals active operational excellence to Google',
        'Keyword density in review bodies matches local search queries (e.g. "implants near me")',
        'Higher average rating drives higher click-through and phone call conversion rates',
      ],
      icon: TrendingUp,
    },
  ];

  const frictionComparison = [
    {
      aspect: 'When Request Occurs',
      oldWay: '4 to 48 hours later via automated SMS text blast',
      rankaroWay: 'At the checkout counter during peak gratitude',
      why: 'Satisfaction peaks at checkout; by evening, customer attention is lost.',
    },
    {
      aspect: 'Customer Effort Required',
      oldWay: 'Type 3-4 sentences from scratch on a blank phone screen',
      rankaroWay: 'Tap 2-3 visual service chips (under 10 seconds)',
      why: 'Recognition requires 90% less cognitive effort than recall.',
    },
    {
      aspect: 'Customer Friction & Spam',
      oldWay: 'Requires giving phone number; risks TCPA SMS spam complaints',
      rankaroWay: 'Zero personal data requested; 100% voluntary mobile web',
      why: 'Customers increasingly ignore or report intrusive SMS texts.',
    },
    {
      aspect: 'Review Keyword Richness',
      oldWay: 'Generic: "Good food!" or "Nice place" (zero SEO benefit)',
      rankaroWay: 'Rich: mentions specific treatments, dishes, and staff traits',
      why: 'Google ranks profiles based on keywords contained in review text.',
    },
    {
      aspect: 'Google & FTC Compliance',
      oldWay: 'Uses deceptive gating (diverts negative reviews to private forms)',
      rankaroWay: '100% anti-gating compliant with optional private remediation',
      why: 'Protects business from FTC civil penalties of up to $51,744.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={howToSchemas} />
      <Navbar />

      <main className="flex-1 space-y-24 pb-28">
        {/* HERO */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>The Science of In-Store Review Conversion</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            How Rankaro Turns a 2-Minute Chore into a{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              10-Second Breeze
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            By eliminating cognitive friction and leveraging the physical point of sale, Rankaro drives 3x to 5x more detailed, keyword-rich Google reviews without annoying SMS text reminders.
          </p>
        </section>

        {/* THE 7-STEP ARCHITECTURE MASTERCLASS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Complete Blueprint
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              The 7-Step Anatomy of a 10-Second Review
            </h2>
          </div>

          <div className="space-y-8">
            {masterSteps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition-all space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center space-x-4">
                      <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded">
                          {st.step}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                          {st.title}
                        </h3>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-500 flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-full w-fit">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{st.time}</span>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {st.desc}
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                      Why This Step Works (Psychological Insight):
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      {st.psychology}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Execution Actions:
                    </div>
                    {st.actions.map((act, i) => (
                      <div key={i} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* WHY OLD WAYS FAIL (COGNITIVE FRICTION ANALYSIS) */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Behavioral Economics
              </span>
              <h2 className="text-3xl font-black mt-2">
                Why Traditional Review Asking Fails 87% of the Time
              </h2>
              <p className="mt-2 text-slate-400 text-xs sm:text-sm">
                A side-by-side analysis of how legacy SMS software introduces friction versus Rankaro&apos;s point-of-sale architecture.
              </p>
            </div>

            <div className="space-y-4">
              {frictionComparison.map((row, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    <span>{row.aspect}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      <span className="font-bold block text-rose-400 mb-0.5">Old SMS / Manual Method:</span>
                      {row.oldWay}
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <span className="font-bold block text-emerald-400 mb-0.5">The Rankaro Architecture:</span>
                      {row.rankaroWay}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    💡 <em>{row.why}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STAFF TRAINING SCRIPTS PLAYBOOK */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-blue-50/60 border border-blue-200/80 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Staff Training Manual
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Exact Verbal Scripts for Your Front-Desk Team (100% Policy-Safe)
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              Google and the FTC strictly prohibit incentivized reviews (e.g. &ldquo;Leave 5 stars and get 10% off&rdquo;). Here are field-tested, non-incentive scripts that convert 30%+ of patrons:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  For Receptionists & Front Desks:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 italic font-medium leading-relaxed">
                  &ldquo;Thank you so much for coming in today, [Name]! If you have 10 seconds while your receipt prints, tapping this stand helps our team immensely &mdash; you can simply tap the treatments you loved!&rdquo;
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  For Restaurant Waitstaff:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 italic font-medium leading-relaxed">
                  &ldquo;I hope you had a fantastic dinner this evening! If you’d like to highlight your favorite dish, tapping the card inside the bill presenter takes just 10 seconds. We really appreciate it!&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
