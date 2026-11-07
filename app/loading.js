export default function RootLoading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="flex flex-col items-center space-y-4 max-w-xs text-center">
        {/* Animated Brand Pulse */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1a73e8] to-[#4285f4] flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
            <span className="text-2xl font-black text-white tracking-wider">R</span>
          </div>
          <div className="absolute -inset-1 rounded-2xl border-2 border-[#1a73e8] border-t-transparent animate-spin"></div>
        </div>

        {/* Brand Title & Spinner */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#202124] tracking-tight">RANKORA</p>
          <div className="flex items-center justify-center space-x-1.5 text-xs text-[#5f6368]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea4335] animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbbc04] animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34a853] animate-bounce [animation-delay:0.15s]"></span>
            <span className="ml-1 text-[11px] font-medium text-[#70757a]">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
