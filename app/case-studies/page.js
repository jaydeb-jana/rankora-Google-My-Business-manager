import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { getSiteUrl } from '@/lib/seoConfig';
import {
  Star,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Building,
  Quote,
  BarChart3,
  MapPin,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'Customer Case Studies & Google Review Success Stories',
  description:
    'Verified case studies of dental clinics, restaurants, auto mechanics, and contractors who grew their 5-star Google reviews by up to 430% with Rankaro.',
  keywords: [
    'local seo case studies',
    'google review success stories',
    'dental clinic reviews case study',
    'restaurant google reviews growth',
    'rankaro customer results',
  ],
  alternates: {
    canonical: `${siteUrl}/case-studies`,
  },
  openGraph: {
    title: 'Customer Case Studies & Google Review Success Stories | Rankaro',
    description:
      'Verified case studies of dental clinics, restaurants, auto mechanics, and contractors who grew their 5-star Google reviews by up to 430% with Rankaro.',
    url: `${siteUrl}/case-studies`,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Rankaro Customer Case Studies and Review Growth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Case Studies & Google Review Success Stories | Rankaro',
    description:
      'Verified case studies of dental clinics, restaurants, auto mechanics, and contractors who grew their 5-star Google reviews by up to 430% with Rankaro.',
    images: ['/logo.png'],
  },
};

