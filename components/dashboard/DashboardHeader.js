'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ExternalLink, Menu, X, Share2, Check, Copy, Crown } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function DashboardHeader({ user }) {
  const router = useRouter();
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

  const reviewUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/r/${user.slug}`
    : `/r/${user.slug}`;

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
      <header className="h-16 bg-white border-b border-[#dadce0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#5f6368] hover:text-[#202124] rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-semibold text-[#202124] truncate">
              {user.businessName}
            </h1>
            <p className="text-xs text-[#5f6368] hidden sm:block">
              RANKORA • Google Business Profile Manager
            </p>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Active Plan & Days Remaining Pill */}
          <a
            href="/dashboard/plans"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1a73e8] border border-[#d2e3fc] transition-colors shadow-2xs"
            title="Subscription details • Click to view plans"
          >
            <Crown className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>{planName} Plan &bull; {daysLeft > 0 ? `${daysLeft}d left` : 'Renews Today'}</span>
          </a>

          {/* 1-Click Copy Link button */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#1a73e8] bg-[#f8f9fa] hover:bg-[#e8f0fe] border border-[#dadce0] rounded-lg transition-colors"
            title="Copy shareable customer review link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#1e8e3e]" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Copy Review Link'}</span>
            <span className="sm:hidden">{copied ? 'Copied' : 'Link'}</span>
          </button>

          {/* Direct link to public review page */}
          <a
            href={`/r/${user.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg shadow-2xs transition-colors"
          >
            <span className="hidden sm:inline">View Review Page</span>
            <span className="sm:hidden">Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            title="Sign out of Rankaro"
            className="p-2 text-[#5f6368] hover:text-[#d93025] hover:bg-[#f1f3f4] rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#dadce0] px-4 py-3 space-y-1">
          {/* Mobile Plan Badge */}
          <a
            href="/dashboard/plans"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-xs font-bold text-[#1a73e8] bg-[#e8f0fe] rounded-lg mb-2 border border-[#d2e3fc]"
          >
            <div className="flex items-center space-x-1.5">
              <Crown className="w-3.5 h-3.5" />
              <span>{planName} Plan</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {daysLeft > 0 ? `${daysLeft} Days Left` : 'Renews Today'}
            </span>
          </a>

          <a
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#3c4043] rounded-lg hover:bg-[#f8f9fa]"
          >
            Home & Overview
          </a>
          <a
            href="/dashboard/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#3c4043] rounded-lg hover:bg-[#f8f9fa]"
          >
            Business Profile
          </a>
          <a
            href="/dashboard/audit"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1a73e8] bg-[#f0f4f9] rounded-lg font-semibold"
          >
            Profile Audit (Health Check)
          </a>
          <a
            href="/dashboard/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#3c4043] rounded-lg hover:bg-[#f8f9fa]"
          >
            AI Knowledge
          </a>
          <a
            href="/dashboard/qr-code"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#3c4043] rounded-lg hover:bg-[#f8f9fa]"
          >
            QR Code & Print
          </a>
          <a
            href="/dashboard/customizer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#3c4043] rounded-lg hover:bg-[#f8f9fa]"
          >
            Review Page Settings
          </a>
          <a
            href="/dashboard/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#3c4043] rounded-lg hover:bg-[#f8f9fa]"
          >
            Business Profile & Review Link
          </a>
          <a
            href="/dashboard/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#3c4043] rounded-lg hover:bg-[#f8f9fa]"
          >
            Analytics & Logs
          </a>
          <a
            href="/dashboard/plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#3c4043] rounded-lg hover:bg-[#f8f9fa]"
          >
            Plans (Pro / Ultra)
          </a>
          <a
            href="/dashboard/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#3c4043] rounded-lg hover:bg-[#f8f9fa]"
          >
            Contact Desk
          </a>
          <a
            href="/dashboard/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1a73e8] bg-[#f0f4f9] rounded-lg"
          >
            Data Security
          </a>
        </div>
      )}
    </>
  );
}
