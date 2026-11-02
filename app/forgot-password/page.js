'use client';
import { useState } from 'react';
import { Mail, Lock, KeyRound, RefreshCw, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { Field, Alert, SubmitButton, DevOtpBanner, PasswordStrength, useCountdown } from '@/components/auth/AuthFields';
import OtpInput from '@/components/OtpInput';

export default function ForgotPasswordPage() {
  // REQUEST -> CODE -> PASSWORD -> DONE
  const [step, setStep] = useState('REQUEST');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const requestCode = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send reset code');
      setStep('CODE');
      setSuccessMsg(data.message || 'Verification code sent to your email.');
      startCooldown(45);
    } catch (err) {
      fail(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async (value = code) => {
    if (!value || value.length < 4) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: value, purpose: 'RESET_PASSWORD', checkOnly: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');
      setCode(value);
      setSuccessMsg('Code verified. Choose a new password.');
      setStep('PASSWORD');
    } catch (err) {
      setCode('');
      fail(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return fail('Password must be at least 6 characters.');
    if (newPassword !== confirmPassword) return fail('Passwords do not match.');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not reset password');
      setStep('DONE');
    } catch (err) {
      fail(err.message);
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    REQUEST: ['Forgot your password?', "No worries — enter your account email and we'll send you a reset code."],
    CODE: ['Enter reset code', <>Enter the 4-digit code sent to <strong className="text-[#202124]">{email}</strong>.</>],
    PASSWORD: ['Set a new password', 'Choose a strong password you haven’t used before.'],
    DONE: ['Password updated', 'You can now sign in with your new password.'],
  };

  const progress = { REQUEST: 1, CODE: 2, PASSWORD: 3, DONE: 3 }[step];

  return (
    <AuthLayout badge="Account recovery" badgeIcon={KeyRound} title={titles[step][0]} subtitle={titles[step][1]}>
      {/* progress bar */}
      <div className="grid grid-cols-3 gap-2 mb-6 rk-fade-up">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 rounded-full bg-[#e8eaed] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: i <= progress ? '100%' : '0%', background: step === 'DONE' ? '#1e8e3e' : '#1a73e8' }}
            />
          </div>
        ))}
      </div>

      {step !== 'DONE' && (
        <>
          <Alert shakeKey={errorKey}>{error}</Alert>
          <Alert type="success">{!error && successMsg}</Alert>
        </>
      )}

      {step === 'REQUEST' && (
        <form onSubmit={requestCode} className="space-y-5">
          <Field id="email" label="Account email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" delay={0.05} />
          <div className="rk-fade-up rk-delay-2">
            <SubmitButton loading={loading} loadingText="Sending code…">
              Send reset code
            </SubmitButton>
          </div>
          <a href="/login" className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#5f6368] hover:text-[#1a73e8] pt-2 rk-fade-up rk-delay-3">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </a>
        </form>
      )}

      {step === 'CODE' && (
        <div className="space-y-6 rk-scale-in">
          <OtpInput length={4} value={code} onChange={setCode} onComplete={confirmCode} />
          <SubmitButton type="button" onClick={() => confirmCode()} loading={loading} disabled={code.length < 4} loadingText="Checking…" icon={ShieldCheck}>
            Verify code
          </SubmitButton>
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => { setStep('REQUEST'); setCode(''); setError(''); setSuccessMsg(''); }} className="inline-flex items-center gap-1 text-[#5f6368] hover:text-[#202124]">
              <ArrowLeft className="w-4 h-4" /> Change email
            </button>
            <button
              type="button"
              disabled={cooldown > 0 || loading}
              onClick={() => requestCode()}
              className="inline-flex items-center gap-1.5 font-semibold text-[#1a73e8] hover:underline disabled:text-[#9aa0a6] disabled:no-underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>
      )}

      {step === 'PASSWORD' && (
        <form onSubmit={resetPassword} className="space-y-4 rk-scale-in">
          <Field id="newPassword" label="New password" type="password" icon={Lock} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
          <PasswordStrength password={newPassword} />
          <Field id="confirmPassword" label="Confirm new password" type="password" icon={Lock} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password" delay={0.05} />
          {confirmPassword && (
            <p className={`text-xs font-medium -mt-1 ${confirmPassword === newPassword ? 'text-[#1e8e3e]' : 'text-[#c5221f]'}`}>
              {confirmPassword === newPassword ? '✓ Passwords match' : 'Passwords do not match yet'}
            </p>
          )}
          <div className="pt-1">
            <SubmitButton loading={loading} loadingText="Saving…">
              Update password
            </SubmitButton>
          </div>
        </form>
      )}

      {step === 'DONE' && (
        <div className="text-center space-y-6 rk-scale-in">
          <div className="mx-auto w-20 h-20 rounded-full bg-[#e6f4ea] flex items-center justify-center rk-pop">
            <CheckCircle2 className="w-11 h-11 text-[#1e8e3e]" />
          </div>
          <p className="text-sm text-[#5f6368]">Your password was changed securely. For your safety, use it only on Rankaro.</p>
          <a
            href="/login"
            className="rk-btn-shine w-full h-[52px] flex items-center justify-center rounded-[14px] text-[15px] font-semibold text-white bg-[#1a73e8] hover:bg-[#1765cc] shadow-[0_6px_20px_-6px_rgba(26,115,232,0.6)] transition-all"
          >
            Continue to sign in
          </a>
        </div>
      )}
    </AuthLayout>
  );
}
