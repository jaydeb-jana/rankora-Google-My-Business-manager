import { redirect } from 'next/navigation';
import { getSessionUser, isAdmin } from '@/lib/auth';
import { ShieldAlert, LogOut, LayoutDashboard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  if (!isAdmin(user)) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-stone-900">Access Denied</h1>
          <p className="text-sm text-stone-600">
            Access to this admin control panel is restricted to authorized system administrators only. Your current account ({user.email}) does not have administrative privileges.
          </p>
          <div className="pt-2 flex justify-center space-x-3">
            <a
              href="/dashboard"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] px-4 py-2.5 rounded-xl transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] flex flex-col">
      {/* Admin Top Navigation */}
      <header className="h-16 bg-white border-b border-[#dadce0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center space-x-4">
          <a href="/admin" className="flex items-center space-x-2.5 group">
            <img
              src="/logo-icon.png"
              alt="RANKORA"
              className="w-9 h-9 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-[#202124] group-hover:text-blue-600 transition-colors">
                  RANKORA
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-[#5f6368] hidden sm:block">
                System & User Management Console
              </p>
            </div>
          </a>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-stone-600">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {user.ownerName ? user.ownerName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-semibold text-stone-900 leading-tight">{user.ownerName}</div>
              <div className="text-[11px] text-stone-500">{user.email}</div>
            </div>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
