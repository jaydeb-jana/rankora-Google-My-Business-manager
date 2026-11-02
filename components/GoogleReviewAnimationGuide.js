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
  const audioRef = useRef(null);
  const audioCacheRef = useRef({});

  const googleUrl = business?.googleReviewUrl || '';
  const snippet = reviewText
    ? reviewText.length > 70
      ? reviewText.slice(0, 68) + '...'
      : reviewText
    : 'Outstanding service and very polite staff!';

  // Pre-load studio audio files on mount for zero-delay instant playback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const bnAudio = new Audio('/audio/review_guide_bn.mp3');
        bnAudio.preload = 'auto';
        const enAudio = new Audio('/audio/review_guide_en.mp3');
        enAudio.preload = 'auto';
        audioCacheRef.current = { bn: bnAudio, en: enAudio };
      } catch {}
    }
  }, []);

  // Fallback speech synthesis if audio file cannot be loaded
  const fallbackSpeechSynthesis = (targetLang) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const speechText = {
        bn: 'আপনার জন্য একটি ৫-স্টার রিভিউ স্বয়ংক্রিয়ভাবে কপি করা হয়েছে। এবার গুগলে গিয়ে ফাইভ স্টার দিন, লেখাটি পেস্ট করুন এবং পোস্ট বাটনে ক্লিক করুন।',
        en: 'Your 5-star review has been automatically copied. Now select 5 stars on Google, paste your review, and tap Post!',
      };
      const utterance = new SpeechSynthesisUtterance(speechText[targetLang] || speechText.en);
      utterance.lang = targetLang === 'bn' ? 'bn-BD' : 'en-US';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const stopAudio = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setIsSpeaking(false);
  };

  const playAudioGuide = (targetLang = lang) => {
    if (typeof window === 'undefined') return;
    try {
      stopAudio();
      if (isMuted) return;

      const audioSrc = targetLang === 'bn' ? '/audio/review_guide_bn.mp3' : '/audio/review_guide_en.mp3';
      const audio = new Audio(audioSrc);
      audio.preload = 'auto';

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        setIsSpeaking(false);
        fallbackSpeechSynthesis(targetLang);
      };

      audioRef.current = audio;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled if user hasn't interacted yet
          setIsSpeaking(false);
        });
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  // Trigger studio audio instantly when modal opens
  useEffect(() => {
    if (isOpen) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
      playAudioGuide(lang);

      return () => {
        if (typeof document !== 'undefined') {
          document.body.style.overflow = '';
        }
        stopAudio();
      };
    } else {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
      stopAudio();
    }
  }, [isOpen]);

  const toggleMute = () => {
    if (isSpeaking) {
      stopAudio();
      setIsMuted(true);
    } else {
      setIsMuted(false);
      playAudioGuide(lang);
    }
  };

  const handleSwitchLanguage = (newLang) => {
    setLang(newLang);
    playAudioGuide(newLang);
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
    <div className="fixed inset-0 z-50 bg-white w-full h-[100dvh] flex flex-col overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col h-full bg-white relative overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-4 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shrink-0 shadow-sm">
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
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  lang === 'bn' ? 'bg-white text-blue-900 shadow-2xs' : 'text-white/80 hover:text-white'
                }`}
                title="বাংলা কণ্ঠ শুনুন"
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => handleSwitchLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
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
              {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area: High-End Smartphone Animation Showcase */}
        <div className="flex-1 px-3 sm:px-4 py-2 sm:py-3 overflow-y-auto flex flex-col justify-between items-center bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 gap-2">
          {/* Synchronized 3-Step Badges */}
          <div className="w-full max-w-[340px] sm:max-w-[360px] flex items-center justify-between text-[11px] font-bold py-1 px-0.5 shrink-0">
            <div className="animate-step-badge-1 px-2.5 py-1 rounded-full border transition-all shadow-2xs flex items-center gap-1">
              <span>1. Tap 5★</span>
            </div>
            <div className="animate-step-badge-2 px-2.5 py-1 rounded-full border transition-all shadow-2xs flex items-center gap-1">
              <span>2. Paste Text</span>
            </div>
            <div className="animate-step-badge-3 px-2.5 py-1 rounded-full border transition-all shadow-2xs flex items-center gap-1">
              <span>3. Tap Post</span>
            </div>
          </div>

          {/* SMARTPHONE DEVICE MOCKUP */}
          <div className="w-full max-w-[330px] sm:max-w-[360px] bg-slate-900 p-2.5 sm:p-3 rounded-[34px] shadow-2xl ring-1 ring-slate-800 my-auto shrink-0">
            {/* Dynamic Island / Speaker */}
            <div className="flex justify-center items-center pb-2 pt-0.5">
              <div className="w-20 h-3.5 bg-slate-950 rounded-full flex items-center justify-between px-3 shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
              </div>
            </div>

            {/* Phone Screen Display */}
            <div className="relative w-full h-[330px] sm:h-[355px] bg-white rounded-[22px] overflow-hidden flex flex-col justify-between border border-slate-100 select-none shadow-inner">
              {/* Google 4-Color Accent Hairline */}
              <div className="h-1 w-full flex shrink-0">
                <div className="h-full w-1/4 bg-[#4285F4]" />
                <div className="h-full w-1/4 bg-[#EA4335]" />
                <div className="h-full w-1/4 bg-[#FBBC05]" />
                <div className="h-full w-1/4 bg-[#34A853]" />
              </div>

              {/* Simulated Google Header */}
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                    G
                  </div>
                  <div className="text-left">
                    <h4 className="text-[11px] font-black text-slate-900 leading-tight truncate max-w-[150px]">
                      {business?.businessName || 'Google Business'}
                    </h4>
                    <p className="text-[9px] text-slate-400">Posting publicly on Google</p>
                  </div>
                </div>

                {/* Dynamic Post Button */}
                <div className="animate-post-btn px-3.5 py-1 rounded-full text-[11px] font-black transition-all shadow-xs flex items-center gap-1">
                  <span className="animate-post-text-draft">Post</span>
                  <span className="animate-post-text-done">✓ Posted</span>
                </div>
              </div>

              {/* Body: 5 Stars + Input Box */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                {/* Rating Area */}
                <div className="py-2.5 px-3 bg-slate-50/90 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-500 mb-1">
                    Rate this business:
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className="relative">
                        <Star className="w-6 h-6 animate-stars" />
                      </div>
                    ))}
                  </div>
                  <div className="animate-rating-text text-[10px] font-black text-amber-600 mt-1 h-3 flex items-center justify-center">
                    ★★★★★ Excellent (5/5)
                  </div>
                </div>

                {/* Input Box Area */}
                <div className="relative p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-left min-h-[85px] text-[11px] leading-relaxed overflow-hidden">
                  {/* Floating Android/Google PASTE Tooltip */}
                  <div className="animate-paste-tooltip absolute top-2 left-5 z-20 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[10px] font-bold shadow-xl flex items-center space-x-1 border border-slate-700">
                    <Copy className="w-2.5 h-2.5 text-blue-400" />
                    <span>PASTE</span>
                    <div className="absolute -bottom-1 left-3.5 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700" />
                  </div>

                  {/* Animated Review Text with Blinking Cursor */}
                  <div className="animate-review-text text-slate-800 font-medium text-[11px] leading-relaxed">
                    &ldquo;{snippet}&rdquo;
                    <span className="animate-pulse text-blue-600 font-bold ml-0.5">|</span>
                  </div>

                  {/* Placeholder */}
                  <div className="animate-placeholder absolute inset-2.5 text-slate-400 text-[10px]">
                    Share details of your own experience at this place...
                  </div>
                </div>
              </div>

              {/* Touch Ripple Effect Indicator */}
              <div className="animate-touch-ripple absolute pointer-events-none z-20 rounded-full bg-blue-500/25 border-2 border-blue-500 shadow-md" />

              {/* Animated Ergonomic Pointing Hand Cursor */}
              <div className="animate-finger-move absolute pointer-events-none z-30">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-lg"
                >
                  <path
                    d="M10 2a2 2 0 0 0-2 2v7.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l5 5a1 1 0 0 0 .707.293H16a4 4 0 0 0 4-4V7a2 2 0 0 0-4 0v1h-1V5a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2z"
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Video Scrubber Timeline Progress Bar */}
          <div className="w-full max-w-[330px] sm:max-w-[360px] space-y-1 py-1 shrink-0">
            <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
              <div className="animate-progress-bar h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] space-y-2 shrink-0">
          <button
            type="button"
            onClick={onProceedToGoogle}
            className="w-full py-4 px-5 rounded-2xl text-sm sm:text-base font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md transition-all duration-150 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer group"
          >
            <span>Open Google &amp; Paste Review</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <div className="flex items-center justify-center text-xs pt-1">
            <button
              type="button"
              onClick={handleCopyAgain}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center space-x-1 cursor-pointer transition-colors py-0.5"
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
          </div>
        </div>
      </div>

      {/* 60 FPS CSS Keyframes for High-Fidelity Vector Animation */}
      <style jsx>{`
        /* 8-Second Loop for Finger Movement */
        @keyframes fingerMove {
          0% {
            top: 88%;
            left: 78%;
            opacity: 0;
            transform: scale(0.9);
          }
          8% {
            top: 68%;
            left: 74%;
            opacity: 1;
            transform: scale(1);
          }
          18% {
            top: 31%;
            left: 73%;
            transform: scale(1);
          }
          22% {
            /* TAP STAR 5 */
            top: 31%;
            left: 73%;
            transform: scale(0.82);
          }
          26% {
            top: 31%;
            left: 73%;
            transform: scale(1);
          }
          34% {
            top: 66%;
            left: 35%;
            transform: scale(1);
          }
          38% {
            /* TAP BOX */
            top: 66%;
            left: 35%;
            transform: scale(0.82);
          }
          42% {
            top: 66%;
            left: 35%;
            transform: scale(1);
          }
          47% {
            top: 55%;
            left: 20%;
            transform: scale(1);
          }
          50% {
            /* TAP PASTE */
            top: 55%;
            left: 20%;
            transform: scale(0.82);
          }
          53% {
            top: 55%;
            left: 20%;
            transform: scale(1);
          }
          62% {
            top: 4%;
            left: 81%;
            transform: scale(1);
          }
          67% {
            /* TAP POST */
            top: 4%;
            left: 81%;
            transform: scale(0.82);
          }
          72% {
            top: 4%;
            left: 81%;
            transform: scale(1);
          }
          86% {
            top: 4%;
            left: 81%;
            opacity: 1;
          }
          94%,
          100% {
            top: 4%;
            left: 81%;
            opacity: 0;
          }
        }

        .animate-finger-move {
          animation: fingerMove 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* Touch Ripple Indicator */
        @keyframes touchRipple {
          0%, 20% {
            opacity: 0;
            top: 31%;
            left: 73%;
            width: 32px;
            height: 32px;
            transform: translate(-50%, -50%) scale(0.2);
          }
          22% {
            opacity: 0.9;
            top: 31%;
            left: 73%;
            transform: translate(-50%, -50%) scale(0.6);
          }
          26% {
            opacity: 0;
            top: 31%;
            left: 73%;
            transform: translate(-50%, -50%) scale(2.2);
          }
          27%, 36% {
            opacity: 0;
            top: 66%;
            left: 35%;
            transform: translate(-50%, -50%) scale(0.2);
          }
          38% {
            opacity: 0.9;
            top: 66%;
            left: 35%;
            transform: translate(-50%, -50%) scale(0.6);
          }
          42% {
            opacity: 0;
            top: 66%;
            left: 35%;
            transform: translate(-50%, -50%) scale(2.2);
          }
          48% {
            opacity: 0;
            top: 55%;
            left: 20%;
            transform: translate(-50%, -50%) scale(0.2);
          }
          50% {
            opacity: 0.9;
            top: 55%;
            left: 20%;
            transform: translate(-50%, -50%) scale(0.6);
          }
          53% {
            opacity: 0;
            top: 55%;
            left: 20%;
            transform: translate(-50%, -50%) scale(2.0);
          }
          55%, 65% {
            opacity: 0;
            top: 4%;
            left: 81%;
            transform: translate(-50%, -50%) scale(0.2);
          }
          67% {
            opacity: 0.9;
            top: 4%;
            left: 81%;
            transform: translate(-50%, -50%) scale(0.6);
          }
          72% {
            opacity: 0;
            top: 4%;
            left: 81%;
            transform: translate(-50%, -50%) scale(2.2);
          }
          73%, 100% {
            opacity: 0;
          }
        }

        .animate-touch-ripple {
          animation: touchRipple 8s ease-out infinite;
        }

        /* 5-Star Lighting Up together upon click */
        @keyframes starsLightUp {
          0%, 21% {
            fill: transparent;
            color: #cbd5e1;
            transform: scale(1);
            filter: none;
          }
          23% {
            fill: #f59e0b;
            color: #f59e0b;
            transform: scale(1.22);
            filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.7));
          }
          27% {
            fill: #f59e0b;
            color: #f59e0b;
            transform: scale(1);
            filter: drop-shadow(0 1px 2px rgba(245, 158, 11, 0.4));
          }
          92% {
            fill: #f59e0b;
            color: #f59e0b;
            opacity: 1;
          }
          96%, 100% {
            fill: transparent;
            color: #cbd5e1;
            transform: scale(1);
            filter: none;
          }
        }

        .animate-stars {
          animation: starsLightUp 8s ease-in-out infinite;
        }

        /* Rating Text Appears */
        @keyframes ratingTextAnim {
          0%, 22% {
            opacity: 0;
            transform: translateY(3px);
          }
          25%, 92% {
            opacity: 1;
            transform: translateY(0);
          }
          96%, 100% {
            opacity: 0;
            transform: translateY(-3px);
          }
        }

        .animate-rating-text {
          animation: ratingTextAnim 8s ease-in-out infinite;
        }

        /* Floating Paste Tooltip */
        @keyframes pasteTooltipAnim {
          0%, 37% {
            opacity: 0;
            transform: translateY(6px) scale(0.85);
            pointer-events: none;
          }
          40%, 49% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          52%, 100% {
            opacity: 0;
            transform: translateY(-4px) scale(0.85);
          }
        }

        .animate-paste-tooltip {
          animation: pasteTooltipAnim 8s ease-in-out infinite;
        }

        /* Review Text Drop-in Reveal */
        @keyframes reviewTextRevealAnim {
          0%, 50% {
            opacity: 0;
            max-height: 0;
            transform: translateY(3px);
          }
          53%, 92% {
            opacity: 1;
            max-height: 120px;
            transform: translateY(0);
          }
          96%, 100% {
            opacity: 0;
            max-height: 0;
            transform: translateY(3px);
          }
        }

        .animate-review-text {
          animation: reviewTextRevealAnim 8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        /* Placeholder Fade */
        @keyframes placeholderFadeAnim {
          0%, 50% {
            opacity: 1;
          }
          53%, 92% {
            opacity: 0;
          }
          96%, 100% {
            opacity: 1;
          }
        }

        .animate-placeholder {
          animation: placeholderFadeAnim 8s ease-in-out infinite;
        }

        /* Post Button Color States */
        @keyframes postBtnAnim {
          0%, 51% {
            background-color: #f1f5f9;
            color: #94a3b8;
            transform: scale(1);
            box-shadow: none;
          }
          54% {
            background-color: #1a73e8;
            color: #ffffff;
            transform: scale(1.05);
            box-shadow: 0 2px 8px rgba(26, 115, 232, 0.4);
          }
          57%, 66% {
            background-color: #1a73e8;
            color: #ffffff;
            transform: scale(1);
            box-shadow: 0 1px 4px rgba(26, 115, 232, 0.3);
          }
          68% {
            background-color: #1a73e8;
            color: #ffffff;
            transform: scale(0.92);
          }
          70%, 92% {
            background-color: #16a34a;
            color: #ffffff;
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(22, 163, 74, 0.4);
          }
          96%, 100% {
            background-color: #f1f5f9;
            color: #94a3b8;
            transform: scale(1);
            box-shadow: none;
          }
        }

        .animate-post-btn {
          animation: postBtnAnim 8s ease-in-out infinite;
        }

        @keyframes postTextDraftAnim {
          0%, 69% {
            display: inline;
            opacity: 1;
          }
          70%, 93% {
            display: none;
            opacity: 0;
          }
          95%, 100% {
            display: inline;
            opacity: 1;
          }
        }

        .animate-post-text-draft {
          animation: postTextDraftAnim 8s step-end infinite;
        }

        @keyframes postTextDoneAnim {
          0%, 69% {
            display: none;
            opacity: 0;
          }
          70%, 93% {
            display: inline;
            opacity: 1;
          }
          95%, 100% {
            display: none;
            opacity: 0;
          }
        }

        .animate-post-text-done {
          animation: postTextDoneAnim 8s step-end infinite;
        }

        /* 3-Step Badge Sync Animations */
        @keyframes stepBadge1Anim {
          0%, 28% {
            background-color: #eff6ff;
            border-color: #3b82f6;
            color: #1d4ed8;
            transform: scale(1.04);
          }
          31%, 100% {
            background-color: #ffffff;
            border-color: #e2e8f0;
            color: #64748b;
            transform: scale(1);
          }
        }

        .animate-step-badge-1 {
          animation: stepBadge1Anim 8s ease-in-out infinite;
        }

        @keyframes stepBadge2Anim {
          0%, 28% {
            background-color: #ffffff;
            border-color: #e2e8f0;
            color: #64748b;
            transform: scale(1);
          }
          31%, 58% {
            background-color: #eff6ff;
            border-color: #3b82f6;
            color: #1d4ed8;
            transform: scale(1.04);
          }
          61%, 100% {
            background-color: #ffffff;
            border-color: #e2e8f0;
            color: #64748b;
            transform: scale(1);
          }
        }

        .animate-step-badge-2 {
          animation: stepBadge2Anim 8s ease-in-out infinite;
        }

        @keyframes stepBadge3Anim {
          0%, 58% {
            background-color: #ffffff;
            border-color: #e2e8f0;
            color: #64748b;
            transform: scale(1);
          }
          61%, 92% {
            background-color: #f0fdf4;
            border-color: #22c55e;
            color: #15803d;
            transform: scale(1.04);
          }
          95%, 100% {
            background-color: #ffffff;
            border-color: #e2e8f0;
            color: #64748b;
            transform: scale(1);
          }
        }

        .animate-step-badge-3 {
          animation: stepBadge3Anim 8s ease-in-out infinite;
        }

        /* Progress Scrubber */
        @keyframes progressBarAnim {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-progress-bar {
          animation: progressBarAnim 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
