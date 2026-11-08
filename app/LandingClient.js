'use client';
import { useState, useEffect } from 'react';
import {
  Star,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Layers,
  Smartphone,
  BarChart3,
  MessageSquare,
  Users,
  Zap,
  TrendingUp,
  Award,
  CheckCircle,
  HelpCircle,
  Lock,
  Compass,
  Smile,
  Shield,
  Building,
  DollarSign,
  HeartHandshake,
  Clock,
  Printer,
  Scale,
  Search,
  ChevronRight,
  ThumbsUp,
  MapPin,
  RefreshCw,
  Eye,
  CheckCheck,
  Gift,
} from 'lucide-react';

export default function LandingClient() {
  // Live Simulator State
  const [activeIndustry, setActiveIndustry] = useState('dental');
  const [selectedChips, setSelectedChips] = useState(['painless', 'punctual']);
  const [demoSentiment, setDemoSentiment] = useState('exceptional');
  const [copied, setCopied] = useState(false);

  // Quick ROI Estimator State
  const [monthlyCustomers, setMonthlyCustomers] = useState(550);
  const [avgTicket, setAvgTicket] = useState(90);
  const [currentRating, setCurrentRating] = useState(4.1);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Industry presets for simulator
  const industryPresets = {
    dental: {
      name: 'Horizon Dental Studio',
      type: 'Dental Practice & Surgery',
      location: 'Denver, Colorado',
      keywords: ['Pain-Free Cleaning', 'Gentle Hygienist', 'Clear Insurance Billing'],
      chips: [
        { id: 'painless', label: 'Pain-Free Cleaning' },
        { id: 'punctual', label: 'Zero Waiting Delay' },
        { id: 'gentle', label: 'Gentle Hygienist' },
        { id: 'transparent', label: 'Clear Insurance Billing' },
        { id: 'modern', label: 'Modern Digital X-Rays' },
        { id: 'implant', label: 'Smooth Dental Implant' },
      ],
      drafts: {
        exceptional:
          'Had an outstanding visit at Horizon Dental Studio! The team was remarkably courteous and welcoming. My pain-free cleaning was the smoothest dental visit I have ever had. I especially appreciated that there was zero waiting delay and clear insurance billing with no surprises. 5/5 stars for dependable dental care!',
        great:
          'Very good experience with Horizon Dental Studio. The staff is polite, the cleaning was thorough and pain-free, and they seated me right on schedule. Definitely recommending to friends and family seeking a gentle dentist!',
        honest:
          'Visited Horizon Dental Studio for a routine checkup and cleaning. The procedure was handled properly and the clinic is clean, modern, and punctual.',
      },
    },
    dining: {
      name: 'Bistro Bella Vista',
      type: 'Italian Trattoria & Wine Bar',
      location: 'Chicago, Illinois',
      keywords: ['Handmade Truffle Pasta', 'Attentive Waitstaff', 'Romantic Ambience'],
      chips: [
        { id: 'handmade', label: 'Handmade Truffle Pasta' },
        { id: 'attentive', label: 'Attentive Waitstaff' },
        { id: 'cozy', label: 'Warm Romantic Ambience' },
        { id: 'cocktails', label: 'Signature Negroni' },
        { id: 'fast', label: 'Prompt Kitchen Timing' },
        { id: 'dessert', label: 'Silky Tiramisu' },
      ],
      drafts: {
        exceptional:
          'An absolute 5-star gem! We celebrated our anniversary at Bistro Bella Vista. The handmade truffle pasta was out of this world, perfectly al dente with rich aroma, and our attentive waitstaff made us feel so special. The warm romantic ambience topped off a flawless evening in Chicago!',
        great:
          'Wonderful dinner at Bistro Bella Vista! The pasta was fresh and flavorful, the cocktails were well-crafted, and our server took great care of us. Will definitely be returning for another date night soon.',
        honest:
          'Dined at Bistro Bella Vista on a Friday evening. Good food, tasty handmade pasta, and pleasant hospitality all around.',
      },
    },
    auto: {
      name: 'Apex Performance Auto',
      type: 'Auto Repair & Diagnostics',
      location: 'Austin, Texas',
      keywords: ['Honest Diagnostic Quote', 'Ceramic Brakes', 'Same-Day Turnaround'],
      chips: [
        { id: 'honest', label: 'Honest Diagnostic Quote' },
        { id: 'same_day', label: 'Same-Day Turnaround' },
        { id: 'mechanic', label: 'Knowledgeable Certified Mechanics' },
        { id: 'brakes', label: 'Smooth Ceramic Brake Job' },
        { id: 'warranty', label: 'Nationwide Parts Warranty' },
        { id: 'fair', label: 'Zero Unnecessary Upsells' },
      ],
      drafts: {
        exceptional:
          'Apex Performance Auto is the gold standard for honest mechanics! They provided an upfront diagnostic quote with zero hidden upcharges, completed my ceramic brake job the same day, and explained everything clearly. Trustworthy, skilled, and highly recommended!',
        great:
          'Reliable and professional service at Apex Performance Auto. They diagnosed the issue quickly, finished the work on time, and charged exactly what was quoted. Great local Austin mechanic.',
        honest:
          'Had my vehicle serviced at Apex Performance Auto. Straightforward repair, knowledgeable crew, and fair pricing without aggressive upselling.',
      },
    },
    salon: {
      name: 'PureGlow Salon & Spa',
      type: 'Hair & Aesthetic Medicine',
      location: 'Miami, Florida',
      keywords: ['Master Balayage Color', 'Scalp Massage', 'Luxury Interior'],
      chips: [
        { id: 'balayage', label: 'Master Balayage Color' },
        { id: 'consultation', label: 'Detailed Hair Consultation' },
        { id: 'scalp', label: 'Relaxing Botanical Scalp Massage' },
        { id: 'clean', label: 'Spotless Luxury Salon' },
        { id: 'stylist', label: 'Friendly Senior Stylist' },
        { id: 'blowout', label: 'Voluminous Silk Blowout' },
      ],
      drafts: {
        exceptional:
          'Left PureGlow Salon feeling like a million bucks! My stylist nailed the master balayage color after a detailed hair consultation. The relaxing botanical scalp massage was pure bliss. Clean, luxury aesthetic, and incredibly talented team!',
        great:
          'Loved my visit to PureGlow Salon! Friendly senior stylists, great listening skills, and beautiful hair color result. The salon space is pristine and relaxing.',
        honest:
          'Had my hair styled and colored at PureGlow Salon. Professional staff, good atmosphere, and satisfied with the final look.',
      },
    },
    contractor: {
      name: 'BrightSky Pro HVAC & Plumbing',
      type: 'Emergency Home Services',
      location: 'Atlanta, Georgia',
      keywords: ['Emergency AC Fix', 'Upfront Quote', 'Clean Work Area'],
      chips: [
        { id: 'emergency', label: 'Emergency Same-Day Fix' },
        { id: 'upfront', label: 'Upfront Honest Estimate' },
        { id: 'clean', label: 'Clean Shoe Covers & Work Area' },
        { id: 'tech', label: 'Knowledgeable Certified Tech' },
        { id: 'punctual', label: 'Arrived Within Window' },
      ],
      drafts: {
        exceptional:
          'BrightSky Pro HVAC is a lifesaver! Our air conditioner stopped working during a 95-degree heatwave. Their technician arrived right inside the promised window with shoe covers, gave an upfront honest estimate, and completed the emergency fix the same day. Top-tier service!',
        great:
          'Prompt and professional service from BrightSky Pro HVAC. Diagnosed our compressor issue quickly, explained the options clearly, and left the work area spotless. Very satisfied.',
        honest:
          'Used BrightSky Pro HVAC for an AC repair. They came out on time, fixed the issue properly, and charged a fair rate.',
      },
    },
  };

  const currentPreset = industryPresets[activeIndustry];

  const toggleChip = (id) => {
    setSelectedChips((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((c) => c !== id) : prev) : [...prev, id]
    );
  };

  const handleCopyDraft = () => {
    const text = currentPreset.drafts[demoSentiment] || currentPreset.drafts.exceptional;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Quick ROI Calculation
  const estimatedReviewsPerMonth = Math.round(monthlyCustomers * 0.14);
  const projectedExtraRevenue = Math.round(estimatedReviewsPerMonth * avgTicket * 1.6);
  const projectedRating = Math.min(5.0, (currentRating + 0.5)).toFixed(1);

  // Real-time Marquee ticker data
  const marqueeItems = [
    { name: 'Dr. Elena Ramos', business: 'Horizon Dental', city: 'Denver, CO', text: 'Collected 5★ review: "Pain-free cleaning and zero waiting delay!"', time: '1m ago' },
    { name: 'Marco Moretti', business: 'Trattoria Bella', city: 'Chicago, IL', text: 'Collected 5★ review: "Handmade truffle pasta was unforgettable."', time: '3m ago' },
    { name: 'David Vance', business: 'Apex Auto Group', city: 'Austin, TX', text: 'Collected 5★ review: "Honest diagnostic quote and same-day ceramic brakes."', time: '4m ago' },
    { name: 'Chloe Dubois', business: 'PureGlow Spa', city: 'Miami, FL', text: 'Collected 5★ review with photo: "Master balayage color!"', time: '6m ago' },
    { name: 'Tom Bradley', business: 'BrightSky HVAC', city: 'Atlanta, GA', text: 'Collected 5★ review: "Emergency AC repair handled with clean shoe covers."', time: '8m ago' },
    { name: 'Sarah Lin, Esq.', business: 'Apex Law Partners', city: 'Seattle, WA', text: 'Collected 5★ review: "Clear estate planning and transparent retainer."', time: '11m ago' },
  ];

  const faqs = [
    {
      q: 'Does Rankaro strictly comply with Google’s official Review Policies and FTC laws?',
      a: 'Yes, 100%. Rankaro strictly enforces Google’s User Contributed Content policies and the FTC’s Trade Regulation Rule (16 CFR Part 465). We strictly forbid deceptive "review gating" (filtering negative reviews away from Google while sending only positive reviews). Every consumer who scans has immediate, unrestricted access to the official Google review screen. Furthermore, we never submit fake reviews or auto-post on behalf of anyone; customers maintain 100% editing autonomy before submitting from their own personal Google accounts.',
    },
    {
      q: 'How does the natural language AI draft generator help my customers?',
      a: '87% of satisfied customers want to leave a review, but 72% abandon the process because typing on a phone creates writer’s block. When a customer scans your countertop QR display, Rankaro presents 5 or 6 interactive service chips (e.g., "Painless Cleaning", "Friendly Staff"). When the customer taps their highlights, our natural language model instantly synthesizes an articulate, genuine draft incorporating those exact keywords. The customer can copy it with 1 tap or edit words freely before Google Maps opens.',
    },
    {
      q: 'Why do keyword-rich reviews matter for Google Maps Local 3-Pack SEO?',
      a: 'Google’s local ranking algorithm weighs three primary review factors: Review Velocity (consistent ongoing new reviews), Overall Sentiment (star rating), and Semantic Keyword Prominence. When customers mention specific services in their review text (e.g., "dental implants", "ceramic brakes", "truffle pasta"), Google’s search bots index those keywords. When nearby consumers search for those exact services, your business profile ranks significantly higher in the local 3-Pack.',
    },
    {
      q: 'What physical hardware do I need, and how fast is setup?',
      a: 'Zero expensive proprietary equipment! Setup takes less than 90 seconds. You can download print-ready PDF/SVG vector files from your dashboard to print on countertop cards, table tents, or receipt footers. We also support programming standard NFC tap pucks (NTAG213/215) so customers can simply tap their iPhone or Android without opening their camera.',
    },
    {
      q: 'How does Rankaro handle unhappy customers or negative feedback without gating?',
      a: 'Rankaro provides an instant, private "Direct Management Resolution" channel. Unhappy customers are offered a prominent option to submit their grievance privately to the business owner’s phone/inbox for instant remediation before escalating online. Crucially, the customer still has full, unhindered access to the official Google review link, keeping your business 100% policy-compliant.',
    },
    {
      q: 'Can customers edit or delete the suggested review text before posting?',
      a: 'Always. Rankaro never auto-submits to Google. The customer sees the draft, can edit individual sentences, add personal anecdotes, or delete the suggestion entirely and write their own words. The customer holds complete sovereignty.',
    },
    {
      q: 'How does Rankaro compare to legacy platforms like Birdeye and Podium?',
      a: 'Legacy tools charge $300-$500/month, lock businesses into 12-month contracts, and rely on annoying SMS text blasts hours or days after the visit (which customers increasingly report as spam). Rankaro costs $0 to $29/month, has zero contracts, and engages customers at the exact point of sale when satisfaction is at its peak.',
    },
    {
      q: 'Can I manage multiple business locations or franchise branches?',
      a: 'Yes! Our Agency and Enterprise tiers allow you to manage unlimited locations under a unified dashboard, compare store review velocity, track staff attribution, and configure central branding presets.',
    },
  ];

  return (
    <div className="space-y-20 pb-28 overflow-x-hidden">
      {/* DIRECT INLINE STYLES FOR GUARANTEED ANIMATIONS ACROSS ALL BROWSERS */}
      <style>{`
        @keyframes rkFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes rkFloatReverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(12px); }
        }
        @keyframes rkMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes rkPulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.2), 0 0 45px rgba(99, 102, 241, 0.12);
          }
          50% {
            box-shadow: 0 0 35px rgba(37, 99, 235, 0.45), 0 0 70px rgba(99, 102, 241, 0.28);
          }
        }
        .rk-marquee-track {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          width: max-content !important;
          animation: rkMarquee 30s linear infinite !important;
        }
        .rk-marquee-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* 1. HERO SECTION WITH VIBRANT ALIVE ANIMATIONS */}
      <section className="relative pt-12 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Animated Background Glowing Mesh */}
        <div
          style={{ animation: 'rkPulseGlow 3s ease-in-out infinite' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-sky-400/15 blur-3xl -z-10 rounded-full pointer-events-none"
        />

        {/* Floating Left Animated Pill (Visible on Laptops & Desktops) */}
        <div
          style={{ animation: 'rkFloat 4.5s ease-in-out infinite' }}
          className="hidden md:flex absolute left-2 lg:left-6 top-24 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl items-center space-x-3 text-left max-w-[260px] z-10"
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Dr. Ramos • Horizon Dental</div>
            <div className="text-[11px] text-emerald-600 font-bold">+430% Review Surge</div>
            <div className="text-[10px] text-slate-500">Rank #1 on Google Maps</div>
          </div>
        </div>

        {/* Floating Right Animated Pill (Visible on Laptops & Desktops) */}
        <div
          style={{ animation: 'rkFloatReverse 5s ease-in-out infinite' }}
          className="hidden md:flex absolute right-2 lg:right-6 top-32 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl items-center space-x-3 text-left max-w-[260px] z-10"
        >
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
            <QrCode className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">10-Second QR Scan</div>
            <div className="text-[11px] text-blue-600 font-bold">Zero App Downloads</div>
            <div className="text-[10px] text-slate-500">34% Checkout Scan Rate</div>
          </div>
        </div>

        {/* Top Compliance Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 mb-6 shadow-sm hover:border-blue-400 transition-colors">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Independent Google Review Growth Engine</span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-600 font-bold">100% Google & FTC Policy Compliant</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight max-w-5xl mx-auto leading-[1.12]">
          Turn Happy In-Store Customers into{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
            Detailed 5-Star Google Reviews
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          87% of satisfied clients want to leave a review, but 72% abandon due to writer&apos;s block.
          Rankaro eliminates friction with smart countertop QR displays, 1-tap service chips, and instant natural language drafting in under 10 seconds.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all rk-btn-shine"
          >
            <span>Start in 2 Minutes</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#interactive-simulator"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 text-base font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:shadow transition-all"
          >
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Try Live Review Simulator</span>
          </a>
        </div>

        {/* Metric Badges */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">12,400+</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Active Storefronts & Clinics</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-blue-600">3.8M+</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Authentic Reviews Captured</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">4.9 / 5</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Merchant Satisfaction</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-indigo-600">&lt; 15s</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Average Review Time</div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE CONTINUOUS HORIZONTAL REVIEW MARQUEE (100% FIXED) */}
      <section className="border-y border-slate-200/90 bg-slate-50 py-3.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-2 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Review Activity Feed Across Active Merchants</span>
          </span>
          <span className="hidden sm:inline text-slate-400">Streaming in Real-Time</span>
        </div>

        {/* Marquee viewport container with edge fade masks */}
        <div className="relative w-full overflow-hidden">
          {/* Left and Right Fade Gradients */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10" />

          {/* Marquee Track with direct inline styles */}
          <div
            className="rk-marquee-track space-x-4 py-1"
            style={{ display: 'flex', width: 'max-content', animation: 'rkMarquee 30s linear infinite' }}
          >
            {marqueeItems.concat(marqueeItems).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2.5 p-2.5 px-4 rounded-xl bg-white border border-slate-200 shadow-sm flex-shrink-0 text-xs text-slate-700 whitespace-nowrap"
              >
                <div className="flex items-center space-x-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-900">{item.business}</span>
                <span className="text-slate-400">({item.city}):</span>
                <span className="text-slate-600 italic">{item.text}</span>
                <span className="text-[10px] text-blue-600 font-semibold ml-1">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE SIMULATOR SECTION */}
      <section id="interactive-simulator" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div
          style={{ animation: 'rkPulseGlow 3.5s ease-in-out infinite' }}
          className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800 relative overflow-hidden"
        >
          {/* Subtle background aura */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Customer Experience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Test the 10-Second Customer Flow
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Select an industry, pick service chips, and watch how our natural language engine synthesizes an authentic Google review draft in real-time.
            </p>

            {/* Industry Switcher Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {Object.keys(industryPresets).map((indKey) => {
                const isSelected = activeIndustry === indKey;
                return (
                  <button
                    key={indKey}
                    onClick={() => {
                      setActiveIndustry(indKey);
                      setSelectedChips([industryPresets[indKey].chips[0].id, industryPresets[indKey].chips[1].id]);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {industryPresets[indKey].type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Mobile Screen Preview */}
            <div className="lg:col-span-6 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-inner space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                    Customer Screen Preview
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{currentPreset.name}</h3>
                  <div className="text-xs text-slate-500">{currentPreset.location}</div>
                </div>
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Service Chips */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                  1. Tap What Made Your Visit Great:
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentPreset.chips.map((chip) => {
                    const isPicked = selectedChips.includes(chip.id);
                    return (
                      <button
                        key={chip.id}
                        onClick={() => toggleChip(chip.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                          isPicked
                            ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md scale-105'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isPicked && <Check className="w-3.5 h-3.5" />}
                        <span>{chip.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sentiment Switcher */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                  2. Choose Sentiment Tone:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'exceptional', label: 'Exceptional (5★)' },
                    { id: 'great', label: 'Great Visit (5★)' },
                    { id: 'honest', label: 'Direct & Concise (4-5★)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setDemoSentiment(s.id)}
                      className={`py-2 px-2 text-center text-xs font-medium rounded-lg transition-colors ${
                        demoSentiment === s.id
                          ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 text-center">
                * Zero review gating: Customers can edit, rewrite, or post their own words on Google Maps.
              </div>
            </div>

            {/* Right: Real-Time Synthesized Draft & Output */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Instant AI Review Draft</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Synthesized in 0.38s</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-slate-200 leading-relaxed font-sans min-h-[130px] flex items-center">
                  &ldquo;{currentPreset.drafts[demoSentiment]}&rdquo;
                </div>

                {/* Highlighted Local SEO Keywords */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Detected Local SEO Keywords:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPreset.keywords.map((kw) => (
                      <span key={kw} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={handleCopyDraft}
                    className="w-full sm:flex-1 py-3.5 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all rk-btn-shine"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Draft & Launch Google Maps</span>
                      </>
                    )}
                  </button>

                  <a
                    href="/how-it-works"
                    className="w-full sm:w-auto py-3.5 px-4 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 text-center transition-colors"
                  >
                    Learn Architecture →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE GOOGLE 3-PACK ALGORITHM BLUEPRINT */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-slate-50 border border-slate-200/90 p-8 sm:p-12">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-100/60 px-3 py-1 rounded-full">
              The Google Local Search Algorithm
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              How Google Decides Who Ranks #1 in the Local 3-Pack
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Google’s Local Search Ranking Algorithm is not random. It evaluates three specific review signals when ranking local storefronts. Here is how Rankaro optimizes each:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 w-fit">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Review Velocity & Freshness</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Google favors businesses that receive consistent, predictable new reviews every week. A business with 500 reviews collected 3 years ago will be outranked by a business receiving 15 reviews every month.
              </p>
              <div className="text-xs font-bold text-blue-600 pt-1">Rankaro Benefit: Steady 10-15% scan rate maintains consistent velocity.</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Keyword Prominence (BERT)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Google&apos;s natural language models parse review bodies for exact service keywords. When 25 reviews mention &ldquo;pain-free cleaning&rdquo; or &ldquo;ceramic brakes&rdquo;, Google tags your business as an authoritative provider.
              </p>
              <div className="text-xs font-bold text-emerald-600 pt-1">Rankaro Benefit: Service chips automatically weave in target keywords.</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 w-fit">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Physical Geolocation Verification</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Reviews posted by users physically located at your storefront coordinates carry higher anti-fraud trust than reviews submitted from distant desktop IP addresses via email links.
              </p>
              <div className="text-xs font-bold text-purple-600 pt-1">Rankaro Benefit: In-store countertop scans provide physical location proof.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ROI REVENUE ESTIMATOR */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-200/60 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-3 py-1 rounded-full">
              Interactive Financial Modeler
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Calculate Your Monthly Review & Revenue Lift
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Harvard Business School research proved that every 1-star rating increase produces a 5% to 9% direct lift in local business revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                  <span>Monthly Store Customers / Patients:</span>
                  <span className="text-blue-600 text-base">{monthlyCustomers} customers</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={monthlyCustomers}
                  onChange={(e) => setMonthlyCustomers(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>50 / mo</span>
                  <span>1,500 / mo</span>
                  <span>3,000+ / mo</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                  <span>Average Ticket / Order Value ($):</span>
                  <span className="text-blue-600 text-base">${avgTicket}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="1000"
                  step="10"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>$15</span>
                  <span>$500</span>
                  <span>$1,000+</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed">
                💡 <strong>The Math:</strong> Based on 3.8M+ physical scans, Rankaro converts 12-16% of patrons into 5-star reviews containing local SEO keywords.
              </div>
            </div>

            {/* Output Metric Cards */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-md space-y-4">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Projected Monthly Growth
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
                <span className="text-sm font-semibold text-slate-700">New Google Reviews:</span>
                <span className="text-2xl font-black text-blue-700">+{estimatedReviewsPerMonth} / mo</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-sm font-semibold text-slate-700">Est. Additional Revenue:</span>
                <span className="text-2xl font-black text-emerald-700">+${projectedExtraRevenue.toLocaleString()} / mo</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50/60 border border-purple-100">
                <span className="text-sm font-semibold text-slate-700">Google Local 3-Pack Lift:</span>
                <span className="text-lg font-black text-purple-700">+340% Impressions</span>
              </div>

              <a
                href="/roi-calculator"
                className="block text-center py-3 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-xl transition-colors"
              >
                Open Full Financial Model & Breakdown →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE 6-STEP FRICTIONLESS CUSTOMER JOURNEY */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>How Rankaro Works</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            The 10-Second Path from Checkout to Google Maps
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Traditional review requests require long SMS messages, app installs, and uncomfortable writer&apos;s block. Here is how Rankaro solves every point of friction:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Dynamic Countertop QR & NFC',
              desc: 'Place high-durability acrylic displays, table tents, or receipt QR codes at your checkout desk or waiting area.',
              icon: QrCode,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              step: '02',
              title: 'Instant Mobile Scan (No App)',
              desc: 'Customers simply point their camera or tap their phone via NFC. Loads instantly in less than 400ms without app downloads.',
              icon: Smartphone,
              color: 'text-indigo-600 bg-indigo-50',
            },
            {
              step: '03',
              title: '1-Tap Service Selection',
              desc: 'Instead of typing on an empty keyboard, the customer simply taps pre-configured chips for the treatments or meals they loved.',
              icon: Layers,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              step: '04',
              title: 'AI Draft Formulation',
              desc: 'Our contextual natural language engine synthesizes an authentic, personalized paragraph packed with local SEO keywords.',
              icon: Sparkles,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              step: '05',
              title: '1-Tap Copy & Native Launch',
              desc: 'The draft is copied to their clipboard while Google Maps opens directly to your official business rating dialog.',
              icon: Copy,
              color: 'text-sky-600 bg-sky-50',
            },
            {
              step: '06',
              title: 'Local SEO & Rating Dominance',
              desc: 'Your Google Business Profile climbs into the local 3-Pack, attracting higher-intent organic customers 24/7.',
              icon: TrendingUp,
              color: 'text-rose-600 bg-rose-50',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3.5 rounded-2xl ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-4xl font-black text-slate-100 group-hover:text-blue-100 transition-colors">
                  {item.step}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. 8 INDUSTRY SOLUTIONS PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Built for Every Local Vertical</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Tailored Service Taxonomies for Every Business
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Pre-engineered review prompt templates optimized for specific keywords that Google searchers type every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Dentists & Clinics',
              tags: ['Painless Cleaning', 'Implants', 'Gentle Staff', 'No Wait Time'],
              stat: '+430% 5-Star Reviews',
              href: '/solutions#healthcare',
            },
            {
              title: 'Restaurants & Bars',
              tags: ['Truffle Pasta', 'Craft Cocktails', 'Romantic Vibe', 'Fast Seating'],
              stat: '35% Weekend Table Surge',
              href: '/solutions#restaurants',
            },
            {
              title: 'Auto Repair & Tuning',
              tags: ['Honest Diagnosis', 'Brake Repair', 'Same-Day Service', 'Fair Price'],
              stat: 'Rank #1 on Google Maps',
              href: '/solutions#auto',
            },
            {
              title: 'Salons & Spas',
              tags: ['Balayage Color', 'Scalp Massage', 'Luxury Interior', 'Great Stylist'],
              stat: '92% Photo Attachment Rate',
              href: '/solutions#salons',
            },
            {
              title: 'Plumbers & HVAC',
              tags: ['Emergency AC Fix', 'On-Time Tech', 'Clean Work Area', 'Upfront Quote'],
              stat: '640+ Emergency Calls',
              href: '/solutions#home-services',
            },
            {
              title: 'Attorneys & Law',
              tags: ['Estate Planning', 'Clear Guidance', 'Responsive Team', 'Trusted Advice'],
              stat: 'Top Rated in County',
              href: '/solutions#legal',
            },
            {
              title: 'Real Estate Brokers',
              tags: ['Fast Closing', 'Local Market Expert', 'Negotiation Skills', 'Transparent'],
              stat: '$14M Closed Volume',
              href: '/solutions#real-estate',
            },
            {
              title: 'Fitness & Gyms',
              tags: ['Clean Facilities', 'Energetic Coaches', 'Modern Equipment', 'Classes'],
              stat: '2x Customer Inquiries',
              href: '/solutions#fitness',
            },
          ].map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors mb-3">
                  {item.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.map((t) => (
                    <span key={t} className="px-2 py-1 rounded bg-slate-100 text-[11px] font-medium text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-600">{item.stat}</span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                  View Playbook →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 8. HEAD-TO-HEAD COMPARISON MATRIX */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-3 py-1 rounded-full">
              Why We Are Different
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Rankaro vs Legacy Review Platforms
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Legacy software costs $300-$500/month, relies on annoying SMS spam that customers ignore, and risks Google penalties with deceptive gating.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-300/80">
                  <th className="py-4 px-4 font-bold text-slate-900">Feature & Capability</th>
                  <th className="py-4 px-4 font-extrabold text-blue-600 bg-blue-50/80 rounded-t-xl">
                    Rankaro
                  </th>
                  <th className="py-4 px-4 font-semibold text-slate-600">Birdeye & Podium</th>
                  <th className="py-4 px-4 font-semibold text-slate-600">Manual In-Person Asking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-800">Monthly Cost</td>
                  <td className="py-4 px-4 font-bold text-emerald-600 bg-blue-50/40">From ₹499 / month</td>
                  <td className="py-4 px-4 text-slate-500">$299 - $599 / month</td>
                  <td className="py-4 px-4 text-slate-500">Free (High Staff Time)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-800">Customer Friction</td>
                  <td className="py-4 px-4 font-bold text-blue-600 bg-blue-50/40">Zero: 10s QR Scan & Tap</td>
                  <td className="py-4 px-4 text-slate-500">High: Intrusive SMS opt-ins</td>
                  <td className="py-4 px-4 text-slate-500">High: 87% Forget by Evening</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-800">AI Context-Aware Drafts</td>
                  <td className="py-4 px-4 font-bold text-blue-600 bg-blue-50/40">Instant Natural Synthesis</td>
                  <td className="py-4 px-4 text-slate-500">Generic Templates Only</td>
                  <td className="py-4 px-4 text-slate-500">None (Writer’s Block)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-800">Google Policy Compliance</td>
                  <td className="py-4 px-4 font-bold text-emerald-600 bg-blue-50/40">100% Policy-Safe (No Gating)</td>
                  <td className="py-4 px-4 text-rose-500">Deceptive Gating Risks Penalties</td>
                  <td className="py-4 px-4 text-slate-500">Compliant</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-slate-800">Local SEO Keywords</td>
                  <td className="py-4 px-4 font-bold text-blue-600 bg-blue-50/40">Auto-Injected via Chips</td>
                  <td className="py-4 px-4 text-slate-500">Short, empty 1-sentence reviews</td>
                  <td className="py-4 px-4 text-slate-500">Random (usually &quot;Good!&quot;)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/compare"
              className="inline-flex items-center space-x-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              <span>See Full 15-Point Competitor Breakdown</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 9. VERIFIED CUSTOMER CASE HIGHLIGHTS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Real Growth Results</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Loved by Over 12,400+ Business Owners
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Read how everyday businesses transformed their Google rating in less than 90 days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote:
                'We struggled for 3 years to break 80 reviews on Google. Within 60 days of setting Rankaro countertop acrylic stands on our reception desks, we jumped to 340+ reviews with a 4.9 average. New patient calls doubled!',
              name: 'Dr. Elena Ramos, DDS',
              role: 'Founder, Horizon Dental Studio',
              metric: '+325% Google Reviews',
              image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
            },
            {
              quote:
                'Customers always used to say "I loved the dinner, I’ll leave a review tonight!" - but they never did. Rankaro lets them scan the check presenter, tap what they ate, and post on Google before the bill is signed.',
              name: 'Marco Moretti',
              role: 'Executive Chef, Trattoria Bella',
              metric: '4.9 Star Rating (620+ reviews)',
              image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=120&auto=format&fit=crop&q=80',
            },
            {
              quote:
                'Being an honest auto mechanic is hard when competitors pay for fake reviews. Rankaro gave our genuine happy customers the easy prompt they needed to detail our fair pricing. We are now #1 in our county on Google Maps.',
              name: 'David Vance',
              role: 'Master Tech, Apex Auto Group',
              metric: '#1 Google Maps 3-Pack',
              image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.role}</div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {item.metric}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/case-studies"
            className="inline-flex items-center space-x-2 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Read All Case Studies & Performance Reports</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Everything you need to know about Google compliance, hardware, and how Rankaro scales your local reputation.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full py-5 px-6 text-left font-bold text-slate-900 flex items-center justify-between hover:text-blue-600 transition-colors gap-4"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/faq"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <span>Have more questions? Browse our complete 25+ FAQ directory →</span>
          </a>
        </div>
      </section>

      {/* SPECIAL PRO PLAN OFFER BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 border-2 border-indigo-500/40 shadow-2xl overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Special Promotion • $49 Value Included Free</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Subscribe to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">Growth Pro</span> &amp; Get a Free Premium Acrylic Google Stand Kit
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Elevate your physical front desk immediately. Every business subscribing to the Growth Pro plan receives our commercial-grade, scratch-resistant acrylic Google counter display with custom laser branding and instant NFC tap support at zero additional charge.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-semibold text-slate-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Heavy-Duty Clear Acrylic Counter Stand</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dual NFC Tap + Ultra-HD QR Code</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Branded with Your Exact Business Name</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Worldwide Express Shipping</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-3 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Limited Time Hardware Bundle
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-sm line-through text-slate-400">$49 Value</span>
              </div>
              <span className="text-xs text-slate-300">
                Included with Growth Pro Subscription
              </span>

              <a
                href="/register?plan=pro"
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 transition-all text-center rk-btn-shine"
              >
                Claim Free Stand with Pro →
              </a>

              <a
                href="/pricing"
                className="text-xs text-slate-400 hover:text-white underline transition-colors"
              >
                View Plan Details &amp; Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 11. BOTTOM CONVERSION CTA BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          style={{ animation: 'rkPulseGlow 3.5s ease-in-out infinite' }}
          className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              No Risk • No Credit Card Required • Instant Setup
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Start Collecting 5-Star Google Reviews Today
            </h2>
            <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto">
              Join thousands of thriving local practices, restaurants, and service brands. Create your customized QR code and service tags in under 2 minutes.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 hover:bg-slate-100 font-extrabold text-base rounded-2xl shadow-xl transition-all rk-btn-shine"
              >
                Create Account Now
              </a>
              <a
                href="/contact"
                className="w-full sm:w-auto px-7 py-4 bg-blue-700/60 hover:bg-blue-700 text-white font-bold text-base border border-white/20 rounded-2xl transition-colors"
              >
                Schedule 1-on-1 Demo
              </a>
            </div>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100/90">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>100% Policy Safe</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Zero Review Gating</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Print-Ready Templates Included</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
