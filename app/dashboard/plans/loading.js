export default function PlansLoading() {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto animate-in fade-in duration-150">
      <div className="space-y-2 text-center max-w-md mx-auto">
        <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse mx-auto" />
        <div className="h-4 w-72 bg-slate-100 rounded-md animate-pulse mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="h-5 w-24 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-10 w-32 bg-slate-300 rounded-xl animate-pulse" />
            <div className="space-y-2 pt-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-3.5 w-full bg-slate-100 rounded animate-pulse" />
              ))}
            </div>
            <div className="h-11 w-full bg-slate-200 rounded-xl animate-pulse pt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
