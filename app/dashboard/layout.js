import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ImpersonationBanner from '@/components/admin/ImpersonationBanner';
import { ShieldAlert, ShieldCheck, AlertCircle, LogOut, Mail, HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  // If user is the pure platform administrator account (ceo@arventventures.online)
  // and not in impersonation mode, redirect directly to the Admin Control Center (/admin)
  if (user.email === 'ceo@arventventures.online' && !user.isImpersonated) {
    redirect('/admin');
  }

  // If user is suspended and not an admin in impersonation mode
  if (user.status === 'suspended' && !user.isImpersonated) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Official Google Partner Trust Header Bar */}
          <div className="bg-[#202124] text-white px-6 py-3.5 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center space-x-2.5">
              <img
                src="/logo-icon.png"
                alt="RANKORA"
                className="w-6 h-6 object-contain"
              />
              <span className="font-bold text-sm tracking-tight text-white">RANKORA</span>
              <span className="text-[10px] text-stone-500">&bull;</span>
              <span className="text-xs text-stone-300 font-medium">Compliance Desk</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Google Partner</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Identity & Status Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-800 font-bold shrink-0 shadow-2xs">
                  {user.businessName?.charAt(0) || 'B'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-stone-900 text-sm truncate">
                    {user.businessName}
                  </h3>
                  <p className="text-xs text-stone-500 truncate">
                    {user.email} &bull; <span className="font-mono">/{user.slug}</span>
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span>Account Suspended</span>
              </span>
            </div>

            {/* Main Alert Headline */}
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-red-50 text-red-600 mb-1 border border-red-100">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                Account Suspended by Official Google Partner
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Your business review dashboard and public review drafting have been temporarily restricted by the Official Google Partner compliance desk to ensure authentic review practices and Google policy compliance.
              </p>
            </div>

            {/* Official Google Partner Notice Box */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-red-50 to-rose-50/70 border border-red-200 rounded-2xl space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Official Google Partner Notice</span>
                </div>
                <span className="text-[10px] font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-md border border-red-200">
                  Compliance Action
                </span>
              </div>
              <p className="text-sm font-semibold text-red-950 leading-relaxed whitespace-pre-wrap bg-white/80 p-3.5 rounded-xl border border-red-100 shadow-2xs">
                {user.suspensionReason || 'Account suspended for review policy compliance and standard quality checks.'}
              </p>
              <p className="text-[11px] text-red-800/80 pt-0.5">
                This notice was issued directly by the Official Google Partner desk. Once resolved, your account will be promptly restored.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
              <a
                href="mailto:info@arventaventures.online?subject=Official%20Google%20Partner%20Compliance%20Appeal"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Compliance Desk</span>
              </a>

              <form action="/api/auth/logout" method="POST" className="w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-stone-500" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>

            {/* Footer trust disclaimer */}
            <div className="pt-2 text-center text-[11px] text-stone-400">
              Rankaro Business Management Platform &bull; Monitored under Official Google Partner Standards
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-[#202124]">
      {/* Impersonation Banner if admin logged in as user */}
      {user.isImpersonated && <ImpersonationBanner user={user} />}

      <DashboardShell user={user}>
        {children}
      </DashboardShell>
    </div>
  );
}
