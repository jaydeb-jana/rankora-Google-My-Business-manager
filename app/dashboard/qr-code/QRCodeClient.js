'use client';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Info,
  LayoutTemplate,
  X,
  Palette,
  Smartphone,
  Radio,
  MapPin,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

const TEMPLATES = [
  {
    id: 'google-official',
    name: 'Google Official Kit',
    category: 'Official Google',
    tag: 'Official Google Partner Kit',
    details:
      'Authentic Google Business Profile standee featuring the iconic Google 4-color top bar, official G emblem, Google wordmark, 5.0 Google rating badge, Google Maps verification pin, and contactless NFC tap guide. Sized perfectly for standard A4 counter stands, desktop acrylic holders, and retail display framing.',
    colors: [
      { name: 'Google Blue', hex: '#4285F4' },
      { name: 'Google Red', hex: '#EA4335' },
      { name: 'Google Yellow', hex: '#FBBC05' },
      { name: 'Google Green', hex: '#34A853' },
      { name: 'Card Canvas', hex: '#FFFFFF', border: true },
      { name: 'Charcoal Text', hex: '#202124' },
    ],
  },
  {
    id: 'google-five-star',
    name: 'Google 5-Star Showcase',
    category: 'Official Google',
    tag: 'High Conversion',
    details:
      'High-impact Google review campaign design with a prominent 4-color Google accent stripe, giant "FIVE STAR" headline, Google review rating stars, and high-visibility scanning target to maximize immediate customer response.',
    colors: [
      { name: 'Google Blue', hex: '#4285F4' },
      { name: 'Google Red', hex: '#EA4335' },
      { name: 'Google Yellow', hex: '#FBBC05' },
      { name: 'Google Green', hex: '#34A853' },
      { name: 'Star Gold', hex: '#FBBC04' },
      { name: 'Card White', hex: '#FFFFFF', border: true },
    ],
  },
  {
    id: 'google-minimal',
    name: 'Google Clean Studio',
    category: 'Official Google',
    tag: 'Minimalist Luxury',
    details:
      'Pure white canvas with Google Pixel studio aesthetics, delicate hairline border, centered Google G emblem, refined typography, and floating QR viewfinder. Recommended for modern boutiques, design studios, and upscale practices.',
    colors: [
      { name: 'Pure White', hex: '#FFFFFF', border: true },
      { name: 'Google Blue', hex: '#1A73E8' },
      { name: 'Star Gold', hex: '#FBBC04' },
      { name: 'Charcoal Text', hex: '#202124' },
      { name: 'Hairline Border', hex: '#E8EAED' },
    ],
  },
  {
    id: 'navy-standee',
    name: 'Executive Midnight Navy',
    category: 'Dark & Luxury',
    tag: 'Corporate & Nightlife',
    details:
      'Deep midnight navy background with electric sky blue accents, brilliant white headings, and glowing gold stars. QR code is mounted on a high-contrast white card for effortless camera scanning. Ideal for salons, clinics, lounges, and corporate desks.',
    colors: [
      { name: 'Midnight Navy', hex: '#0A1628' },
      { name: 'Electric Sky', hex: '#38BDF8' },
      { name: 'Star Gold', hex: '#FBBC04' },
      { name: 'Pure White', hex: '#FFFFFF', border: true },
      { name: 'Slate Muted', hex: '#94A3B8' },
    ],
  },
  {
    id: 'gold-premium',
    name: 'Royal Obsidian & Gold',
    category: 'Dark & Luxury',
    tag: '5-Star Hospitality',
    details:
      'Dark obsidian base paired with metallic dual gold borders, elegant serif typography, and warm champagne accents. Specifically engineered for fine dining restaurants, luxury jewelry stores, 5-star hotels, and prestige spas.',
    colors: [
      { name: 'Obsidian Base', hex: '#12100E' },
      { name: 'Royal Gold', hex: '#D4AF37' },
      { name: 'Amber Gold', hex: '#F59E0B' },
      { name: 'Warm Cream', hex: '#F8F1D8' },
      { name: 'Champagne Gold', hex: '#E5D5A8' },
    ],
  },
  {
    id: 'emerald-modern',
    name: 'Emerald Botanica',
    category: 'Retail & Hospitality',
    tag: 'Fresh Organic',
    details:
      'Lush forest emerald header with a gentle mint pastel card canvas, sage green accents, and warm gold review stars. Welcoming and approachable for specialty cafes, bakeries, dental wellness centers, and organic retail shops.',
    colors: [
      { name: 'Forest Emerald', hex: '#064E3B' },
      { name: 'Pastel Mint', hex: '#F0FDF4' },
      { name: 'Sage Accent', hex: '#10B981' },
      { name: 'Charcoal Text', hex: '#1F2937' },
      { name: 'Star Gold', hex: '#FBBC04' },
    ],
  },
  {
    id: 'bold-counter',
    name: 'High-Impact POS Standee',
    category: 'Retail & Hospitality',
    tag: 'Point of Sale',
    details:
      'High-contrast Google Blue top block and solid dark borders engineered for high visibility from 5-10 feet away. Commands immediate customer attention at busy checkout counters, billing POS registers, and order pickup areas.',
    colors: [
      { name: 'Electric Blue', hex: '#1A73E8' },
      { name: 'Jet Black', hex: '#111827' },
      { name: 'Card White', hex: '#FFFFFF', border: true },
      { name: 'Star Gold', hex: '#FBBC04' },
      { name: 'Border Gray', hex: '#DADCE0' },
    ],
  },
  {
    id: 'table-tent-fold',
    name: 'Foldable A-Frame Tent',
    category: 'Retail & Hospitality',
    tag: 'Self-Standing Tent',
    details:
      'Two-sided printable table tent with an integrated central fold-line guide. Prints onto standard paper or cardstock and stands upright on dining tables and hotel rooms without requiring any acrylic plastic frame.',
    colors: [
      { name: 'Card White', hex: '#FFFFFF', border: true },
      { name: 'Google Blue', hex: '#1A73E8' },
      { name: 'Google Red', hex: '#EA4335' },
      { name: 'Star Gold', hex: '#FBBC04' },
      { name: 'Slate Charcoal', hex: '#202124' },
    ],
  },
];

