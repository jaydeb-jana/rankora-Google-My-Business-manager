import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingClient from './LandingClient';
import JsonLd from '@/components/JsonLd';
import { getSiteUrl } from '@/lib/seoConfig';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'Rankaro - #1 Google Review Booster & Local SEO Growth Platform',
  description:
    'Turn happy in-store customers into authentic 5-star Google reviews in 10 seconds. Generate custom QR stands, smart service chips, and AI drafts to dominate Google Maps 3-Pack rankings.',
  keywords: [
    'google review qr code generator',
    'how to get 5 star google reviews',
    'local seo review management platform',
    'google business profile ranking software',
    'countertop qr code stand for reviews',
    'nfc review tap cards',
    'ai google review generator',
    'ftc compliant review tool',
    'birdeye alternative',
    'podium alternative',
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Rankaro - #1 Google Review Booster & Local SEO Growth Platform',
    description:
      'Turn happy in-store customers into authentic 5-star Google reviews in 10 seconds. Generate custom QR stands, smart service chips, and AI drafts to dominate Google Maps 3-Pack rankings.',
    url: siteUrl,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Rankaro - Local SEO & Google Review Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rankaro - #1 Google Review Booster & Local SEO Growth Platform',
    description:
      'Turn happy in-store customers into authentic 5-star Google reviews in 10 seconds. Generate custom QR stands, smart service chips, and AI drafts to dominate Google Maps 3-Pack rankings.',
    images: ['/logo.png'],
  },
};

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Does Rankaro strictly comply with Google’s official Review Policies and FTC laws?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, 100%. Rankaro strictly enforces Google’s User Contributed Content policies and the FTC’s Trade Regulation Rule (16 CFR Part 465). We strictly forbid deceptive review gating (filtering negative reviews away from Google while sending only positive reviews). Every consumer who scans has immediate, unrestricted access to the official Google review screen. Furthermore, we never submit fake reviews or auto-post on behalf of anyone; customers maintain 100% editing autonomy before submitting from their own personal Google accounts.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How does the natural language AI draft generator help my customers?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': '87% of satisfied customers want to leave a review, but 72% abandon the process because typing on a phone creates writer’s block. When a customer scans your countertop QR display, Rankaro presents 5 or 6 interactive service chips (e.g., Painless Cleaning, Friendly Staff). When the customer taps their highlights, our natural language model instantly synthesizes an articulate, genuine draft incorporating those exact keywords. The customer can copy it with 1 tap or edit words freely before Google Maps opens.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Why do keyword-rich reviews matter for Google Maps Local 3-Pack SEO?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Google’s local ranking algorithm weighs three primary review factors: Review Velocity (consistent ongoing new reviews), Overall Sentiment (star rating), and Semantic Keyword Prominence. When customers mention specific services in their review text (e.g., dental implants, ceramic brakes, truffle pasta), Google’s search bots index those keywords. When nearby consumers search for those exact services, your business profile ranks significantly higher in the local 3-Pack.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What physical hardware do I need, and how fast is setup?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Zero expensive proprietary equipment! Setup takes less than 90 seconds. You can download print-ready PDF/SVG vector files from your dashboard to print on countertop cards, table tents, or receipt footers. We also support programming standard NFC tap pucks (NTAG213/215) so customers can simply tap their iPhone or Android without opening their camera.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How does Rankaro handle unhappy customers or negative feedback without gating?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Rankaro provides an instant, private Direct Management Resolution channel. Unhappy customers are offered a prominent option to submit their grievance privately to the business owner’s phone/inbox for instant remediation before escalating online. Crucially, the customer still has full, unhindered access to the official Google review link, keeping your business 100% policy-compliant.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How does Rankaro compare to legacy platforms like Birdeye and Podium?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Legacy tools charge $300-$500/month, lock businesses into 12-month contracts, and rely on annoying SMS text blasts hours or days after the visit (which customers increasingly report as spam). Rankaro costs $0 to $29/month, has zero contracts, and engages customers at the exact point of sale when satisfaction is at its peak.'
      }
    }
  ]
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={homeFaqSchema} />
      <Navbar />
      <main className="flex-1">
        <LandingClient />
      </main>
      <Footer />
    </div>
  );
}
