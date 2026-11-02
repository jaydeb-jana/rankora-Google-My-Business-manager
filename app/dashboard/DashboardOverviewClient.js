'use client';
import { useState, useEffect } from 'react';
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Eye,
  FileEdit,
  ClipboardCheck,
  MousePointerClick,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Settings,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import GoogleReviewUrlHelpModal from '@/components/GoogleReviewUrlHelpModal';

export default function DashboardOverviewClient({ initialUser, initialStats, recentActivities }) {
  const { showToast } = useToast();
  const [user, setUser] = useState(initialUser);
  const [copied, setCopied] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Quick save Google Review URL if not set
  const [googleUrlInput, setGoogleUrlInput] = useState(user.googleReviewUrl || '');
  const [savingGoogleUrl, setSavingGoogleUrl] = useState(false);

  // Initialize URL state safely to prevent SSR hydration mismatch
  const [reviewPageUrl, setReviewPageUrl] = useState(`/r/${user.slug}`);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReviewPageUrl(`${window.location.origin}/r/${user.slug}`);
    }
  }, [user.slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewPageUrl);
    setCopied(true);
    showToast('Personalized review link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const [googleUrlError, setGoogleUrlError] = useState('');

  const handleSaveGoogleUrl = async (e) => {
    e.preventDefault();
    if (!googleUrlInput.trim()) return;

    setSavingGoogleUrl(true);
    setGoogleUrlError('');
    try {
      const res = await fetch('/api/business/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleReviewUrl: googleUrlInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save URL');

      // Merge so the banner hides immediately even if the API returns a partial profile
      setUser((prev) => ({ ...prev, ...(data.profile || {}), googleReviewUrl: googleUrlInput.trim() }));
      showToast('Google Review link saved successfully!', 'success');
    } catch (err) {
      setGoogleUrlError(err.message);
      showToast(err.message, 'error');
    } finally {
      setSavingGoogleUrl(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#dadce0] google-card-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-[#202124]">
              Welcome, {user.ownerName}
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#e6f4ea] text-[#137333] rounded-full">
              Account Active
            </span>
          </div>
          <p className="mt-1 text-sm text-[#5f6368]">
            Your Rankaro review engine for <strong>{user.businessName}</strong> is ready to capture authentic feedback.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <a
            href={`/r/${user.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl shadow-xs transition-all"
          >
            <span>Preview Review Page</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Important: Missing Google Review Link Notification */}
      {(!user.googleReviewUrl || !user.googleReviewUrl.startsWith('http')) && (
        <div className="bg-[#fef7e0] border border-[#feefc3] rounded-2xl p-5">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-[#fce8b2] text-[#b06000] shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#202124]">
                Action Needed: Connect your Google Review Page Link
              </h3>
              <p className="mt-1 text-xs text-[#5f6368] leading-relaxed">
                When customers approve their review draft, Rankaro seamlessly sends them to your Google Business Profile to publish it. Save your Google review URL below so customers can paste their review with one tap.
              </p>

              <form onSubmit={handleSaveGoogleUrl} className="mt-3 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  placeholder="Paste your link here (e.g. https://share.google/... or Google Review URL)"
                  value={googleUrlInput}
                  onChange={(e) => setGoogleUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-white text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
                />
                <button
                  type="submit"
                  disabled={savingGoogleUrl}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg transition-colors whitespace-nowrap"
                >
                  {savingGoogleUrl ? 'Saving...' : 'Save Google Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="px-3 py-2 text-xs font-medium text-[#1a73e8] hover:underline whitespace-nowrap"
                >
                  How to find mine?
                </button>
              </form>
              {googleUrlError && (
                <p className="mt-2 text-xs font-medium text-[#c5221f]">{googleUrlError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Connected Google link confirmation */}
      {user.googleReviewUrl && user.googleReviewUrl.startsWith('http') && (
        <div className="bg-[#e6f4ea] border border-[#ceead6] rounded-2xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rk-fade-up">
          <div className="flex items-center space-x-2 text-xs text-[#137333] font-medium min-w-0">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="shrink-0">Google review link connected:</span>
            <span className="font-mono truncate text-[#202124]">{user.googleReviewUrl}</span>
          </div>
          <a href="/dashboard/profile" className="text-xs font-semibold text-[#1a73e8] hover:underline shrink-0">
            Change
          </a>
        </div>
      )}

      {/* Shareable Link & QR Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#dadce0] google-card-shadow">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-[#e8f0fe] text-[#1a73e8]">
                <QrCode className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-semibold text-[#202124]">
                Your Unique Customer Review Link & QR Code
              </h3>
            </div>
            <p className="text-xs text-[#5f6368] leading-relaxed">
              Share this link via SMS, post-service emails, or display the QR code at your checkout counter, tables, or reception desk.
            </p>

            <div className="flex items-center space-x-2 bg-[#f8f9fa] border border-[#dadce0] p-1.5 rounded-xl max-w-xl">
              <span className="text-xs font-mono text-[#202124] px-2.5 truncate flex-1">
                {reviewPageUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="/dashboard/qr-code"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 text-xs font-semibold text-[#3c4043] bg-white hover:bg-[#f8f9fa] border border-[#dadce0] rounded-xl transition-colors shadow-2xs"
            >
              <QrCode className="w-4 h-4 text-[#1a73e8]" />
              <span>Download Scannable QR Code</span>
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Funnel Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visits */}
        <div className="bg-white rounded-2xl p-5 border border-[#dadce0] google-card-shadow">
          <div className="flex items-center justify-between text-[#5f6368]">
            <span className="text-xs font-medium uppercase tracking-wider">Page Visits</span>
            <div className="p-2 rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-[#202124]">{initialStats.totalVisits || 0}</p>
          <p className="mt-1 text-[11px] text-[#70757a]">Customers opened your link</p>
        </div>

        {/* Drafts Generated */}
        <div className="bg-white rounded-2xl p-5 border border-[#dadce0] google-card-shadow">
          <div className="flex items-center justify-between text-[#5f6368]">
            <span className="text-xs font-medium uppercase tracking-wider">Drafts Generated</span>
            <div className="p-2 rounded-xl bg-[#fef7e0] text-[#f29900]">
              <FileEdit className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-[#202124]">{initialStats.draftsGenerated || 0}</p>
          <p className="mt-1 text-[11px] text-[#70757a]">Selected services & prompted</p>
        </div>

        {/* Reviews Copied */}
        <div className="bg-white rounded-2xl p-5 border border-[#dadce0] google-card-shadow">
          <div className="flex items-center justify-between text-[#5f6368]">
            <span className="text-xs font-medium uppercase tracking-wider">Reviews Copied</span>
            <div className="p-2 rounded-xl bg-[#e6f4ea] text-[#1e8e3e]">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-[#202124]">{initialStats.reviewsCopied || 0}</p>
          <p className="mt-1 text-[11px] text-[#70757a]">Approved text copied</p>
        </div>

        {/* Google Clicks */}
        <div className="bg-white rounded-2xl p-5 border border-[#dadce0] google-card-shadow">
          <div className="flex items-center justify-between text-[#5f6368]">
            <span className="text-xs font-medium uppercase tracking-wider">Google Redirects</span>
            <div className="p-2 rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-[#202124]">{initialStats.googleClicks || 0}</p>
          <p className="mt-1 text-[11px] text-[#70757a]">Sent to Google review box</p>
        </div>
      </div>

      {/* Quick Setup & Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Services Card */}
        <a
          href="/dashboard/services"
          className="bg-white rounded-2xl p-5 border border-[#dadce0] google-card-shadow hover:border-[#1a73e8] transition-all group block"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#5f6368] group-hover:text-[#1a73e8] group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-semibold text-[#202124]">
            AI Knowledge ({user.services?.length || 0})
          </h4>
          <p className="mt-1 text-xs text-[#5f6368]">
            Add or edit the services, topics, and keywords AI uses when generating customer reviews.
          </p>
        </a>

        {/* Page Customizer Card */}
        <a
          href="/dashboard/customizer"
          className="bg-white rounded-2xl p-5 border border-[#dadce0] google-card-shadow hover:border-[#1a73e8] transition-all group block"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-[#fef7e0] text-[#f29900]">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#5f6368] group-hover:text-[#1a73e8] group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-semibold text-[#202124]">
            Review Page Settings
          </h4>
          <p className="mt-1 text-xs text-[#5f6368]">
            Customize the welcome title, customer instructions, and prompt questions.
          </p>
        </a>

        {/* Profile & Google URL */}
        <a
          href="/dashboard/profile"
          className="bg-white rounded-2xl p-5 border border-[#dadce0] google-card-shadow hover:border-[#1a73e8] transition-all group block"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-[#e6f4ea] text-[#1e8e3e]">
              <Settings className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#5f6368] group-hover:text-[#1a73e8] group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-semibold text-[#202124]">
            Business Profile & URL
          </h4>
          <p className="mt-1 text-xs text-[#5f6368]">
            Update contact info, location address, and your official Google review URL.
          </p>
        </a>
      </div>

      {/* Help Modal */}
      <GoogleReviewUrlHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
