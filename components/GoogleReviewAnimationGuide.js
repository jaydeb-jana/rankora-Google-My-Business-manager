'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  ExternalLink,
  Copy,
  Check,
  X,
  MapPin,
  Camera,
} from 'lucide-react';
import { copyTextToClipboard } from '@/lib/clipboard';

const DURATION_BN = 10.34;
const DURATION_EN = 9.05;

export default function GoogleReviewAnimationGuide({
  isOpen,
  onClose,
  business,
  reviewText = '',
  onProceedToGoogle,
}) {
  const [lang, setLang] = useState('bn'); // 'bn' (West Bengal Indian Bengali) or 'en' (Indian English)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isProceeding, setIsProceeding] = useState(false);
  const [animStep, setAnimStep] = useState(0); // 0: intro, 1: 5-star, 2: paste tooltip, 3: text pasted, 4: post clicked at top-right
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 100%
  const [fingerState, setFingerState] = useState({
    x: 260,
    y: 280,
    opacity: 0,
    isClicking: false,
    isMoving: true,
  });

  const audioRef = useRef(null);
  const rafRef = useRef(null);
  const virtualClockRef = useRef(0);
  const lastTimestampRef = useRef(null);
  const loopTimeoutRef = useRef(null);

  const containerRef = useRef(null);
  const star5Ref = useRef(null);
  const boxRef = useRef(null);
  const pasteRef = useRef(null);
  const topPostRef = useRef(null);

  const snippet = reviewText
    ? reviewText.length > 75
      ? reviewText.slice(0, 72) + '...'
      : reviewText
    : 'Excellent service and polite behavior. Highly recommended!';

  // Helper to obtain target coordinates relative to the modal container
  const getTargetCenter = useCallback((targetRef) => {
    if (!containerRef.current || !targetRef?.current) return null;
    const c = containerRef.current.getBoundingClientRect();
    const t = targetRef.current.getBoundingClientRect();
    return {
      x: t.left - c.left + t.width / 2,
      y: t.top - c.top + t.height / 2,
    };
  }, []);

  // Synchronous stop of audio and animation loops
  const stopPlayback = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}
    }
    virtualClockRef.current = 0;
    lastTimestampRef.current = null;
    setIsSpeaking(false);
  }, []);

  // Frame-by-Frame Timeline Synchronizer (Matches Bengali & English Voiceover)
  const syncTimelineFrame = useCallback(
    (currentSec, activeLang) => {
      if (activeLang === 'bn') {
        // Bengali Voice Timeline: Total 10.34s
        // 0.0s - 3.8s: "আপনার জন্য একটি ফাইভ স্টার রিভিউ কপি করা হয়েছে।" (Intro)
        if (currentSec < 3.8) {
          setAnimStep(0);
          if (currentSec < 0.8) {
            setFingerState((prev) => ({ ...prev, opacity: 0, isClicking: false }));
          } else {
            // Hover near center ready to point
            setFingerState({
              x: 260,
              y: 280,
              opacity: 0.7,
              isClicking: false,
              isMoving: true,
            });
          }
        }
        // 3.8s - 6.2s: "এবার ফাইভ স্টার সিলেক্ট করুন..." (Star 5 Selection)
        else if (currentSec < 6.2) {
          const starCoords = getTargetCenter(star5Ref);
          if (starCoords) {
            if (currentSec < 4.9) {
              // Gliding to Star 5
              setFingerState({
                x: starCoords.x,
                y: starCoords.y,
                opacity: 1,
                isClicking: false,
                isMoving: true,
              });
            } else if (currentSec >= 4.9 && currentSec < 5.3) {
              // Tapping Star 5!
              setFingerState({
                x: starCoords.x,
                y: starCoords.y,
                opacity: 1,
                isClicking: true,
                isMoving: false,
              });
            } else {
              setFingerState({
                x: starCoords.x,
                y: starCoords.y,
                opacity: 1,
                isClicking: false,
                isMoving: false,
              });
            }
          }
          if (currentSec >= 5.0) {
            setAnimStep(1);
          } else {
            setAnimStep(0);
          }
        }
        // 6.2s - 8.2s: "...লেখাটি পেস্ট করুন..." (Review Box & Paste Action)
        else if (currentSec < 8.2) {
          setAnimStep((prev) => (prev < 1 ? 1 : prev));
          const boxCoords = getTargetCenter(boxRef);
          const pasteCoords = getTargetCenter(pasteRef);

          if (currentSec < 7.0 && boxCoords) {
            // Glide to review box
            setFingerState({
              x: boxCoords.x,
              y: boxCoords.y - 10,
              opacity: 1,
              isClicking: false,
              isMoving: true,
            });
          } else if (currentSec >= 7.0 && currentSec < 7.4 && boxCoords) {
            // Tap review box -> shows PASTE tooltip
            setAnimStep(2);
            setFingerState({
              x: boxCoords.x,
              y: boxCoords.y - 10,
              opacity: 1,
              isClicking: true,
              isMoving: false,
            });
          } else if (currentSec >= 7.4 && currentSec < 7.7 && pasteCoords) {
            // Move to PASTE tooltip
            setAnimStep(2);
            setFingerState({
              x: pasteCoords.x,
              y: pasteCoords.y,
              opacity: 1,
              isClicking: false,
              isMoving: true,
            });
          } else if (currentSec >= 7.7 && pasteCoords) {
            // Tap PASTE -> text drops in!
            setAnimStep(3);
            setFingerState({
              x: pasteCoords.x,
              y: pasteCoords.y,
              opacity: 1,
              isClicking: true,
              isMoving: false,
            });
          }
        }
        // 8.2s - 9.8s: "...এবং Post বাটনে ক্লিক করুন।" (Tap the Top-Right Post Button!)
        else if (currentSec < 9.8) {
          const postCoords = getTargetCenter(topPostRef);
          if (postCoords) {
            if (currentSec < 8.8) {
              // Gliding up to the top-right Post button
              setFingerState({
                x: postCoords.x,
                y: postCoords.y,
                opacity: 1,
                isClicking: false,
                isMoving: true,
              });
            } else if (currentSec >= 8.8 && currentSec < 9.3) {
              // Tapping the top-right Post button!
              setAnimStep(4);
              setFingerState({
                x: postCoords.x,
                y: postCoords.y,
                opacity: 1,
                isClicking: true,
                isMoving: false,
              });
            } else {
              setAnimStep(4);
              setFingerState({
                x: postCoords.x,
                y: postCoords.y,
                opacity: 1,
                isClicking: false,
                isMoving: false,
              });
            }
          }
        }
        // 9.8s - 10.34s: Completion and fade
        else {
          setAnimStep(4);
          setFingerState((prev) => ({ ...prev, opacity: 0, isClicking: false }));
        }
      } else {
        // English Voice Timeline: Total 9.05s
        // 0.0s - 3.2s: "Your 5-star review has been automatically copied."
        if (currentSec < 3.2) {
          setAnimStep(0);
          if (currentSec < 0.8) {
            setFingerState((prev) => ({ ...prev, opacity: 0, isClicking: false }));
          } else {
            setFingerState({
              x: 260,
              y: 280,
              opacity: 0.7,
              isClicking: false,
              isMoving: true,
            });
          }
        }
        // 3.2s - 5.4s: "Select 5 stars..."
        else if (currentSec < 5.4) {
          const starCoords = getTargetCenter(star5Ref);
          if (starCoords) {
            if (currentSec < 4.3) {
              setFingerState({
                x: starCoords.x,
                y: starCoords.y,
                opacity: 1,
                isClicking: false,
                isMoving: true,
              });
            } else if (currentSec >= 4.3 && currentSec < 4.7) {
              setFingerState({
                x: starCoords.x,
                y: starCoords.y,
                opacity: 1,
                isClicking: true,
                isMoving: false,
              });
            } else {
              setFingerState({
                x: starCoords.x,
                y: starCoords.y,
                opacity: 1,
                isClicking: false,
                isMoving: false,
              });
            }
          }
          if (currentSec >= 4.4) {
            setAnimStep(1);
          } else {
            setAnimStep(0);
          }
        }
        // 5.4s - 7.2s: "...paste your review..."
        else if (currentSec < 7.2) {
          setAnimStep((prev) => (prev < 1 ? 1 : prev));
          const boxCoords = getTargetCenter(boxRef);
          const pasteCoords = getTargetCenter(pasteRef);

          if (currentSec < 6.0 && boxCoords) {
            setFingerState({
              x: boxCoords.x,
              y: boxCoords.y - 10,
              opacity: 1,
              isClicking: false,
              isMoving: true,
            });
          } else if (currentSec >= 6.0 && currentSec < 6.4 && boxCoords) {
            setAnimStep(2);
            setFingerState({
              x: boxCoords.x,
              y: boxCoords.y - 10,
              opacity: 1,
              isClicking: true,
              isMoving: false,
            });
          } else if (currentSec >= 6.4 && currentSec < 6.7 && pasteCoords) {
            setAnimStep(2);
            setFingerState({
              x: pasteCoords.x,
              y: pasteCoords.y,
              opacity: 1,
              isClicking: false,
              isMoving: true,
            });
          } else if (currentSec >= 6.7 && pasteCoords) {
            setAnimStep(3);
            setFingerState({
              x: pasteCoords.x,
              y: pasteCoords.y,
              opacity: 1,
              isClicking: true,
              isMoving: false,
            });
          }
        }
        // 7.2s - 8.6s: "...and tap Post!"
        else if (currentSec < 8.6) {
          const postCoords = getTargetCenter(topPostRef);
          if (postCoords) {
            if (currentSec < 7.8) {
              setFingerState({
                x: postCoords.x,
                y: postCoords.y,
                opacity: 1,
                isClicking: false,
                isMoving: true,
              });
            } else if (currentSec >= 7.8 && currentSec < 8.2) {
              setAnimStep(4);
              setFingerState({
                x: postCoords.x,
                y: postCoords.y,
                opacity: 1,
                isClicking: true,
                isMoving: false,
              });
            } else {
              setAnimStep(4);
              setFingerState({
                x: postCoords.x,
                y: postCoords.y,
                opacity: 1,
                isClicking: false,
                isMoving: false,
              });
            }
          }
        }
        // 8.6s - 9.05s: Finish and fade
        else {
          setAnimStep(4);
          setFingerState((prev) => ({ ...prev, opacity: 0, isClicking: false }));
        }
      }
    },
    [getTargetCenter]
  );

  // Core Playback Driver: Combines Audio Playback with 60 FPS requestAnimationFrame
  const startGuide = useCallback(
    (targetLang = lang) => {
      if (typeof window === 'undefined') return;
      stopPlayback();

      const totalDuration = targetLang === 'bn' ? DURATION_BN : DURATION_EN;
      setAnimStep(0);
      setPlaybackProgress(0);
      setFingerState({
        x: 260,
        y: 280,
        opacity: 0,
        isClicking: false,
        isMoving: true,
      });

      let audioObj = null;

      if (!isMuted) {
        const audioSrc =
          targetLang === 'bn'
            ? `/audio/review_guide_bn.mp3?v=${Date.now()}`
            : `/audio/review_guide_en.mp3?v=${Date.now()}`;
        audioObj = new Audio(audioSrc);
        audioObj.preload = 'auto';

        const playPromise = audioObj.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsSpeaking(true);
            })
            .catch(() => {
              // Smooth fallback to virtual timer if autoplay policy blocks
              setIsSpeaking(false);
            });
        }
        audioRef.current = audioObj;
      }

      virtualClockRef.current = 0;
      lastTimestampRef.current = performance.now();

      // 60 FPS Smooth Driver Loop
      const stepFrame = (now) => {
        const delta = (now - (lastTimestampRef.current || now)) / 1000;
        lastTimestampRef.current = now;

        let currentSec = 0;
        if (audioObj && !audioObj.paused && !audioObj.ended) {
          currentSec = audioObj.currentTime;
        } else {
          virtualClockRef.current += delta;
          currentSec = virtualClockRef.current;
        }

        if (currentSec >= totalDuration) {
          setPlaybackProgress(100);
          setAnimStep(4);
          stopPlayback();

          // Smooth loop after 1.8s
          loopTimeoutRef.current = setTimeout(() => {
            startGuide(targetLang);
          }, 1800);
          return;
        }

        const pct = Math.min(100, Math.max(0, (currentSec / totalDuration) * 100));
        setPlaybackProgress(pct);
        syncTimelineFrame(currentSec, targetLang);

        rafRef.current = requestAnimationFrame(stepFrame);
      };

      rafRef.current = requestAnimationFrame(stepFrame);
    },
    [lang, isMuted, stopPlayback, syncTimelineFrame]
  );

  useEffect(() => {
    if (isOpen) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
      startGuide(lang);
      return () => {
        if (typeof document !== 'undefined') {
          document.body.style.overflow = '';
        }
        stopPlayback();
      };
    } else {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
      stopPlayback();
    }
  }, [isOpen, lang, startGuide, stopPlayback]);

  const toggleMute = () => {
    if (isSpeaking || !isMuted) {
      stopPlayback();
      setIsMuted(true);
      setTimeout(() => startGuide(lang), 50);
    } else {
      setIsMuted(false);
      setTimeout(() => startGuide(lang), 50);
    }
  };

  const handleSwitchLanguage = (newLang) => {
    setLang(newLang);
    startGuide(newLang);
  };

  const handleCopyAgain = async () => {
    if (!reviewText) return;
    try {
      await copyTextToClipboard(reviewText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleProceedClick = async () => {
    if (isProceeding) return;
    setIsProceeding(true);

    // 1. Force bulletproof clipboard copy of the customer's review text
    if (reviewText) {
      await copyTextToClipboard(reviewText);
    }
    setCopied(true);

    // 2. Short visual confirmation so customer sees "✓ Review Copied! Opening Google..."
    setTimeout(() => {
      if (onProceedToGoogle) {
        onProceedToGoogle();
      } else if (business?.googleReviewUrl) {
        window.open(business.googleReviewUrl, '_blank', 'noopener,noreferrer');
      }
      setTimeout(() => setIsProceeding(false), 2500);
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs w-full h-[100dvh] flex flex-col justify-end sm:justify-center items-center overflow-hidden animate-in fade-in duration-200">
      <div
        ref={containerRef}
        className="w-full max-w-md bg-white h-full sm:h-[94vh] sm:rounded-3xl shadow-2xl flex flex-col relative overflow-hidden select-none"
      >
        {/* Rankaro Official Branded Top Bar */}
        <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-2.5">
            {/* Rankaro Signature Logo Badge */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 text-white shadow-md font-black text-base shrink-0 border border-white/20">
              R
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-indigo-700 rounded-full shadow-xs" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-black tracking-tight text-white">Rankaro</span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[9px] font-extrabold uppercase tracking-wider text-sky-200 border border-white/10 leading-none">
                  Review Copied!
                </span>
              </div>
              <p className="text-[11px] font-medium text-blue-100/90 leading-tight mt-0.5">
                Paste &amp; Post on Google in 5 seconds
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Audio Voice Language Switcher */}
            <div className="flex items-center bg-black/25 backdrop-blur-md rounded-full p-0.5 border border-white/15 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleSwitchLanguage('bn')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-white text-blue-900 shadow-sm font-black'
                    : 'text-white/80 hover:text-white'
                }`}
                title="West Bengal Bengali voice guide"
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => handleSwitchLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white text-blue-900 shadow-sm font-black'
                    : 'text-white/80 hover:text-white'
                }`}
                title="English voice guide"
              >
                EN
              </button>
            </div>

            {/* Voice Mute / Replay Button */}
            <button
              type="button"
              onClick={toggleMute}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/15'
              }`}
              title={isSpeaking ? 'Mute voice audio' : 'Play voice audio'}
            >
              {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              title="Close Guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Google 4-Color Accent Hairline */}
        <div className="h-1 w-full flex shrink-0">
          <div className="h-full w-1/4 bg-[#4285F4]" />
          <div className="h-full w-1/4 bg-[#EA4335]" />
          <div className="h-full w-1/4 bg-[#FBBC05]" />
          <div className="h-full w-1/4 bg-[#34A853]" />
        </div>

        {/* 3-Step Guided Tour Status Header */}
        <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200/80 shrink-0">
          <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-bold">
            <div
              className={`py-1.5 px-2 rounded-xl border transition-all duration-300 ${
                animStep <= 1
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-102 font-black'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              <span>1. Tap 5★</span>
            </div>
            <div
              className={`py-1.5 px-2 rounded-xl border transition-all duration-300 ${
                animStep === 2 || animStep === 3
                  ? 'bg-[#1a73e8] text-white border-blue-600 shadow-sm scale-102 font-black'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              <span>2. Paste Text</span>
            </div>
            <div
              className={`py-1.5 px-2 rounded-xl border transition-all duration-300 ${
                animStep >= 4
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm scale-102 font-black'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              <span>3. Tap Post</span>
            </div>
          </div>
        </div>

        {/* Dynamic Coachmark Tour Bubble */}
        <div className="px-4 py-1.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border-b border-blue-100/60 flex items-center justify-center shrink-0">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
            {animStep <= 1 && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Step 1: Select 5 Stars on Google</span>
              </>
            )}
            {(animStep === 2 || animStep === 3) && (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>Step 2: Paste your copied review in the box</span>
              </>
            )}
            {animStep >= 4 && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span className="text-emerald-800 font-black">Step 3: Tap Post at the top right!</span>
              </>
            )}
          </div>
        </div>

        {/* Clean Interactive Review Demonstration Canvas */}
        <div className="flex-1 px-4 py-3 overflow-y-auto flex flex-col justify-between bg-white space-y-3">
          {/* Real Google Maps Identity & Official TOP-RIGHT POST Button Row */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1a73e8] text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                G
              </div>
              <div className="text-left">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate max-w-[170px] sm:max-w-[210px]">
                  {business?.businessName || 'Business Name'}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#EA4335] shrink-0" />
                  <span>Posting publicly</span>
                  <span>•</span>
                  <span>Google</span>
                </p>
              </div>
            </div>

            {/* Google's Real Top-Right POST Button */}
            <div
              ref={topPostRef}
              onClick={() => setAnimStep(4)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-xs flex items-center space-x-1 cursor-pointer shrink-0 ${
                animStep >= 4
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 scale-95'
                  : animStep >= 3
                  ? 'bg-[#1a73e8] text-white shadow-md ring-2 ring-blue-300 animate-pulse'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>{animStep >= 4 ? '✓ Posted' : 'Post'}</span>
            </div>
          </div>

          {/* 5-STAR RATING SECTION (High-Contrast Vivid Golden Stars) */}
          <div className="py-3.5 px-4 bg-slate-50/90 rounded-2xl border border-slate-200 flex flex-col items-center justify-center my-auto shadow-2xs">
            <span className="text-xs font-semibold text-slate-600 mb-2">
              Rate this business:
            </span>
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              {[1, 2, 3, 4, 5].map((s) => {
                const isStarFilled = animStep >= 1;
                return (
                  <button
                    key={s}
                    type="button"
                    ref={s === 5 ? star5Ref : null}
                    onClick={() => setAnimStep(1)}
                    className="relative cursor-pointer transition-transform active:scale-90 focus:outline-none"
                    title={`Rate ${s} star`}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill={isStarFilled ? '#FFB800' : 'none'}
                      stroke={isStarFilled ? '#D97706' : '#94a3b8'}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-all duration-300 ${
                        isStarFilled
                          ? 'scale-110 drop-shadow-[0_2px_12px_rgba(255,184,0,0.85)]'
                          : 'scale-100 opacity-60'
                      }`}
                    >
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        fill={isStarFilled ? '#FFB800' : 'none'}
                        stroke={isStarFilled ? '#D97706' : '#94a3b8'}
                        strokeWidth="1.6"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>

            {/* Glowing Golden Rating Feedback Badge */}
            <div className="h-6 mt-2 flex items-center justify-center">
              {animStep >= 1 ? (
                <div className="flex items-center space-x-1 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black shadow-xs animate-in zoom-in-95 duration-200">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>5.0 ★★★★★ Excellent</span>
                </div>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400">
                  Select the 5th star
                </span>
              )}
            </div>
          </div>

          {/* REVIEW TEXT BOX SECTION */}
          <div
            ref={boxRef}
            onClick={() => setAnimStep((prev) => (prev < 2 ? 2 : 3))}
            className={`relative p-3.5 bg-white rounded-2xl border-2 text-left min-h-[105px] text-xs leading-relaxed transition-all duration-200 cursor-pointer ${
              animStep >= 2
                ? 'border-[#1a73e8] ring-2 ring-blue-100 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Realistic Floating Android/Google PASTE Tooltip */}
            <div
              ref={pasteRef}
              onClick={(e) => {
                e.stopPropagation();
                setAnimStep(3);
              }}
              className={`absolute -top-11 left-6 z-20 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-2xl flex items-center space-x-1.5 border border-slate-700 transition-all duration-200 cursor-pointer ${
                animStep === 2
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-90 translate-y-2 pointer-events-none'
              }`}
            >
              <Copy className="w-3.5 h-3.5 text-blue-400" />
              <span>PASTE</span>
              <div className="absolute -bottom-1.5 left-5 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-700" />
            </div>

            {/* Review Content */}
            {animStep >= 3 ? (
              <div className="text-slate-800 font-medium text-xs leading-relaxed animate-in fade-in duration-200">
                &ldquo;{snippet}&rdquo;
                <span className="animate-pulse text-[#1a73e8] font-black ml-0.5">|</span>
              </div>
            ) : (
              <div className="text-slate-400 text-xs">
                Share details of your own experience at this place...
              </div>
            )}
          </div>

          {/* Form Action Sub-Row: Photos */}
          <div className="flex items-center justify-start pt-1 shrink-0">
            <div className="px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold flex items-center space-x-1.5 bg-slate-50">
              <Camera className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>Add photos</span>
            </div>
          </div>
        </div>

        {/* 100% Synchronized Voice Progress Timeline Scrubber */}
        <div className="px-4 py-1.5 bg-white shrink-0">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, Math.max(0, playbackProgress))}%` }}
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-[width] duration-75 ease-linear"
            />
          </div>
        </div>

        {/* Mathematically Centered Animated Touch Hand Pointer */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate3d(${fingerState.x}px, ${fingerState.y}px, 0)`,
            opacity: fingerState.opacity,
            transition: fingerState.isMoving
              ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease'
              : 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 40,
          }}
        >
          {/* Touch Ripple - Origin at exact target center (0, 0) */}
          {fingerState.isClicking && (
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-blue-500/35 border-2 border-blue-500 animate-ping pointer-events-none" />
          )}

          {/* Subtle Google touch contact beacon at (0, 0) */}
          <div
            className={`absolute -top-3 -left-3 w-6 h-6 rounded-full pointer-events-none transition-transform duration-150 ${
              fingerState.isClicking
                ? 'bg-blue-600/50 ring-4 ring-blue-400/30 scale-125'
                : 'bg-blue-500/15 scale-100'
            }`}
          />

          {/* Ergonomic Hand Pointer SVG: Fingertip positioned at exact (0, 0) */}
          <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-2xl"
            style={{
              position: 'absolute',
              left: '-15px',
              top: '-3.3px',
              transform: fingerState.isClicking ? 'scale(0.85)' : 'scale(1)',
              transformOrigin: '15px 3.3px',
              transition: 'transform 0.14s ease-out',
            }}
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

        {/* Modal Bottom Sticky CTA Actions: Permanent Launch Button with Guaranteed Copy */}
        <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] space-y-2 shrink-0">
          <button
            type="button"
            onClick={handleProceedClick}
            disabled={isProceeding}
            className={`w-full py-4 px-5 rounded-2xl text-sm sm:text-base font-black text-white shadow-md transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer group ${
              isProceeding
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 ring-2 ring-emerald-300 scale-[1.01]'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800'
            }`}
          >
            {isProceeding ? (
              <>
                <Check className="w-5 h-5 text-white stroke-[3] animate-bounce" />
                <span className="text-white">Review Copied! Opening Google...</span>
              </>
            ) : (
              <>
                <span>Open Google &amp; Paste Review</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs pt-0.5 px-1">
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

            <span className="text-[11px] font-medium text-slate-400">
              Powered by <strong className="text-slate-700 font-black">Rankaro</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
