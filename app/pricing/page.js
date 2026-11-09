import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingClient from './PricingClient';
import { settingsRepo } from '@/lib/repositories';
import JsonLd from '@/components/JsonLd';
import { getSiteUrl } from '@/lib/seoConfig';

export const revalidate = 60; // Cache at edge, background revalidate every 60s

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'Pricing & Plans - Transparent Google Review Software',
  description:
    'Simple, honest pricing for local businesses. Unlimited QR scans, instant AI review drafts, and 100% FTC compliance starting at $0/month. No lock-in contracts.',
  keywords: [
    'google review software pricing',
    'free google review qr code',
    'cheap podium alternative',
    'cheap birdeye alternative',
    'reputation management pricing',
    'local seo software cost',
  ],
  alternates: {
    canonical: `${siteUrl}/pricing`,
  },
  openGraph: {
    title: 'Pricing & Plans - Transparent Google Review Software | Rankaro',
    description:
      'Simple, honest pricing for local businesses. Unlimited QR scans, instant AI review drafts, and 100% FTC compliance starting at $0/month. No lock-in contracts.',
    url: `${siteUrl}/pricing`,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Rankaro Pricing and Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing & Plans - Transparent Google Review Software | Rankaro',
    description:
      'Simple, honest pricing for local businesses. Unlimited QR scans, instant AI review drafts, and 100% FTC compliance starting at $0/month. No lock-in contracts.',
    images: ['/logo.png'],
  },
};

const pricingSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': 'Rankaro Review Acceleration Platform',
    'image': `${siteUrl}/logo.png`,
    'description': 'AI-powered Google review acceleration and local SEO software for physical storefronts.',
    'brand': {
      '@type': 'Brand',
      'name': 'Rankaro'
    },
    'offers': {
      '@type': 'AggregateOffer',
      'lowPrice': '0',
      'highPrice': '29',
      'priceCurrency': 'USD',
      'offerCount': '3'
    }
  },
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
        'name': 'Pricing',
        'item': `${siteUrl}/pricing`
      }
    ]
  }
];

export default async function PricingPage() {
  const settings = await settingsRepo.getSettings();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={pricingSchemas} />
      <Navbar />
      <main className="flex-1">
        <PricingClient pricingConfig={settings?.pricing} />
      </main>
      <Footer />
    </div>
  );
}
