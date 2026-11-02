import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Heart,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      {/* Top Pre-Footer Call to Action Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Ready to transform your Google review velocity?</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Start collecting 5-star reviews in under 2 minutes
            </h3>
            <p className="text-slate-400 max-w-xl text-sm sm:text-base">
              Join over 12,400+ local businesses worldwide. 100% Google policy compliant, no credit card required.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all rk-btn-shine"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/roi-calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
            >
              <span>Calculate Your ROI</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main 5-Column Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <a href="/" className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg shadow-md shadow-blue-500/20">
                R
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Rankaro
              </span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The ethical reputation operating system for brick-and-mortar storefronts, healthcare practices, and service professionals worldwide.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Global Headquarters: San Francisco & Kolkata</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:support@arventaventures.online" className="hover:text-blue-400 transition-colors">
                  support@arventaventures.online
                </a>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>100% Google Review Policy & FTC Compliant</span>
              </div>
            </div>
          </div>

          {/* Product Col */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/features" className="hover:text-white transition-colors">Platform Features</a></li>
              <li><a href="/how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="/solutions" className="hover:text-white transition-colors">Industry Solutions</a></li>
              <li><a href="/qr-guide" className="hover:text-white transition-colors">QR & NFC Hardware</a></li>
              <li><a href="/roi-calculator" className="hover:text-white transition-colors">ROI Calculator</a></li>
              <li><a href="/compare" className="hover:text-white transition-colors">Compare Platforms</a></li>
            </ul>
          </div>

          {/* Pricing & Verticals Col */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Plans & Growth
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/pricing" className="hover:text-white transition-colors font-medium text-blue-400">Plans & Pricing</a></li>
              <li><a href="/case-studies" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="/solutions#healthcare" className="hover:text-white transition-colors">For Clinics & Dentists</a></li>
              <li><a href="/solutions#restaurants" className="hover:text-white transition-colors">For Restaurants</a></li>
              <li><a href="/solutions#home-services" className="hover:text-white transition-colors">For Contractors</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Create Free Account</a></li>
            </ul>
          </div>

          {/* Resources & Guides Col */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/faq" className="hover:text-white transition-colors">Knowledge Base / FAQ</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Local SEO Blog</a></li>
              <li><a href="/qr-guide#print-templates" className="hover:text-white transition-colors">Print Templates</a></li>
              <li><a href="/blog#anti-gating" className="hover:text-white transition-colors">Anti-Gating Policy</a></li>
              <li><a href="/how-it-works#staff-scripts" className="hover:text-white transition-colors">Staff Scripts</a></li>
            </ul>
          </div>

          {/* Legal & Governance Col */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/about" className="hover:text-white transition-colors">About Rankaro</a></li>
              <li><a href="/security" className="hover:text-white transition-colors">Security Architecture</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/gdpr" className="hover:text-white transition-colors">GDPR & DPA Portal</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Google Trademark Notice */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-3 leading-relaxed">
          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-medium">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Independent SaaS Engine</span>
            </span>
            <span className="text-slate-700">•</span>
            <span>Zero Review Gating</span>
            <span className="text-slate-700">•</span>
            <span>No Automated Fake Submissions</span>
            <span className="text-slate-700">•</span>
            <span>Customer-Owned Direct Google Submissions</span>
          </div>
          <p>
            <strong className="text-slate-400">Trademark & Legal Disclaimer:</strong> Google, Google Maps, and Google Business Profile are registered trademarks of Google LLC.
            Rankaro is an independent productivity suite created by Arventa Ventures to facilitate ethical, frictionless communication between physical storefronts and their customers.
            Rankaro is not affiliated with, endorsed by, certified by, or sponsored by Google LLC or Alphabet Inc.
            All reviews generated through this tool are submitted directly and voluntarily by customers via Google&apos;s official review interfaces.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-3 border-t border-slate-800/60">
            <div>
              © {currentYear} RANKARO. A Product by <span className="text-slate-300 font-semibold">Arventa Ventures</span>. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="/security" className="hover:text-slate-300 transition-colors">Security</a>
              <a href="/contact" className="hover:text-slate-300 transition-colors">Support Desk</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
