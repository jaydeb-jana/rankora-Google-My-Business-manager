'use client';
import { useEffect, useState } from 'react';
import { Star, ShieldCheck, Sparkles, QrCode, Copy, Check, ArrowLeft, MousePointerClick } from 'lucide-react';

const DEMO_REVIEWS = [
  {
    name: 'Priya S.',
    business: 'Smile Care Dental',
    text: 'The cleaning was gentle and completely painless. Dr. Mehta explained every step clearly and the front desk was so welcoming!',
    tags: ['Gentle Treatment', 'Clear Explanations'],
  },
  {
    name: 'Rahul K.',
    business: 'Urban Auto Works',
    text: 'Honest inspection with no pushy upsells. My car was ready before the promised time and the invoice was fully itemized.',
    tags: ['Honest Inspection', 'Fast Turnaround'],
  },
  {
    name: 'Ananya D.',
    business: 'Café Kolkata',
    text: 'Fresh, flavorful food and really attentive service. The ambience is cozy and our order arrived hot within minutes.',
    tags: ['Fresh Food', 'Attentive Service'],
  },
];

function TypingReview() {
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const review = DEMO_REVIEWS[index];

  useEffect(() => {
    if (chars < review.text.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 22);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setChars(0);
      setIndex((i) => (i + 1) % DEMO_REVIEWS.length);
    }, 2600);
    return () => clearTimeout(t);
  }, [chars, review.text.length]);

  const done = chars >= review.text.length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-2xl text-left w-full max-w-sm rk-float">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1a73e8] to-[#34a853] text-white font-bold text-sm flex items-center justify-center">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold text-[#202124]">{review.name}</p>
            <p className="text-[10px] text-[#5f6368]">{review.business}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-3.5 h-3.5 fill-[#fbbc04] text-[#fbbc04]" />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {review.tags.map((t) => (
          <span key={t} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[#e8f0fe] text-[#1a73e8]">
            ✓ {t}
          </span>
        ))}
      </div>

      <p className="text-[13px] leading-relaxed text-[#3c4043] min-h-[84px]">
        {review.text.slice(0, chars)}
        {!done && <span className="inline-block w-[2px] h-3.5 bg-[#1a73e8] align-middle ml-0.5 animate-pulse" />}
      </p>

      <div className="mt-3 pt-3 border-t border-[#f1f3f4] flex items-center justify-between">
        <span className="text-[10px] text-[#70757a] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#fbbc04]" /> Draft from confirmed selections
        </span>
        <span
          className={`text-[10px] font-semibold px-2 py-1 rounded-md flex items-center gap-1 transition-all duration-300 ${
            done ? 'bg-[#1e8e3e] text-white' : 'bg-[#f1f3f4] text-[#5f6368]'
          }`}
        >
          {done ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {done ? 'Copied' : 'Copy'}
        </span>
      </div>
    </div>
  );
}

export default function AuthLayout({ children, title, subtitle, badge, badgeIcon: BadgeIcon = Sparkles }) {
  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* LEFT: Animated brand showcase */}
      <aside className="relative hidden lg:flex lg:w-[46%] xl:w-[48%] flex-col justify-between p-10 xl:p-14 overflow-hidden text-white bg-gradient-to-br from-[#1a73e8] via-[#1557b0] to-[#0b3d91] rk-gradient">
        {/* animated blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#4285f4]/40 blur-3xl rk-blob pointer-events-none" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[28rem] h-[28rem] rounded-full bg-[#34a853]/25 blur-3xl rk-blob pointer-events-none" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-1/3 right-10 w-64 h-64 rounded-full bg-[#fbbc04]/15 blur-3xl rk-blob pointer-events-none" style={{ animationDelay: '-9s' }} />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        {/* top brand */}
        <div className="relative z-10 flex items-center justify-between rk-fade-up">
          <a href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo-white.png"
              alt="RANKORA"
              className="h-9 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </a>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#81c995]" /> Policy-compliant reviews
          </span>
        </div>

        {/* center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <h2 className="text-3xl xl:text-[2.6rem] font-extrabold leading-[1.15] max-w-md rk-fade-up rk-delay-1">
            Help happy customers say it{' '}
            <span className="bg-gradient-to-r from-[#fde293] to-[#81c995] bg-clip-text text-transparent">in their own words.</span>
          </h2>
          <p className="mt-4 text-sm text-blue-100/90 max-w-md leading-relaxed rk-fade-up rk-delay-2">
            Customers pick what they actually experienced, edit a natural draft, and post it on Google themselves — honest, fast, and effortless.
          </p>

          <div className="relative mt-10 rk-fade-up rk-delay-3">
            <TypingReview />

            {/* floating mini chips */}
            <div className="absolute -right-2 xl:right-6 -top-6 bg-white/15 backdrop-blur-md border border-white/25 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold rk-float-slow">
              <QrCode className="w-4 h-4" /> Scan → Review
            </div>
            <div
              className="absolute right-4 xl:right-16 -bottom-8 bg-white/15 backdrop-blur-md border border-white/25 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold rk-float-slow"
              style={{ animationDelay: '-4s' }}
            >
              <MousePointerClick className="w-4 h-4" /> Opens Google review
            </div>
          </div>
        </div>

        {/* bottom steps */}
        <div className="relative z-10 grid grid-cols-3 gap-3 rk-fade-up rk-delay-4">
          {[
            ['1', 'Scan QR'],
            ['2', 'Pick & edit'],
            ['3', 'Post on Google'],
          ].map(([n, label]) => (
            <div key={n} className="rounded-xl bg-white/10 border border-white/15 backdrop-blur px-3 py-2.5">
              <p className="text-[10px] text-blue-200 font-semibold">STEP {n}</p>
              <p className="text-xs font-bold mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT: Form area */}
      <main className="relative flex-1 flex flex-col min-h-screen bg-white">
        {/* soft background for mobile */}
        <div className="lg:hidden absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#e8f0fe] to-white pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between px-5 sm:px-10 pt-6">
          <a href="/" className="flex items-center gap-2 lg:hidden">
            <img
              src="/logo.png"
              alt="RANKORA"
              className="h-8 w-auto object-contain"
            />
          </a>
          <a
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#5f6368] hover:text-[#1a73e8] px-3 py-1.5 rounded-full hover:bg-[#f1f3f4] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </a>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-5 sm:px-10 py-8">
          <div className="w-full max-w-[440px]">
            <div className="mb-7 rk-fade-up">
              {badge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#e8f0fe] text-[#1a73e8] mb-4">
                  <BadgeIcon className="w-3.5 h-3.5" /> {badge}
                </span>
              )}
              <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-[#202124] leading-tight">{title}</h1>
              {subtitle && <p className="mt-2 text-sm text-[#5f6368] leading-relaxed">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>

        <p className="relative z-10 text-center text-[11px] text-[#9aa0a6] pb-6 px-6">
          Rankaro is independent software and is not affiliated with Google LLC.
        </p>
      </main>
    </div>
  );
}
