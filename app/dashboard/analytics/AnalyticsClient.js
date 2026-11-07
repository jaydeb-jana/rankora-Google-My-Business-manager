'use client';
import {
  Eye,
  FileEdit,
  ClipboardCheck,
  MousePointerClick,
  Award,
  MessageSquareCheck,
  TrendingUp,
} from 'lucide-react';

export default function AnalyticsClient({ stats, profileScore = 94, totalReplies = 0, businessName }) {
  const totalVisits = stats?.totalVisits || 0;
  const draftsGenerated = stats?.draftsGenerated || 0;
  const reviewsCopied = stats?.reviewsCopied || 0;
  const googleClicks = stats?.googleClicks || 0;

  // Calculation of conversion funnel percentages
  const draftRate = totalVisits > 0 ? Math.round((draftsGenerated / totalVisits) * 100) : 0;
  const copyRate = draftsGenerated > 0 ? Math.round((reviewsCopied / draftsGenerated) * 100) : 0;
  const clickRate = reviewsCopied > 0 ? Math.round((googleClicks / reviewsCopied) * 100) : 0;

  const scoreNum = Number(profileScore ?? 94);

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-[#202124]">
          Review Collection Funnel &amp; Analytics
        </h2>
        <p className="text-xs text-[#5f6368] mt-1">
          Track customer engagement, overall profile health score, and review response metrics for {businessName}.
        </p>
      </div>

      {/* Profile Performance Score & Total Replies KPI Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Profile Performance Score */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dadce0] google-card-shadow relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#5f6368] mb-2">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#1a73e8]">
                Profile Performance Score
              </span>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#e8f0fe] text-[#1a73e8] shrink-0">
                <Award className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <p className="text-3xl sm:text-4xl font-black text-[#202124] tracking-tight">
                {scoreNum}
                <span className="text-lg font-bold text-[#5f6368]">/100</span>
              </p>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  scoreNum >= 90
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : scoreNum >= 75
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {scoreNum >= 90 ? 'Excellent' : scoreNum >= 75 ? 'Optimal' : 'Active'}
              </span>
            </div>

            <div className="w-full bg-[#f1f3f4] h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  scoreNum >= 90
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, scoreNum))}%` }}
              />
            </div>
          </div>

          <div className="mt-3.5 pt-2 border-t border-[#f1f3f4] flex items-center justify-between text-[11px] text-[#5f6368]">
            <span>Google Local 3-Pack Health</span>
            <span className="font-semibold text-emerald-700 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>High Authority</span>
            </span>
          </div>
        </div>

        {/* Total Reviews Replied */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dadce0] google-card-shadow relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#5f6368] mb-2">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#137333]">
                Total Reviews Replied
              </span>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#e6f4ea] text-[#137333] shrink-0">
                <MessageSquareCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <p className="text-3xl sm:text-4xl font-black text-[#202124] tracking-tight">
                {totalReplies}
              </p>
              <span className="text-xs font-semibold text-[#5f6368]">Customer Responses Managed</span>
            </div>

            <p className="text-xs text-[#5f6368] mt-2.5 leading-relaxed">
              Active owner replies boost customer retention and improve local Google Maps organic visibility.
            </p>
          </div>

          <div className="mt-3.5 pt-2 border-t border-[#f1f3f4] flex items-center justify-between text-[11px] text-[#5f6368]">
            <span>Response Velocity</span>
            <span className="font-semibold text-[#137333]">100% Google Coverage</span>
          </div>
        </div>
      </div>

      {/* Visual Funnel Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Step 1 */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#dadce0] google-card-shadow relative overflow-hidden min-w-0">
          <div className="flex items-center justify-between text-[#5f6368] mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8] truncate">
              Step 1: Scans
            </span>
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a73e8] shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#202124]">{totalVisits}</p>
          <p className="text-[10px] sm:text-xs text-[#5f6368] mt-1 truncate">Opened review link</p>
          <div className="mt-2.5 sm:mt-3 pt-2 border-t border-[#f1f3f4] text-[10px] sm:text-[11px] text-[#9aa0a6] truncate">
            100% of pipeline
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#dadce0] google-card-shadow relative overflow-hidden min-w-0">
          <div className="flex items-center justify-between text-[#5f6368] mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#b06000] truncate">
              Step 2: Drafts
            </span>
            <FileEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#fbbc04] shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#202124]">{draftsGenerated}</p>
          <p className="text-[10px] sm:text-xs text-[#5f6368] mt-1 truncate">Services drafted</p>
          <div className="mt-2.5 sm:mt-3 pt-2 border-t border-[#f1f3f4] text-[10px] sm:text-[11px] font-medium text-[#b06000] truncate">
            {draftRate}% visit rate
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#dadce0] google-card-shadow relative overflow-hidden min-w-0">
          <div className="flex items-center justify-between text-[#5f6368] mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#137333] truncate">
              Step 3: Copied
            </span>
            <ClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1e8e3e] shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#202124]">{reviewsCopied}</p>
          <p className="text-[10px] sm:text-xs text-[#5f6368] mt-1 truncate">Approved &amp; copied</p>
          <div className="mt-2.5 sm:mt-3 pt-2 border-t border-[#f1f3f4] text-[10px] sm:text-[11px] font-medium text-[#137333] truncate">
            {copyRate}% approved
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#dadce0] google-card-shadow relative overflow-hidden min-w-0">
          <div className="flex items-center justify-between text-[#5f6368] mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8] truncate">
              Step 4: Google
            </span>
            <MousePointerClick className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a73e8] shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#202124]">{googleClicks}</p>
          <p className="text-[10px] sm:text-xs text-[#5f6368] mt-1 truncate">Sent to Google</p>
          <div className="mt-2.5 sm:mt-3 pt-2 border-t border-[#f1f3f4] text-[10px] sm:text-[11px] font-medium text-[#1a73e8] truncate">
            {clickRate}% to Google
          </div>
        </div>
      </div>
    </div>
  );
}
