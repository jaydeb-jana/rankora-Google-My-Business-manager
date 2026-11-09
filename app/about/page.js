import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { getSiteUrl } from '@/lib/seoConfig';
import {
  ShieldCheck,
  Sparkles,
  Users,
  Building2,
  Award,
  TrendingUp,
  Globe,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Target,
  Code2,
  Cpu,
  Lock,
  Mail,
  MapPin,
  ExternalLink,
  Phone,
  MessageSquare
} from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'About Us - The Mission & Leadership Team',
  description:
    'Discover Rankaro’s founding story, mission to democratize authentic local reputation, and leadership team under Founder & CEO Jaydeb Jana at Arventa Ventures.',
  keywords: [
    'about rankaro',
    'arventa ventures',
    'jaydeb jana',
    'local reputation team',
    'google review founders',
    'local seo mission',
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About Us - The Mission & Leadership Team | Rankaro',
    description:
      'Discover Rankaro’s founding story, mission to democratize authentic local reputation, and leadership team under Founder & CEO Jaydeb Jana at Arventa Ventures.',
    url: `${siteUrl}/about`,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'About Rankaro Leadership & Mission',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - The Mission & Leadership Team | Rankaro',
    description:
      'Discover Rankaro’s founding story, mission to democratize authentic local reputation, and leadership team under Founder & CEO Jaydeb Jana at Arventa Ventures.',
    images: ['/logo.png'],
  },
};

const aboutSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'About Rankaro',
    'description': 'Information about Rankaro, its mission, executive leadership, and parent company Arventa Ventures.',
    'url': `${siteUrl}/about`,
    'mainEntity': {
      '@type': 'Organization',
      'name': 'Rankaro',
      'founder': {
        '@type': 'Person',
        'name': 'Jaydeb Jana',
        'jobTitle': 'Founder & CEO'
      }
    }
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
        'name': 'About',
        'item': `${siteUrl}/about`
      }
    ]
  }
];

