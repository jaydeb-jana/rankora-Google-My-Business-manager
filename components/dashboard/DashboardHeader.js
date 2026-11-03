'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ExternalLink, Menu, X, Share2, Check, Copy } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function DashboardHeader({ user }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
