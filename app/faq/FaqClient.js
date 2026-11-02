'use client';
import { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  QrCode,
  CreditCard,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function FaqClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const faqData = [
    // Category: Getting Started
    {
      id: 'gs-1',
      cat: 'getting-started',
      q: 'How fast can I get Rankaro running for my business?',
      a: 'In less than 2 minutes! Create your account, link your Google Business Profile name or Google Place ID, select from our pre-made industry service presets (e.g. Dental, Restaurant, Auto, Salon), and instantly download your ready-to-print vector QR code.',
    },
    {
      id: 'gs-2',
      cat: 'getting-started',
      q: 'Do my customers need to download an app or sign up?',
      a: 'No, never! Rankaro operates 100% on the mobile web. When a customer scans your countertop QR code or taps an NFC badge, your customized page opens in their phone’s native browser in under 400 milliseconds. No app store download, no passwords, and no login required.',
    },
    {
      id: 'gs-3',
      cat: 'getting-started',
      q: 'Where do I find my Google Review Link or Place ID?',
      a: 'You can easily find your review link inside your Google Business Profile dashboard by clicking "Ask for reviews". Alternatively, Rankaro provides an automated search tool during onboarding that automatically resolves your Google Place ID for you.',
    },
    {
      id: 'gs-4',
      cat: 'getting-started',
      q: 'Can I customize the colors and logo on my review page?',
      a: 'Yes. On our Growth Pro and Agency plans, you can upload your high-resolution business logo, set your primary brand colors, and add custom welcome taglines so the review experience feels 100% native to your brand.',
    },

    // Category: Google Compliance
    {
      id: 'gc-1',
      cat: 'compliance',
      q: 'Is Rankaro 100% compliant with Google’s official Review Policies?',
      a: 'Yes, 100%. Rankaro strictly enforces Google’s User Contributed Content guidelines. We do not engage in "review gating" (selectively routing unhappy customers away from Google while only sending happy ones). Every customer who scans has immediate, unrestricted access to the official Google review dialogue.',
    },
    {
      id: 'gc-2',
      cat: 'compliance',
      q: 'Does Rankaro violate the FTC’s new 2024/2026 rules on fake reviews?',
      a: 'No. The FTC’s Trade Regulation Rule (16 CFR Part 465) penalizes fake reviews, insider reviews, and review suppression. Rankaro does not fabricate synthetic reviews or post on behalf of customers. Every review is drafted with the customer’s active service choices and voluntarily published by the customer themselves from their own personal Google account.',
    },
    {
      id: 'gc-3',
      cat: 'compliance',
      q: 'Can I offer discounts or free coffee to customers who leave a review?',
      a: 'No. Offering financial incentives, coupons, or gifts in exchange for reviews violates both Google’s Terms and FTC law. Rankaro makes the review process so frictionless and fun that satisfied customers willingly leave reviews without needing prohibited bribes.',
    },
    {
      id: 'gc-4',
      cat: 'compliance',
      q: 'What happens if a customer has a negative experience?',
      a: 'Rankaro provides a prominent "Direct Management Resolution" channel. Unhappy customers can choose to submit their private grievance directly to the business owner for immediate remediation, while still maintaining full access to the public Google review link if they choose.',
    },

    // Category: AI Drafting
    {
      id: 'ai-1',
      cat: 'ai-engine',
      q: 'How does the AI generate personalized reviews from simple taps?',
      a: 'When a customer taps 2 or 3 service chips (for example: "Pain-Free Cleaning" and "Zero Waiting Delay"), our contextual natural language engine constructs a smooth, grammatically natural paragraph reflecting those exact points. It reads just like an articulate customer wrote it from scratch.',
    },
    {
      id: 'ai-2',
      cat: 'ai-engine',
      q: 'Can customers edit or rewrite the suggested text before posting?',
      a: 'Yes, always. Customers have complete control: they can copy the draft as-is, edit individual sentences, add personal anecdotes, or delete the suggestion entirely and write their own words. Rankaro never auto-submits.',
    },
    {
      id: 'ai-3',
      cat: 'ai-engine',
      q: 'Does mentioning specific services improve our Google SEO ranking?',
      a: 'Tremendously. Google’s Local Search algorithm analyzes the text body of reviews for keywords. When multiple reviews mention specific terms like "Dental Implants", "Emergency AC Repair", or "Truffle Pasta", Google recognizes your business as a high-authority provider for those search terms and ranks you higher in Google Maps.',
    },

    // Category: Hardware & QR Codes
    {
      id: 'hw-1',
      cat: 'hardware',
      q: 'What file format do the downloaded QR codes come in?',
      a: 'All QR codes can be downloaded as scalable vector SVG files (which never blur at any print size) as well as 300 DPI high-resolution PNGs ready for commercial offset printing or desktop printouts.',
    },
    {
      id: 'hw-2',
      cat: 'hardware',
      q: 'What is NFC and how does it work with Rankaro?',
      a: 'NFC (Near Field Communication) allows customers to simply tap their iPhone or Android against a smart countertop puck or card, instantly opening your review page without even opening their camera app. Rankaro provides the exact URL payload needed to encode any standard NTAG213/215 chip.',
    },
    {
      id: 'hw-3',
      cat: 'hardware',
      q: 'Do you provide ready-made print templates for table tents and counters?',
      a: 'Yes! Inside your dashboard, you can download pre-formatted PDF templates sized for standard 4x6" acrylic stands, 5x7" counter cards, and table tent check presenters.',
    },

    // Category: Billing & Plans
    {
      id: 'bl-1',
      cat: 'billing',
      q: 'Is the Starter plan truly free forever?',
      a: 'Yes. Our Starter plan has no monthly fees, no expiration date, and requires no credit card. It includes unlimited scans for 1 business location.',
    },
    {
      id: 'bl-2',
      cat: 'billing',
      q: 'How does the 30-day money-back guarantee work?',
      a: 'If you upgrade to Growth Pro or Agency and aren’t completely thrilled with your increase in Google reviews, email our support desk within 30 days and we will refund 100% of your payment with zero hassle.',
    },
    {
      id: 'bl-3',
      cat: 'billing',
      q: 'Can I cancel or downgrade my subscription at any time?',
      a: 'Yes, with one click in your billing dashboard. There are no contracts, cancellation fees, or penalties. Your account will simply revert at the end of the paid cycle.',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'compliance', name: 'Google & FTC Compliance' },
    { id: 'ai-engine', name: 'AI Formulation Engine' },
    { id: 'hardware', name: 'Hardware, QR & NFC' },
    { id: 'billing', name: 'Plans & Billing' },
  ];

  const filteredFaqs = faqData.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.cat === activeCategory;
    const matchesQuery =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-16 pb-24">
      {/* HERO & SEARCH BAR */}
      <section className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
          <HelpCircle className="w-4 h-4" />
          <span>Knowledge Base & Answers</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
          Everything you need to know about setting up countertop displays, Google review policies, AI writing assistance, and billing.
        </p>

        {/* Live Search Input */}
        <div className="mt-8 max-w-xl mx-auto relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. Google policy, NFC, refund, pricing)..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* ACCORDION LIST */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <p className="text-slate-600 text-sm">
              No matching questions found for &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((item) => {
              const isOpen = !!openItems[item.id];
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full py-5 px-6 text-left font-bold text-slate-900 flex items-center justify-between hover:text-blue-600 gap-4"
                  >
                    <span className="text-base sm:text-lg">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* STILL HAVE QUESTIONS CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
          <h3 className="text-lg font-bold text-slate-900">
            Still have questions that aren&apos;t answered here?
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Our support architects are ready to assist with custom hardware, enterprise setups, and API documentation.
          </p>
          <div className="pt-2">
            <a
              href="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              <span>Contact Support Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
