import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Globe,
  Award,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Building,
  Target,
  Code2,
  Cpu,
  Lock,
  Mail,
  MapPin
} from 'lucide-react';

export const metadata = {
  title: 'About Us | Rankaro by Arventa Ventures',
  description:
    'Learn about our mission to democratize authentic local reputation, eliminate review friction, and empower independent businesses worldwide.',
};

export default function AboutPage() {
  const leadership = [
    {
      name: 'Ayan Mukherjee',
      role: 'Chief Executive Officer & Co-Founder',
      bio: 'Former local SEO director and SaaS product leader. Passionate about leveling the playing field for local storefronts.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Debjit Jana',
      role: 'Head of Engineering & Co-Founder',
      bio: 'Full-stack distributed systems architect with over a decade in real-time analytics, AI synthesis, and high-concurrency cloud infrastructure.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Head of Customer Success & Operations',
      bio: 'Specialized in brick-and-mortar hospitality and healthcare onboarding. Helped over 4,000 clinic managers scale local reviews.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Marcus Chen',
      role: 'VP of AI Research & Compliance',
      bio: 'Natural language processing researcher focused on ethical AI prompt formulation and search engine guidelines compliance.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const milestones = [
    { year: '2023', title: 'The Genesis', desc: 'Founded after witnessing local clinics struggle with 1-star review extortion while happy patients never left feedback.' },
    { year: '2024', title: '1,000 Storefronts', desc: 'Introduced our proprietary vector QR countertop displays and instant mobile micro-survey engine.' },
    { year: '2025', title: 'AI Synthesis Engine', desc: 'Launched contextual natural language formulation, cutting review drafting time down to 10 seconds.' },
    { year: '2026', title: '12,400+ Global Merchants', desc: 'Expanding across North America, Europe, Australia, and India under Arventa Ventures.' },
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
      <Navbar />

      <main className="flex-1 space-y-24 pb-24">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Globe className="w-3.5 h-3.5" />
            <span>Our Mission & Story</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Democratizing Authentic Local Reputation for{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Independent Businesses
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Every day, millions of local restaurants, clinics, plumbers, and mechanics deliver unforgettable service.
            Yet, less than 2% of satisfied clients ever leave a review. Rankaro was built to bridge this empathy gap.
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
                In 2023, while advising independent dental practices and family-owned restaurants, our founders noticed a persistent injustice: a single unreasonable customer could drop a business&apos;s rating from 4.8 to 4.2 in a single afternoon. Meanwhile, hundreds of ecstatic patients walked out the door promising &ldquo;I&apos;ll definitely review you when I get home!&rdquo; &mdash; only to get distracted by traffic, emails, and life.
              </p>
              <p>
                The problem wasn&apos;t lack of gratitude; it was cognitive friction. Staring at an empty white text box on a smartphone creates instant writer&apos;s block. Most people simply don&apos;t know what to write, which words matter for SEO, or how to articulate their experience.
              </p>
              <p>
                Existing &ldquo;solutions&rdquo; were worse: enterprise software companies charged small businesses $400/month for clunky SMS blasting tools that spam customers, irritate patrons, and violate Google’s anti-gating policies.
              </p>
              <p className="font-semibold text-slate-900">
                We founded Rankaro under Arventa Ventures with a clear, contrarian conviction: Build a frictionless, beautiful, policy-safe countertop operating system that lets customers articulate genuine appreciation in under 15 seconds.
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

        {/* LEADERSHIP & TEAM */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              The Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Led by Pioneers in Local Search & AI Architecture
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              A distributed team of engineers, designers, and local business advocates based in San Francisco, London, and Kolkata.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((member) => (
              <div
                key={member.name}
                className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-100 shadow-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{member.name}</h3>
                <p className="text-xs font-semibold text-blue-600 mt-0.5 mb-3">{member.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
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
              From Napkin Sketch to Global Reputation Engine
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

        {/* GLOBAL OFFICES & GOVERNANCE */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Corporate Governance
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                Governed with Pride by Arventa Ventures
              </h3>
              <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                Rankaro is backed and operated under Arventa Ventures (arventaventures.online), adhering to rigorous international SaaS standards, SOC 2 alignment, and strict EU GDPR frameworks.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>San Francisco • London • Kolkata</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>contact@arventaventures.online</span>
                </div>
              </div>
            </div>
            <div>
              <a
                href="/contact"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all rk-btn-shine"
              >
                <span>Contact Our Corporate Desk</span>
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
