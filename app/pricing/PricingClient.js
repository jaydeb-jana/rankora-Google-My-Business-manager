'use client';
import { useState } from 'react';
import {
  Check,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Zap,
  Building,
  CheckCircle2,
  Lock,
  ChevronDown,
  Layers,
  HeartHandshake
} from 'lucide-react';

export default function PricingClient() {
  const [annualBilling, setAnnualBilling] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  const tiers = [
    {
      name: 'Starter',
      id: 'starter',
      badge: 'Free Forever',
      desc: 'Perfect for solo professionals, local food trucks, and single-practitioner clinics starting out.',
      priceMonthly: 0,
      priceAnnual: 0,
      highlight: false,
      features: [
        '1 Physical Business Location',
        'Unlimited Customer QR Scans',
        'Up to 6 Custom Service Chips',
        'Standard AI Review Formulation',
        'Direct Google Maps Review Link',
        'Basic Sentiment Analytics',
        'Standard Print-Ready PDF Templates',
        'Email Support',
      ],
      notIncluded: [
        'NFC Tap Card Integration',
        'Private Unresolved Complaint Channel',
        'Staff Attribution Leaderboards',
        'Custom Brand Logo & Hex Color Matching',
        'Multi-Location Central Dashboard',
        'Webhook & POS Integrations',
      ],
      cta: 'Get Started Free',
      ctaHref: '/register?plan=starter',
    },
    {
      name: 'Growth Pro',
      id: 'growth-pro',
      badge: 'Most Popular',
      desc: 'Ideal for busy dental practices, auto shops, popular restaurants, and service contractors.',
      priceMonthly: 29,
      priceAnnual: 23,
      highlight: true,
      features: [
        'Everything in Starter, plus:',
        'Unlimited Custom Service Chips',
        'Advanced Context-Aware AI Engine',
        'Private Direct Resolution Grievance Channel',
        'Full Brand Customizer (Logo, Colors, Taglines)',
        'Staff Attribution & Employee Tracking',
        'High-Resolution Vector SVG Print Exports',
        'NFC Tap Card Programming Data',
        'Real-Time Weekly Velocity Reports',
        'Priority 1-Hour Ticket Support',
      ],
      notIncluded: [
        'Multi-Location Central Dashboard',
        'Dedicated Enterprise Account Manager',
      ],
      cta: 'Start 14-Day Free Trial',
      ctaHref: '/register?plan=growth',
    },
    {
      name: 'Agency / Enterprise',
      id: 'enterprise',
      badge: 'Multi-Location',
      desc: 'Built for franchises, multi-doctor groups, agency resellers, and enterprise chains.',
      priceMonthly: 79,
      priceAnnual: 63,
      highlight: false,
      features: [
        'Everything in Growth Pro, plus:',
        'Up to 10 Physical Locations (Expandable)',
        'Unified Multi-Location Rollup Dashboard',
        'Role-Based Staff Access (Admin / Manager)',
        'Custom POS & Webhook Integrations (Square, Toast)',
        'Cross-Store Benchmark Leaderboards',
        'Dedicated Customer Success Architect',
        'Custom Invoicing & SLA Guarantee',
        'Phone & WhatsApp Emergency Support Desk',
      ],
      notIncluded: [],
      cta: 'Launch Enterprise Suite',
      ctaHref: '/register?plan=agency',
    },
  ];

  const comparisonRows = [
    {
      category: 'Core Review Engine',
      items: [
        { name: 'Customer Scans per Month', starter: 'Unlimited', pro: 'Unlimited', agency: 'Unlimited' },
        { name: 'AI Review Formulation Engine', starter: 'Standard', pro: 'Contextual (3 Tones)', agency: 'Contextual + Custom Prompts' },
        { name: 'Service Tag Chips', starter: 'Up to 6', pro: 'Unlimited', agency: 'Unlimited' },
        { name: 'Google Maps Native Deep-Linking', starter: true, pro: true, agency: true },
        { name: 'Automatic Clipboard Copy', starter: true, pro: true, agency: true },
      ],
    },
    {
      category: 'Hardware & Countertop Support',
      items: [
        { name: 'Dynamic QR Code Generation', starter: true, pro: true, agency: true },
        { name: 'Vector SVG & 300 DPI Exports', starter: false, pro: true, agency: true },
        { name: 'NFC Tap Card Programming Payload', starter: false, pro: true, agency: true },
        { name: 'Printable Table Tent & Counter Templates', starter: 'Standard', pro: 'Custom Branded', agency: 'Custom Branded' },
      ],
    },
    {
      category: 'Reputation Protection & Compliance',
      items: [
        { name: '100% Anti-Gating Google Compliance', starter: true, pro: true, agency: true },
        { name: 'Private Direct Resolution Channel', starter: false, pro: true, agency: true },
        { name: 'Instant Negative Sentiment Alerts', starter: false, pro: true, agency: true },
        { name: 'Zero Fake Review Guarantee', starter: true, pro: true, agency: true },
      ],
    },
    {
      category: 'Analytics & Multi-Unit Management',
      items: [
        { name: 'Scan Velocity & Conversion Tracking', starter: 'Basic', pro: 'Advanced Real-Time', agency: 'Cross-Store Comparative' },
        { name: 'Staff & Team Attribution', starter: false, pro: true, agency: true },
        { name: 'Multi-Location Central Dashboard', starter: false, pro: false, agency: true },
        { name: 'POS & Webhook Integration (Square/Toast)', starter: false, pro: false, agency: true },
        { name: 'CSV & PDF Executive Exports', starter: false, pro: true, agency: true },
      ],
    },
    {
      category: 'Support & Governance',
      items: [
        { name: 'Support Response SLA', starter: '24-48 Hours', pro: '< 1 Hour Priority', agency: 'Direct Phone & WhatsApp' },
        { name: 'Dedicated Account Manager', starter: false, pro: false, agency: true },
        { name: 'Custom Data Processing Addendum (DPA)', starter: false, pro: true, agency: true },
      ],
    },
  ];

  const pricingFaqs = [
    {
      q: 'Can I truly use Rankaro for free forever?',
      a: 'Yes. Our Starter plan is 100% free with no expiration, no credit card required, and no hidden trial traps. You get unlimited scans and authentic Google review generation for 1 location indefinitely.',
    },
    {
      q: 'How does the 14-day free trial on Growth Pro work?',
      a: 'You can test all Pro features (custom branding, private resolution gate, staff tracking, and vector QR exports) for 14 days without paying a penny. Cancel anytime with a single click in your dashboard.',
    },
    {
      q: 'What is your 30-day money-back guarantee?',
      a: 'If you upgrade to Growth Pro or Agency and do not see a dramatic increase in your Google review velocity within 30 days, simply message our support desk and we will refund 100% of your fee immediately, no questions asked.',
    },
    {
      q: 'Do you charge per review or per customer scan?',
      a: 'Never! All plans include unlimited customer scans and unlimited review generations. Whether 50 or 5,000 customers scan your counter QR code each month, your price remains strictly fixed.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and bank wire transfers for annual enterprise contracts.',
    },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* 1. HERO & BILLING TOGGLE */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Honest, Transparent Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Invest in 5-Star Reviews, Not in{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
            $400/Month Software Bloat
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          While legacy platforms lock local businesses into restrictive multi-year contracts, Rankaro offers fair, transparent pricing that pays for itself with a single new customer.
        </p>

        {/* Monthly / Annual Switcher */}
        <div className="mt-10 inline-flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setAnnualBilling(false)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              !annualBilling
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setAnnualBilling(true)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              annualBilling
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-extrabold ${
              annualBilling ? 'bg-white text-blue-600' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* 2. THE 3 TIER CARDS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => {
            const price = annualBilling ? tier.priceAnnual : tier.priceMonthly;
            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all relative ${
                  tier.highlight
                    ? 'bg-gradient-to-b from-blue-900 to-slate-900 text-white shadow-2xl ring-2 ring-blue-500 scale-105 z-10'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-lg'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-500 text-white text-xs font-black uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-2xl font-black ${tier.highlight ? 'text-white' : 'text-slate-900'}`}>
                      {tier.name}
                    </h3>
                    {!tier.highlight && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                    tier.highlight ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {tier.desc}
                  </p>

                  {/* Price Block */}
                  <div className="flex items-baseline space-x-2 mb-6 pb-6 border-b border-slate-200/20">
                    <span className="text-5xl font-black tracking-tight">
                      ${price}
                    </span>
                    <span className={`text-xs font-semibold ${tier.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                      {price === 0 ? 'forever' : '/ month'}
                    </span>
                    {annualBilling && price > 0 && (
                      <span className="text-[11px] text-emerald-400 font-bold ml-1">
                        (billed annually)
                      </span>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3">
                    <div className={`text-xs font-bold uppercase tracking-wider ${
                      tier.highlight ? 'text-blue-300' : 'text-slate-500'
                    }`}>
                      Included Features:
                    </div>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm font-medium">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          tier.highlight ? 'text-emerald-400' : 'text-emerald-600'
                        }`} />
                        <span className={tier.highlight ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                      </div>
                    ))}

                    {tier.notIncluded.length > 0 && (
                      <div className="pt-2 space-y-2">
                        {tier.notIncluded.map((feat, idx) => (
                          <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-400">
                            <X className="w-4 h-4 flex-shrink-0 text-slate-400 mt-0.5" />
                            <span className="line-through">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-200/20">
                  <a
                    href={tier.ctaHref}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
                      tier.highlight
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30 rk-btn-shine'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 30-DAY GUARANTEE BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="p-4 rounded-2xl bg-emerald-600 text-white flex-shrink-0 shadow-md">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-950">
              100% 30-Day Money-Back Guarantee
            </h3>
            <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
              Try Growth Pro or Agency completely risk-free. If you don&apos;t see a noticeable surge in your Google reviews within the first 30 days, message us for a 100% immediate refund. You keep all reviews collected forever.
            </p>
          </div>
        </div>
      </section>

      {/* 4. COMPREHENSIVE 35-ROW MATRIX */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Side-By-Side Details
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Detailed Plan Feature Comparison
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-4 px-6 font-bold text-slate-900 w-2/5">Platform Feature</th>
                <th className="py-4 px-4 font-bold text-slate-700 text-center w-1/5">Starter</th>
                <th className="py-4 px-4 font-extrabold text-blue-600 text-center bg-blue-50/60 w-1/5">Growth Pro</th>
                <th className="py-4 px-4 font-bold text-slate-900 text-center w-1/5">Agency / Multi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonRows.map((cat, cIdx) => (
                <div key={cIdx} className="contents">
                  <tr className="bg-slate-100/70">
                    <td colSpan={4} className="py-2.5 px-6 font-extrabold text-xs text-slate-700 uppercase tracking-wider">
                      {cat.category}
                    </td>
                  </tr>
                  {cat.items.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-slate-800">
                        {row.name}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? (
                            <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-xs font-semibold text-slate-600">{row.starter}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center bg-blue-50/20">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="w-4 h-4 text-blue-600 font-bold mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-xs font-bold text-blue-700">{row.pro}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {typeof row.agency === 'boolean' ? (
                          row.agency ? (
                            <Check className="w-4 h-4 text-emerald-600 font-bold mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-xs font-bold text-slate-900">{row.agency}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </div>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. PRICING FAQS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Billing & Invoicing
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">
            Pricing Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {pricingFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full py-4 px-6 text-left font-bold text-slate-900 flex items-center justify-between hover:text-blue-600"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
