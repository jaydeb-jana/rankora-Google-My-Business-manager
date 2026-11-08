import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoiCalculatorClient from './RoiCalculatorClient';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rankaro.com';

export const metadata = {
  title: 'Google Review Revenue & ROI Calculator for Local Businesses | Rankaro',
  description:
    'Calculate the estimated revenue lift, customer footfall increase, and Google Maps rank progression by multiplying your 5-star Google review velocity.',
  keywords: [
    'google review roi calculator',
    'review value calculator',
    'local seo revenue impact',
    'reputation roi calculator',
    'google rating revenue lift',
  ],
  alternates: {
    canonical: `${siteUrl}/roi-calculator`,
  },
  openGraph: {
    title: 'Google Review Revenue & ROI Calculator for Local Businesses | Rankaro',
    description:
      'Calculate the estimated revenue lift, customer footfall increase, and Google Maps rank progression by multiplying your 5-star Google review velocity.',
    url: `${siteUrl}/roi-calculator`,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Rankaro Interactive Review ROI Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Google Review Revenue & ROI Calculator for Local Businesses | Rankaro',
    description:
      'Calculate the estimated revenue lift, customer footfall increase, and Google Maps rank progression by multiplying your 5-star Google review velocity.',
    images: ['/logo.png'],
  },
};

const roiSchemas = [
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
        'name': 'ROI Calculator',
        'item': `${siteUrl}/roi-calculator`
      }
    ]
  }
];

export default function RoiCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={roiSchemas} />
      <Navbar />
      <main className="flex-1">
        <RoiCalculatorClient />
      </main>
      <Footer />
    </div>
  );
}
