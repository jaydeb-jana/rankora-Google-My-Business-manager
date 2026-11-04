'use client';
import { useState, useEffect, useRef } from 'react';
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
  BarChart3,
  MessageCircle,
  ChevronRight,
  Building,
  Mail,
  ExternalLink,
  SearchCheck,
} from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSection, setMobileSection] = useState('all'); // 'all' or collapsible
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const productLinks = [
    { name: 'Google Profile Audit', desc: 'Instant Google Business health & SEO audit', href: '/dashboard/audit', icon: SearchCheck },
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
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 group">
            <img
              src="/logo.png"
              alt="RANKORA"
              className="h-9 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
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
            <a href="/pricing" className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors">
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
                    Our Company
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
                  href={user.isAdmin ? "/admin" : "/dashboard"}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{user.isAdmin ? "Admin Center" : "Dashboard"}</span>
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
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            {!loading && user && (
              <a
                href={user.isAdmin ? "/admin" : "/dashboard"}
                className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 rounded-full border border-blue-200/80 shadow-2xs"
              >
                {user.isAdmin ? "Admin" : "Dashboard"}
              </a>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* ===================== WORLD-CLASS MOBILE SLIDE-OVER DRAWER ===================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container (Sheet sliding in smoothly) */}
          <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white flex flex-col shadow-2xl z-50 overflow-hidden animate-in slide-in-from-right duration-300">
            {/* 1. Drawer Top Bar */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 bg-white/95 shrink-0">
              <a
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2"
              >
                <img
                  src="/logo.png"
                  alt="RANKORA"
                  className="h-8 w-auto object-contain"
                />
              </a>

              <div className="flex items-center space-x-2">
                {!loading && user && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                    {user.isAdmin ? "Admin" : "Active"}
                  </span>
                )}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Scrollable Body with smooth hidden scrollbar */}
            <div className="flex-1 overflow-y-auto scrollbar-none px-5 py-4 space-y-6">
              {/* User Authentication Card */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 shadow-2xs">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {(user.ownerName || user.businessName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm truncate max-w-[200px]">
                            {user.businessName || user.ownerName || 'Merchant'}
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-1">
                      <a
                        href={user.isAdmin ? "/admin" : "/dashboard"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="col-span-3 py-2.5 px-4 text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{user.isAdmin ? "Open Admin Center" : "Open Dashboard"}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </a>
                      <button
                        onClick={handleLogout}
                        title="Sign Out"
                        className="col-span-1 py-2.5 px-3 text-center text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200/80 flex items-center justify-center transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-slate-600">
                      Welcome to Rankaro Reputation OS
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 text-center text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs"
                      >
                        Sign in
                      </a>
                      <a
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 text-center text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm flex items-center justify-center space-x-1 transition-all"
                      >
                        <span>Get Started Free</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Audit Spotlight Card */}
              <a
                href="/dashboard/audit"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 shadow-2xs hover:border-blue-400 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white group-hover:scale-105 transition-transform shadow-xs">
                    <SearchCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>Google Profile Audit</span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-600 text-white">NEW</span>
                    </div>
                    <div className="text-[11px] text-slate-600">Inspect review health score &amp; ranking issues</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </a>

              {/* Quick Navigation Pills: Pricing & Solutions */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-400 hover:bg-blue-50/40 transition-all group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Pricing Plans</div>
                      <div className="text-[10px] text-slate-500">From ₹0 / mo</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </a>

                <a
                  href="/solutions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-400 hover:bg-blue-50/40 transition-all group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Solutions</div>
                      <div className="text-[10px] text-slate-500">8+ Verticals</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>

              {/* SECTION 1: Core Platform */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <span>Core Platform</span>
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    6 Features
                  </span>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-1.5 space-y-1">
                  {productLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white text-slate-700 hover:text-blue-600 hover:shadow-2xs transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-white border border-slate-200/70 text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:bg-blue-50/50 transition-colors shadow-2xs">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: Company & Trust */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <span>Company & Trust</span>
                  <span className="text-[10px] font-medium text-slate-500">Arventa Ventures</span>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-1.5 space-y-1">
                  {companyLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white text-slate-700 hover:text-blue-600 hover:shadow-2xs transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-white border border-slate-200/70 text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:bg-blue-50/50 transition-colors shadow-2xs">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: Knowledge Base & Guides */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <span>Knowledge & Legal</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <a
                    href="/faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                    <span>Knowledge FAQ</span>
                  </a>
                  <a
                    href="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>SEO Blog</span>
                  </a>
                  <a
                    href="/security"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Security Portal</span>
                  </a>
                  <a
                    href="/gdpr"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>GDPR & DPA</span>
                  </a>
                </div>
              </div>

              {/* Direct WhatsApp & Priority Help Card */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border border-emerald-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-sm">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Direct WhatsApp Help</div>
                      <div className="text-[10px] text-emerald-700 font-medium">9:00 AM – 9:00 PM IST</div>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <a
                  href="https://wa.me/917872490719?text=Hello%20Rankaro!%20I'd%20like%20to%20learn%20more."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-sm transition-all"
                >
                  <span>Chat on WhatsApp (+91 7872490719)</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>

              {/* Drawer Bottom Meta Links */}
              <div className="pt-2 pb-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="space-x-3">
                  <a href="/privacy" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">Privacy</a>
                  <span>•</span>
                  <a href="/terms" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">Terms</a>
                  <span>•</span>
                  <a href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">Contact Desk</a>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  © Arventa Ventures
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
