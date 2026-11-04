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

export default function DashboardHeader({ user, onOpenMobileSidebar, mobileSidebarOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);

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
    setInternalDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll if internal drawer is open
  useEffect(() => {
    if (internalDrawerOpen && !onOpenMobileSidebar) {
      document.body.style.overflow = 'hidden';
    } else if (!mobileSidebarOpen) {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [internalDrawerOpen, onOpenMobileSidebar, mobileSidebarOpen]);

  const handleToggleMenu = () => {
    if (onOpenMobileSidebar) {
      onOpenMobileSidebar();
    } else {
      setInternalDrawerOpen(!internalDrawerOpen);
    }
  };

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

  const isDrawerActive = onOpenMobileSidebar ? mobileSidebarOpen : internalDrawerOpen;

  return (
    <>
      <header className="h-16 bg-white border-b border-[#dadce0] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          {/* Mobile menu toggle */}
          <button
            onClick={handleToggleMenu}
            className="md:hidden p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-xl transition-colors shrink-0"
            aria-label="Open navigation menu"
          >
            {isDrawerActive ? <X className="w-5 h-5 text-[#202124]" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="min-w-0">
            <h1 className="text-xs sm:text-base font-bold text-[#202124] truncate max-w-[120px] xs:max-w-[170px] sm:max-w-xs md:max-w-md">
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

      {/* Standalone Fallback Drawer (Only rendered if onOpenMobileSidebar is not provided) */}
      {!onOpenMobileSidebar && internalDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setInternalDrawerOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 w-full max-w-[310px] bg-white flex flex-col shadow-2xl z-50 overflow-hidden animate-in slide-in-from-left duration-300">
            <div className="h-16 flex items-center justify-between px-4 border-b border-[#f1f3f4] bg-white shrink-0">
              <a
                href="/dashboard"
                onClick={() => setInternalDrawerOpen(false)}
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
                onClick={() => setInternalDrawerOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none px-3.5 py-3 space-y-3">
              <div className="px-3 py-2.5 bg-[#f8f9fa] rounded-2xl border border-[#e8eaed]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {user?.businessName?.charAt(0) || 'B'}
                  </div>
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

              <nav className="space-y-0.5 pt-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setInternalDrawerOpen(false)}
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
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