function GoogleG({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

function GoogleWordmark({ className = 'text-xl' }) {
  return (
    <span
      className={`font-semibold tracking-tight inline-flex items-center ${className}`}
      aria-label="Google"
    >
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  );
}

function GoogleStar({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FBBC04" aria-hidden="true">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function BusinessLogoBadge({
  logoUrl,
  businessName,
  size = 'w-14 h-14',
  className = '',
  imgClassName = '',
  variant = 'light',
}) {
  const initial = businessName ? businessName.trim().charAt(0).toUpperCase() : 'B';

  const containerStyles =
    {
      light: 'bg-white border-[#dadce0] text-[#1a73e8] shadow-xs',
      dark: 'bg-white border-white/40 text-[#0a1628] shadow-md',
      gold: 'bg-white border-2 border-[#d4af37] text-[#12100e] shadow-lg',
      emerald: 'bg-white border-2 border-[#a7f3d0] text-[#064e3b] shadow-xs',
      minimal: 'bg-white border border-[#e8eaed] text-[#202124] shadow-xs',
    }[variant] || 'bg-white border-[#dadce0] text-[#1a73e8] shadow-xs';

  if (logoUrl) {
    return (
      <div
        className={`${size} rounded-2xl border p-1 flex items-center justify-center shrink-0 ${containerStyles} ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={businessName || 'Business Logo'}
          className={`w-full h-full object-contain rounded-xl ${imgClassName}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`${size} rounded-2xl border flex items-center justify-center font-black select-none shrink-0 ${containerStyles} ${className}`}
    >
      <span className="text-base">{initial}</span>
    </div>
  );
}

function QrViewfinder({
  dataUrl,
  className = 'w-48 h-48',
  cornerColor = '#4285F4',
  scanLabel = 'SCAN TO REVIEW',
}) {
  return (
    <div className="relative inline-block p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200/90">
      {/* Corner Viewfinder brackets */}
      <div
        className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 rounded-tl"
        style={{ borderColor: cornerColor }}
      />
      <div
        className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 rounded-tr"
        style={{ borderColor: cornerColor }}
      />
      <div
        className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 rounded-bl"
        style={{ borderColor: cornerColor }}
      />
      <div
        className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 rounded-br"
        style={{ borderColor: cornerColor }}
      />

      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt="Scan QR code"
          className={`${className} object-contain block mx-auto`}
        />
      ) : (
        <div
          className={`${className} flex items-center justify-center text-xs text-slate-400 bg-slate-50`}
        >
          Generating QR...
        </div>
      )}

      {scanLabel && (
        <div className="mt-1 text-[9px] font-bold tracking-wider uppercase text-slate-500 text-center">
          {scanLabel}
        </div>
      )}
    </div>
  );
}

function DisplayCard({ templateId, user, dataUrl, cardSize = 'a4' }) {
  const cardWidth =
    cardSize === '5x7'
      ? 'w-full max-w-[430px]'
      : cardSize === 'fold'
      ? 'w-full max-w-[390px]'
      : 'w-full max-w-[420px]';

  // 1. Google Official Partner Kit (The Flagship Masterpiece)
  if (templateId === 'google-official' || templateId === 'google-review') {
    return (
      <div
        className={`bg-white rounded-3xl overflow-hidden ${cardWidth} mx-auto text-center border border-[#dadce0] shadow-md relative`}
      >
        {/* Google 4-Color Stripe Header */}
        <div className="flex h-2 w-full">
          <div className="flex-1 bg-[#4285F4]" />
          <div className="flex-1 bg-[#EA4335]" />
          <div className="flex-1 bg-[#FBBC05]" />
          <div className="flex-1 bg-[#34A853]" />
        </div>

        <div className="p-6 sm:p-7 flex flex-col items-center">
          {/* Official Google Header */}
          <div className="flex items-center justify-center space-x-2.5 mb-2">
            <GoogleG className="w-7 h-7" />
            <div className="flex flex-col items-start leading-tight">
              <GoogleWordmark className="text-xl leading-none" />
              <span className="text-[10px] font-semibold text-[#5f6368] tracking-wider uppercase">
                Business Profile
              </span>
            </div>
          </div>

          {/* Business Logo in exact right place */}
          <div className="flex flex-col items-center mt-2 mb-1">
            <BusinessLogoBadge
              logoUrl={user.logoUrl}
              businessName={user.businessName}
              size="w-14 h-14 sm:w-16 sm:h-16"
              className="mb-2"
              variant="light"
            />
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#202124] tracking-tight max-w-full px-2 break-words leading-tight">
              {user.businessName}
            </h2>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-[#5F6368] mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
            <span className="font-medium">Verified on Google Search &amp; Maps</span>
          </div>

          {/* Official Review Badge */}
          <div className="mb-3.5 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FE] border border-[#D2E3FC] text-[#1A73E8]">
            <span className="text-xs font-bold tracking-tight">Review us on Google</span>
            <span className="w-1 h-1 rounded-full bg-[#1A73E8]" />
            <div className="flex items-center space-x-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <GoogleStar key={s} className="w-3.5 h-3.5" />
              ))}
              <span className="text-xs font-bold ml-1 text-[#202124]">5.0</span>
            </div>
          </div>

          {/* QR Code Container with High-Tech Google Brackets */}
          <div className="mb-3.5">
            <QrViewfinder
              dataUrl={dataUrl}
              className="w-44 h-44 sm:w-48 sm:h-48"
              cornerColor="#4285F4"
              scanLabel="SCAN WITH CAMERA"
            />
          </div>

          {/* Contactless / NFC & Speed Callout */}
          <div className="flex items-center justify-center space-x-3 text-[11px] font-semibold text-[#3C4043] bg-[#F8F9FA] px-4 py-1.5 rounded-xl border border-[#E8EAED] w-full max-w-xs">
            <div className="flex items-center space-x-1">
              <Smartphone className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Camera Scan</span>
            </div>
            <span className="text-[#BDC1C6]">•</span>
            <div className="flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-[#34A853]" />
              <span>NFC Tap</span>
            </div>
          </div>

          <p className="text-[11px] text-[#5F6368] mt-2.5">
            Takes under 30 seconds • No app download needed
          </p>

          <div className="mt-4 pt-2.5 border-t border-[#F1F3F4] w-full flex items-center justify-between text-[9px] text-[#9AA0A6] uppercase tracking-wider font-medium">
            <span>Google Business Profile Kit</span>
            <span>Verified Standee</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Google 5-Star Showcase
  if (templateId === 'google-five-star') {
    return (
      <div
        className={`bg-white rounded-3xl overflow-hidden ${cardWidth} mx-auto text-center border border-[#DADCE0] shadow-md relative`}
      >
        <div className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] p-1" />
        <div className="p-6 sm:p-7 flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-2">
            <GoogleG className="w-7 h-7" />
            <GoogleWordmark className="text-xl" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#5F6368]">
            Help Us Grow With A
          </span>
          <h2 className="text-3xl font-black tracking-tight text-[#202124] mt-0.5 mb-1">
            FIVE STAR
          </h2>
          <div className="flex items-center justify-center space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <GoogleStar key={s} className="w-5 h-5" />
            ))}
          </div>

          {/* Business Logo & Name */}
          <div className="flex flex-col items-center mb-3">
            <BusinessLogoBadge
              logoUrl={user.logoUrl}
              businessName={user.businessName}
              size="w-13 h-13 sm:w-14 sm:h-14"
              className="mb-1.5"
              variant="light"
            />
            <h3 className="text-base sm:text-lg font-bold text-[#1A73E8] max-w-full px-2 break-words leading-tight">
              {user.businessName}
            </h3>
          </div>

          <div className="mb-3.5">
            <QrViewfinder
              dataUrl={dataUrl}
              className="w-44 h-44 sm:w-48 sm:h-48"
              cornerColor="#EA4335"
              scanLabel="POINT PHONE CAMERA"
            />
          </div>

          <p className="text-xs font-semibold text-[#202124]">
            Scan to leave your review on Google
          </p>
          <p className="text-[11px] text-[#5F6368] mt-0.5">
            Your 5-star feedback means the world to our team
          </p>

          <div className="mt-4 pt-2.5 border-t border-[#F1F3F4] w-full text-[10px] text-[#9AA0A6]">
            Fast • 100% Anonymous Draft • Powered by Google
          </div>
        </div>
      </div>
    );
  }

  // 3. Google Clean Studio (Minimalist)
  if (templateId === 'google-minimal' || templateId === 'classic') {
    return (
      <div
        className={`bg-white rounded-3xl overflow-hidden ${cardWidth} mx-auto text-center border-2 border-[#E8EAED] shadow-sm relative p-6 sm:p-7 flex flex-col items-center`}
      >
        {/* Business Logo as prominent centerpiece */}
        <BusinessLogoBadge
          logoUrl={user.logoUrl}
          businessName={user.businessName}
          size="w-14 h-14 sm:w-16 sm:h-16"
          className="mb-2.5"
          variant="minimal"
        />

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F8F9FA] border border-[#E8EAED] text-xs font-semibold text-[#1A73E8] mb-1.5">
          <GoogleG className="w-3.5 h-3.5" />
          <span>Review us on Google</span>
        </div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#202124] tracking-tight mb-2 max-w-full px-2 break-words leading-tight">
          {user.businessName}
        </h2>

        <div className="flex items-center justify-center space-x-1 mb-3.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <GoogleStar key={s} className="w-4 h-4" />
          ))}
        </div>

        <div className="mb-3.5">
          <QrViewfinder
            dataUrl={dataUrl}
            className="w-44 h-44 sm:w-48 sm:h-48"
            cornerColor="#1A73E8"
            scanLabel="CAMERA SCAN TARGET"
          />
        </div>

        <p className="text-xs font-semibold text-[#202124]">Point your phone camera here</p>
        <p className="text-[11px] text-[#5F6368] mt-0.5">
          Select received services &amp; post in one tap
        </p>

        <div className="mt-5 pt-2.5 border-t border-[#F1F3F4] w-full flex items-center justify-between text-[9px] text-[#9AA0A6]">
          <span>Google Business Profile</span>
          <span>Verified Merchant</span>
        </div>
      </div>
    );
  }

  // 4. Executive Midnight Navy
  if (templateId === 'navy-standee') {
    return (
      <div
        className={`bg-gradient-to-b from-[#0A1628] to-[#0F2444] rounded-3xl overflow-hidden ${cardWidth} mx-auto text-center border border-[#1E293B] shadow-xl relative p-6 sm:p-7 flex flex-col items-center text-white`}
      >
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#38BDF8] text-[10px] font-bold uppercase tracking-widest mb-2.5">
          <Radio className="w-3 h-3 text-[#38BDF8]" />
          <span>We Value Your Feedback</span>
        </div>

        <BusinessLogoBadge
          logoUrl={user.logoUrl}
          businessName={user.businessName}
          size="w-14 h-14 sm:w-16 sm:h-16"
          className="mb-2"
          variant="dark"
        />

        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight mb-1 max-w-full px-2 break-words leading-tight">
          {user.businessName}
        </h2>
        <p className="text-xs text-[#94A3B8] mb-2.5">Share your experience on Google</p>

        <div className="flex items-center justify-center space-x-1 mb-3.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <GoogleStar key={s} className="w-4 h-4" />
          ))}
        </div>

        <div className="mb-3.5">
          <QrViewfinder
            dataUrl={dataUrl}
            className="w-44 h-44 sm:w-48 sm:h-48"
            cornerColor="#0A1628"
            scanLabel="SCAN WITH CAMERA"
          />
        </div>

        <p className="text-sm font-bold text-white">Point phone camera to review</p>
        <p className="text-[11px] text-[#94A3B8] mt-0.5">One tap connects directly to Google</p>

        <div className="mt-4 pt-2.5 border-t border-white/10 w-full flex items-center justify-between text-[9px] text-[#64748B] uppercase tracking-wider font-medium">
          <span>Official Counter Stand</span>
          <span>Google Verified</span>
        </div>
      </div>
    );
  }

  // 5. Royal Obsidian & Gold
  if (templateId === 'gold-premium') {
    return (
      <div
        className={`bg-[#12100E] rounded-3xl overflow-hidden ${cardWidth} mx-auto text-center border-2 border-[#D4AF37]/50 shadow-2xl relative p-6 sm:p-7 flex flex-col items-center`}
      >
        <div className="absolute inset-2 border border-[#D4AF37]/25 rounded-2xl pointer-events-none" />

        <div className="inline-flex items-center space-x-1 text-[#E5D5A8] text-[10px] font-serif uppercase tracking-[0.3em] mb-2">
          <span>• A Five Star Thank You •</span>
        </div>

        <BusinessLogoBadge
          logoUrl={user.logoUrl}
          businessName={user.businessName}
          size="w-14 h-14 sm:w-16 sm:h-16"
          className="mb-2"
          variant="gold"
        />

        <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#F8F1D8] tracking-wide mb-1 max-w-full px-2 break-words leading-tight">
          {user.businessName}
        </h2>
        <p className="text-xs text-[#D4AF37] mb-2.5 font-serif italic">
          Your kind words illuminate our journey
        </p>

        <div className="flex items-center justify-center space-x-1.5 mb-3.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <GoogleStar key={s} className="w-4 h-4" />
          ))}
        </div>

        <div className="mb-3.5">
          <QrViewfinder
            dataUrl={dataUrl}
            className="w-44 h-44 sm:w-48 sm:h-48"
            cornerColor="#D4AF37"
            scanLabel="SCAN WITH PHONE"
          />
        </div>

        <p className="text-xs font-serif font-bold text-[#F8F1D8]">
          Scan to share your Google review
        </p>
        <p className="text-[11px] text-[#A89870] mt-0.5 font-serif">
          Takes less than a minute of your time
        </p>

        <div className="mt-4 pt-2.5 border-t border-[#D4AF37]/20 w-full text-[9px] font-serif text-[#A89870] uppercase tracking-widest">
          Prestige Hospitality Standee
        </div>
      </div>
    );
  }

  // 6. Emerald Botanica
  if (templateId === 'emerald-modern' || templateId === 'mint-modern') {
    return (
      <div
        className={`bg-[#F0FDF4] rounded-3xl overflow-hidden ${cardWidth} mx-auto text-center border-2 border-[#A7F3D0] shadow-md relative`}
      >
        <div className="bg-[#064E3B] px-5 py-3 text-white flex items-center justify-center space-x-3">
          <BusinessLogoBadge
            logoUrl={user.logoUrl}
            businessName={user.businessName}
            size="w-11 h-11"
            className="border-white/40 shadow-sm shrink-0"
            variant="emerald"
          />
          <div className="text-left overflow-hidden">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#6EE7B7]">
              Thank You For Visiting
            </p>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight break-words leading-tight">
              {user.businessName}
            </h2>
          </div>
        </div>

        <div className="p-6 sm:p-7 flex flex-col items-center">
          <p className="text-xs text-[#064E3B] font-medium mb-2 max-w-xs">
            If we earned your smile today, a Google review means the world to our team!
          </p>

          <div className="flex items-center justify-center space-x-1 mb-3.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <GoogleStar key={s} className="w-4 h-4" />
            ))}
          </div>

          <div className="mb-3.5">
            <QrViewfinder
              dataUrl={dataUrl}
              className="w-44 h-44 sm:w-48 sm:h-48"
              cornerColor="#10B981"
              scanLabel="POINT CAMERA HERE"
            />
          </div>

          <p className="text-xs font-bold text-[#064E3B]">Point your camera to leave a review</p>
          <p className="text-[11px] text-[#047857] mt-0.5">Quick, honest, and directly on Google</p>

          <div className="mt-4 pt-2.5 border-t border-[#D1FAE5] w-full flex items-center justify-between text-[9px] text-[#059669] font-medium uppercase tracking-wider">
            <span>Verified Green Business</span>
            <span>Google Reviews</span>
          </div>
        </div>
      </div>
    );
  }

  // 7. High-Impact POS Standee
  if (templateId === 'bold-counter') {
    return (
      <div
        className={`bg-white rounded-3xl overflow-hidden ${cardWidth} mx-auto text-center border-2 border-[#111827] shadow-xl relative`}
      >
        <div className="bg-[#1A73E8] px-5 py-3 text-white flex items-center justify-center space-x-3">
          <BusinessLogoBadge
            logoUrl={user.logoUrl}
            businessName={user.businessName}
            size="w-11 h-11"
            className="border-white/40 shadow-sm shrink-0"
            variant="light"
          />
          <div className="text-left overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/80">
              RATE YOUR EXPERIENCE
            </p>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight break-words leading-tight">
              {user.businessName}
            </h2>
          </div>
        </div>

        <div className="p-6 sm:p-7 flex flex-col items-center">
          <div className="inline-block bg-[#111827] text-white px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-2">
            ★ ★ ★ ★ ★ 5 STARS
          </div>

          <p className="text-xs font-bold text-[#5F6368] mb-3">
            Takes only 15 seconds at the counter
          </p>

          <div className="mb-3.5">
            <QrViewfinder
              dataUrl={dataUrl}
              className="w-44 h-44 sm:w-48 sm:h-48"
              cornerColor="#111827"
              scanLabel="OPEN CAMERA TO SCAN"
            />
          </div>

          <p className="text-sm font-black text-[#111827]">Scan to copy review straight to Google!</p>
          <p className="text-[11px] text-[#5F6368] mt-0.5">
            Thank you for supporting our local business!
          </p>

          <div className="mt-4 pt-2.5 border-t border-[#F1F3F4] w-full text-[10px] font-mono text-[#9AA0A6] uppercase">
            Point of Sale Counter Stand
          </div>
        </div>
      </div>
    );
  }

  // 8. Foldable A-Frame Table Tent
  if (templateId === 'table-tent-fold') {
    return (
      <div
        className={`bg-white rounded-2xl overflow-hidden ${cardWidth} mx-auto text-center border-2 border-[#DADCE0] shadow-md relative`}
      >
        {/* Panel 1: Top Face (Side A) */}
        <div className="p-4 sm:p-5 bg-[#F8F9FA] flex flex-col items-center border-b border-[#E8EAED]">
          <BusinessLogoBadge
            logoUrl={user.logoUrl}
            businessName={user.businessName}
            size="w-12 h-12"
            className="mb-1.5"
            variant="light"
          />
          <div className="flex items-center space-x-1.5 mb-1">
            <GoogleG className="w-4 h-4" />
            <GoogleWordmark className="text-sm" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#202124] max-w-full px-2 break-words leading-tight">
            {user.businessName}
          </h3>
          <p className="text-[11px] text-[#5F6368] mt-0.5">
            Thank you for dining / visiting with us today!
          </p>
          <div className="flex items-center space-x-1 mt-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <GoogleStar key={s} className="w-3.5 h-3.5" />
            ))}
          </div>
        </div>

        {/* Center Fold Line with scissor / fold guide */}
        <div className="py-2 px-3 bg-white border-y-2 border-dashed border-[#BDC1C6] flex items-center justify-between text-[9px] font-mono font-bold text-[#5F6368] uppercase tracking-wider">
          <span>✂ FOLD HERE</span>
          <span>A-FRAME TABLE TENT</span>
          <span>FOLD HERE ✂</span>
        </div>

        {/* Panel 2: Bottom Face (Side B with QR code) */}
        <div className="p-4 sm:p-5 flex flex-col items-center">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-xs font-bold mb-2.5">
            <span>Rate Us On Google</span>
          </div>

          <div className="mb-2.5">
            <QrViewfinder
              dataUrl={dataUrl}
              className="w-40 h-40"
              cornerColor="#1A73E8"
              scanLabel="SCAN TO LEAVE REVIEW"
            />
          </div>

          <p className="text-xs font-bold text-[#202124]">Point phone camera at this QR code</p>
          <p className="text-[10px] text-[#5F6368] mt-0.5">
            Self-standing tent card • Place on dining tables
          </p>
        </div>
      </div>
    );
  }

  // Fallback to Google Official
  return (
    <DisplayCard
      templateId="google-official"
      user={user}
      dataUrl={dataUrl}
      cardSize={cardSize}
    />
  );
}

