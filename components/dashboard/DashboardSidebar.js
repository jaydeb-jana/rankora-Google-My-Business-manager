'use client';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  QrCode,
  Sliders,
  Building,
  BarChart3,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Knowledge', href: '/dashboard/services', icon: Layers },
  { label: 'QR Code & Print', href: '/dashboard/qr-code', icon: QrCode },
  { label: 'Review Page Settings', href: '/dashboard/customizer', icon: Sliders },
  { label: 'Business Profile', href: '/dashboard/profile', icon: Building },
  { label: 'Analytics & Logs', href: '/dashboard/analytics', icon: BarChart3 },
];

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#dadce0] shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-[#f1f3f4]">
        <a href="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1a73e8] text-white flex items-center justify-center font-bold text-base shadow-xs">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-[#202124]">Rankaro</span>
        </a>
      </div>

      {/* Business Identity Card */}
      <div className="p-4 mx-3 my-3 bg-[#f8f9fa] rounded-xl border border-[#e8eaed]">
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
              /{user.slug}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#e8f0fe] text-[#1a73e8]'
                  : 'text-[#3c4043] hover:bg-[#f8f9fa] hover:text-[#202124]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Live Review Page Shortcut */}
      <div className="p-4 border-t border-[#f1f3f4] space-y-2">
        <a
          href={`/r/${user.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 w-full py-2 px-3 text-xs font-medium text-[#1a73e8] bg-[#f8f9fa] hover:bg-[#e8f0fe] border border-[#dadce0] rounded-lg transition-colors group"
        >
          <span>Open Review Page</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </a>

        <div className="flex items-center space-x-1.5 text-[11px] text-[#5f6368] justify-center pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34a853]" />
          <span>Google Review Compliant</span>
        </div>
      </div>
    </aside>
  );
}
