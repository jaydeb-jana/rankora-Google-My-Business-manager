import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  FileText
} from 'lucide-react';

export const metadata = {
  title: 'The Countertop QR & NFC Setup Playbook | Rankaro',
  description:
    'Master the physical art of in-store review generation: optimal countertop placement spots, NFC tap hardware, material selection, and printable templates.',
};

export default function QrGuidePage() {
  const hotspots = [
    {
      title: 'Checkout Register & Payment Terminal',
      rate: '34% Scan Rate',
      why: 'While the customer’s credit card chip is reading or their receipt is printing, there is an unavoidable 5 to 10 second idle dwell time. Positioning a 4x6" matte acrylic stand directly adjacent to the payment terminal converts this dead time into authentic 5-star Google reviews.',
      tips: 'Position stand at a 45-degree angle facing the customer’s dominant hand. Keep counter clutter to an absolute minimum.',
    },
    {
      title: 'Leather Check Presenter / Bill Folio',
      rate: '28% Scan Rate',
      why: 'For restaurants, cafes, and bars, the bill presentation is the definitive moment of satisfaction. The meal was delicious, the server was warm, and the guest is feeling relaxed.',
      tips: 'Insert a credit-card-sized laminated NFC/QR card right above the credit card pocket. Guests tap their phone before signing.',
    },
    {
      title: 'Reception Desk & Exit Lounge',
      rate: '22% Scan Rate',
      why: 'For dental clinics, med spas, and salon studios, patients pause at the front desk to book their next appointment or settle copays.',
      tips: 'Equip receptionists with our 10-second non-incentive verbal script: "Tapping this helps our small team immensely!"',
    },
    {
      title: 'Service Invoices & Vehicle Dashboards',
      rate: '25% Scan Rate',
      why: 'For auto mechanics, roofers, and plumbers, handing over keys or reviewing completed repair line items is the peak moment of trust.',
      tips: 'Print our vector QR code directly onto the printed invoice footer and hang a branded mirror tag on the vehicle rearview mirror.',
    },
    {
      title: 'Packaging Inserts & Shopping Bags',
      rate: '14% Scan Rate',
      why: 'For boutique retail and takeaway dining, unboxing at home provides a second touchpoint for customers who were in a hurry at the store.',
      tips: 'Include a personalized postcard with the QR code and a handwritten "Thank you for supporting local business!" note.',
    },
  ];

  const materials = [
    {
      name: 'Matte Cast Acrylic Displays',
      bestFor: 'Medical Clinics, Salons & Law Offices',
      pros: 'Glare-resistant under harsh LED lighting; premium, hygienic modern appearance; easy to sanitize.',
      durability: '5+ Years',
    },
    {
      name: 'Engraved Hardwood Blocks with NFC',
      bestFor: 'Artisan Cafes, Fine Dining & Luxury Spas',
      pros: 'Warm, organic hospitality feel; hides embedded NTAG213 NFC chip underneath genuine walnut or oak.',
      durability: '3+ Years',
    },
    {
      name: 'Weatherproof Matte Vinyl Decals',
      bestFor: 'Auto Repair, Food Trucks & Storefront Windows',
      pros: 'UV-resistant, waterproof, scratch-proof adhesive that sticks securely to glass, metal, and registers.',
      durability: '2+ Years',
    },
    {
      name: 'Heavyweight Laminated Cardstock',
      bestFor: 'Pop-ups, Farmers Markets & Events',
      pros: 'Lowest cost; instantly printable on standard office laser printers; folds easily into self-standing tents.',
      durability: '6 Months',
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
      <Navbar />

      <main className="flex-1 space-y-24 pb-24">
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
            A poorly placed QR code gets ignored. A strategically placed, glare-free acrylic stand captures 34% of checkout patrons. Here is the field-tested guide to maximizing physical scan conversion.
          </p>
        </section>

        {/* 5 PLACEMENT ZONES */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Field-Tested Conversion Data
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              The 5 Golden Physical Placement Hotspots
            </h2>
          </div>

          <div className="space-y-6">
            {hotspots.map((spot, idx) => (
              <div
                key={spot.title}
                className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      Spot #{idx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{spot.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                    {spot.rate}
                  </span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">{spot.why}</p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Pro Placement Tip:</strong> {spot.tips}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NFC VS QR CODE ANALYSIS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Technology Showdown
            </span>
            <h2 className="text-3xl font-black">
              NFC Tap Cards vs QR Codes: The Verdict
            </h2>
            <div className="text-slate-300 text-sm leading-relaxed space-y-4">
              <p>
                <strong>QR Codes:</strong> Universally compatible with every smartphone produced in the last 10 years. Require the customer to open their camera app and point.
              </p>
              <p>
                <strong>NFC (Near Field Communication):</strong> Zero camera opening required! The customer simply taps their iPhone or Android against the puck, and the review page immediately pops open via native OS prompt.
              </p>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-blue-300 font-semibold">
                🏆 <strong>The Winning Recommendation:</strong> Deploy hybrid hardware. Our downloadable print files feature both a high-contrast vector QR code for scanning and an internal NFC chip payload so customers can interact using whichever method they prefer.
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
                  <p className="text-xs text-slate-600 leading-relaxed">{mat.pros}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Durability:</span>
                  <span className="font-bold text-slate-800">{mat.durability}</span>
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
