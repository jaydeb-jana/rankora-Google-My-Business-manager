import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import {
  Heart,
  UtensilsCrossed,
  Wrench,
  Car,
  Scissors,
  Scale,
  Building2,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Star,
  MapPin,
  TrendingUp,
  Clock,
  Printer
} from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rankaro.com';

export const metadata = {
  title: 'Industry Review Playbooks: Dental, Dining, Auto & Legal | Rankaro',
  description:
    'Comprehensive vertical reputation playbooks for dental clinics, restaurants, auto mechanics, home services, salons, law firms, and real estate agencies.',
  keywords: [
    'dental clinic google reviews',
    'restaurant review management',
    'auto repair google reviews',
    'home contractor reputation management',
    'salon google reviews',
    'law firm local seo reviews',
    'industry review playbooks',
  ],
  alternates: {
    canonical: `${siteUrl}/solutions`,
  },
  openGraph: {
    title: 'Industry Review Playbooks: Dental, Dining, Auto & Legal | Rankaro',
    description:
      'Comprehensive vertical reputation playbooks for dental clinics, restaurants, auto mechanics, home services, salons, law firms, and real estate agencies.',
    url: `${siteUrl}/solutions`,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Rankaro Industry Review Playbooks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Industry Review Playbooks: Dental, Dining, Auto & Legal | Rankaro',
    description:
      'Comprehensive vertical reputation playbooks for dental clinics, restaurants, auto mechanics, home services, salons, law firms, and real estate agencies.',
    images: ['/logo.png'],
  },
};

const solutionsSchemas = [
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
        'name': 'Solutions',
        'item': `${siteUrl}/solutions`
      }
    ]
  }
];

