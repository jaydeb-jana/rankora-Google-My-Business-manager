'use client';
import { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, LayoutDashboard, KeyRound } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function AdminLoginForm({ currentUser }) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('ceo@arventaventures.online');
  const [password, setPassword] = useState('Jaydeb@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid administrator credentials.');
      }

      showToast('Admin authentication successful! Redirecting...', 'success');
      window.location.href = '/admin';
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      showToast(err.message || 'Authentication error', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 space-y-6">
        {/* Brand & Security Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="pt-2">
            <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-purple-700 bg-purple-100 px-3 py-0.5 rounded-full border border-purple-200">
              Rankora Super Admin
            </span>
          </div>

          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed">
            Restricted gateway for system administration, plan management, and merchant operations.
          </p>
        </div>

        {/* Notice if logged in with non-admin account */}
        {currentUser && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-1">
            <p className="font-semibold">Account Switch Required</p>
            <p className="text-[11px] leading-relaxed text-amber-700">
              You are currently logged in as <strong className="font-mono">{currentUser.email}</strong>, which lacks administrative privileges. Authenticate below with your administrator credentials.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Email</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ceo@arventaventures.online"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-stone-900"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                <span>Password</span>
              </label>
              <button
                type="button"
                onClick={() => setPassword('Jaydeb@123')}
                className="text-[10px] text-purple-600 hover:text-purple-800 font-semibold cursor-pointer"
              >
                Auto-fill Default
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Jaydeb@123"
                className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-stone-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Administrator...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Credentials Info Box */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-left space-y-1.5 text-xs text-stone-600">
          <div className="flex items-center space-x-1.5 font-bold text-stone-800">
            <KeyRound className="w-3.5 h-3.5 text-purple-600" />
            <span>Administrator Credentials</span>
          </div>
          <p className="text-[11px] font-mono text-stone-600">
            Email: <strong className="text-purple-700">ceo@arventaventures.online</strong>
          </p>
          <p className="text-[11px] font-mono text-stone-600">
            Password: <strong className="text-purple-700">Jaydeb@123</strong>
          </p>
        </div>

        {/* Return to Dashboard */}
        {currentUser && (
          <div className="text-center pt-1">
            <a
              href="/dashboard"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Return to User Dashboard</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
