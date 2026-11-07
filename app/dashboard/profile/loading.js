export default function ProfileLoading() {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      <div className="space-y-2">
        <div className="h-6 w-60 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-4 w-80 bg-slate-100 rounded-md animate-pulse" />
      </div>

      {/* Profile Avatar Card Skeleton */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-200 animate-pulse shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="h-8 w-28 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Form Fields Skeletons */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3.5 w-28 bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
