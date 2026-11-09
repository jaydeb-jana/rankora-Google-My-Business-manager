import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { getSiteUrl } from '@/lib/seoConfig';
import {
  QrCode,
  Smartphone,
  Printer,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
  MapPin,
  Download,
  Lightbulb,
  FileText,
  Eye,
  Check,
  Radio,
  Sliders,
  DollarSign
} from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'Countertop QR Code & NFC Stand Setup Guide',
  description:
    'Master the physical science of in-store Google review collection: countertop placement ergonomics, NFC tap cards, glare reduction, and printable acrylic templates.',
  keywords: [
    'google review qr code stand',
    'countertop qr code placement',
    'nfc review tap cards setup',
    'acrylic qr stand for business',
    'google review stand templates',
    'how to print review qr codes',
  ],
  alternates: {
    canonical: `${siteUrl}/qr-guide`,
  },
  openGraph: {
    title: 'Countertop QR Code & NFC Stand Setup Guide | Rankaro',
    description:
      'Master the physical science of in-store Google review collection: countertop placement ergonomics, NFC tap cards, glare reduction, and printable acrylic templates.',
    url: `${siteUrl}/qr-guide`,
    siteName: 'Rankaro',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Countertop QR and NFC Review Hardware Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Countertop QR Code & NFC Stand Setup Guide | Rankaro',
    description:
      'Master the physical science of in-store Google review collection: countertop placement ergonomics, NFC tap cards, glare reduction, and printable acrylic templates.',
    images: ['/logo.png'],
  },
};

const qrGuideSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': 'How to Deploy Countertop QR Displays for In-Store Google Reviews',
    'description': 'Best practices for physical QR and NFC hardware placement to achieve maximum customer scan rates.',
    'step': [
      {
        '@type': 'HowToStep',
        'position': 1,
        'name': 'Position Next to POS Payment Terminal',
        'text': 'Place a 4x6 inch matte acrylic stand within 8 to 12 inches of the chip reader at a 45-degree angle.'
      },
      {
        '@type': 'HowToStep',
        'position': 2,
        'name': 'Eliminate Overhead Glare',
        'text': 'Use matte finish acrylic or non-reflective cardstock to prevent overhead store lighting from causing specular glare.'
      },
      {
        '@type': 'HowToStep',
        'position': 3,
        'name': 'Equip Staff with 10-Second Prompt',
        'text': 'Train staff to use the compliant verbal cue: Tapping this lets you highlight your favorite service in 10 seconds.'
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
        'name': 'QR Guide',
        'item': `${siteUrl}/qr-guide`
      }
    ]
  }
];

