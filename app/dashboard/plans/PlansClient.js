'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Crown,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function PlansClient({ user }) {
  const { showToast } = useToast();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter / Free',
      description: 'Essential local reputation engine for individual storefronts.',
      priceMonthly: '₹0',
      priceYearly: '₹0',
      period: 'Forever free',
      popular: false,
      badge: 'Current Tier',
      features: [
        'Single Business Profile connection',
        'Standard QR Code Stand generation',
        'AI Review Drafts (Powered by Gemini)',
        'Basic review analytics & activity log',
        'Direct link to Google review box',
      ],
      ctaText: 'Current Plan',
      ctaDisabled: true,
    },
    {
      name: 'Pro',
      description: 'Ideal for growing businesses looking to dominate local Google search.',
      priceMonthly: '₹999',
      priceYearly: '₹849',
      period: 'per month',
      popular: true,
      badge: 'Most Popular',
      features: [
        'Everything in Starter, plus:',
        'Custom Branded QR Stands (Print Ready PDF)',
        'Unlimited AI Review Draft generations',
        'AI Knowledge Base customization with custom services',
        'WhatsApp instant inquiry desk priority',
        'Custom review landing page branding & colors',
        'Zero Google review link dropouts',
      ],
      ctaText: 'Upgrade to Pro',
      ctaDisabled: false,
      tierCode: 'PRO',
    },
    {
      name: 'Ultra Enterprise',
      description: 'Tailored for agencies, multi-location chains, and high-volume brands.',
      priceMonthly: '₹2,499',
      priceYearly: '₹1,999',
      period: 'per month',
      popular: false,
      badge: 'Enterprise Grade',
      features: [
        'Everything in Pro, plus:',
        'Multi-location dashboard (up to 10 locations)',
        'Dedicated Technical Account Manager at Arventa Ventures',
        'Custom REST API & Webhook integration',
        'Priority SLA support via direct WhatsApp & phone',
        'Automated monthly Google Business Profile local SEO audits',
        'Custom domain support for review pages',
      ],
      ctaText: 'Contact Enterprise Desk',
      ctaDisabled: false,
      tierCode: 'ULTRA',
    },
  ];

  const handlePlanClick = (plan) => {
    if (plan.ctaDisabled) return;
    const text = encodeURIComponent(
      `Hello Arventa Ventures Team,\n\nI want to upgrade my business (${user?.businessName || 'Business'}) on RANKORA to the *${plan.name}* plan.\n\nAccount: ${user?.email || 'N/A'}`
    );
    window.open(`https://wa.me/917872490719?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-[#5f6368]">
        <Link href="/dashboard" className="hover:text-[#1a73e8] transition-colors">
          Google Business Profile
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#202124]">Plans (Pro / Ultra)</span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
          <Crown className="w-3.5 h-3.5" />
          <span>Scale Your Google Business Profile</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202124]">
          Flexible Plans for Local Growth
        </h1>
        <p className="text-sm sm:text-base text-[#5f6368]">
          Engineered by Arventa Ventures. Upgrade to unlock full-funnel Google Review automation, customized QR stands, and enterprise multi-location management.
        </p>

        {/* Billing Toggle */}
        <div className="pt-2 flex items-center justify-center space-x-3">
          <span className={`text-xs font-medium ${billingCycle === 'monthly' ? 'text-[#202124]' : 'text-[#70757a]'}`}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#1a73e8] transition-colors duration-200 ease-in-out focus:outline-none"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-medium ${billingCycle === 'yearly' ? 'text-[#202124]' : 'text-[#70757a]'}`}>
            Yearly <span className="text-[#1e8e3e] font-semibold">(Save 15%)</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border bg-white p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
              plan.popular
                ? 'border-[#1a73e8] shadow-lg ring-2 ring-[#1a73e8]/20'
                : 'border-[#dadce0] hover:shadow-md'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a73e8] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                {plan.badge}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#202124]">{plan.name}</h3>
                <p className="mt-1 text-xs text-[#5f6368] leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>
              </div>

              <div className="pt-2 pb-4 border-b border-[#f1f3f4]">
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#202124]">
                    {billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly}
                  </span>
                  <span className="text-xs text-[#70757a]">/{plan.period}</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 pt-2">
                <p className="text-xs font-semibold text-[#202124] uppercase tracking-wider">Features included:</p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-[#3c4043]">
                    <Check className="w-4 h-4 text-[#34a853] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#f1f3f4]">
              <button
                type="button"
                disabled={plan.ctaDisabled}
                onClick={() => handlePlanClick(plan)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  plan.popular
                    ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-xs'
                    : plan.ctaDisabled
                    ? 'bg-[#f1f3f4] text-[#70757a] cursor-default'
                    : 'bg-[#f8f9fa] hover:bg-[#e8f0fe] text-[#1a73e8] border border-[#dadce0]'
                }`}
              >
                <span>{plan.ctaText}</span>
                {!plan.ctaDisabled && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Governed by Arventa Ventures Banner */}
      <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#1a73e8] uppercase tracking-wider flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Enterprise Strategy & Custom Contracts</span>
          </p>
          <h4 className="text-base font-bold text-[#202124]">
            Need a custom deployment across 50+ retail branches or franchise stores?
          </h4>
          <p className="text-xs text-[#5f6368]">
            Arventa Ventures provides white-glove onboarding, Google Business Profile API setup, and dedicated customer success.
          </p>
        </div>

        <Link
          href="/dashboard/contact"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-[#f1f3f4] text-[#202124] border border-[#dadce0] rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <span>Contact Sales Team</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#5f6368]" />
        </Link>
      </div>

      {/* Brand Footer Governance Note */}
      <div className="py-4 text-center border-t border-[#e8eaed]">
        <p className="text-xs text-[#70757a] flex items-center justify-center space-x-2">
          <span className="font-bold tracking-wider text-[#202124]">RANKORA</span>
          <span>•</span>
          <span>A Product by Arventa Ventures</span>
        </p>
      </div>
    </div>
  );
}