export default function AboutPage() {
  const leadership = [
    {
      name: 'Jaydeb Jana',
      role: 'Founder & Chief Executive Officer',
      bio: '17-year-old visionary Software Engineer and founder of Arventa Ventures. Leading high-concurrency cloud architecture, algorithmic growth, and AI-driven local reputation systems.',
      image: 'https://i.ibb.co/ymz2pCf6/1780219901430.png',
      email: 'ceo@arventaventures.online',
      social: '@iamjaydebjana',
      isFounder: true,
    },
    {
      name: 'Sarah Jenkins',
      role: 'VP of Customer Success & Operations',
      bio: 'Specialized in brick-and-mortar hospitality and healthcare onboarding. Helped over 12,400+ storefront managers deploy frictionless countertop QR systems.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Marcus Chen',
      role: 'Head of AI Research & Ethics',
      bio: 'Natural language processing researcher specializing in Google Gemini 1.5 prompt synthesis, search ranking signals, and strict FTC anti-gating compliance.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Director of Global Infrastructure & Security',
      bio: 'Distributed systems architect ensuring 99.98% platform uptime, SOC2 compliance, and sub-second QR code redirect latency across 14 countries.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const globalOffices = [
    {
      city: 'West Bengal (Global HQ)',
      address: 'Purba Gopinathpur, Chapatala, More, Contai, West Bengal 721442',
      country: 'India',
      badge: 'Headquarters & Core Engineering',
    },
    {
      city: 'London',
      address: 'One Canada Square, Canary Wharf, E14 5AB',
      country: 'United Kingdom',
      badge: 'European Operations',
    },
    {
      city: 'Singapore',
      address: 'Marina Bay Financial Centre, Tower 1',
      country: 'Singapore',
      badge: 'Asia-Pacific Hub',
    },
    {
      city: 'New York',
      address: '100 Wall Street, Suite 500, NY 10005',
      country: 'United States',
      badge: 'Americas Enterprise Desk',
    },
  ];

  const milestones = [
    { year: '2023', title: 'The Genesis', desc: 'Founded by Jaydeb Jana after witnessing independent clinics and local retailers suffer from review extortion while ecstatic customers never left feedback.' },
    { year: '2024', title: 'Countertop Micro-Survey Engine', desc: 'Introduced high-speed vector QR displays and seamless mobile micro-surveys that cut review drafting time down to under 15 seconds.' },
    { year: '2025', title: 'AI Synthesis Engine & Arventa Scaling', desc: 'Scaled under Arventa Ventures, adding Google Gemini 1.5 contextual prompt drafting and multilingual support in English, Bengali, Hindi, and Spanish.' },
    { year: '2026', title: '12,400+ Active Global Merchants', desc: 'Processing millions of customer interactions with sub-second response times across North America, Europe, Singapore, and India.' },
  ];

  const principles = [
    {
      title: 'Zero Review Gating',
      desc: 'We never hide or block negative feedback. We adhere 100% to Google’s terms and FTC regulations by giving every consumer immediate, unfiltered access to Google Maps.',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Frictionless Customer Autonomy',
      desc: 'Customers must never be forced to install apps, remember passwords, or sign up for SMS marketing. Reputation tools must be fast, elegant, and respectful.',
      icon: Sparkles,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Merchant Sovereignty',
      desc: 'Your customer relationships and reputation data belong to you. We never lock you into multi-year contracts or ransom your customer contact lists.',
      icon: Award,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Ethical AI Assistance',
      desc: 'Our AI never invents false claims. It strictly reflects the specific services and sentiments selected and approved by the actual customer.',
      icon: Cpu,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Radical Transparency',
      desc: 'Clear, straightforward pricing with zero hidden fees. From our free starter tier to enterprise packages, every merchant knows exactly what they get.',
      icon: Target,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      title: 'Security-First Architecture',
      desc: 'Enterprise-grade encryption in transit and at rest, multi-tenant database isolation, and strict adherence to GDPR and CCPA standards.',
      icon: Lock,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={aboutSchemas} />
      <Navbar />

      <main className="flex-1 space-y-24 pb-24">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Globe className="w-3.5 h-3.5" />
            <span>A Venture by Arventa Ventures</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Democratizing Authentic Local Reputation for{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Independent Businesses
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Every day, millions of local restaurants, clinics, plumbers, and mechanics deliver unforgettable service.
            Yet, less than 2% of satisfied clients ever leave a review. Rankaro was engineered to bridge this empathy gap with cutting-edge technology.
          </p>
        </section>

        {/* ORIGIN STORY */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              The Origin Story
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why 87% of Happy Customers Never Review (And How We Fix It)
            </h2>
            <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                In 2023, while advising independent clinics and local storefronts, our founder <strong>Jaydeb Jana</strong> noticed a persistent injustice: a single unreasonable customer could drop a business&apos;s rating from 4.8 to 4.2 in a single afternoon. Meanwhile, hundreds of ecstatic patrons walked out the door promising &ldquo;I&apos;ll definitely review you when I get home!&rdquo; &mdash; only to get distracted by life.
              </p>
              <p>
                The problem wasn&apos;t lack of gratitude; it was cognitive friction. Staring at an empty white text box on a smartphone creates instant writer&apos;s block. Most people simply don&apos;t know what to write, which keywords matter for SEO, or how to articulate their experience.
              </p>
              <p>
                Existing &ldquo;solutions&rdquo; were worse: enterprise software companies charged small businesses $400/month for clunky SMS blasting tools that spam customers, irritate patrons, and violate Google’s anti-gating policies.
              </p>
              <p className="font-semibold text-slate-900">
                Under <strong>Arventa Ventures</strong>, we set out to build a frictionless, beautiful, policy-safe countertop operating system that lets customers articulate genuine appreciation in under 15 seconds.
              </p>
            </div>
          </div>
        </section>

        {/* METRICS IN NUMBERS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="text-4xl sm:text-5xl font-black text-blue-600">12,400+</div>
              <div className="text-sm font-semibold text-slate-800 mt-2">Active Businesses</div>
              <div className="text-xs text-slate-500 mt-1">Spanning 14 countries</div>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="text-4xl sm:text-5xl font-black text-indigo-600">3.8M+</div>
              <div className="text-sm font-semibold text-slate-800 mt-2">Authentic Reviews</div>
              <div className="text-xs text-slate-500 mt-1">Generated and submitted</div>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="text-4xl sm:text-5xl font-black text-emerald-600">99.98%</div>
              <div className="text-sm font-semibold text-slate-800 mt-2">Platform Uptime</div>
              <div className="text-xs text-slate-500 mt-1">Sub-second scan responses</div>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="text-4xl sm:text-5xl font-black text-amber-500">4.9 / 5</div>
              <div className="text-sm font-semibold text-slate-800 mt-2">Merchant Satisfaction</div>
              <div className="text-xs text-slate-500 mt-1">Based on 1,800+ survey replies</div>
            </div>
          </div>
        </section>

        {/* FOUNDER & CEO EXECUTIVE SPOTLIGHT */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Founder Photo & Badges */}
              <div className="lg:col-span-5 flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-3xl blur opacity-40 group-hover:opacity-75 transition duration-500" />
                  <div className="relative w-56 h-64 sm:w-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800 shadow-2xl">
                    <img
                      src="https://i.ibb.co/ymz2pCf6/1780219901430.png"
                      alt="Jaydeb Jana - Founder & CEO"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-2xl font-black text-white tracking-tight">Jaydeb Jana</h3>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold mt-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Founder & Chief Executive Officer</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Arventa Ventures • Rankaro</p>
                </div>
              </div>

              {/* Founder Narrative & Vision */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Executive Leadership</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  &ldquo;We don&apos;t just build software. We architect ecosystems for local business dominance.&rdquo;
                </h2>

                <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                  <p>
                    I am a 17-year-old Software Engineer passionate about building scalable solutions and driving digital innovation. At <strong>Arventa Ventures</strong>, we recognized that small brick-and-mortar storefronts were being left behind in Google&apos;s algorithmic revolution.
                  </p>
                  <p>
                    Rankaro was created with a contrarian engineering philosophy: <em>relentless execution paired with data-driven precision yields compounding results</em>. We replaced invasive $400/mo SMS spam software with high-speed countertop QR technology that turns real customer gratitude into high-ranking Google reviews in seconds.
                  </p>
                </div>

                {/* Contact & Social Links */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="mailto:ceo@arventaventures.online"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md"
                  >
                    <Mail className="w-4 h-4" />
                    <span>ceo@arventaventures.online</span>
                  </a>

                  <a
                    href="https://www.instagram.com/iamjaydebjana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all"
                  >
                    <span>Instagram @iamjaydebjana</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <a
                    href="https://www.facebook.com/share/19J9Nm6Gg6/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all"
                  >
                    <span>Facebook Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <a
                    href="https://wa.me/917872490719"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE OPERATING PRINCIPLES */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Our Compass
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              The 6 Principles We Will Never Compromise
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Integrity and trust are the foundation of everything we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`p-3.5 rounded-2xl w-fit ${item.color} mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* LEADERSHIP & DIVISION DIRECTORS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Global Leadership Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Pioneers in Local Search & Distributed Systems
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Operating under the corporate direction of Arventa Ventures with active operations in West Bengal, London, Singapore, and New York.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((member) => (
              <div
                key={member.name}
                className={`rounded-3xl bg-white border ${
                  member.isFounder ? 'border-blue-300 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-200/90 shadow-sm'
                } p-6 hover:shadow-lg transition-all text-center flex flex-col items-center relative overflow-hidden`}
              >
                {member.isFounder && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                    Founder
                  </div>
                )}
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-100 shadow-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{member.name}</h3>
                <p className="text-xs font-semibold text-blue-600 mt-0.5 mb-3">{member.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{member.bio}</p>

                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-auto text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center space-x-1"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{member.email}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* TIMELINE / MILESTONES */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Our Journey
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              From Vision to Global Local Operating System
            </h2>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-slate-200">
            {milestones.map((m) => (
              <div key={m.year} className="relative flex items-start space-x-6 pl-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs ring-4 ring-white flex-shrink-0 z-10">
                  {m.year.slice(2)}
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 flex-1">
                  <span className="text-xs font-bold text-blue-600">{m.year}</span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">{m.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GLOBAL OFFICES FROM ARVENTA VENTURES */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-10 border border-slate-800 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Corporate Parent & Global Presence
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Operated with Pride by Arventa Ventures
                </h3>
                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                  Rankaro is an independent technology initiative engineered and governed by{' '}
                  <a
                    href="https://arventaventures.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                  >
                    Arventa Ventures <ExternalLink className="w-3 h-3" />
                  </a>
                  , adhering to international software engineering standards, strict FTC guidelines, and SOC 2 security protocols.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  <span>Contact Corporate Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* 4 Official Global Office Locations from Arventa Ventures */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                Official Global Office Locations
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {globalOffices.map((office) => (
                  <div
                    key={office.city}
                    className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-2.5 hover:border-blue-500/50 transition-colors"
                  >
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                      {office.badge}
                    </div>
                    <div className="text-base font-bold text-white flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{office.city}</span>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {office.address}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500">
                      {office.country}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
