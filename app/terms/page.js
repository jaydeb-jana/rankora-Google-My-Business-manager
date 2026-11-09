import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { FileText, ShieldCheck, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rankaro.com';

export const metadata = {
  title: 'Terms of Service | Rankaro by Arventa Ventures',
  description:
    'Comprehensive Terms of Service and Master Subscription Agreement governing the use of the Rankaro platform, API, QR codes, and review assistance tools.',
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    title: 'Terms of Service | Rankaro by Arventa Ventures',
    description:
      'Comprehensive Terms of Service and Master Subscription Agreement governing the use of the Rankaro platform, API, QR codes, and review assistance tools.',
    url: `${siteUrl}/terms`,
    siteName: 'Rankaro',
    type: 'website',
  },
};

const termsSchemas = [
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
        'name': 'Terms of Service',
        'item': `${siteUrl}/terms`
      }
    ]
  }
];

export default function TermsPage() {
  const lastUpdated = 'November 2, 2026';

  const sections = [
    {
      num: 'Section 1',
      title: 'Acceptance of Terms and Agreement to Bound',
      content: `These Terms of Service ("Terms", "Agreement") constitute a legally binding agreement between you (whether individually or on behalf of an entity, "Merchant", "Customer", "User", or "you") and Arventa Ventures ("Company", "we", "us", or "our"), governing your access to and use of the Rankaro web application, review formulation engine, vector QR generators, APIs, and associated online services (collectively, the "Services").

BY CREATING AN ACCOUNT, ACCESSING THE PLATFORM, DOWNLOADING PRINT TEMPLATES, OR DISPLAYING A RANKARO QR CODE OR NFC CHIP IN YOUR BUSINESS PREMISES, YOU EXPRESSLY AGREE TO BE BOUND BY ALL OF THESE TERMS. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS, YOU ARE PROHIBITED FROM USING THE SERVICES AND MUST DISCONTINUE USE IMMEDIATELY.`,
    },
    {
      num: 'Section 2',
      title: 'Description of Services and Platform License',
      content: `Rankaro provides productivity and customer communication software designed to streamline the voluntary collection of authentic reviews on third-party platforms, primarily Google Maps and Google Business Profile.

Subject to your continued compliance with these Terms and timely payment of applicable subscription fees, Arventa Ventures grants you a limited, non-exclusive, non-transferable, revocable license to:
(a) Access and use the merchant dashboard for your internal commercial operations;
(b) Generate, download, print, and display custom QR codes and NFC payloads for your registered business locations;
(c) Utilize the natural language review formulation engine to assist visiting patrons in drafting feedback.

You agree not to reverse engineer, decompile, resell, white-label without authorization, or lease the Services to third parties.`,
    },
    {
      num: 'Section 3',
      title: 'Eligibility and Authority',
      content: `By registering for an account, you represent and warrant that:
(a) You are at least 18 years of age or the age of legal majority in your jurisdiction;
(b) You possess the legal capacity and corporate authority to bind the commercial entity you represent;
(c) The business profile, physical location, and Google Place ID you register correspond to a bona fide commercial enterprise owned or legally managed by you;
(d) All registration information submitted is truthful, accurate, and current.`,
    },
    {
      num: 'Section 4',
      title: 'Account Registration, Passwords and Security',
      content: `You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately at security@arventaventures.online of any unauthorized access or breach of security.

Arventa Ventures shall not be liable for any loss or damage arising from your failure to protect your login credentials. We reserve the right to suspend or terminate accounts that exhibit suspicious access patterns, credential stuffing indicators, or automated bot scraping.`,
    },
    {
      num: 'Section 5',
      title: 'Strict Adherence to Google Review Policies and FTC Guidelines',
      content: `Google LLC maintains strict User Contributed Content Policies regarding Maps and Local Business Profiles. Furthermore, the U.S. Federal Trade Commission (FTC Title 16 CFR Part 465) strictly prohibits deceptive review practices.

As an express condition of using Rankaro, you agree and covenant that:
(a) NO REVIEW GATING: You will not configure Rankaro, signage, or staff scripts to prevent, discourage, or block customers with negative feedback from submitting reviews directly to Google.
(b) NO INCENTIVIZED REVIEWS: You will not offer discounts, free gifts, cash, lottery entries, or employee kickbacks to consumers conditioned upon leaving a 5-star review or positive rating.
(c) NO FAKE REVIEWS: You will not submit reviews on your own behalf, purchase reviews, employ click farms, or fabricate synthetic customer accounts.
(d) CUSTOMER AUTONOMY: Every customer must maintain 100% discretion to edit, alter, delete, or reject any drafted text suggested by the AI engine before submitting to Google.

VIOLATION OF THIS SECTION RESULTS IN IMMEDIATE ACCOUNT TERMINATION WITH ZERO REFUND AND MAY EXPOSE YOU TO STATUTORY CIVIL PENALTIES FROM GOVERNMENT REGULATORS.`,
    },
    {
      num: 'Section 6',
      title: 'Subscription Fees, Billing Cycles, and Automatic Renewal',
      content: `Certain tiers of our Services (Growth Pro, Agency, Enterprise) require payment of recurring subscription fees.
• Billing Cycles: Fees are billed in advance on either a monthly or annual cadence as selected at checkout.
• Automatic Renewal: Subscriptions automatically renew at the conclusion of each billing period unless canceled prior to the renewal date via the dashboard.
• Taxes: All listed prices are exclusive of applicable federal, state, local, or value-added taxes (VAT/GST), which will be added to your invoice where required by law.
• Price Adjustments: We reserve the right to modify subscription pricing upon 30 days prior written notice. Continued use following the effective date constitutes acceptance of adjusted rates.`,
    },
    {
      num: 'Section 7',
      title: 'Cancellation and 30-Day Money-Back Guarantee',
      content: `• Cancellation: You may cancel your subscription at any time directly through the dashboard under Billing Settings. Cancellation takes effect at the end of your current prepaid billing cycle.
• 30-Day Money-Back Guarantee: If you are dissatisfied with a paid tier within the first 30 days of initial purchase, you may contact support@arventaventures.online to request a full refund. This guarantee applies solely to first-time subscribers and does not apply to subsequent renewal periods or hardware orders.`,
    },
    {
      num: 'Section 8',
      title: 'Intellectual Property and Proprietary Rights',
      content: `Arventa Ventures retains all right, title, and interest in and to the Rankaro platform, including all source code, algorithms, visual interface designs, vector QR formatting routines, AI prompt formulation frameworks, documentation, and registered trademarks.

You retain all ownership rights to your business trademarks, logos, service descriptions, and proprietary imagery uploaded to the customizer. You grant Arventa Ventures a limited, worldwide license to display your logos strictly to render your personalized review landing page and QR print outputs.`,
    },
    {
      num: 'Section 9',
      title: 'Third-Party Trademarks and Platform Disclaimers',
      content: `Google, Google Maps, Google Business Profile, and the Google logo are registered trademarks of Google LLC.
Apple, Apple Maps, and iOS are trademarks of Apple Inc.
Rankaro is an independent software tool developed by Arventa Ventures. Rankaro is not affiliated with, endorsed by, certified by, or officially associated with Google LLC, Alphabet Inc., or Apple Inc. All reviews are submitted voluntarily by end customers through Google's native review dialogue.`,
    },
    {
      num: 'Section 10',
      title: 'Service Availability and 99.98% Uptime SLA',
      content: `We strive to provide continuous platform availability with a targeted 99.98% uptime service level agreement (excluding scheduled maintenance windows communicated in advance).

In the event of an unexpected service disruption exceeding 4 consecutive hours, eligible paid subscribers may request a pro-rated service credit applied to their subsequent billing cycle.`,
    },
    {
      num: 'Section 11',
      title: 'Disclaimer of Warranties',
      content: `EXCEPT AS EXPRESSLY PROVIDED HEREIN, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. ARVENTA VENTURES SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.

WE DO NOT GUARANTEE THAT GOOGLE WILL INDEX EVERY SUBMITTED REVIEW, THAT YOUR GOOGLE BUSINESS PROFILE WILL ACHIEVE A SPECIFIC SEARCH RANKING POSITION, OR THAT CONSUMERS WILL CHOOSE TO LEAVE POSITIVE FEEDBACK.`,
    },
    {
      num: 'Section 12',
      title: 'Limitation of Liability',
      content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ARVENTA VENTURES, ITS DIRECTORS, EMPLOYEES, PARTNERS, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING LOSS OF PROFITS, DATA, USE, GOODWILL, OR BUSINESS REPUTATION) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICES.

OUR TOTAL AGGREGATE LIABILITY FOR ANY AND ALL CLAIMS ARISING UNDER OR RELATED TO THIS AGREEMENT SHALL BE STRICTLY LIMITED TO THE AMOUNT ACTUALLY PAID BY YOU TO ARVENTA VENTURES DURING THE TWELVE (12) MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY.`,
    },
    {
      num: 'Section 13',
      title: 'Indemnification Obligations',
      content: `You agree to defend, indemnify, and hold harmless Arventa Ventures, its officers, directors, employees, and agents from and against any third-party claims, liabilities, damages, losses, and reasonable legal expenses arising out of or in any way connected with:
(a) Your violation of these Terms;
(b) Your violation of Google's Review Policies or FTC deceptive endorsement rules;
(c) Any deceptive, defamatory, or unlawful conduct conducted through your merchant account.`,
    },
    {
      num: 'Section 14',
      title: 'Governing Law and Dispute Resolution',
      content: `These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles.

Any dispute, controversy, or claim arising out of or relating to this contract, or the breach thereof, shall be settled by binding confidential arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules. You agree that any claim must be brought in your individual capacity, and not as a plaintiff or class member in any purported class or representative proceeding.`,
    },
    {
      num: 'Section 15',
      title: 'Severability and Entire Agreement',
      content: `If any provision of these Terms is found to be unlawful, void, or for any reason unenforceable, that provision shall be deemed severable from these Terms and shall not affect the validity and enforceability of any remaining provisions.

These Terms, together with our Privacy Policy and executed enterprise order forms (if applicable), constitute the entire agreement between you and Arventa Ventures concerning the Services.`,
    },
    {
      num: 'Section 16',
      title: 'Contact for Legal Inquiries',
      content: `For any legal questions or notices regarding these Terms of Service, please contact:
Arventa Ventures Corporate Legal Department
Email: legal@arventaventures.online
Support: support@arventaventures.online`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={termsSchemas} />
      <Navbar />

      <main className="flex-1 space-y-16 pb-24">
        {/* HEADER */}
        <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Scale className="w-4 h-4" />
            <span>Master Subscription Agreement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Effective Date & Last Updated: <strong>{lastUpdated}</strong>
          </p>
        </section>

        {/* 16 DETAILED SECTIONS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
          {sections.map((sec) => (
            <div
              key={sec.num}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {sec.num}
                </span>
                <h2 className="text-xl font-bold text-slate-900">{sec.title}</h2>
              </div>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {sec.content}
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