export default function SolutionsPage() {
  const industries = [
    {
      id: 'healthcare',
      title: 'Dental Clinics & Medical Practices',
      badge: 'Healthcare & Dental',
      icon: Heart,
      color: 'from-blue-600 to-indigo-600',
      tagline: 'Turn Grateful Patients into Local 3-Pack Dominance',
      problem:
        'Patients are anxious and vulnerable during appointments. 99% of happy patients walk out promising to review you, but forget within an hour. A single unreasonable billing complaint can drop your average from 4.8 to 4.2.',
      solution:
        'Place custom matte acrylic stands directly adjacent to the checkout copay terminal. Patients tap chips while their appointment receipt prints.',
      chips: [
        'Pain-Free Dental Cleaning',
        'Gentle Hygienist',
        'Zero Waiting Delay',
        'Clear Insurance Billing',
        'Modern Digital X-Rays',
        'Smooth Dental Implant',
        'Emergency Tooth Extraction',
        'Compassionate Front Desk',
      ],
      script:
        '“Thank you for visiting Horizon Dental today! If you have 10 seconds while your receipt prints, tapping this QR stand helps our small team immensely on Google Maps.”',
      benchmark: '+430% 5-Star Reviews in 90 Days • 4.9 Average Rating',
      sampleReview:
        '“Had an outstanding visit at Horizon Dental Studio! The team was remarkably courteous and welcoming. My pain-free cleaning was the smoothest dental visit I have ever had. I especially appreciated that there was zero waiting delay and clear insurance billing with no surprises. 5/5 stars for dependable dental care!”',
    },
    {
      id: 'restaurants',
      title: 'Restaurants, Cafes & Bars',
      badge: 'Hospitality & Dining',
      icon: UtensilsCrossed,
      color: 'from-amber-600 to-orange-600',
      tagline: 'Capture Authentic Foodie Reviews at Peak Satisfaction',
      problem:
        'Diners enjoy their meal and wine, but asking for a review verbally at the table feels awkward and breaks the hospitality mood. Online foodies leave reviews on Yelp, but Google Maps is where 82% of weekend diners search for nearby tables.',
      solution:
        'Discreet, elegant NFC/QR wood pucks placed inside the leather check bill presenter. Diners tap their smartphone while waiting for their credit card slip.',
      chips: [
        'Handmade Truffle Pasta',
        'Attentive Waitstaff',
        'Warm Romantic Ambience',
        'Signature Negroni Cocktails',
        'Prompt Kitchen Timing',
        'Silky Tiramisu Dessert',
        'Wood-Fired Margherita Pizza',
        'Courteous Sommelier',
      ],
      script:
        '“I hope you had a wonderful dinner this evening! If you’d like to highlight your favorite dish, tapping the card inside the bill presenter takes just 10 seconds.”',
      benchmark: '35% Surge in Weekend Table Bookings • 620+ Verified Reviews',
      sampleReview:
        '“An absolute 5-star gem! We celebrated our anniversary at Bistro Bella Vista. The handmade truffle pasta was out of this world, perfectly al dente, and our attentive waitstaff made us feel so special. The warm romantic ambience topped off a flawless evening in Chicago!”',
    },
    {
      id: 'home-services',
      title: 'Plumbers, HVAC & Roofing Contractors',
      badge: 'Contractors & Trades',
      icon: Wrench,
      color: 'from-emerald-600 to-teal-600',
      tagline: 'Win High-Ticket Emergency Repair Calls First',
      problem:
        'Homeowners face high anxiety when an AC fails or a pipe bursts. They choose the contractor with the most verified reviews mentioning "same-day" and "honest price". Techs in the field forget to ask for reviews or feel awkward doing so.',
      solution:
        'Print high-resolution vector QR codes directly onto the footer of digital and paper completion invoices. Technicians hand the customer an NFC keychain during the final inspection walk-through.',
      chips: [
        'Emergency Same-Day Fix',
        'Upfront Honest Estimate',
        'Clean Shoe Covers & Work Area',
        'Certified Master Tech',
        'Nationwide Parts Warranty',
        'Arrived Within Promised Window',
        'No Surprise Add-on Charges',
        'Polite Diagnostic Explanation',
      ],
      script:
        '“Mr. Johnson, everything is tested and working properly. If you have 10 seconds to tap this invoice footer, it helps our family business tremendously on Google Maps.”',
      benchmark: '640+ Emergency Inbound Calls • #1 in County Google Maps',
      sampleReview:
        '“BrightSky Pro HVAC is a lifesaver! Our air conditioner stopped working during a 95-degree heatwave. Their technician arrived right inside the promised window with clean shoe covers, gave an upfront honest estimate, and completed the emergency fix the same day. Top-tier service!”',
    },
    {
      id: 'auto',
      title: 'Auto Repair & Performance Tuning',
      badge: 'Automotive Services',
      icon: Car,
      color: 'from-red-600 to-rose-600',
      tagline: 'Dismantle Customer Skepticism with Overwhelming Trust Proof',
      problem:
        'Consumers inherently fear being overcharged by dishonest mechanics. Competitors frequently buy fake reviews. Honest shops struggle to prove their integrity.',
      solution:
        'Position an acrylic display directly at the key pickup counter and place a rearview mirror hangtag in the vehicle upon repair completion.',
      chips: [
        'Upfront Diagnostic Quote',
        'Smooth Ceramic Brake Job',
        'Same-Day Turnaround',
        'Certified Mechanics',
        'Nationwide Parts Warranty',
        'Zero Unnecessary Upsells',
        'Clear Digital Inspection Report',
        'Fair Labor Rates',
      ],
      script:
        '“Here are your keys, David! Your brake job is finished and warrantied. If you have 10 seconds at the register, tapping here helps other drivers know our quotes are honest.”',
      benchmark: 'Climbed from Rank #11 to #1 on Google 3-Pack • +380% Review Velocity',
      sampleReview:
        '“Apex Performance Auto is the gold standard for honest mechanics! They provided an upfront diagnostic quote with zero hidden upcharges, completed my ceramic brake job the same day, and explained everything clearly. Trustworthy, skilled, and highly recommended!”',
    },
    {
      id: 'salons',
      title: 'Hair Salons, Spas & Aesthetic Medicine',
      badge: 'Beauty & Wellness',
      icon: Scissors,
      color: 'from-pink-600 to-purple-600',
      tagline: 'Turn Instagram Hair Selfies into High-Converting Google Reviews',
      problem:
        'Clients post selfies to Instagram stories that disappear in 24 hours, but rarely post them to Google Maps where high-paying local clients actually search for balayage and injectables.',
      solution:
        'Place sleek QR decals directly on styling station mirrors and counter displays at reception. The prompt encourages adding a photo of their new style.',
      chips: [
        'Master Balayage Color',
        'Detailed Hair Consultation',
        'Relaxing Scalp Massage',
        'Spotless Luxury Salon',
        'Friendly Senior Stylist',
        'Voluminous Silk Blowout',
        'Gentle Aesthetic Injection',
        'Long-Lasting Gloss Finish',
      ],
      script:
        '“Your balayage looks incredible! If you have a second while you book your touchup, tapping this mirror stand lets you post your chair photo directly to our Google page!”',
      benchmark: '92% Photo Attachment Rate • +18% Lift in Stylist Tips',
      sampleReview:
        '“Left PureGlow Salon feeling like a million bucks! My stylist nailed the master balayage color after a detailed hair consultation. The relaxing botanical scalp massage was pure bliss. Clean, luxury aesthetic, and incredibly talented team!”',
    },
    {
      id: 'legal',
      title: 'Attorneys, Law Firms & CPAs',
      badge: 'Professional Services',
      icon: Scale,
      color: 'from-slate-700 to-slate-900',
      tagline: 'Build Unassailable Authority for High-Stakes Consultations',
      problem:
        'Clients seeking estate planning, business litigation, or tax advisory require deep institutional trust before booking a retainer. One-sentence reviews fail to convey legal rigor.',
      solution:
        'Display discrete leather or brushed metal stands on conference tables and embed QR links in closing engagement letters.',
      chips: [
        'Clear Estate Planning Guidance',
        'Highly Responsive Legal Team',
        'Transparent Retainer Billing',
        'Complex Tax Problem Solved',
        'Empathetic Consultation',
        'Meticulous Contract Review',
      ],
      script:
        '“It was a pleasure assisting with your estate planning. If you found our guidance helpful, this link lets you share your feedback confidentially on Google.”',
      benchmark: 'Top-Rated Firm in County • $45K+ in New Inbound Retainers',
      sampleReview:
        '“Outstanding legal counsel from Apex Law Partners. They guided our family through complex estate planning with complete clarity, responsive communication, and transparent retainer billing. Highly recommended for trusted legal advice!”',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={solutionsSchemas} />
      <Navbar />

      <main className="flex-1 space-y-24 pb-28">
        {/* HERO */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Award className="w-4 h-4" />
            <span>Vertical-Specific Playbooks & Strategy</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Reputation Playbooks Engineered for{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Your Specific Industry
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Generic review asking produces generic results. Rankaro provides industry-tested keyword chips, optical countertop placement blueprints, and staff scripts tailored to your specific customer journey.
          </p>
        </section>

        {/* 6 MASSIVE INDUSTRY DEEP-DIVES */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.id}
                id={ind.id}
                className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all space-y-8 scroll-mt-24"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-tr ${ind.color} text-white shadow-md`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        {ind.badge}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                        {ind.title}
                      </h2>
                      <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                        {ind.tagline}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
                    {ind.benchmark}
                  </div>
                </div>

                {/* Problem vs Solution Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed">
                  <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1.5">
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                      The Industry Friction Barrier:
                    </span>
                    <p className="text-slate-700">{ind.problem}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      The Countertop Placement Blueprint:
                    </span>
                    <p className="text-slate-700">{ind.solution}</p>
                  </div>
                </div>

                {/* Keyword Chips */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Pre-Engineered Local SEO Service Chips:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ind.chips.map((chip) => (
                      <span key={chip} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                        + {chip}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Script and Sample Review Output */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Frontline Staff Script:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                      {ind.script}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Formulated Google Review Output</span>
                      </span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                      {ind.sampleReview}
                    </p>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Includes downloadable vector print templates</span>
                  <a
                    href={`/register?industry=${ind.id}`}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all rk-btn-shine"
                  >
                    <span>Deploy This Preset Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
}
