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
  Clock,
  Award,
  MessageSquareCheck,
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

  const now = new Date();
  const expiresAt = user?.planExpiresAt ? new Date(user.planExpiresAt) : null;
  const isExpired = user?.role !== 'admin' && (user?.isPlanExpired || (expiresAt && expiresAt.getTime() <= now.getTime()));
  const diffMs = expiresAt ? expiresAt.getTime() - now.getTime() : 0;
  const daysLeft = isExpired || !expiresAt ? 0 : Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isExpiringSoon = !isExpired && daysLeft > 0 && daysLeft <= 5;

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 w-full">
      {/* Subscription Expired Alert Banner */}
      {isExpired && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-red-950 flex items-center gap-2">
                <span>Subscription Plan Expired</span>
                <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Action Required
                </span>
              </h4>
              <p className="text-xs text-red-800/90 leading-relaxed">
                Your subscription ended on{' '}
                {expiresAt
                  ? expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'recently'}
                . Please renew your plan to ensure uninterrupted Google Business Profile services.
              </p>
            </div>
          </div>
          <a
            href="/dashboard/plans"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition shadow-xs shrink-0"
          >
            <span>Renew Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Subscription Expiring Soon Alert Banner */}
      {isExpiringSoon && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <span>Subscription Expiring Soon</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {daysLeft} Day{daysLeft === 1 ? '' : 's'} Left
                </span>
              </h4>
              <p className="text-xs text-amber-800/90 leading-relaxed">
                Your plan validity will expire on{' '}
                {expiresAt
                  ? expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'soon'}
                . Renew early to extend your active subscription seamlessly.
              </p>
            </div>
          </div>
          <a
            href="/dashboard/plans"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-200 rounded-xl transition border border-amber-300 shadow-2xs shrink-0"
          >
            <span>Extend Subscription</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#dadce0] google-card-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#202124] truncate">
              Welcome, {user.ownerName}
            </h2>
            <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold bg-[#e6f4ea] text-[#137333] rounded-full shrink-0">
              Account Active
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#5f6368] leading-relaxed">
            Your Rankaro review engine for <strong>{user.businessName}</strong> is ready to capture authentic feedback.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto shrink-0">
          <a
            href={`/r/${user.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span>Preview Review Page</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Important: Missing Google Review Link Notification */}
      {(!user.googleReviewUrl || !user.googleReviewUrl.startsWith('http')) && (
        <div className="bg-[#fef7e0] border border-[#feefc3] rounded-2xl p-4 sm:p-5 min-w-0">
          <div className="flex items-start space-x-3 min-w-0">
            <div className="p-2 rounded-full bg-[#fce8b2] text-[#b06000] shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[#202124]">
                Action Needed: Connect your Google Review Page Link
              </h3>
              <p className="mt-1 text-xs text-[#5f6368] leading-relaxed">
                When customers approve their review draft, Rankaro seamlessly sends them to your Google Business Profile to publish it. Save your Google review URL below so customers can paste their review with one tap.
              </p>

              <form onSubmit={handleSaveGoogleUrl} className="mt-3 flex flex-col sm:flex-row gap-2 min-w-0 w-full">
                <input
                  type="text"
                  required
                  placeholder="Paste your link here (e.g. https://g.page/r/... or Google Review URL)"
                  value={googleUrlInput}
                  onChange={(e) => setGoogleUrlInput(e.target.value)}
                  className="flex-1 w-full min-w-0 px-3.5 py-2 text-xs bg-white text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="submit"
                    disabled={savingGoogleUrl}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {savingGoogleUrl ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      'Save Google Link'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="px-2 py-2 text-xs font-medium text-[#1a73e8] hover:underline whitespace-nowrap cursor-pointer"
                  >
                    How to find?
                  </button>
                </div>
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
        <div className="bg-[#e6f4ea] border border-[#ceead6] rounded-2xl px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rk-fade-up min-w-0">
          <div className="flex items-center space-x-2 text-xs text-[#137333] font-medium min-w-0 flex-1">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="shrink-0">Google review link connected:</span>
            <span className="font-mono truncate text-[#202124] min-w-0 flex-1">{user.googleReviewUrl}</span>
          </div>
          <a href="/dashboard/profile" className="text-xs font-semibold text-[#1a73e8] hover:underline shrink-0 self-end sm:self-auto">
            Change
          </a>
        </div>
      )}

      {/* Shareable Link & QR Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#dadce0] google-card-shadow min-w-0">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 w-full min-w-0">
          <div className="space-y-2 flex-1 w-full min-w-0">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-[#e8f0fe] text-[#1a73e8] shrink-0">
                <QrCode className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-semibold text-[#202124]">
                Your Unique Customer Review Link &amp; QR Code
              </h3>
            </div>
            <p className="text-xs text-[#5f6368] leading-relaxed">
              Share this link via SMS, post-service emails, or display the QR code at your checkout counter, tables, or reception desk.
            </p>

            <div className="flex items-center space-x-2 bg-[#f8f9fa] border border-[#dadce0] p-1.5 rounded-xl w-full max-w-xl min-w-0">
              <span className="text-xs font-mono text-[#202124] px-2 truncate flex-1 min-w-0 select-all">
                {reviewPageUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto shrink-0">
            <a
              href="/dashboard/qr-code"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 text-xs font-semibold text-[#3c4043] bg-white hover:bg-[#f8f9fa] border border-[#dadce0] rounded-xl transition-colors shadow-2xs"
            >
              <QrCode className="w-4 h-4 text-[#1a73e8]" />
              <span>Download Scannable QR Code</span>
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Funnel Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Visits */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#dadce0] google-card-shadow min-w-0">
          <div className="flex items-center justify-between text-[#5f6368]">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">Page Visits</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#e8f0fe] text-[#1a73e8] shrink-0">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold text-[#202124]">{initialStats.totalVisits || 0}</p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-[#70757a] truncate">Customers opened link</p>
        </div>

        {/* Drafts Generated */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#dadce0] google-card-shadow min-w-0">
          <div className="flex items-center justify-between text-[#5f6368]">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">Drafts Created</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#fef7e0] text-[#f29900] shrink-0">
              <FileEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold text-[#202124]">{initialStats.draftsGenerated || 0}</p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-[#70757a] truncate">Selected services &amp; drafted</p>
        </div>

        {/* Reviews Copied */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#dadce0] google-card-shadow min-w-0">
          <div className="flex items-center justify-between text-[#5f6368]">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">Reviews Copied</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#e6f4ea] text-[#1e8e3e] shrink-0">
              <ClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold text-[#202124]">{initialStats.reviewsCopied || 0}</p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-[#70757a] truncate">Approved text copied</p>
        </div>

        {/* Google Clicks */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#dadce0] google-card-shadow min-w-0">
          <div className="flex items-center justify-between text-[#5f6368]">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">Google Clicks</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#e8f0fe] text-[#1a73e8] shrink-0">
              <MousePointerClick className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold text-[#202124]">{initialStats.googleClicks || 0}</p>
          <p className="mt-1 text-[10px] sm:text-[11px] text-[#70757a] truncate">Sent to Google review box</p>
        </div>
      </div>

      {/* Admin-Controlled Performance & Response Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
        {/* Profile Health Score */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dadce0] google-card-shadow min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#5f6368]">
              <div className="flex items-center space-x-1.5 min-w-0">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5f6368] truncate">
                  Profile Score
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#e6f4ea] text-[#1e8e3e] shrink-0">
                  {Number(user.profileScore ?? 94) >= 90 ? 'Top Tier' : Number(user.profileScore ?? 94) >= 75 ? 'Optimal' : 'Needs Action'}
                </span>
              </div>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#e6f4ea] text-[#1e8e3e] shrink-0">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div className="mt-2.5 sm:mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#202124] tracking-tight">
                {user.profileScore !== undefined && user.profileScore !== null ? user.profileScore : 94}
              </span>
              <span className="text-sm font-semibold text-[#70757a]">/ 100</span>
              <span className="text-xs font-medium text-[#1e8e3e] ml-auto">
                {Number(user.profileScore ?? 94) >= 90 ? 'High Ranking Tier' : Number(user.profileScore ?? 94) >= 75 ? 'Good Performance' : 'Optimization Required'}
              </span>
            </div>

            {/* Meter Progress Bar */}
            <div className="mt-3 w-full bg-[#f1f3f4] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  Number(user.profileScore ?? 94) >= 90
                    ? 'bg-[#1e8e3e]'
                    : Number(user.profileScore ?? 94) >= 75
                    ? 'bg-[#1a73e8]'
                    : 'bg-[#f29900]'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, Number(user.profileScore ?? 94)))}%` }}
              />
            </div>
          </div>

          <div className="mt-3 text-[11px] text-[#70757a] flex items-center justify-between pt-2 border-t border-[#f1f3f4]">
            <span>Google Local 3-Pack Optimization</span>
            <span className="font-medium text-[#202124]">Live Ranking</span>
          </div>
        </div>

        {/* Total Reviews Replied */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dadce0] google-card-shadow min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#5f6368]">
              <div className="flex items-center space-x-1.5 min-w-0">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5f6368] truncate">
                  Total Reviews Replied
                </span>
                <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#e6f4ea] text-[#137333] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#137333] animate-pulse"></span>
                  <span>Google Managed</span>
                </span>
              </div>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#e6f4ea] text-[#1e8e3e] shrink-0">
                <MessageSquareCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div className="mt-2.5 sm:mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#202124] tracking-tight">
                {user.totalReplies !== undefined && user.totalReplies !== null ? user.totalReplies : 0}
              </span>
              <span className="text-xs font-medium text-[#70757a]">Responses Completed</span>
            </div>

            <p className="mt-2 text-xs text-[#5f6368] leading-relaxed">
              Total customer reviews answered and managed to boost local Google SEO visibility.
            </p>
          </div>

          <div className="mt-3 text-[11px] text-[#70757a] flex items-center justify-between pt-2 border-t border-[#f1f3f4]">
            <span>Review Response Rate</span>
            <span className="font-semibold text-[#1e8e3e]">100% Active</span>
          </div>
        </div>
      </div>

      {/* Quick Setup & Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Services Card */}
        <a
          href="/dashboard/services"
          className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dadce0] google-card-shadow hover:border-[#1a73e8] transition-all group block min-w-0"
        >
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#5f6368] group-hover:text-[#1a73e8] group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-semibold text-[#202124]">
            AI Knowledge ({user.services?.length || 0})
          </h4>
          <p className="mt-1 text-xs text-[#5f6368] leading-relaxed">
            Add or edit the services, topics, and keywords AI uses when generating customer reviews.
          </p>
        </a>

        {/* Page Customizer Card */}
        <a
          href="/dashboard/customizer"
          className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dadce0] google-card-shadow hover:border-[#1a73e8] transition-all group block min-w-0"
        >
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#fef7e0] text-[#f29900]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#5f6368] group-hover:text-[#1a73e8] group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-semibold text-[#202124]">
            Review Page Settings
          </h4>
          <p className="mt-1 text-xs text-[#5f6368] leading-relaxed">
            Customize the welcome title, customer instructions, and prompt questions.
          </p>
        </a>

        {/* Profile & Google URL */}
        <a
          href="/dashboard/profile"
          className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dadce0] google-card-shadow hover:border-[#1a73e8] transition-all group block min-w-0"
        >
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#e6f4ea] text-[#1e8e3e]">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#5f6368] group-hover:text-[#1a73e8] group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="text-sm font-semibold text-[#202124]">
            Business Profile &amp; URL
          </h4>
          <p className="mt-1 text-xs text-[#5f6368] leading-relaxed">
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