const caseStudiesSchemas = [
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
        'name': 'Case Studies',
        'item': `${siteUrl}/case-studies`
      }
    ]
  }
];

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      id: 'horizon-dental',
      business: 'Horizon Dental Studio',
      industry: 'Dental Practice & Oral Surgery',
      location: 'Denver, Colorado',
      founder: 'Dr. Elena Ramos, DDS',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80',
      stats: [
        { label: 'Google Review Surge', value: '+430%', detail: '78 to 412 reviews in 90 days' },
        { label: 'Average Google Rating', value: '4.9 ★', detail: 'Increased from 4.2' },
        { label: 'New Patient Inquiries', value: '+$62K', detail: 'High-margin implant consultations' },
      ],
      challenge:
        'Dr. Ramos had built a state-of-the-art clinic with over 800 active patients, but only 78 total Google reviews over 4 years. Unhappy patients were 10x more motivated to vent online, while hundreds of happy patients walked out the door with good intentions but forgot to review due to friction.',
      solution:
        'Placed custom matte acrylic Rankaro QR displays at the checkout payment desk. Configured service chips for "Painless Cleaning", "Gentle Hygienist", and "Zero Waiting Delay". Staff used our FTC-compliant 10-second script during billing.',
      quote:
        'Rankaro completely transformed our clinic. Patients literally scan the stand while their card is processing, tap three buttons, and paste into Google in 10 seconds. We jumped from #9 to #1 in local search for dental care in Denver.',
    },
    {
      id: 'apex-auto',
      business: 'Apex Performance Auto',
      industry: 'Auto Repair, Diagnostics & Tuning',
      location: 'Austin, Texas',
      founder: 'David Vance, Master Technician',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
      stats: [
        { label: 'Map Pack Rank', value: '#1', detail: 'Climbed from #11 in county' },
        { label: 'Monthly Reviews', value: '45+ / mo', detail: 'Up from 3 per month' },
        { label: 'Review Keyword Density', value: '94%', detail: 'Mentions "brakes", "honest quote"' },
      ],
      challenge:
        'Independent repair shops face intense skepticism. Shady competitors regularly bought fake reviews. David needed a transparent way for real customers to highlight Apex’s upfront quotes and ceramic brake jobs.',
      solution:
        'Printed Rankaro vector QR codes directly onto the bottom of final work invoices and handed an NFC tap keychain to each driver during vehicle handover.',
      quote:
        'Customers always appreciate that we never sneak in surprise charges. Rankaro gives them the exact words to say that on Google. Seeing reviews that say "Honest mechanic who finished the same day" brings us 8-10 calls every single Monday morning.',
    },
    {
      id: 'trattoria-bella',
      business: 'Trattoria Bella Vista',
      industry: 'Fine Italian Dining & Hospitality',
      location: 'Chicago, Illinois',
      founder: 'Chef Marco Moretti',
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=600&auto=format&fit=crop&q=80',
      stats: [
        { label: 'Total Reviews', value: '620+', detail: 'Surpassed legacy competitor' },
        { label: 'Weekend Bookings', value: '+35%', detail: 'Driven by Google Maps reservations' },
        { label: 'Scan Conversion Rate', value: '28%', detail: 'Of all dining tables scanned' },
      ],
      challenge:
        'Dinner guests loved the food and wine pairings, but asking for a review at the table felt awkward, intrusive, and broke the romantic ambiance.',
      solution:
        'Embedded discreet, elegant wood-block NFC/QR pucks inside the leather check bill presenters. When the check arrived, guests tapped their phone while settling the bill.',
      quote:
        'It doesn’t feel like asking for a review &mdash; it feels like asking them what dish they enjoyed the most. Diners tap "Handmade Truffle Pasta" and smile. It made review collection feel like an organic part of the dining experience.',
    },
    {
      id: 'pureglow-spa',
      business: 'PureGlow Salon & Medical Spa',
      industry: 'Luxury Hair & Aesthetic Medicine',
      location: 'Miami, Florida',
      founder: 'Chloe Dubois',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      stats: [
        { label: 'Review Growth', value: '+290', detail: 'Reviews added in first 4 months' },
        { label: 'Photo Uploads', value: '92%', detail: 'Clients attach hairstyle photos' },
        { label: 'Stylist Tipping Lift', value: '+18%', detail: 'Via staff attribution tracking' },
      ],
      challenge:
        'Beauty clients take selfies of their new balayage and blowouts on Instagram, but rarely posted them to Google Maps where high-paying local searchers actually look.',
      solution:
        'Rankaro QR mirrors placed at each stylist station. The prompt guided clients to copy their review and upload their chair selfie straight to Google.',
      quote:
        'Google reviews with photos convert 4x higher than plain text. Rankaro made it effortless for our clients to show off their hair color on Google Maps.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={caseStudiesSchemas} />
      <Navbar />

      <main className="flex-1 space-y-24 pb-24">
        {/* HERO */}
        <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Award className="w-4 h-4" />
            <span>Proven Business Impact</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            How Local Leaders Multiplied Their 5-Star Reviews with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Frictionless Countertop QR
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Read the exact numbers, strategies, and placement tactics behind real businesses that climbed to #1 in their regional Google 3-Packs.
          </p>
        </section>

        {/* 4 IN-DEPTH CASE STUDIES */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
          {caseStudies.map((cs) => (
            <div
              key={cs.id}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Photo & Founder */}
                <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
                  <img
                    src={cs.image}
                    alt={cs.business}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 text-white">
                    <div>
                      <div className="font-extrabold text-lg">{cs.founder}</div>
                      <div className="text-xs text-slate-300">{cs.business}</div>
                      <div className="text-[11px] text-blue-300 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{cs.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details & Metrics */}
                <div className="lg:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {cs.industry}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
                      {cs.business}
                    </h2>

                    {/* 3 Metric Pills */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {cs.stats.map((st) => (
                        <div key={st.label} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                          <div className="text-xl sm:text-2xl font-black text-blue-600">{st.value}</div>
                          <div className="text-[11px] font-bold text-slate-800 mt-0.5">{st.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">{st.detail}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <div>
                        <strong className="text-slate-900">The Challenge: </strong>
                        {cs.challenge}
                      </div>
                      <div>
                        <strong className="text-slate-900">The Implementation: </strong>
                        {cs.solution}
                      </div>
                    </div>
                  </div>

                  {/* Founder Quote */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs italic text-slate-800 leading-relaxed">
                    &ldquo;{cs.quote}&rdquo;
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* BOTTOM CTA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="p-10 rounded-3xl bg-slate-900 text-white space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Ready to Write Your Own 5-Star Success Story?
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Join over 12,400+ practices and storefronts. Get your custom QR code running in 2 minutes for free.
            </p>
            <div>
              <a
                href="/register"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all rk-btn-shine shadow-lg"
              >
                <span>Get Started Free</span>
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
