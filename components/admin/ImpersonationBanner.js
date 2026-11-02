'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

export default function ImpersonationBanner({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleExit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/exit-impersonation', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      console.error('Failed to exit impersonation:', err);
      window.location.href = '/admin';
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-100 animate-pulse" />
          <span>
            <strong>Impersonation Mode Active:</strong> You are currently viewing and managing the account for{' '}
            <span className="underline font-semibold">{user.businessName}</span> ({user.email}).
          </span>
        </div>
        <button
          onClick={handleExit}
          disabled={loading}
          className="inline-flex items-center space-x-1.5 bg-white text-stone-900 hover:bg-stone-100 font-semibold px-3 py-1 rounded-md shadow-xs transition-colors shrink-0 disabled:opacity-75 cursor-pointer text-xs"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
          ) : (
            <ArrowLeft className="w-3.5 h-3.5 text-stone-700" />
          )}
          <span>Return to Admin Panel</span>
        </button>
      </div>
    </div>
  );
}
