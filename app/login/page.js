'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck, RefreshCw, LogIn, ArrowLeft } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { Field, Alert, SubmitButton, DevOtpBanner, useCountdown } from '@/components/auth/AuthFields';
import OtpInput from '@/components/OtpInput';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [requireOtp, setRequireOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [devOtp, setDevOtp] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorKey, setErrorKey] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, startCooldown] = useCountdown();

  const fail = (msg) => {
    setSuccessMsg('');
    setError(msg);
    setErrorKey((k) => k + 1);
  };

  const sendVerificationCode = async (targetEmail = email) => {
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, purpose: 'VERIFY_EMAIL' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send code');
      setError('');
      setSuccessMsg(data.message || `A verification code was sent to ${targetEmail}.`);
      startCooldown(45);
    } catch (err) {
      fail(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.requireOtp) {
          setRequireOtp(true);
          await sendVerificationCode(email);
          return;
        }
        throw new Error(data.error || 'Invalid email or password.');
      }
      const targetUrl = data.redirectTo || (data.user?.isAdmin ? '/admin' : '/dashboard');
      setSuccessMsg(data.user?.isAdmin ? 'Signed in as Administrator! Opening Admin Control Center…' : 'Signed in! Opening your dashboard…');
      router.push(targetUrl);
      router.refresh();
    } catch (err) {
      fail(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (code = otpCode) => {
    if (!code || code.length < 4) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, purpose: 'VERIFY_EMAIL' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setSuccessMsg('Email verified! Opening your dashboard…');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setOtpCode('');
      fail(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (requireOtp) {
    return (
      <AuthLayout
        badge="Email verification"
        badgeIcon={ShieldCheck}
        title="Verify your email"
        subtitle={
          <>
            Your account isn&apos;t activated yet. Enter the 4-digit code sent to <strong className="text-[#202124]">{email}</strong>.
          </>
        }
      >
        <Alert shakeKey={errorKey}>{error}</Alert>
        <Alert type="success">{!error && successMsg}</Alert>

        <div className="space-y-6 rk-scale-in">
          <OtpInput length={4} value={otpCode} onChange={setOtpCode} onComplete={handleVerify} />
          <SubmitButton type="button" onClick={() => handleVerify()} loading={loading} disabled={otpCode.length < 4} loadingText="Verifying…" icon={ShieldCheck}>
            Verify &amp; continue
          </SubmitButton>
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => { setRequireOtp(false); setError(''); setSuccessMsg(''); }} className="inline-flex items-center gap-1 text-[#5f6368] hover:text-[#202124]">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={() => sendVerificationCode()}
              className="inline-flex items-center gap-1.5 font-semibold text-[#1a73e8] hover:underline disabled:text-[#9aa0a6] disabled:no-underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      badge="Business owner portal"
      badgeIcon={LogIn}
      title="Welcome back"
      subtitle="Sign in to manage your review page, QR codes and analytics."
    >
      <Alert shakeKey={errorKey}>{error}</Alert>
      <Alert type="success">{!error && successMsg}</Alert>

      <form onSubmit={handleLogin} className="space-y-4">
        <Field id="email" label="Email address" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" delay={0.05} />
        <Field id="password" label="Password" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" delay={0.1} />

        <div className="flex items-center justify-end rk-fade-up rk-delay-3">
          <a href="/forgot-password" className="text-sm font-semibold text-[#1a73e8] hover:text-[#1557b0] hover:underline">
            Forgot password?
          </a>
        </div>

        <div className="pt-1 rk-fade-up rk-delay-4">
          <SubmitButton loading={loading} loadingText="Signing in…">
            Sign in
          </SubmitButton>
        </div>
      </form>

      <div className="my-7 flex items-center gap-3 rk-fade-up rk-delay-5">
        <div className="h-px flex-1 bg-[#e8eaed]" />
        <span className="text-xs text-[#9aa0a6]">New to Rankaro?</span>
        <div className="h-px flex-1 bg-[#e8eaed]" />
      </div>

      <a
        href="/register"
        className="rk-fade-up rk-delay-6 w-full h-[50px] flex items-center justify-center rounded-[14px] border-[1.5px] border-[#dadce0] text-[15px] font-semibold text-[#1a73e8] hover:bg-[#f8f9fa] hover:border-[#1a73e8] transition-all"
      >
        Create a free business account
      </a>
    </AuthLayout>
  );
}
