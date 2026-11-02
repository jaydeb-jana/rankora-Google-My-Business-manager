'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, Phone, Mail, Lock, ShieldCheck, RefreshCw, Sparkles, ArrowLeft, Check } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { Field, Alert, SubmitButton, DevOtpBanner, PasswordStrength, useCountdown } from '@/components/auth/AuthFields';
import OtpInput from '@/components/OtpInput';

function Steps({ step }) {
  const items = ['Business details', 'Verify email'];
  return (
    <div className="flex items-center gap-2 mb-6 rk-fade-up">
      {items.map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                done ? 'bg-[#1e8e3e] text-white rk-pop' : active ? 'bg-[#1a73e8] text-white shadow-md' : 'bg-[#f1f3f4] text-[#9aa0a6]'
              }`}
            >
              {done ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs font-semibold ${active || done ? 'text-[#202124]' : 'text-[#9aa0a6]'}`}>{label}</span>
            {i < items.length - 1 && (
              <div className="flex-1 h-0.5 rounded-full bg-[#e8eaed] overflow-hidden">
                <div className="h-full bg-[#1a73e8] transition-all duration-500" style={{ width: step > i ? '100%' : '0%' }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ businessName: '', ownerName: '', phone: '', email: '', password: '' });
  const [agree, setAgree] = useState(true);

  const [step, setStep] = useState(0);
  const [otpCode, setOtpCode] = useState('');
  const [devOtp, setDevOtp] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorKey, setErrorKey] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, startCooldown] = useCountdown();

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError('');
  };

  const fail = (msg) => {
    setSuccessMsg('');
    setError(msg);
    setErrorKey((k) => k + 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!/^[+\d][\d\s()-]{6,}$/.test(form.phone.trim())) return fail('Please enter a valid mobile number.');
    if (form.password.length < 6) return fail('Password must be at least 6 characters.');
    if (!agree) return fail('Please accept the honest review guidelines to continue.');

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setStep(1);
      setSuccessMsg(data.message || `We sent a verification code to ${form.email} (default: 1234).`);
      setDevOtp(data.devOtp || '1234');
      startCooldown(45);
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
        body: JSON.stringify({ email: form.email, code, purpose: 'VERIFY_EMAIL' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setStep(2);
      setSuccessMsg('Account activated! Setting up your dashboard…');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setOtpCode('');
      fail(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, purpose: 'VERIFY_EMAIL' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not resend code');
      setError('');
      setSuccessMsg('A new code is on its way.');
      setDevOtp(data.devOtp || null);
      startCooldown(45);
    } catch (err) {
      fail(err.message);
    }
  };

  return (
    <AuthLayout
      badge="Free forever · No card required"
      badgeIcon={Sparkles}
      title={step === 0 ? 'Create your account' : 'Check your inbox'}
      subtitle={
        step === 0 ? (
          'Set up your personalized review page in under 2 minutes.'
        ) : (
          <>
            Enter the 4-digit code (default: <strong className="text-[#1a73e8]">1234</strong>) sent to <strong className="text-[#202124]">{form.email}</strong>.
          </>
        )
      }
    >
      <Steps step={step} />
      <Alert shakeKey={errorKey}>{error}</Alert>
      <Alert type="success">{!error && successMsg}</Alert>

      {step === 0 ? (
        <form onSubmit={handleRegister} className="space-y-3.5">
          <Field id="businessName" label="Business name" icon={Building2} value={form.businessName} onChange={set('businessName')} required autoComplete="organization" delay={0.04} />
          <Field id="ownerName" label="Owner name" icon={User} value={form.ownerName} onChange={set('ownerName')} required autoComplete="name" delay={0.08} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field id="phone" label="Mobile number" type="tel" icon={Phone} value={form.phone} onChange={set('phone')} required autoComplete="tel" inputMode="tel" delay={0.12} />
            <Field id="email" label="Email address" type="email" icon={Mail} value={form.email} onChange={set('email')} required autoComplete="email" delay={0.16} />
          </div>
          <Field id="password" label="Create password" type="password" icon={Lock} value={form.password} onChange={set('password')} required minLength={6} autoComplete="new-password" delay={0.2} />
          <PasswordStrength password={form.password} />

          <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none rk-fade-up rk-delay-5">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#1a73e8]" />
            <span className="text-xs text-[#5f6368] leading-relaxed">
              I&apos;ll use Rankaro to collect <strong className="text-[#202124]">honest</strong> customer feedback — no fake reviews, incentives or review gating.
            </span>
          </label>

          <div className="pt-2 rk-fade-up rk-delay-6">
            <SubmitButton loading={loading} loadingText="Creating account…">
              Continue
            </SubmitButton>
          </div>

          <p className="text-center text-sm text-[#5f6368] pt-3">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-[#1a73e8] hover:underline">
              Sign in
            </a>
          </p>
        </form>
      ) : (
        <div className="space-y-6 rk-scale-in">
          <DevOtpBanner code={devOtp} onUse={() => { setOtpCode(devOtp); handleVerify(devOtp); }} />
          <OtpInput length={4} value={otpCode} onChange={setOtpCode} onComplete={handleVerify} />
          <p className="text-center text-xs text-[#70757a] -mt-2">Default test code: 1234 · Expires in 15 minutes</p>
          <SubmitButton type="button" onClick={() => handleVerify()} loading={loading} disabled={otpCode.length < 4} loadingText="Verifying…" icon={ShieldCheck}>
            Verify &amp; activate
          </SubmitButton>
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => { setStep(0); setOtpCode(''); setError(''); setSuccessMsg(''); }} className="inline-flex items-center gap-1 text-[#5f6368] hover:text-[#202124]">
              <ArrowLeft className="w-4 h-4" /> Edit details
            </button>
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={handleResend}
              className="inline-flex items-center gap-1.5 font-semibold text-[#1a73e8] hover:underline disabled:text-[#9aa0a6] disabled:no-underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
