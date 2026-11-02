import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  Award
} from 'lucide-react';

export const metadata = {
  title: 'Industry Solutions & Reputation Playbooks | Rankaro',
  description:
    'Tailored Google review acceleration playbooks for dental clinics, restaurants, auto mechanics, home service contractors, salons, and law practices.',
};

export default function SolutionsPage() {
  const industries = [
    {
      id: 'healthcare',
      title: 'Dental & Medical Practices',
      badge: 'Healthcare & Wellness',
      icon: Heart,
      color: 'from-blue-600 to-indigo-600',
      desc: 'Eliminate patient anxiety and overcome 1-star billing grievances by capturing the appreciation of hundreds of treated patients.',
      chips: ['Pain-Free Cleaning', 'Gentle Hygienist', 'Clear Insurance Billing', 'Modern X-Rays', 'Zero Waiting Delay'],
      placement: 'Reception checkout counter acrylic stand alongside payment terminal.',
      stat: '+430% 5-Star Reviews in 90 Days',
    },
    {
      id: 'restaurants',
      title: 'Restaurants, Cafes & Bars',
      badge: 'Hospitality & Dining',
      icon: UtensilsCrossed,
      color: 'from-amber-600 to-orange-600',
      desc: 'Capture reviews at the exact moment of post-dessert delight. Keyword tags highlight signature dishes directly on Google Maps.',
      chips: ['Handmade Truffle Pasta', 'Attentive Waitstaff', 'Warm Romantic Ambience', 'Craft Cocktails', 'Fast Seating'],
      placement: 'Discreet NFC / QR wood puck inside the check bill presenter.',
      stat: '35% Lift in Weekend Table Bookings',
    },
    {
      id: 'home-services',
      title: 'Plumbers, HVAC & Roofers',
      badge: 'Contractors & Trades',
      icon: Wrench,
      color: 'from-emerald-600 to-teal-600',
      desc: 'Win high-ticket emergency repair calls by establishing your business as the most reviewed and verified contractor in your county.',
      chips: ['Emergency Same-Day Fix', 'Upfront Honest Estimate', 'Clean Work Area', 'Knowledgeable Tech', 'Warranty Included'],
      placement: 'Printed on digital and paper completion invoices; technician business card.',
      stat: '640+ Emergency Inbound Calls',
    },
    {
      id: 'auto',
      title: 'Auto Repair & Tuning Shops',
      badge: 'Automotive Care',
      icon: Car,
      color: 'from-red-600 to-rose-600',
      desc: 'Combat industry skepticism with overwhelming social proof verifying your fair quotes, skilled mechanics, and honest diagnosis.',
      chips: ['Upfront Diagnostic Quote', 'Ceramic Brake Job', 'Same-Day Turnaround', 'Certified Mechanics', 'Nationwide Warranty'],
      placement: 'Customer keys pickup counter & vehicle steering wheel hangtag.',
      stat: '#1 Rank in County Google Maps 3-Pack',
    },
    {
      id: 'salons',
      title: 'Hair Salons, Spas & Aesthetics',
      badge: 'Beauty & Personal Care',
      icon: Scissors,
      color: 'from-pink-600 to-purple-600',
      desc: 'Convert Instagram beauty selfies into authoritative Google review photos that convince high-ticket clients to book consultations.',
      chips: ['Master Balayage Color', 'Relaxing Scalp Massage', 'Detailed Consultation', 'Spotless Luxury Salon', 'Senior Stylist'],
      placement: 'Styling mirror station QR decals and reception desk cards.',
      stat: '92% Photo Attachment Rate',
    },
    {
      id: 'legal',
      title: 'Law Firms & Accounting',
      badge: 'Professional Services',
      icon: Scale,
      color: 'from-slate-700 to-slate-900',
      desc: 'Build rock-solid institutional credibility for prospective clients searching for trusted legal and financial representation.',
      chips: ['Clear Legal Guidance', 'Estate Planning Expertise', 'Responsive Communication', 'Transparent Retainer', 'Case Success'],
      placement: 'Conference room table displays and closing document emails.',
      stat: 'Top-Rated Firm on Local Legal Directory',
    },
    {
      id: 'real-estate',
      title: 'Real Estate Brokers & Agents',
      badge: 'Property & Housing',
      icon: Building2,
      color: 'from-sky-600 to-blue-700',
      desc: 'Differentiate yourself in hyper-local neighborhoods by proving your negotiation prowess and speedy property closings.',
      chips: ['Neighborhood Market Expert', 'Fast Smooth Closing', 'Skillful Negotiation', 'Always Accessible', 'Stress-Free Experience'],
      placement: 'Closing gift basket custom QR card and celebratory welcome packet.',
      stat: '$14M in Additional Closed Transaction Volume',
    },
    {
      id: 'retail',
      title: 'Boutiques & Specialty Stores',
      badge: 'Brick-and-Mortar Retail',
      icon: ShoppingBag,
      color: 'from-violet-600 to-indigo-700',
      desc: 'Turn local foot-traffic into loyal brand ambassadors who highlight your curated selection, friendly staff, and gift wrapping.',
      chips: ['Curated Unique Gifts', 'Super Friendly Staff', 'Beautiful Packaging', 'Helpful Recommendations', 'Clean Store'],
      placement: 'Checkout cash wrap counter stand and shopping bag receipt insert.',
      stat: '4.9 Star Rating Across 500+ Reviews',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 space-y-24 pb-24">
        {/* HERO */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Award className="w-4 h-4" />
            <span>Vertical-Specific Strategies</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Reputation Playbooks Engineered for{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Your Specific Industry
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Every vertical has unique customer emotions, service terms, and point-of-sale dynamics. Rankaro comes pre-loaded with proven keyword chips and placement strategies for your trade.
          </p>
        </section>

        {/* 8 INDUSTRY CARDS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <div
                  key={ind.id}
                  id={ind.id}
                  className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between scroll-mt-24"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-tr ${ind.color} text-white shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                        {ind.badge}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-3">{ind.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{ind.desc}</p>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Pre-Engineered Service Chips:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {ind.chips.map((c) => (
                            <span key={c} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Recommended Placement:
                        </div>
                        <div className="text-xs text-slate-700 leading-relaxed font-medium">
                          {ind.placement}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-600">{ind.stat}</span>
                    <a
                      href={`/register?industry=${ind.id}`}
                      className="inline-flex items-center space-x-1 font-bold text-blue-600 hover:text-blue-700"
                    >
                      <span>Load This Preset Free</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">Don&apos;t See Your Exact Vertical?</h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Rankaro is 100% customizable. You can define your own unique service tags, categories, and review tone in less than 60 seconds.
            </p>
            <div className="pt-2">
              <a
                href="/register"
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md rk-btn-shine"
              >
                <span>Create Custom Preset Free</span>
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
