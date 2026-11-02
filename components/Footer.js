import { Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] border-t border-[#e8eaed] text-[#5f6368] text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-7 h-7 rounded bg-[#1a73e8] text-white font-bold text-sm">
                R
              </div>
              <span className="text-lg font-bold text-[#202124]">Rankaro</span>
            </div>
            <p className="text-[#5f6368] max-w-sm text-sm leading-relaxed">
              Empowering local businesses and service professionals to capture genuine, rich, and detailed customer reviews on Google with friction-free QR codes and assisted drafting.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#1e8e3e] font-medium pt-1">
              <Shield className="w-4 h-4" />
              <span>100% Policy Compliant • No Fake Reviews • No Review Gating</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#202124] mb-3 text-xs uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#how-it-works" className="hover:text-[#1a73e8] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#features" className="hover:text-[#1a73e8] transition-colors">
                  Feature Highlights
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-[#1a73e8] transition-colors">
                  Create Business Account
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-[#1a73e8] transition-colors">
                  Owner Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#202124] mb-3 text-xs uppercase tracking-wider">
              Standards & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#ethics" className="hover:text-[#1a73e8] transition-colors">
                  Ethical Review Guidelines
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-[#1a73e8] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="/security" className="hover:text-[#1a73e8] transition-colors">
                  Data Security & Architecture
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#1a73e8] transition-colors">
                  Contact Support Desk
                </a>
              </li>
              <li className="text-xs text-[#70757a]">
                Privacy-first: Governed by Arventa Ventures (arventaventures.online).
              </li>
            </ul>
          </div>
        </div>

        {/* Google Independent Notice & Disclaimer */}
        <div className="pt-8 border-t border-[#dadce0] text-xs text-[#70757a] space-y-2">
          <p className="font-medium text-[#5f6368]">
            Disclaimer & Trademark Notice:
          </p>
          <p className="leading-relaxed">
            Google, Google Maps, and Google Business Profile are registered trademarks of Google LLC.
            Rankaro is an independent SaaS productivity tool created to assist businesses in collecting authentic feedback from their customers.
            Rankaro is not affiliated with, endorsed by, certified by, or sponsored by Google LLC or Alphabet Inc. All reviews are submitted directly by verified customers on Google&apos;s official review interfaces.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 text-xs text-[#9aa0a6]">
            <span>© {new Date().getFullYear()} RANKORA. A Product by Arventa Ventures. All rights reserved.</span>
            <span className="mt-2 sm:mt-0 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-[#fbbc04]" />
              <span>Built with precision for authentic customer reputation</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
