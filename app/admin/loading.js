export default function AdminLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Admin Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-44 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* 4 Admin Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 animate-shimmer"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-slate-300 rounded-lg animate-pulse" />
            <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden animate-shimmer">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-64 bg-slate-100 rounded-xl animate-pulse" />
        </div>

        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div
              key={row}
              className="p-4 sm:p-5 flex items-center justify-between space-x-4 bg-white"
            >
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse shrink-0" />
                <div className="space-y-1.5 flex-1 max-w-sm">
                  <div className="h-4 w-44 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-56 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="hidden sm:block h-6 w-24 bg-slate-100 rounded-full animate-pulse" />
              <div className="hidden md:block h-4 w-28 bg-slate-200 rounded animate-pulse" />
              <div className="h-8 w-20 bg-slate-200 rounded-xl animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
