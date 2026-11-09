import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { getSiteUrl } from '@/lib/seoConfig';
import { ShieldCheck, Lock, Globe, Mail, FileText, CheckCircle2 } from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Comprehensive Privacy Policy outlining our strict data governance, zero-sale of consumer information, GDPR & CCPA adherence, and security practices.',
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy | Rankaro by Arventa Ventures',
    description:
      'Comprehensive Privacy Policy outlining our strict data governance, zero-sale of consumer information, GDPR & CCPA adherence, and security practices.',
    url: `${siteUrl}/privacy`,
    siteName: 'Rankaro',
    type: 'website',
  },
};

const privacySchemas = [
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
        'name': 'Privacy Policy',
        'item': `${siteUrl}/privacy`
      }
    ]
  }
];

export default function PrivacyPage() {
  const lastUpdated = 'November 2, 2026';

  const sections = [
    {
      num: '1.0',
      title: 'Introduction and Scope',
      content: `Rankaro is a software-as-a-service application developed, owned, and operated by Arventa Ventures ("Company", "we", "our", or "us"). We provide reputation enablement software, dynamic vector QR generation, and assisted feedback formulation tools for independent businesses ("Merchants") and their visiting consumers ("End Users" or "Patrons").

This Privacy Policy describes our practices regarding the collection, storage, processing, transfer, and protection of personal data when you interact with our website (rankaro.com / arventaventures.online), our merchant administration consoles, our public review landing pages, and associated APIs. By accessing or using our Services, you acknowledge that you have read and understood this Policy.`,
    },
    {
      num: '2.0',
      title: 'Data Controller and Contact Information',
      content: `For the purposes of the EU General Data Protection Regulation (GDPR), the UK Data Protection Act 2018, and relevant international data privacy laws, the primary Data Controller is Arventa Ventures.

For inquiries, data access requests, or to reach our designated Data Protection Officer (DPO), please contact:
• Entity: Arventa Ventures
• Support Desk: support@arventaventures.online
• Data Protection Officer: dpo@arventaventures.online
• Registered Website: https://arventaventures.online`,
    },
    {
      num: '3.0',
      title: 'Categories of Information We Collect',
      content: `We collect minimal, purpose-specific information categorized as follows:

A. Merchant Account Information: When a business registers on Rankaro, we collect the account owner's legal name, corporate business name, verified email address, hashed authentication credentials, physical storefront address, Google Business Profile place identifiers, and selected industry vertical.

B. Patron / End User Interaction Data: When an end customer scans a Rankaro countertop QR code or visits a public review page (/r/[slug]), we temporarily process transient operational data: IP address (strictly for rate-limiting and DDoS mitigation), browser user-agent string, selected service tags (e.g. "Pain-Free Cleaning"), chosen sentiment tone, and timestamp. We DO NOT require patrons to create an account, log in with social profiles, or submit their phone number to generate a review draft.

C. Private Resolution Form Data (Optional): If an end user elects to utilize the direct private management feedback channel, they may voluntarily submit their name, telephone number, email, and a written description of their grievance. This data is delivered directly to the designated business owner and is never shared, rented, or sold.`,
    },
    {
      num: '4.0',
      title: 'Lawful Basis for Processing (GDPR Article 6)',
      content: `We process personal data solely under recognized lawful bases:
• Contractual Necessity (Art. 6(1)(b)): To provision merchant dashboards, process payments, and generate scannable review codes.
• Legitimate Interests (Art. 6(1)(f)): To maintain network security, detect brute-force attacks, prevent fraud, and optimize scan latency across edge networks.
• Legal Compliance (Art. 6(1)(c)): To maintain financial accounting records, verify tax compliance, and honor legal requests from regulatory authorities.
• Explicit Consent (Art. 6(1)(a)): Where a user voluntarily submits feedback via our contact forms or private resolution mechanisms.`,
    },
    {
      num: '5.0',
      title: 'Zero-Sale and Strict Non-Monetization of Data',
      content: `We maintain an unconditional commitment to customer privacy:
1. WE NEVER SELL, RENT, OR MONETIZE PERSONAL DATA.
2. We never build cross-site behavioral advertising profiles on visiting patrons.
3. We do not participate in third-party data broker networks.
4. Patron interactions with our QR codes are strictly transaction-isolated: their scan history is never linked to third-party ad networks or data aggregators.`,
    },
    {
      num: '6.0',
      title: 'Cookies and Tracking Technologies',
      content: `Rankaro adheres to a strict cookie-minimization architecture:
• Strictly Necessary Cookies: Used solely for merchant session authentication, CSRF security tokens, and load balancer routing.
• Local Storage: Used to cache non-sensitive interface preferences (e.g., active dashboard tab or dark/light display settings).
• We do not deploy intrusive third-party cross-site advertising cookies or fingerprinting trackers.`,
    },
    {
      num: '7.0',
      title: 'Third-Party Sub-Processors and Infrastructure',
      content: `To ensure global high availability, sub-second latency, and bank-grade security, we partner with industry-leading cloud infrastructure providers who undergo strict vendor security assessments:
• Cloudflare Inc. (Edge CDN, DDoS Shield, DNS)
• Amazon Web Services (AWS) / DigitalOcean (Encrypted cloud application hosting)
• MongoDB Atlas (Encrypted multi-tenant database clusters)
• Resend / Nodemailer SMTP (Transactional account emails and OTP delivery)
All sub-processors are bound by executed Data Processing Addenda (DPAs) with standard contractual clauses.`,
    },
    {
      num: '8.0',
      title: 'International Data Transfers (Cross-Border)',
      content: `Personal data may be transferred to and maintained on computer servers located outside of your state, province, or country. When transferring data from the European Economic Area (EEA) or the United Kingdom to countries not deemed to provide an adequate level of data protection, Arventa Ventures relies on standard contractual clauses (SCCs) approved by the European Commission, supplemented by technical safeguards including AES-256 encryption.`,
    },
    {
      num: '9.0',
      title: 'Data Retention and Deletion Protocols',
      content: `• Merchant Account Data: Retained for the duration of the active subscription plus 90 days following account termination to accommodate reactivation requests.
• Patron Scan Logs: Aggregated into anonymous statistical counters (e.g., total scan counts per month) and stripped of raw IP addresses within 30 days.
• Private Resolution Inquiries: Retained for up to 180 days to allow merchants to audit customer service remediation, after which records may be permanently purged upon request.`,
    },
    {
      num: '10.0',
      title: 'Data Subject Rights (GDPR & CCPA/CPRA)',
      content: `Depending on your jurisdiction, you possess statutory rights regarding your personal data:
• Right of Access & Portability: You may request a machine-readable export of all data associated with your profile.
• Right to Rectification: You may correct inaccurate or incomplete account records directly within your dashboard or via support.
• Right to Erasure ("Right to be Forgotten"): You may request the permanent deletion of your account and associated data.
• Right to Restrict or Object: You may object to the processing of your data based on legitimate interests.
• Non-Discrimination: We will never discriminate against you, alter pricing, or degrade service quality for exercising your privacy rights.
To exercise any of these rights, email privacy@arventaventures.online with the subject line "Data Subject Request".`,
    },
    {
      num: '11.0',
      title: 'Information Security and Safeguards',
      content: `We implement state-of-the-art administrative, technical, and physical safeguards:
• AES-256 encryption for data at rest.
• TLS 1.3 encryption for all data in transit across public networks.
• Automated brute-force lockout mechanisms and rate-limiting.
• Strict role-based access control (RBAC) limiting production access strictly to vetted engineering personnel.`,
    },
    {
      num: '12.0',
      title: 'Protection of Children’s Privacy',
      content: `Our services are designed strictly for commercial enterprises and adult consumers capable of forming legally binding agreements. We do not knowingly solicit or collect personal data from individuals under the age of 16. If we become aware that a child under 16 has provided us with personal data, we will immediately take steps to delete such information.`,
    },
    {
      num: '13.0',
      title: 'Compliance with Google Review Policies & FTC Guidelines',
      content: `Rankaro operates in strict adherence to Google’s Content Policies for Maps and Local Business Profiles. Specifically:
• We do not incentivize reviews (no payments, discounts, or gifts in exchange for reviews).
• We do not engage in review gating (filtering negative reviewers away from Google).
• All review drafts formulated by our natural language engine require deliberate, manual confirmation and posting by the customer through their own Google account.`,
    },
    {
      num: '14.0',
      title: 'Modifications to this Privacy Policy',
      content: `We reserve the right to amend this Privacy Policy at any time to reflect legislative developments, industry best practices, or operational modifications. When updates are published, the revised date at the top of this document will be updated. In the event of material changes affecting your rights, active merchants will receive prior notification via electronic mail.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={privacySchemas} />
      <Navbar />

      <main className="flex-1 space-y-16 pb-24">
        {/* HEADER */}
        <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Legal & Privacy Governance</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Rankaro Privacy Policy
          </h1>
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Effective Date & Last Updated: <strong>{lastUpdated}</strong>
          </p>
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left leading-relaxed">
            <strong>Key Summary:</strong> We respect consumer privacy. We never sell your personal information. We do not require visiting patrons to create an account or sign up to scan our QR codes. All reviews are posted voluntarily and directly by users to Google Maps.
          </div>
        </section>

        {/* 14 SECTIONS */}
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

          {/* DPO CONTACT BOX */}
          <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-3">
            <h3 className="text-lg font-bold">Have Questions About Your Data?</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Our Data Protection Officer and compliance team are available to answer inquiries, process DSAR requests, or discuss enterprise Data Processing Agreements (DPA).
            </p>
            <div className="pt-2 text-xs text-blue-400 font-semibold">
              Email: dpo@arventaventures.online • Arventa Ventures Corporate Desk
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
