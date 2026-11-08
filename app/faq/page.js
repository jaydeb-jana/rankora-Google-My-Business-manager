import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FaqClient from './FaqClient';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rankaro.com';

export const metadata = {
  title: 'Frequently Asked Questions & Local SEO Knowledge Base | Rankaro',
  description:
    'Answers to all your questions regarding Google review policy compliance, FTC regulations, countertop QR stands, NFC tap cards, and AI review drafts.',
  keywords: [
    'google review faq',
    'ftc review guidelines',
    'review gating compliance',
    'countertop qr code questions',
    'nfc review card setup',
    'google review ranking algorithm',
    'rankaro faq',
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: 'Frequently Asked Questions & Local SEO Knowledge Base | Rankaro',
    description:
      'Answers to all your questions regarding Google review policy compliance, FTC regulations, countertop QR stands, NFC tap cards, and AI review drafts.',
    url: `${siteUrl}/faq`,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Rankaro Knowledge Base & FAQs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions & Local SEO Knowledge Base | Rankaro',
    description:
      'Answers to all your questions regarding Google review policy compliance, FTC regulations, countertop QR stands, NFC tap cards, and AI review drafts.',
    images: ['/logo.png'],
  },
};

const faqSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How fast can I get Rankaro running for my business?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'In less than 2 minutes! Create your account, link your Google Business Profile name or Google Place ID, select from our pre-made industry service presets (e.g. Dental, Restaurant, Auto, Salon), and instantly download your ready-to-print vector QR code.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Do my customers need to download an app or sign up?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'No, never! Rankaro operates 100% on the mobile web. When a customer scans your countertop QR code or taps an NFC badge, your customized page opens in their phone’s native browser in under 400 milliseconds. No app store download, no passwords, and no login required.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Where do I find my Google Review Link or Place ID?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You can easily find your review link inside your Google Business Profile dashboard by clicking "Ask for reviews". Alternatively, Rankaro provides an automated search tool during onboarding that automatically resolves your Google Place ID for you.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I customize the colors and logo on my review page?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes. On our Growth Pro and Agency plans, you can upload your high-resolution business logo, set your primary brand colors, and add custom welcome taglines so the review experience feels 100% native to your brand.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Is Rankaro 100% compliant with Google’s official Review Policies?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, 100%. Rankaro strictly enforces Google’s User Contributed Content guidelines. We do not engage in "review gating" (selectively routing unhappy customers away from Google while only sending happy ones). Every customer who scans has immediate, unrestricted access to the official Google review dialogue.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Does Rankaro violate the FTC’s new 2024/2026 rules on fake reviews?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'No. The FTC’s Trade Regulation Rule (16 CFR Part 465) penalizes fake reviews, insider reviews, and review suppression. Rankaro does not fabricate synthetic reviews or post on behalf of customers. Every review is drafted with the customer’s active service choices and voluntarily published by the customer themselves from their own personal Google account.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Can I offer discounts or free coffee to customers who leave a review?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'No. Offering financial incentives, coupons, or gifts in exchange for reviews violates both Google’s Terms and FTC law. Rankaro makes the review process so frictionless and fun that satisfied customers willingly leave reviews without needing prohibited bribes.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What happens if a customer has a negative experience?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Rankaro provides a prominent Direct Management Resolution channel. Unhappy customers can choose to submit their private grievance directly to the business owner for immediate remediation, while still maintaining full access to the public Google review link if they choose.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How does the AI generate personalized reviews from simple taps?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'When a customer taps 2 or 3 service chips (for example: "Pain-Free Cleaning" and "Zero Waiting Delay"), our contextual natural language engine constructs a smooth, grammatically natural paragraph reflecting those exact points. It reads just like an articulate customer wrote it from scratch.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Does mentioning specific services improve our Google SEO ranking?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Tremendously. Google’s Local Search algorithm analyzes the text body of reviews for keywords. When multiple reviews mention specific terms like "Dental Implants", "Emergency AC Repair", or "Truffle Pasta", Google recognizes your business as a high-authority provider for those search terms and ranks you higher in Google Maps.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What file format do the downloaded QR codes come in?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'All QR codes can be downloaded as scalable vector SVG files (which never blur at any print size) as well as 300 DPI high-resolution PNGs ready for commercial offset printing or desktop printouts.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What is NFC and how does it work with Rankaro?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'NFC (Near Field Communication) allows customers to simply tap their iPhone or Android against a smart countertop puck or card, instantly opening your review page without even opening their camera app. Rankaro provides the exact URL payload needed to encode any standard NTAG213/215 chip.'
        }
      }
    ]
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
        'name': 'FAQ',
        'item': `${siteUrl}/faq`
      }
    ]
  }
];

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={faqSchemas} />
      <Navbar />
      <main className="flex-1">
        <FaqClient />
      </main>
      <Footer />
    </div>
  );
}