export default function QrGuidePage() {
  const hotspots = [
    {
      title: 'Checkout Register & Payment Terminal Dwell Zone',
      rate: '34% Scan Rate (Highest Conversion)',
      why: 'While the customer’s credit card chip is reading or their receipt is printing, there is an unavoidable 5 to 10 second idle dwell time. Positioning a 4x6" matte acrylic stand directly adjacent to the payment terminal converts this dead time into authentic 5-star Google reviews.',
      ergonomics: 'Position display at a 45-degree angle facing the customer’s dominant right hand. Place within 8 to 12 inches of the chip reader.',
      tips: 'Keep counter clutter to an absolute minimum. Ensure store overhead lights do not produce specular glare across the QR code matrix.',
    },
    {
      title: 'Leather Check Presenter / Bill Folio Pocket',
      rate: '28% Scan Rate (Hospitality Benchmark)',
      why: 'For restaurants, cafes, and bars, the bill presentation is the definitive emotional moment of satisfaction. The meal was delicious, the server was warm, and the guest is feeling relaxed.',
      ergonomics: 'Insert a credit-card-sized laminated NFC/QR card right above the credit card pocket. Guests tap their phone before signing.',
      tips: 'Ensure waitstaff mention: “If you’d like to highlight your favorite dish, tapping this card takes just 10 seconds!”',
    },
    {
      title: 'Clinic Reception Desk & Appointment Scheduling Counter',
      rate: '22% Scan Rate (Medical & Dental Standard)',
      why: 'For dental clinics, med spas, and salon studios, patients pause at the front desk to book their next appointment or settle copays.',
      ergonomics: 'Place on the front desk partition at eye level for seated or standing patients.',
      tips: 'Equip receptionists with our 10-second non-incentive verbal script: "Tapping this helps our small team immensely!"',
    },
    {
      title: 'Vehicle Steering Wheel & Service Invoices',
      rate: '25% Scan Rate (Trades & Auto Repair)',
      why: 'For auto mechanics, roofers, and plumbers, handing over keys or reviewing completed repair line items is the peak moment of trust.',
      ergonomics: 'Print our vector QR code directly onto the printed invoice footer and hang a branded mirror tag on the vehicle rearview mirror.',
      tips: 'Technicians should review the completed work line-by-line before pointing to the invoice footer code.',
    },
    {
      title: 'Boutique Shopping Bags & Packaging Unboxing Inserts',
      rate: '14% Scan Rate (Retail Footwear & Gifts)',
      why: 'For boutique retail and takeaway dining, unboxing at home provides a second touchpoint for customers who were in a hurry at the store.',
      ergonomics: 'Place an embossed 4x4" postcard insert at the very top of the shopping bag tissue paper.',
      tips: 'Include a handwritten note: “Thank you for supporting our local shop! Scan here to share your favorite find.”',
    },
  ];

  const materials = [
    {
      name: 'Matte Cast Acrylic Displays',
      bestFor: 'Medical Clinics, Salons & Law Offices',
      pros: 'Glare-resistant under harsh LED lighting; premium, hygienic modern appearance; easy to sanitize.',
      durability: '5+ Years',
      cost: '$8 - $14 per stand',
    },
    {
      name: 'Engraved Hardwood Blocks with NFC',
      bestFor: 'Artisan Cafes, Fine Dining & Luxury Spas',
      pros: 'Warm, organic hospitality feel; hides embedded NTAG213 NFC chip underneath genuine walnut or oak.',
      durability: '3+ Years',
      cost: '$12 - $18 per puck',
    },
    {
      name: 'Weatherproof Matte Vinyl Decals',
      bestFor: 'Auto Repair, Food Trucks & Storefront Windows',
      pros: 'UV-resistant, waterproof, scratch-proof adhesive that sticks securely to glass, metal, and registers.',
      durability: '2+ Years',
      cost: '$2 - $4 per decal',
    },
    {
      name: 'Heavyweight Laminated Cardstock',
      bestFor: 'Pop-ups, Farmers Markets & Events',
      pros: 'Lowest cost; instantly printable on standard office laser printers; folds easily into self-standing tents.',
      durability: '6 Months',
      cost: '&lt; $0.50 per sheet',
    },
  ];

  const templates = [
    { size: '4" x 6" Acrylic Countertop Card', format: 'Vector PDF / SVG', desc: 'Standard horizontal display for checkout registers.' },
    { size: '5" x 7" Vertical Reception Display', format: 'Vector PDF / SVG', desc: 'Larger vertical format ideal for waiting rooms.' },
    { size: '3.5" x 2" Wallet / Check Insert Card', format: 'Vector PDF / SVG', desc: 'Sized to fit standard leather restaurant bill folios.' },
    { size: 'Square 1000px Digital POS Receipt Code', format: '300 DPI PNG', desc: 'For embedding onto Clover, Square, and Toast digital receipts.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={qrGuideSchemas} />
      <Navbar />

      <main className="flex-1 space-y-24 pb-28">
        {/* HERO */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <QrCode className="w-4 h-4" />
            <span>Storefront Placement Masterclass</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            The Definitive Countertop{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              QR & NFC Playbook
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A poorly positioned QR code gets ignored. A strategically placed, glare-free acrylic stand captures 34% of checkout patrons. Here is the field-tested guide to maximizing physical scan conversion.
          </p>
        </section>

        {/* 5 PLACEMENT ZONES WITH ERGONOMIC SIGHTLINES */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Field-Tested Conversion Data
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              The 5 Golden Physical Placement Hotspots
            </h2>
          </div>

          <div className="space-y-8">
            {hotspots.map((spot, idx) => (
              <div
                key={spot.title}
                className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      Spot #{idx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{spot.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                    {spot.rate}
                  </span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed">{spot.why}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="font-bold text-blue-700 uppercase tracking-wider flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Optical Sightline & Distance:</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed">{spot.ergonomics}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="font-bold text-amber-700 uppercase tracking-wider flex items-center space-x-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Pro Placement Tip:</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed">{spot.tips}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NFC VS QR CODE TECHNICAL SHOWDOWN */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Contactless Hardware Physics
            </span>
            <h2 className="text-3xl font-black">
              NFC Tap Cards vs QR Codes: The Definitive Analysis
            </h2>
            <div className="text-slate-300 text-sm leading-relaxed space-y-4">
              <p>
                <strong>QR Codes (Optical Scanning):</strong> Universally compatible across 100% of smartphones. However, it introduces minor optical friction: the customer must open their camera app, focus, and tap the notification banner.
              </p>
              <p>
                <strong>NFC (Near Field Communication):</strong> Zero camera opening required! The customer simply taps their iPhone or Android against the puck, and the review page immediately pops open via native OS prompt.
              </p>
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-blue-300 font-semibold space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>The Hybrid Recommendation:</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  Never force patrons to use one single modality. The highest-performing businesses deploy hybrid acrylic stands that feature a crisp vector QR code with an embedded NFC chip right behind the target icon. Customers under 35 instinctively tap via NFC, while mature patrons point their camera.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MATERIAL SELECTION MATRIX */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Physical Fabrication
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Choosing the Right Hardware Material
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {materials.map((mat) => (
              <div
                key={mat.name}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-1">{mat.name}</h3>
                  <div className="text-xs font-semibold text-blue-600 mb-3">{mat.bestFor}</div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{mat.pros}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Estimated Cost:</span>
                  <span className="font-bold text-slate-800">{mat.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRINT TEMPLATES CHECKLIST */}
        <section id="print-templates" className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-24">
          <div className="p-8 sm:p-10 rounded-3xl bg-blue-50/70 border border-blue-200/90 space-y-6">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <Download className="w-4 h-4" />
              <span>Free Print-Ready Assets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Download Pre-Formatted Display Templates
            </h2>
            <p className="text-sm text-slate-700">
              Available instantly inside your free Rankaro merchant dashboard formatted with your custom logo and brand colors:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {templates.map((tmpl) => (
                <div key={tmpl.size} className="p-4 rounded-2xl bg-white border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{tmpl.size}</span>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {tmpl.format}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{tmpl.desc}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center sm:text-left">
              <a
                href="/register"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all rk-btn-shine"
              >
                <span>Access Free Templates in Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