function TemplateModal({ isOpen, onClose, activeId, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = ['All', 'Official Google', 'Dark & Luxury', 'Retail & Hospitality'];
  const filteredTemplates =
    selectedCategory === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  const currentTemplate = TEMPLATES.find((t) => t.id === activeId) || TEMPLATES[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-[#dadce0] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-[#f1f3f4] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3
                  id="template-modal-title"
                  className="text-base sm:text-lg font-bold text-[#202124]"
                >
                  Choose Display Template
                </h3>
                <span className="text-[11px] font-semibold text-[#1e8e3e] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                  8 Styles
                </span>
              </div>
              <p className="text-xs text-[#5f6368]">
                Select a physical standee style. Color palettes and detailed design specs below.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-5 py-2.5 bg-[#f8f9fa] border-b border-[#f1f3f4] flex items-center space-x-1.5 overflow-x-auto shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#1a73e8] text-white shadow-2xs'
                  : 'bg-white text-[#5f6368] hover:text-[#202124] border border-[#dadce0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Modal Body: Templates List without images, purely typography, details, and color palettes */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {filteredTemplates.map((template) => {
            const isSelected = template.id === activeId;
            return (
              <div
                key={template.id}
                onClick={() => onSelect(template.id)}
                className={`cursor-pointer rounded-2xl p-4 sm:p-4.5 transition-all border text-left ${
                  isSelected
                    ? 'border-[#1a73e8] bg-[#f8fafd] ring-2 ring-[#1a73e8]/20 shadow-xs'
                    : 'border-[#dadce0] bg-white hover:border-[#1a73e8]/50 hover:bg-[#fafbfc]'
                }`}
              >
                {/* Top Row: Name, Tag & Radio */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 className="text-sm sm:text-base font-bold text-[#202124]">
                        {template.name}
                      </h4>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f1f3f4] text-[#5f6368]">
                        {template.tag}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#1e8e3e] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    {/* Details below name */}
                    <p className="text-xs text-[#5f6368] leading-relaxed mt-1.5">
                      {template.details}
                    </p>
                  </div>

                  {/* Radio indicator */}
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[#1a73e8] bg-[#1a73e8]'
                          : 'border-[#dadce0] bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>

                {/* Colors Used Section */}
                <div className="mt-3.5 pt-3 border-t border-[#f1f3f4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#3c4043]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]" />
                    <span>Colors Used:</span>
                  </div>

                  <div className="flex items-center flex-wrap gap-1.5">
                    {template.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center space-x-1.5 px-2 py-1 rounded-md bg-[#f8f9fa] border border-[#e8eaed] text-[11px] text-[#3c4043]"
                        title={`${color.name} (${color.hex})`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full shrink-0 shadow-2xs ${
                            color.border ? 'border border-[#dadce0]' : ''
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="font-medium text-[10.5px]">{color.name}</span>
                        <span className="font-mono text-[9.5px] text-[#70757a] uppercase">
                          {color.hex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-[#f8f9fa] border-t border-[#dadce0] flex items-center justify-between shrink-0">
          <p className="text-xs text-[#5f6368]">
            Selected: <strong className="text-[#202124]">{currentTemplate.name}</strong>
          </p>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl transition-colors shadow-2xs"
          >
            Apply &amp; Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QRCodeClient({ user }) {
  const { showToast } = useToast();
  const [dataUrl, setDataUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [copied, setCopied] = useState(false);
  const [templateId, setTemplateId] = useState('google-official');
  const cardSize = 'a4';
  const showCropMarks = false;
  const [downloadingStand, setDownloadingStand] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reviewUrl, setReviewUrl] = useState(`/r/${user.slug}`);
  const printCardRef = useRef(null);

  useEffect(() => {
    setReviewUrl(`${window.location.origin}/r/${user.slug}`);
    try {
      const saved = window.localStorage.getItem('rankaro-qr-template');
      if (saved && TEMPLATES.some((t) => t.id === saved)) {
        setTemplateId(saved);
      } else {
        setTemplateId('google-official');
      }
    } catch {
      /* ignore */
    }
  }, [user.slug]);

  useEffect(() => {
    QRCode.toDataURL(reviewUrl, {
      width: 1000,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#202124',
        light: '#ffffff',
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));

    QRCode.toString(reviewUrl, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#202124',
        light: '#ffffff',
      },
    })
      .then((svg) => setSvgString(svg))
      .catch((err) => console.error('SVG QR error:', err));
  }, [reviewUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    showToast('Review link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `rankaro-${user.slug}-qrcode.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('High-resolution QR code PNG downloaded!', 'success');
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rankaro-${user.slug}-qrcode.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Vector QR code SVG downloaded!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadStand = async () => {
    if (!printCardRef.current) return;
    setDownloadingStand(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(printCardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `rankaro-${user.slug}-a4-qr-stand.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('A4 QR Code Stand downloaded successfully!', 'success');
    } catch (err) {
      console.error('Failed to download stand image:', err);
      showToast('Failed to generate stand image. Please use Print Stand instead.', 'error');
    } finally {
      setDownloadingStand(false);
    }
  };

  const handleSelectTemplate = (id) => {
    setTemplateId(id);
    try {
      window.localStorage.setItem('rankaro-qr-template', id);
    } catch {
      /* ignore */
    }
    const picked = TEMPLATES.find((t) => t.id === id);
    showToast(`${picked?.name || 'Template'} selected`, 'success');
  };

  const activeTemplate =
    TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-[#202124]">
          Downloadable QR Code &amp; Counter Displays
        </h2>
        <p className="text-xs text-[#5f6368] mt-1">
          Provide your customers with an instant scan target that launches your personalized Rankaro review assistant on any smartphone camera.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Code Visual & Downloads */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-[#dadce0] google-card-shadow flex flex-col items-center text-center">
            <span className="text-xs font-semibold text-[#5f6368] uppercase tracking-wider mb-4">
              Scannable QR Code
            </span>

            <div className="p-4 bg-white rounded-2xl border-2 border-[#e8eaed] shadow-xs mb-4">
              {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dataUrl}
                  alt={`QR code for ${user.businessName}`}
                  className="w-56 h-56 object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center bg-[#f8f9fa] text-xs text-[#70757a]">
                  Generating QR code...
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 mb-1 max-w-xs">
              <BusinessLogoBadge
                logoUrl={user.logoUrl}
                businessName={user.businessName}
                size="w-7 h-7"
                className="rounded-lg"
              />
              <p className="text-xs text-[#202124] font-bold break-words leading-tight">
                {user.businessName}
              </p>
            </div>
            <p className="text-[11px] font-mono text-[#5f6368] mb-4 truncate max-w-xs">
              {reviewUrl}
            </p>

            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={!dataUrl}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadSvg}
                disabled={!svgString}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 text-xs font-semibold text-[#3c4043] bg-white hover:bg-[#f8f9fa] border border-[#dadce0] rounded-xl transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#5f6368]" />
                <span>Vector SVG</span>
              </button>
            </div>

            <div className="w-full pt-3 mt-4 border-t border-[#f1f3f4] flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center space-x-1 text-xs text-[#1a73e8] hover:underline font-medium"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#1e8e3e]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
              </button>

              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-[#5f6368] hover:text-[#202124]"
              >
                <span>Open Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#e8eaed] text-xs text-[#5f6368] space-y-2">
            <div className="flex items-center space-x-2 text-[#202124] font-semibold">
              <Info className="w-4 h-4 text-[#1a73e8]" />
              <span>Where to place your QR code</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#5f6368]">
              <li>Front desk / reception checkout counter</li>
              <li>Dining table tents or receipt bill presentation booklets</li>
              <li>Business cards, appointment reminders, and work order invoices</li>
              <li>Follow-up thank you emails or SMS texts</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Printable Table Tent / Counter Display Stand */}
        <div className="lg:col-span-7 space-y-4 min-w-0">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#dadce0] google-card-shadow min-w-0">
            {/* Header with Title and Description */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-[#202124]">
                  Printable Table Tent / Counter Stand (A4 Size)
                </h3>
                <span className="text-[10px] font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.5 rounded-full shrink-0">
                  Standard A4 Size (210 × 297 mm)
                </span>
              </div>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Engineered for physical A4 counter stands, desktop acrylic holders, and retail display framing.
              </p>
            </div>

            {/* Printable Mount Point */}
            <div
              id="print-mount-point"
              className="relative flex flex-col items-center py-2"
            >
              {/* Print Cut Guide Header (only visible on print sheet) */}
              <div className="hidden print:flex items-center justify-between w-full mb-3 text-[9px] font-mono text-slate-400 border-b border-dashed border-slate-300 pb-1">
                <span>
                  STANDARD A4 COUNTER STAND • 210 × 297 MM
                </span>
                <span>300 DPI OPTIMAL PRINT • RANKARO DISPLAY KIT</span>
              </div>

              <div
                ref={printCardRef}
                id="printable-display-card"
                className="relative print-card-a4 w-full flex justify-center"
              >
                {/* Physical Scissor Corner Markers (for printing) */}
                {showCropMarks && (
                  <>
                    <div className="absolute -top-3 -left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-slate-400 print:block hidden" />
                    <div className="absolute -top-3 -right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-slate-400 print:block hidden" />
                    <div className="absolute -bottom-3 -left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-slate-400 print:block hidden" />
                    <div className="absolute -bottom-3 -right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-slate-400 print:block hidden" />
                  </>
                )}

                <DisplayCard
                  templateId={templateId}
                  user={user}
                  dataUrl={dataUrl}
                  cardSize="a4"
                />
              </div>
            </div>

            {/* Change Template, Download Stand & Print Stand Actions */}
            <div className="mt-5 flex flex-col items-center space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadStand}
                  disabled={downloadingStand}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {downloadingStand ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating A4 Stand...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download A4 Stand (PNG)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#1e8e3e] hover:bg-[#188038] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Stand (A4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 text-xs font-semibold text-[#1a73e8] bg-white hover:bg-[#f8f9fa] border border-[#dadce0] rounded-xl shadow-2xs transition-colors cursor-pointer"
                  aria-expanded={pickerOpen}
                >
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  <span>Change Template</span>
                  <span className="ml-1 px-1.5 py-0.5 rounded-md bg-[#e8f0fe] text-[10px]">
                    {activeTemplate.name}
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-[#5f6368] flex items-center space-x-1">
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ✓ Standard A4 Print Ready (210 × 297 mm)
                </span>
                <span className="text-[#dadce0]">•</span>
                <span>Active:</span>
                <span className="font-bold text-[#202124]">
                  {activeTemplate.name}
                </span>
                <span className="text-[#dadce0]">•</span>
                <span className="text-[#1a73e8] font-medium">
                  {activeTemplate.tag}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Overlay Modal */}
      <TemplateModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        activeId={templateId}
        onSelect={handleSelectTemplate}
      />

      {/* Print Specific CSS to guarantee 300 DPI razor-sharp standard dimensions */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          html,
          body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          #print-mount-point,
          #print-mount-point * {
            visibility: visible !important;
          }
          #print-mount-point {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-card-a4 {
            width: 190mm !important;
            max-width: 190mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
          }
          .print-card-4x6 {
            width: 4in !important;
            max-width: 4in !important;
            margin: 0 auto !important;
            box-shadow: none !important;
          }
          .print-card-5x7 {
            width: 5in !important;
            max-width: 5in !important;
            margin: 0 auto !important;
            box-shadow: none !important;
          }
          .print-card-fold {
            width: 4.2in !important;
            max-width: 4.2in !important;
            margin: 0 auto !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
