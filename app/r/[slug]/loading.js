export default function PublicReviewLoading() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col justify-between animate-in fade-in duration-200">
      {/* Top Header Placeholder */}
      <header className="bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-6 w-28 bg-slate-100 rounded-full animate-pulse" />
        </div>
        <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 opacity-60" />
      </header>

      {/* Main Review Card Skeleton */}
      <main className="flex-1 max-w-md w-full mx-auto px-3.5 py-4 sm:py-6 flex flex-col justify-center">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-shimmer">
          {/* Business Identity */}
          <div className="p-5 text-center border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 animate-pulse" />
            <div className="h-5 w-44 bg-slate-300 rounded-md animate-pulse" />
            <div className="h-3.5 w-32 bg-slate-100 rounded animate-pulse" />
            <div className="h-6 w-28 bg-amber-100/60 rounded-full animate-pulse" />
          </div>

          {/* Rating Section Skeleton */}
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between pb-1">
              <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-blue-100 rounded-full animate-pulse" />
            </div>

            {/* 5 Emojis Placeholder */}
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="py-3 px-1 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center space-y-1.5"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse" />
                  <div className="w-8 h-2.5 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Service Chips Placeholder */}
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-36 bg-slate-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center space-x-2"
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-200 animate-pulse shrink-0" />
                    <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="pt-2">
              <div className="h-12 w-full rounded-2xl bg-slate-300 animate-pulse" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding Skeleton */}
      <footer className="py-3 text-center">
        <div className="h-3 w-36 bg-slate-200 rounded mx-auto animate-pulse" />
      </footer>
    </div>
  );
}
