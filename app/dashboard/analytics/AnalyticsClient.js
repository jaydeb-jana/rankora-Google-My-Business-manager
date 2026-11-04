'use client';
import {
  Eye,
  FileEdit,
  ClipboardCheck,
  MousePointerClick,
} from 'lucide-react';

export default function AnalyticsClient({ stats, businessName }) {
  const totalVisits = stats?.totalVisits || 0;
  const draftsGenerated = stats?.draftsGenerated || 0;
  const reviewsCopied = stats?.reviewsCopied || 0;
  const googleClicks = stats?.googleClicks || 0;

  // Calculation of conversion funnel percentages
  const draftRate = totalVisits > 0 ? Math.round((draftsGenerated / totalVisits) * 100) : 0;
  const copyRate = draftsGenerated > 0 ? Math.round((reviewsCopied / draftsGenerated) * 100) : 0;
  const clickRate = reviewsCopied > 0 ? Math.round((googleClicks / reviewsCopied) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-[#202124]">
          Review Collection Funnel &amp; Analytics
        </h2>
        <p className="text-xs text-[#5f6368] mt-1">
          Track customer engagement from the moment they scan your QR code to when they copy their review onto Google.
        </p>
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
