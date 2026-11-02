'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  ExternalLink,
  Copy,
  Check,
  X,
  Star,
  Play,
  ArrowRight,
} from 'lucide-react';

export default function GoogleReviewAnimationGuide({
  isOpen,
  onClose,
  business,
  reviewText = '',
  onProceedToGoogle,
}) {
  const [lang, setLang] = useState('bn'); // 'bn' or 'en'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const utteranceRef = useRef(null);

  const googleUrl = business?.googleReviewUrl || '';
  const snippet = reviewText
    ? reviewText.length > 70
      ? reviewText.slice(0, 68) + '...'
      : reviewText
    : 'Outstanding service and very polite staff!';

  // Speech voice messages
  const speechText = {
    bn: 'আপনার জন্য একটি ৫-স্টার রিভিউ স্বয়ংক্রিয়ভাবে কপি করে দেওয়া হয়েছে। এবার গুগলে গিয়ে ৫-স্টার সিলেক্ট করুন, লেখাটি পেস্ট করে দিন এবং পোস্ট বাটনে ক্লিক করুন।',
    en: 'Your 5-star review has been automatically copied. Now select 5 stars on Google, paste your review, and tap Post!',
  };

  const speakGuide = (targetLang = lang) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (isMuted) return;

      const text = speechText[targetLang] || speechText.en;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang === 'bn' ? 'bn-BD' : 'en-US';
      utterance.rate = targetLang === 'bn' ? 0.95 : 1.0;
      utterance.pitch = 1.0;

      // Find natural voice if available
      const voices = window.speechSynthesis.getVoices();
      if (targetLang === 'bn') {
        const bnVoice = voices.find((v) => v.lang.startsWith('bn'));
        if (bnVoice) utterance.voice = bnVoice;
      } else {
        const enVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural')));
        if (enVoice) utterance.voice = enVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // Trigger speech when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        speakGuide(lang);
      }, 350);
      return () => {
        clearTimeout(timer);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const toggleMute = () => {
    if (isSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsMuted(true);
    } else {
      setIsMuted(false);
      speakGuide(lang);
    }
  };

  const handleSwitchLanguage = (newLang) => {
    setLang(newLang);
    speakGuide(newLang);
  };

  const handleCopyAgain = async () => {
    if (!reviewText) return;
    try {
      await navigator.clipboard.writeText(reviewText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black leading-tight">Review Copied!</h3>
              <p className="text-[10px] text-blue-100">Paste &amp; Post in 5 seconds</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Audio Language Switcher */}
            <div className="flex items-center bg-black/20 rounded-full p-0.5 border border-white/20 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => handleSwitchLanguage('bn')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  lang === 'bn' ? 'bg-white text-blue-900 shadow-2xs' : 'text-white/80 hover:text-white'
                }`}
                title="বাংলা কণ্ঠ শুনুন"
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => handleSwitchLanguage('en')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-white text-blue-900 shadow-2xs' : 'text-white/80 hover:text-white'
                }`}
                title="Listen in English"
              >
                English
              </button>
            </div>

            {/* Voice Mute/Replay Button */}
            <button
              type="button"
              onClick={toggleMute}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 animate-pulse'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isSpeaking ? 'Mute voice' : 'Play voice guide'}
            >
              {isSpeaking ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Audio Status Banner */}
        <div className="px-4 py-1.5 bg-blue-50/90 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
          <div className="flex items-center space-x-1.5 truncate">
            {isSpeaking ? (
              <>
                <span className="flex space-x-0.5 items-end h-3">
                  <span className="w-0.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.1s] h-2.5" />
                  <span className="w-0.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.25s] h-3.5" />
                  <span className="w-0.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.15s] h-2" />
                </span>
                <span className="font-semibold text-blue-800 truncate">
                  {lang === 'bn' ? 'ভয়েস গাইড বাজছে...' : 'Playing Voice Instructions...'}
                </span>
              </>
            ) : (
              <span className="text-slate-600 font-medium">
                {lang === 'bn' ? 'কথা শুনতে সাউন্ড বাটনে চাপুন' : 'Tap voice icon to replay audio'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => speakGuide(lang)}
            className="text-[10px] font-bold text-blue-700 hover:underline flex items-center space-x-1 shrink-0 cursor-pointer"
          >
            <Play className="w-2.5 h-2.5 fill-blue-700" />
            <span>{lang === 'bn' ? 'আবার বলুন' : 'Replay Voice'}</span>
          </button>
        </div>

        {/* Main Content Area: Phone Animation Container */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1 bg-slate-50">
          {/* Step Badges Tracker */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
            <div className="py-1 px-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center justify-center space-x-1">
              <span>1. Select 5★</span>
            </div>
            <div className="py-1 px-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200/80 flex items-center justify-center space-x-1">
              <span>2. Paste</span>
            </div>
            <div className="py-1 px-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/80 flex items-center justify-center space-x-1">
              <span>3. Tap Post</span>
            </div>
          </div>

          {/* CODE-CRAFTED ANIMATION CARD (Simulated Google Review Interface) */}
          <div className="relative rounded-2xl bg-white border-2 border-slate-200 p-3.5 shadow-sm overflow-hidden select-none">
            {/* Mock Google Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-2xs">
                  G
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-slate-900 leading-tight truncate max-w-[170px]">
                    {business?.businessName || 'Google Business'}
                  </h4>
                  <p className="text-[9px] text-slate-400">Posting publicly on Google</p>
                </div>
              </div>

              {/* Mock Google Post Button */}
              <div className="animate-post-btn px-3 py-1 rounded-full text-[10px] font-black transition-all shadow-2xs">
                Post
              </div>
            </div>

            {/* Mock 5 Stars Rating Bar */}
            <div className="py-3 flex flex-col items-center justify-center bg-slate-50/70 rounded-xl my-2 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 mb-1">Rate this business:</span>
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="relative">
                    <Star
                      className={`w-6 h-6 transition-all duration-300 ${
                        s === 5
                          ? 'animate-star-five'
                          : 'fill-amber-400 text-amber-400 drop-shadow-2xs'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Review Input Box with Animated Paste */}
            <div className="relative p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-left min-h-[75px] text-[11px] text-slate-700 leading-relaxed font-sans overflow-hidden">
              {/* Floating Animated "PASTE" tooltip */}
              <div className="animate-paste-tooltip absolute top-2 left-4 z-20 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[10px] font-bold shadow-lg flex items-center space-x-1">
                <Copy className="w-2.5 h-2.5" />
                <span>PASTE</span>
              </div>

              {/* Animated Text Content Reveal */}
              <div className="animate-text-reveal text-slate-800">
                &ldquo;{snippet}&rdquo;
              </div>

              {/* Placeholder when not pasted */}
              <div className="animate-placeholder-fade absolute inset-2.5 text-slate-400 text-[10px]">
                Share details of your own experience at this place...
              </div>
            </div>

            {/* Animated Pointer Hand / Finger */}
            <div className="animate-finger-move absolute pointer-events-none z-30">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-md text-slate-900 fill-slate-900"
              >
                <path
                  d="M10 2a2 2 0 0 0-2 2v7.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l5 5a1 1 0 0 0 .707.293H16a4 4 0 0 0 4-4V7a2 2 0 0 0-4 0v1h-1V5a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2z"
                  fill="#ffffff"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Quick Notice */}
          <p className="text-[10px] text-center text-slate-500 font-medium">
            Text is already on your clipboard. When Google opens, simply tap the box and select <strong>Paste</strong>!
          </p>
        </div>

        {/* Modal Bottom CTA Actions */}
        <div className="p-3.5 bg-white border-t border-slate-200/80 space-y-2 shrink-0">
          <button
            type="button"
            onClick={onProceedToGoogle}
            className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md transition-all duration-150 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer group"
          >
            <span>Open Google &amp; Paste Review</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <button
              type="button"
              onClick={handleCopyAgain}
              className="text-[11px] font-bold text-slate-600 hover:text-blue-600 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied again!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text Again</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* 60 FPS CSS Keyframes for Lag-Free Vector Animation */}
      <style jsx>{`
        /* Finger Movement Animation Across 3 Steps (6s Loop) */
        @keyframes fingerMove {
          0% {
            top: 75%;
            left: 70%;
            opacity: 0;
            transform: scale(0.9);
          }
          10% {
            top: 36%;
            left: 68%;
            opacity: 1;
            transform: scale(1);
          }
          18% {
            /* Tap 5th Star */
            top: 36%;
            left: 68%;
            transform: scale(0.85);
          }
          25% {
            top: 36%;
            left: 68%;
            transform: scale(1);
          }
          38% {
            /* Move into review text box */
            top: 66%;
            left: 32%;
            transform: scale(1);
          }
          45% {
            /* Tap inside box to trigger Paste tooltip */
            top: 66%;
            left: 32%;
            transform: scale(0.85);
          }
          52% {
            /* Tap Paste tooltip */
            top: 55%;
            left: 20%;
            transform: scale(0.85);
          }
          62% {
            /* Move to Post button */
            top: 14%;
            left: 82%;
            transform: scale(1);
          }
          70% {
            /* Tap Post button */
            top: 14%;
            left: 82%;
            transform: scale(0.85);
          }
          85% {
            top: 14%;
            left: 82%;
            opacity: 1;
            transform: scale(1);
          }
          95%,
          100% {
            top: 14%;
            left: 82%;
            opacity: 0;
          }
        }

        .animate-finger-move {
          animation: fingerMove 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* 5th Star Golden Pulse upon click */
        @keyframes starFive {
          0%,
          12% {
            fill: #cbd5e1;
            color: #94a3b8;
            transform: scale(1);
          }
          18% {
            fill: #fbbf24;
            color: #d97706;
            transform: scale(1.35) rotate(12deg);
          }
          24%,
          100% {
            fill: #fbbf24;
            color: #d97706;
            transform: scale(1);
          }
        }

        .animate-star-five {
          animation: starFive 6s ease-in-out infinite;
        }

        /* Floating Paste Tooltip */
        @keyframes pasteTooltip {
          0%,
          42% {
            opacity: 0;
            transform: translateY(4px) scale(0.9);
            visibility: hidden;
          }
          45%,
          53% {
            opacity: 1;
            transform: translateY(0) scale(1);
            visibility: visible;
          }
          55%,
          100% {
            opacity: 0;
            transform: translateY(-4px) scale(0.9);
            visibility: hidden;
          }
        }

        .animate-paste-tooltip {
          animation: pasteTooltip 6s ease-in-out infinite;
        }

        /* Review Text Reveal after Paste */
        @keyframes textReveal {
          0%,
          52% {
            opacity: 0;
            max-height: 0;
            transform: translateY(4px);
          }
          54%,
          100% {
            opacity: 1;
            max-height: 120px;
            transform: translateY(0);
          }
        }

        .animate-text-reveal {
          animation: textReveal 6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        /* Placeholder Fade */
        @keyframes placeholderFade {
          0%,
          52% {
            opacity: 1;
          }
          54%,
          100% {
            opacity: 0;
          }
        }

        .animate-placeholder-fade {
          animation: placeholderFade 6s ease-in-out infinite;
        }

        /* Post Button Highlight and Click */
        @keyframes postBtn {
          0%,
          65% {
            background-color: #e2e8f0;
            color: #64748b;
            transform: scale(1);
          }
          68% {
            background-color: #2563eb;
            color: #ffffff;
            transform: scale(1.05);
          }
          72% {
            background-color: #16a34a;
            color: #ffffff;
            transform: scale(0.95);
          }
          76%,
          100% {
            background-color: #16a34a;
            color: #ffffff;
            transform: scale(1);
          }
        }

        .animate-post-btn {
          animation: postBtn 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
