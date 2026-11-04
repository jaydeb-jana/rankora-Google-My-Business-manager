export default function DashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome Skeleton */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs animate-shimmer">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2.5">
            <div className="h-6 sm:h-7 w-48 sm:w-64 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-60 sm:w-80 bg-slate-100 rounded-md animate-pulse" />
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* 4 Metric Stat Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3 animate-shimmer"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-slate-200 rounded-md animate-pulse" />
              <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-slate-300 rounded-lg animate-pulse" />
            <div className="h-3 w-32 bg-slate-100 rounded-md animate-pulse" />
          </div>
        ))}
      </div>

      {/* 2-Column Content Card Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Main Content Area (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 animate-shimmer">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1.5">
              <div className="h-5 w-40 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-3.5 w-56 bg-slate-100 rounded-md animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
          </div>

          {/* Shimmer Rows */}
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="p-3.5 rounded-xl border border-slate-100 flex items-center justify-between space-x-3 bg-slate-50/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel Area (1 col) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 animate-shimmer">
          <div className="h-5 w-32 bg-slate-200 rounded-md animate-pulse border-b border-slate-100 pb-4" />
          <div className="space-y-3 pt-1">
            <div className="h-36 w-full bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 w-full bg-slate-200 rounded-xl animate-pulse mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
