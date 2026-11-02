'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/navigation';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Layers,
  HelpCircle,
  FileText,
  Lock,
  Calculator,
  Compass,
  Star,
  QrCode,
  Award,
  BookOpen,
  PhoneCall,
  CheckCircle,
  BarChart3
} from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const productLinks = [
    { name: 'Platform Features', desc: 'All tools, AI engine & integrations', href: '/features', icon: Layers },
    { name: 'How It Works', desc: 'The 7-step frictionless customer journey', href: '/how-it-works', icon: Compass },
    { name: 'Industry Solutions', desc: 'Tailored playbooks for 8+ verticals', href: '/solutions', icon: Award },
    { name: 'Physical QR & NFC Guide', desc: 'Hardware, stands & countertop placement', href: '/qr-guide', icon: QrCode },
    { name: 'ROI Revenue Calculator', desc: 'Calculate review & revenue lift', href: '/roi-calculator', icon: Calculator },
    { name: 'Compare vs Competitors', desc: 'Rankaro vs Birdeye, Podium & others', href: '/compare', icon: BarChart3 },
  ];

  const companyLinks = [
    { name: 'About Rankaro', desc: 'Our mission, story & leadership', href: '/about', icon: Sparkles },
    { name: 'Customer Case Studies', desc: 'Real growth stories & metrics', href: '/case-studies', icon: Star },
    { name: 'Security & Trust Center', desc: 'SOC 2, encryption & architecture', href: '/security', icon: Lock },
    { name: 'Contact Sales & Support', desc: 'Direct desk, phone & global offices', href: '/contact', icon: PhoneCall },
  ];

  const resourceLinks = [
    { name: 'Knowledge Base & FAQ', desc: '25+ comprehensive answers', href: '/faq', icon: HelpCircle },
    { name: 'Local SEO Strategy Blog', desc: 'In-depth ranking & review guides', href: '/blog', icon: BookOpen },
    { name: 'Privacy Policy', desc: 'GDPR & CCPA compliant data handling', href: '/privacy', icon: ShieldCheck },
    { name: 'Terms of Service', desc: 'Master agreement & SLA terms', href: '/terms', icon: FileText },
    { name: 'GDPR Compliance Hub', desc: 'EU data rights, DPA & sub-processors', href: '/gdpr', icon: CheckCircle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-md shadow-blue-500/20 font-extrabold text-xl group-hover:scale-105 transition-transform">
              R
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Rankaro
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase -mt-1">
                Reputation OS
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav ref={dropdownRef} className="hidden lg:flex items-center space-x-1 text-sm font-medium text-slate-600">
            {/* Product Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'product' ? null : 'product')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors ${
                  activeDropdown === 'product' ? 'text-blue-600 bg-slate-50' : ''
                }`}
              >
                <span>Product</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'product' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'product' && (
                <div className="absolute top-full left-0 w-80 mt-2 p-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 rk-fade-up z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Core Platform
                  </div>
                  {productLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-blue-50/70 group transition-all"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500 leading-tight">
                            {item.desc}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Solutions link */}
            <a href="/solutions" className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors">
              Solutions
            </a>

            {/* Pricing link */}
            <a href="/pricing" className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors font-medium">
              Pricing
            </a>

            {/* Company Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'company' ? null : 'company')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors ${
                  activeDropdown === 'company' ? 'text-blue-600 bg-slate-50' : ''
                }`}
              >
                <span>Company</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'company' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'company' && (
                <div className="absolute top-full left-0 w-80 mt-2 p-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 rk-fade-up z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Our Organization
                  </div>
                  {companyLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-blue-50/70 group transition-all"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500 leading-tight">
                            {item.desc}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors ${
                  activeDropdown === 'resources' ? 'text-blue-600 bg-slate-50' : ''
                }`}
              >
                <span>Resources</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'resources' && (
                <div className="absolute top-full right-0 w-80 mt-2 p-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 rk-fade-up z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Knowledge & Trust
                  </div>
                  {resourceLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-blue-50/70 group transition-all"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500 leading-tight">
                            {item.desc}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Contact quick link */}
            <a href="/contact" className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {loading ? (
              <div className="w-24 h-9 bg-slate-100 animate-pulse rounded-full" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <a
                  href="/dashboard"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <a
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors"
                >
                  Sign in
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center space-x-1.5 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all rk-btn-shine"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            {!loading && user && (
              <a
                href="/dashboard"
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full"
              >
                Dashboard
              </a>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white max-h-[85vh] overflow-y-auto px-4 pt-3 pb-8 space-y-6">
          {/* Main Auth Buttons */}
          <div className="pt-2 pb-3 border-b border-slate-100 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between">
                <a
                  href="/dashboard"
                  className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm"
                >
                  Go to Dashboard
                </a>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2.5 text-rose-600 bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/login"
                  className="py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Sign in
                </a>
                <a
                  href="/register"
                  className="py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm"
                >
                  Get Started Free
                </a>
              </div>
            )}
          </div>

          {/* Product links */}
          <div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Platform & Features
            </div>
            <div className="grid grid-cols-1 gap-1">
              {productLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2.5 py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  <item.icon className="w-4 h-4 text-blue-600" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Pricing & Solutions */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Plans & Verticals
            </div>
            <div className="grid grid-cols-2 gap-1">
              <a
                href="/pricing"
                className="py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-blue-50"
              >
                Pricing Plans
              </a>
              <a
                href="/solutions"
                className="py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-blue-50"
              >
                Industry Solutions
              </a>
            </div>
          </div>

          {/* Company & Resources */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Company & Guides
            </div>
            <div className="grid grid-cols-1 gap-1">
              {companyLinks.concat(resourceLinks).map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2.5 py-1.5 px-3 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                >
                  <item.icon className="w-4 h-4 text-slate-500" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
