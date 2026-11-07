export default function QrCodeLoading() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
      <div className="space-y-2">
        <div className="h-6 w-64 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-4 w-96 max-w-full bg-slate-100 rounded-md animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center space-y-4">
            <div className="w-56 h-56 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-10 w-full bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center space-y-4">
            <div className="w-full max-w-[360px] h-[480px] bg-slate-100 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
