'use client';
import { usePathname } from 'next/navigation';
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
  ExternalLink,
  Zap,
  Clock,
  ArrowRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home & Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Business Profile', href: '/dashboard/profile', icon: Building },
  { label: 'Profile Audit', href: '/dashboard/audit', icon: SearchCheck, badge: 'Health' },
  { label: 'Review Link & QR Stand', href: '/dashboard/qr-code', icon: QrCode },
  { label: 'AI Review', href: '/dashboard/services', icon: Sparkles },
  { label: 'Review Page Settings', href: '/dashboard/customizer', icon: Sliders },
  { label: 'Analytics & Logs', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Plans', href: '/dashboard/plans', icon: Crown, badge: 'Pro / Ultra' },
  { label: 'Contact', href: '/dashboard/contact', icon: Building2 },
  { label: 'Data Security', href: '/dashboard/security', icon: ShieldCheck },
];

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();

  const rawPlan = (user?.plan === 'free' ? 'starter' : user?.plan) || 'starter';
  const planName = rawPlan === 'enterprise' ? 'Enterprise' : rawPlan === 'pro' ? 'Pro' : 'Starter';

  // Calculate days remaining in active billing cycle
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

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#dadce0] shrink-0 sticky top-0 h-screen z-20">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#f1f3f4] shrink-0">
        <a href="/dashboard" className="flex items-center space-x-2.5 group">
          <img
            src="/logo-icon.png"
            alt="RANKORA"
            className="w-8 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-extrabold tracking-tight text-[#202124] leading-none">
              RANKORA
            </span>
            <span className="text-[10px] text-[#5f6368] font-medium leading-tight mt-0.5 truncate">
              Google Business Profile Manager
            </span>
          </div>
        </a>
      </div>

      {/* Business Identity Card */}
      <div className="px-3 py-2 mx-3 my-2 bg-[#f8f9fa] rounded-xl border border-[#e8eaed] shrink-0">
        <div className="flex items-center space-x-2.5">
          {user.logoUrl ? (
            <div className="w-7 h-7 rounded-lg border border-[#dadce0] overflow-hidden bg-white p-0.5 shrink-0 flex items-center justify-center">
              <img
                src={user.logoUrl}
                alt={user.businessName}
                className="w-full h-full object-contain rounded-md"
              />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user.businessName?.charAt(0) || 'B'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#202124] truncate leading-tight">
              {user.businessName}
            </p>
            <p className="text-[10px] text-[#5f6368] truncate leading-tight mt-0.5">
              {user.email || `/${user.slug}`}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-1 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-none">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-[13px] transition-all group ${
                isActive
                  ? 'bg-[#f0f4f9] text-[#202124] font-semibold'
                  : 'text-[#3c4043] hover:bg-[#f8f9fa] hover:text-[#202124] font-medium'
              }`}
            >
              {/* Rounded icon box matching design */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  isActive
                    ? 'bg-white text-[#1a73e8] shadow-xs'
                    : 'bg-[#f1f3f4] text-[#5f6368] group-hover:bg-[#e8f0fe] group-hover:text-[#1a73e8]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 flex items-center justify-between min-w-0">
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] shrink-0">
                    {item.badge}
                  </span>
                )}
              </div>
            </a>
          );
        })}

        {(user.isAdmin || user.role === 'admin') && (
          <div className="pt-1">
            <a
              href="/admin"
              className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-white text-purple-600 shadow-xs">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">Admin Panel</span>
            </a>
          </div>
        )}
      </nav>

      {/* Plan Status, Live Review Page Shortcut & Arventa Footer */}
      <div className="p-2.5 border-t border-[#f1f3f4] space-y-2 shrink-0">
        {/* Active Plan & Days Remaining Card */}
        <div
          className={`p-2.5 rounded-xl border relative overflow-hidden transition-all ${
            planName === 'Enterprise'
              ? 'bg-gradient-to-br from-amber-50/90 via-purple-50/40 to-white border-amber-200/80 shadow-2xs'
              : planName === 'Pro'
              ? 'bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white border-blue-200/80 shadow-2xs'
              : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-white border-stone-200 shadow-2xs'
          }`}
        >
          {/* Top Row: Plan Badge & Status */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                  planName === 'Enterprise'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : planName === 'Pro'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-700 text-white shadow-2xs'
                }`}
              >
                <Crown className="w-3 h-3" />
              </div>
              <div className="leading-none min-w-0">
                <span className="text-[11px] font-bold text-[#202124] tracking-tight block truncate">
                  {planName} Plan
                </span>
              </div>
            </div>

            {/* Live Status indicator */}
            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active</span>
            </span>
          </div>

          {/* Middle Row: Days Remaining & Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-between text-[11px]">
              <span className="text-[#5f6368] font-medium text-[10px]">Validity:</span>
              <span className={`font-bold ${isExpiringSoon ? 'text-amber-600' : 'text-[#1a73e8]'}`}>
                {daysLeft > 0 ? `${daysLeft} Day${daysLeft === 1 ? '' : 's'} Left` : 'Renews Today'}
              </span>
            </div>

            {/* Cycle Progress Bar */}
            <div className="w-full bg-stone-200/80 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isExpiringSoon ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-0.5 text-[9px] text-[#70757a]">
              <span>Billing: 30 Days</span>
              <a
                href="/dashboard/plans"
                className="font-semibold text-[#1a73e8] hover:text-[#1557b0] hover:underline"
              >
                {planName === 'Enterprise' ? 'Manage' : 'Upgrade →'}
              </a>
            </div>
          </div>
        </div>

        <a
          href={`/r/${user.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-1.5 w-full py-1.5 px-2.5 text-xs font-semibold text-[#1a73e8] bg-[#f8f9fa] hover:bg-[#e8f0fe] border border-[#dadce0] rounded-lg transition-colors group"
        >
          <span className="truncate">Preview Review Page</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </a>

        <div className="text-center pt-0.5">
          <p className="text-[10px] text-[#70757a] font-medium leading-tight">
            RANKORA • By <span className="text-[#202124] font-semibold">Arventa Ventures</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
