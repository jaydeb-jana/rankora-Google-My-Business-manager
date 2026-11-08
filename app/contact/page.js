import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactClient from './ContactClient';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rankaro.com';

export const metadata = {
  title: 'Contact Us & Executive Support | Rankaro',
  description:
    'Contact the Rankaro team for enterprise deployment, countertop NFC hardware inquiries, agency partnerships, or 24/7 technical assistance.',
  keywords: [
    'contact rankaro',
    'google review support',
    'local seo consultation',
    'countertop qr code inquiry',
    'nfc review hardware support',
    'arventa ventures contact',
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Us & Executive Support | Rankaro',
    description:
      'Contact the Rankaro team for enterprise deployment, countertop NFC hardware inquiries, agency partnerships, or 24/7 technical assistance.',
    url: `${siteUrl}/contact`,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Contact Rankaro & Arventa Ventures',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us & Executive Support | Rankaro',
    description:
      'Contact the Rankaro team for enterprise deployment, countertop NFC hardware inquiries, agency partnerships, or 24/7 technical assistance.',
    images: ['/logo.png'],
  },
};

const contactSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'Contact Rankaro & Arventa Ventures',
    'description': 'Contact channels for Rankaro review platform support, partnerships, and executive assistance.',
    'url': `${siteUrl}/contact`,
    'mainEntity': {
      '@type': 'Organization',
      'name': 'Rankaro',
      'telephone': '+91 7872490719',
      'email': 'ceo@arventaventures.online',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Purba Gopinathpur, Chapatala, More',
        'addressLocality': 'Contai',
        'addressRegion': 'West Bengal',
        'postalCode': '721442',
        'addressCountry': 'IN'
      }
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
        'name': 'Contact',
        'item': `${siteUrl}/contact`
      }
    ]
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={contactSchemas} />
      <Navbar />
      <main className="flex-1">
        <ContactClient />
      </main>
      <Footer />
    </div>
  );
}
