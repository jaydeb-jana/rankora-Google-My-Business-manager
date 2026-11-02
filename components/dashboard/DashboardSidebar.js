'use client';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  Building2,
  QrCode,
  Sparkles,
  Sliders,
  BarChart3,
  Crown,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home & Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Business Profile', href: '/dashboard/profile', icon: Building },
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

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#dadce0] shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-[#f1f3f4]">
        <a href="/dashboard" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1a73e8] text-white flex items-center justify-center font-bold text-base shadow-xs">
            R
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-[#202124] leading-none">
              RANKORA
            </span>
            <span className="text-[10px] text-[#5f6368] font-medium leading-tight mt-0.5">
              Google Business Profile Manager
            </span>
          </div>
        </a>
      </div>

      {/* Business Identity Card */}
      <div className="p-3 mx-3 my-3 bg-[#f8f9fa] rounded-xl border border-[#e8eaed]">
        <div className="flex items-center space-x-2.5">
          {user.logoUrl ? (
            <div className="w-8 h-8 rounded-lg border border-[#dadce0] overflow-hidden bg-white p-0.5 shrink-0 flex items-center justify-center">
              <img
                src={user.logoUrl}
                alt={user.businessName}
                className="w-full h-full object-contain rounded-md"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user.businessName?.charAt(0) || 'B'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#202124] truncate">
              {user.businessName}
            </p>
            <p className="text-[11px] text-[#5f6368] truncate">
              {user.email || `/${user.slug}`}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-2.5 py-2 rounded-xl text-xs sm:text-sm transition-all group ${
                isActive
                  ? 'bg-[#f0f4f9] text-[#202124] font-semibold'
                  : 'text-[#3c4043] hover:bg-[#f8f9fa] hover:text-[#202124] font-medium'
              }`}
            >
              {/* Rounded icon box matching design */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  isActive
                    ? 'bg-white text-[#1a73e8] shadow-xs'
                    : 'bg-[#f1f3f4] text-[#5f6368] group-hover:bg-[#e8f0fe] group-hover:text-[#1a73e8]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 flex items-center justify-between min-w-0">
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] shrink-0">
                    {item.badge}
                  </span>
                )}
              </div>
            </a>
          );
        })}

        {(user.isAdmin || user.role === 'admin') && (
          <div className="pt-2">
            <a
              href="/admin"
              className="flex items-center space-x-3 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white text-purple-600 shadow-xs">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span>Admin Panel</span>
            </a>
          </div>
        )}
      </nav>

      {/* Live Review Page Shortcut & Arventa Footer */}
      <div className="p-3 border-t border-[#f1f3f4] space-y-2">
        <a
          href={`/r/${user.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 w-full py-2 px-3 text-xs font-semibold text-[#1a73e8] bg-[#f8f9fa] hover:bg-[#e8f0fe] border border-[#dadce0] rounded-xl transition-colors group"
        >
          <span>Preview Customer Review Page</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </a>

        <div className="text-center pt-1">
          <p className="text-[10px] text-[#70757a] font-medium">
            RANKORA • A Product by <span className="text-[#202124] font-semibold">Arventa Ventures</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
