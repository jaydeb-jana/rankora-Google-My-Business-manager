export default function AnalyticsLoading() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
      <div className="space-y-2">
        <div className="h-6 w-64 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-4 w-96 max-w-full bg-slate-100 rounded-md animate-pulse" />
      </div>

      {/* Top 2 KPI Score highlights skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="w-8 h-8 rounded-xl bg-slate-100 animate-pulse" />
            </div>
            <div className="h-9 w-28 bg-slate-300 rounded-lg animate-pulse" />
            <div className="h-2 w-full bg-slate-100 rounded-full animate-pulse" />
          </div>
        ))}
      </div>

      {/* 4 Funnel step cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-20 bg-slate-200 rounded animate-pulse" />
              <div className="w-6 h-6 rounded-lg bg-slate-100 animate-pulse" />
            </div>
            <div className="h-7 w-16 bg-slate-300 rounded animate-pulse" />
            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
