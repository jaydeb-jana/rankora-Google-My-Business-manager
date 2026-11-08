import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import TopProgressBar from "@/components/TopProgressBar";
import JsonLd from "@/components/JsonLd";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rankaro.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rankaro - #1 Google Review Booster & Local SEO Growth Platform",
    template: "%s | Rankaro",
  },
  description:
    "Turn happy in-store customers into detailed 5-star Google reviews in 10 seconds. Boost your Google Maps 3-Pack ranking with AI review drafts, NFC tap cards, and custom countertop QR stands.",
  keywords: [
    "google review qr code generator",
    "google review management software",
    "local seo tools",
    "get more google reviews",
    "google business profile ranking",
    "ai review assistant",
    "countertop qr stands",
    "nfc review cards",
    "google maps 3 pack",
    "ftc compliant review software",
    "birdeye alternative",
    "podium alternative",
    "gatherup alternative",
    "local business reputation management"
  ],
  authors: [
    { name: "Rankaro Team", url: siteUrl },
    { name: "Jaydeb Jana", url: "https://arventaventures.online" },
  ],
  creator: "Jaydeb Jana",
  publisher: "Arventa Ventures",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon-512.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Rankaro",
    title: "Rankaro - #1 Google Review Booster & Local SEO Growth Platform",
    description:
      "Turn happy customers into authentic, detailed 5-star Google reviews in 10 seconds. Boost your Google Maps 3-Pack rankings with AI drafts and countertop QR stands.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Rankaro - Google Review Acceleration & Local SEO Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rankaro - #1 Google Review Booster & Local SEO Growth Platform",
    description:
      "Turn happy customers into authentic, detailed 5-star Google reviews in 10 seconds. Boost your Google Maps 3-Pack rankings with AI drafts and countertop QR stands.",
    images: ["/logo.png"],
    creator: "@iamjaydebjana",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

// Global Schema.org JSON-LD Entities
const globalSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    "name": "Rankaro",
    "legalName": "Arventa Ventures",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "founder": {
      "@type": "Person",
      "name": "Jaydeb Jana",
      "jobTitle": "Founder & CEO",
      "sameAs": "https://arventaventures.online"
    },
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "ceo@arventaventures.online",
      "telephone": "+91 7872490719",
      "availableLanguage": ["en"]
    },
    "sameAs": [
      "https://twitter.com/iamjaydebjana",
      "https://linkedin.com/company/rankaro"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "name": "Rankaro",
    "url": siteUrl,
    "description": "AI-powered Google review acceleration and local SEO reputation platform for businesses.",
    "publisher": {
      "@id": `${siteUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/blog?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#software`,
    "name": "Rankaro",
    "operatingSystem": "All (Web Browser, iOS, Android)",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Reputation Management & Local SEO",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free Starter Tier with unlimited QR scans and 100% FTC compliance."
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1284",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Contextual AI Review Formulation Engine",
      "Instant Vector QR Code Stand Generator",
      "NFC Tap-to-Review Hardware Compatibility",
      "100% FTC Anti-Gating Policy Compliance",
      "Private Negative Sentiment Resolution Gateway",
      "Multi-Location Google Business Profile Sync",
      "Smart Service Chip Keyword Injection"
    ]
  }
];

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLd schema={globalSchemas} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#202124]">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
