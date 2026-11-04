'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  Building2,
  SearchCheck,
  QrCode,
  Sparkles,
  Sliders,
  BarChart3,
  Crown,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Check,
  Copy,
  ChevronRight,
  ArrowRight,
  User
} from 'lucide-react';
import { useToast } from '@/components/Toast';

const NAV_ITEMS = [
  { label: 'Home & Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Business Profile', href: '/dashboard/profile', icon: Building },
  { label: 'Profile Audit', href: '/dashboard/audit', icon: SearchCheck, badge: 'Health' },
  { label: 'Review Link & QR Stand', href: '/dashboard/qr-code', icon: QrCode },
  { label: 'AI Review', href: '/dashboard/services', icon: Sparkles },
  { label: 'Review Page Settings', href: '/dashboard/customizer', icon: Sliders },
  { label: 'Analytics & Logs', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Plans', href: '/dashboard/plans', icon: Crown, badge: 'Pro / Ultra' },
  { label: 'Contact Desk', href: '/dashboard/contact', icon: Building2 },
  { label: 'Data Security', href: '/dashboard/security', icon: ShieldCheck },
];

export default function DashboardHeader({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rawPlan = (user?.plan === 'free' ? 'starter' : user?.plan) || 'starter';
  const planName = rawPlan === 'enterprise' ? 'Enterprise' : rawPlan === 'pro' ? 'Pro' : 'Starter';

  const now = new Date();
  const planStart = user?.planUpdatedAt
    ? new Date(user.planUpdatedAt)
    : user?.createdAt
    ? new Date(user.createdAt)
    : now;

  const expiresAt = user?.planExpiresAt
    ? new Date(user.planExpiresAt)
    : new Date(planStart.getTime() + 30 * 24 * 60 * 60 * 1000);

  const diffMs = expiresAt.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, Math.max(8, Math.round((daysLeft / 30) * 100)));
  const isExpiringSoon = daysLeft <= 5;

  const reviewUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/r/${user?.slug}`
    : `/r/${user?.slug}`;

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    showToast('Shareable review link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-[#dadce0] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-xl transition-colors shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-xs sm:text-base font-bold text-[#202124] truncate max-w-[130px] xs:max-w-[170px] sm:max-w-xs md:max-w-md">
              {user?.businessName || 'Business Dashboard'}
            </h1>
            <p className="text-[10px] sm:text-xs text-[#5f6368] hidden sm:block truncate">
              RANKORA &bull; Google Business Profile Manager
            </p>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          {/* Active Plan & Days Remaining Pill (Desktop / Tablet) */}
          <a
            href="/dashboard/plans"
            className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] border border-[#d2e3fc] transition-colors shadow-2xs"
            title="Subscription details • Click to view plans"
          >
            <Crown className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>{planName} Plan &bull; {daysLeft > 0 ? `${daysLeft}d left` : 'Renews Today'}</span>
          </a>

          {/* 1-Click Copy Link button */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-[#1a73e8] bg-[#f8f9fa] hover:bg-[#e8f0fe] border border-[#dadce0] rounded-xl transition-colors shadow-2xs shrink-0"
            title="Copy shareable customer review link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#1e8e3e]" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Copy Review Link'}</span>
            <span className="sm:hidden">{copied ? 'Copied' : 'Link'}</span>
          </button>

          {/* Direct link to public review page */}
          <a
            href={`/r/${user?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl shadow-2xs transition-colors shrink-0"
            title="Preview public review page"
          >
            <span className="hidden sm:inline">Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            title="Sign out of Rankaro"
            className="p-1.5 sm:p-2 text-[#5f6368] hover:text-[#d93025] hover:bg-[#f1f3f4] rounded-xl transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ===================== WORLD-CLASS MOBILE SLIDE-OVER DRAWER ===================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over sheet from left */}
          <div className="fixed inset-y-0 left-0 w-full max-w-[310px] xs:max-w-xs bg-white flex flex-col shadow-2xl z-50 overflow-hidden animate-in slide-in-from-left duration-300">
            {/* 1. Drawer Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-[#f1f3f4] bg-white shrink-0">
              <a
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2.5"
              >
                <img
                  src="/logo-icon.png"
                  alt="RANKORA"
                  className="w-7 h-7 object-contain shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-extrabold tracking-tight text-[#202124] leading-none">
                    RANKORA
                  </span>
                  <span className="text-[10px] text-[#5f6368] font-medium leading-tight mt-0.5 truncate">
                    Dashboard Menu
                  </span>
                </div>
              </a>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Scrollable Body with hidden scrollbar */}
            <div className="flex-1 overflow-y-auto scrollbar-none px-3.5 py-3 space-y-3">
              {/* Business Identity Card */}
              <div className="px-3 py-2.5 bg-[#f8f9fa] rounded-2xl border border-[#e8eaed]">
                <div className="flex items-center space-x-2.5">
                  {user?.logoUrl ? (
                    <div className="w-8 h-8 rounded-xl border border-[#dadce0] overflow-hidden bg-white p-0.5 shrink-0 flex items-center justify-center">
                      <img
                        src={user.logoUrl}
                        alt={user.businessName}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {user?.businessName?.charAt(0) || 'B'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#202124] truncate leading-tight">
                      {user?.businessName}
                    </p>
                    <p className="text-[10px] text-[#5f6368] truncate leading-tight mt-0.5 font-mono">
                      /r/{user?.slug}
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Status Card */}
              <div
                className={`p-3 rounded-2xl border relative overflow-hidden transition-all ${
                  planName === 'Enterprise'
                    ? 'bg-gradient-to-br from-amber-50/90 via-purple-50/40 to-white border-amber-200 shadow-2xs'
                    : planName === 'Pro'
                    ? 'bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white border-blue-200 shadow-2xs'
                    : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-white border-stone-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        planName === 'Enterprise'
                          ? 'bg-amber-500 text-white'
                          : planName === 'Pro'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      <Crown className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-[#202124]">
                      {planName} Plan
                    </span>
                  </div>

                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{daysLeft > 0 ? `${daysLeft}d Left` : 'Renews Today'}</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200/80 rounded-full h-1.5 overflow-hidden my-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isExpiringSoon ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#70757a] pt-0.5">
                  <span>Cycle: 30 Days</span>
                  <a
                    href="/dashboard/plans"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bold text-[#1a73e8] hover:underline"
                  >
                    {planName === 'Enterprise' ? 'Manage Plans' : 'Upgrade Plan →'}
                  </a>
                </div>
              </div>

              {/* Navigation Links with colored icon boxes */}
              <nav className="space-y-0.5 pt-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#f0f4f9] text-[#1a73e8] font-bold shadow-2xs'
                          : 'text-[#3c4043] hover:bg-[#f8f9fa] hover:text-[#202124]'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white text-[#1a73e8] shadow-xs'
                            : 'bg-[#f1f3f4] text-[#5f6368]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isActive ? 'text-[#1a73e8]' : 'text-slate-300'
                        }`}
                      />
                    </a>
                  );
                })}

                {(user?.isAdmin || user?.role === 'admin') && (
                  <div className="pt-1.5">
                    <a
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-white text-purple-600 shadow-xs">
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </div>
                      <span className="flex-1 truncate">Admin Control Panel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </nav>
            </div>

            {/* 3. Drawer Bottom Action Footer */}
            <div className="p-3 border-t border-[#f1f3f4] bg-white space-y-2 shrink-0">
              <a
                href={`/r/${user?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-1.5 w-full py-2 px-3 text-xs font-bold text-[#1a73e8] bg-[#f8f9fa] hover:bg-[#e8f0fe] border border-[#dadce0] rounded-xl transition-colors shadow-2xs"
              >
                <span>Preview Review Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center justify-between pt-1 text-[10px] text-[#70757a]">
                <span>Logged in as <strong>{user?.ownerName || user?.businessName}</strong></span>
                <button
                  onClick={handleLogout}
                  className="font-bold text-rose-600 hover:text-rose-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
