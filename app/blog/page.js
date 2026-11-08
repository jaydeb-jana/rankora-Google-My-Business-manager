import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogClient from './BlogClient';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rankaro.com';

export const metadata = {
  title: 'Local SEO Strategy & Google Review Knowledge Base | Rankaro',
  description:
    'Authoritative masterclasses on Google Maps 3-Pack algorithms, BERT entity matching, FTC compliance, and physical countertop QR conversion psychology.',
  keywords: [
    'local seo blog',
    'google maps 3-pack ranking strategy',
    'review velocity algorithm',
    'ftc review gating rules',
    'google review seo optimization',
    'how to get 5 star reviews',
  ],
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Local SEO Strategy & Google Review Knowledge Base | Rankaro',
    description:
      'Authoritative masterclasses on Google Maps 3-Pack algorithms, BERT entity matching, FTC compliance, and physical countertop QR conversion psychology.',
    url: `${siteUrl}/blog`,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Rankaro Local SEO & Google Review Knowledge Base',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local SEO Strategy & Google Review Knowledge Base | Rankaro',
    description:
      'Authoritative masterclasses on Google Maps 3-Pack algorithms, BERT entity matching, FTC compliance, and physical countertop QR conversion psychology.',
    images: ['/logo.png'],
  },
};

const blogSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Rankaro Local SEO & Reputation Knowledge Base',
    'description': 'Authoritative guides on Google local ranking algorithms, FTC compliance, and review conversion.',
    'url': `${siteUrl}/blog`,
    'publisher': {
      '@type': 'Organization',
      'name': 'Rankaro',
      'logo': `${siteUrl}/logo.png`
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
        'name': 'Blog',
        'item': `${siteUrl}/blog`
      }
    ]
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={blogSchemas} />
      <Navbar />
      <main className="flex-1">
        <BlogClient />
      </main>
      <Footer />
    </div>
  );
}
