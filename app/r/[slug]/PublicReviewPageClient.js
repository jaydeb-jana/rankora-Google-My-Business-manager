'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Star,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Edit3,
  MapPin,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/lib/reviewEngine';
import GoogleReviewAnimationGuide from '@/components/GoogleReviewAnimationGuide';
import { copyTextToClipboard } from '@/lib/clipboard';

export default function PublicReviewPageClient({ business }) {
  // Step navigation: 'SELECT' (1) -> 'DRAFT' (2)
  const [currentStep, setCurrentStep] = useState('SELECT');

  // Form selections - Pre-select services marked as default by the business owner
  const [selectedServiceIds, setSelectedServiceIds] = useState(() => {
    const allServices = business?.services || [];
    return allServices.filter((s) => Boolean(s.isDefault)).map((s) => s.id);
  });
  const [sentiment, setSentiment] = useState('exceptional'); // 'exceptional' (5), 'great' (4), 'neutral' (3), 'critical' (2), 'terrible' (1)
  const [experienceText, setExperienceText] = useState('');

  // Generated review draft states
  const [drafts, setDrafts] = useState([]);
  const [activeDraftIndex, setActiveDraftIndex] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [activeLang, setActiveLang] = useState('en');
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isAiDraft, setIsAiDraft] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [privateFeedbackSent, setPrivateFeedbackSent] = useState(false);
  const [privateFeedbackText, setPrivateFeedbackText] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [systemError, setSystemError] = useState(null);

  const experienceTextareaRef = useRef(null);
  const reviewTextareaRef = useRef(null);

  // Auto-resize experience textarea as user types or pastes text
  useEffect(() => {
    if (experienceTextareaRef.current) {
      experienceTextareaRef.current.style.height = 'auto';
      experienceTextareaRef.current.style.height = `${Math.max(44, experienceTextareaRef.current.scrollHeight)}px`;
    }
  }, [experienceText]);

  const handleExperienceChange = (e) => {
    setExperienceText(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.max(44, target.scrollHeight)}px`;
  };

  // Auto-resize review draft textarea as draft loads, regenerates, or user edits
  useEffect(() => {
    if (currentStep === 'DRAFT') {
      const resize = () => {
        if (reviewTextareaRef.current) {
          reviewTextareaRef.current.style.height = 'auto';
          reviewTextareaRef.current.style.height = `${Math.max(100, reviewTextareaRef.current.scrollHeight)}px`;
        }
      };
      resize();
      const raf = requestAnimationFrame(resize);
      const timer = setTimeout(resize, 60);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }
  }, [reviewText, currentStep]);

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.max(90, target.scrollHeight)}px`;
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((confettiModule) => {
          const confetti = confettiModule.default || confettiModule;
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.65 },
            colors: ['#1a73e8', '#34a853', '#fbbc05', '#ea4335', '#9333ea'],
          });
        }).catch(() => {});
      }
    } catch (e) {
      // Graceful fallback
    }
  };

  // Toggle service selection
  const toggleService = (id) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Generate Review Drafts
  const handleGenerateDraft = async (forceLang = null) => {
    setIsAiGenerating(true);
    setSystemError(null);

    try {
      const res = await fetch('/api/public/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: business.slug,
          selectedServiceIds,
          sentiment,
          answers: { experience: experienceText },
          forceLanguage: forceLang,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success && Array.isArray(data?.drafts) && data.drafts.length > 0) {
        setDrafts(data.drafts);
        setActiveDraftIndex(0);
        setReviewText(data.drafts[0]?.text || '');
        setIsAiDraft(true);
        if (data.drafts[0]?.lang) {
          setActiveLang(data.drafts[0].lang);
        }
        setCurrentStep('DRAFT');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorMsg =
          data?.error || 'System Error: Unable to generate AI review. Please verify the Gemini API key or try again.';
        setSystemError(errorMsg);
        setDrafts([]);
      }
    } catch {
      setSystemError('System Error: Network connection failed while reaching review generator.');
      setDrafts([]);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleRegenerateInLanguage = (langCode) => {
    setActiveLang(langCode);
    handleGenerateDraft(langCode);
  };

  const handleSelectDraftStyle = (index) => {
    setActiveDraftIndex(index);
    setReviewText(drafts[index]?.text || '');
  };

  const handleCycleNextDraft = async () => {
    // If we have remaining drafts from the current Gemini response, cycle through them first
    if (drafts && drafts.length > 1 && activeDraftIndex < drafts.length - 1) {
      setIsRegenerating(true);
      const nextIndex = activeDraftIndex + 1;
      setActiveDraftIndex(nextIndex);
      setReviewText(drafts[nextIndex]?.text || '');
      setTimeout(() => setIsRegenerating(false), 300);
      return;
    }

    // Otherwise, generate fresh new review drafts directly via Google Gemini API
    setIsRegenerating(true);
    setSystemError(null);
    try {
      const res = await fetch('/api/public/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: business.slug,
          selectedServiceIds,
          sentiment,
          answers: { experience: experienceText },
          forceLanguage: activeLang,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success && Array.isArray(data?.drafts) && data.drafts.length > 0) {
        setDrafts(data.drafts);
        setActiveDraftIndex(0);
        setReviewText(data.drafts[0]?.text || '');
        setIsAiDraft(true);
      } else {
        const errorMsg =
          data?.error || 'System Error: Failed to generate fresh alternative style. Please check your Gemini API key.';
        setSystemError(errorMsg);
      }
    } catch {
      setSystemError('System Error: Network connection failed during review regeneration.');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Handle Copy text
  const handleCopyReview = async () => {
    if (!reviewText.trim()) return;

    try {
      await copyTextToClipboard(reviewText);
      setCopied(true);
      triggerConfetti();

      // Track copy action in background
      fetch('/api/public/track-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: business.slug,
          action: 'COPIED',
        }),
      }).catch(() => {});

      setTimeout(() => setCopied(false), 3500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // 1-Tap Super Action: Copy Review and Open Interactive Animation Guide
  const handleSuperAction = async () => {
    await handleCopyReview();
    setShowGuideModal(true);

    // Track Continue click action in background
    fetch('/api/public/track-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: business.slug,
        action: 'GOOGLE_CONTINUE_CLICK',
      }),
    }).catch(() => {});
  };

  // Open Google Review Link when customer taps the primary button inside animation guide
  const handleProceedToGoogle = async () => {
    // Guaranteed final clipboard copy right before launching Google Maps
    if (reviewText) {
      await copyTextToClipboard(reviewText);
    }
    if (business.googleReviewUrl) {
      window.open(business.googleReviewUrl, '_blank', 'noopener,noreferrer');
    }
    fetch('/api/public/track-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: business.slug,
        action: 'GOOGLE_REDIRECT',
      }),
    }).catch(() => {});
  };

  const sentimentOptions = [
    {
      id: 'terrible',
      emoji: '😡',
      label: 'Terrible',
      stars: 1,
      bgActive: 'bg-rose-50 border-rose-500 text-rose-700 ring-rose-200',
    },
    {
      id: 'critical',
      emoji: '🙁',
      label: 'Poor',
      stars: 2,
      bgActive: 'bg-orange-50 border-orange-500 text-orange-700 ring-orange-200',
    },
    {
      id: 'neutral',
      emoji: '😐',
      label: 'Okay',
      stars: 3,
      bgActive: 'bg-amber-50 border-amber-500 text-amber-700 ring-amber-200',
    },
    {
      id: 'great',
      emoji: '😊',
      label: 'Good',
      stars: 4,
      bgActive: 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-emerald-200',
    },
    {
      id: 'exceptional',
      emoji: '🤩',
      label: 'Amazing',
      stars: 5,
      bgActive: 'bg-blue-50 border-blue-600 text-blue-700 ring-blue-200',
    },
  ];

  // Language options available
  const configuredLanguages = business.aiKnowledge?.languages || [];

  // Clean headline check
  const hasCustomHeadline =
    business.welcomeHeadline &&
    !business.welcomeHeadline.toLowerCase().includes('how was your experience at') &&
    !business.welcomeHeadline.toLowerCase().includes(business.slug.toLowerCase());

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-between text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Brand Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          {/* Rankora Official Brand */}
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-white shadow-xs ring-1 ring-slate-200 p-0.5">
              <img
                src="/logo-icon.png"
                alt="Rankora"
                className="w-full h-full object-contain rounded-lg"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#34a853] border-2 border-white rounded-full" />
            </div>
            <div className="leading-none">
              <span className="text-sm font-black tracking-tight text-slate-900 block">
                Rankora
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Official Review Partner
              </span>
            </div>
          </div>

          {/* Official Google Badge */}
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-3 py-1.5 rounded-full shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Google Verified</span>
          </div>
        </div>

        {/* 100% Full-Width Accent Line */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 shadow-2xs" />
      </header>

      {/* Main Single Seamless Mobile Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-3.5 py-3 sm:py-5">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Integrated Business Header (Compact & Mobile-Optimized) */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white text-center">
            {/* Logo */}
            {business.logoUrl ? (
              <div className="w-16 h-16 rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden bg-white p-1 mx-auto mb-2.5 flex items-center justify-center">
                <img
                  src={business.logoUrl}
                  alt={business.businessName}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl mx-auto mb-2.5 shadow-xs">
                {business.businessName ? business.businessName.charAt(0).toUpperCase() : 'B'}
              </div>
            )}

            {/* Business Name with Verified Checkmark Inline */}
            <div className="inline-flex items-center justify-center gap-1.5 max-w-full px-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                {business.businessName}
              </h1>
              <div
                className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs"
                title="Google Verified"
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>

            {/* Category / City Subtitle */}
            {(business.businessCategory || business.city) && (
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5 flex items-center justify-center gap-1">
                {business.city && <MapPin className="w-3 h-3 text-blue-500 shrink-0" />}
                <span className="truncate">
                  {business.businessCategory} {business.city ? `• ${business.city}` : ''}
                </span>
              </p>
            )}

            {/* Google Rating Star Badge */}
            <div className="inline-flex items-center space-x-1.5 bg-amber-50/80 border border-amber-200/70 px-2.5 py-0.5 rounded-full mt-2">
              <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10.5px] font-bold text-amber-900">
                5.0 on Google
              </span>
            </div>

            {/* Custom Welcome Headline (Only if configured) */}
            {hasCustomHeadline && (
              <p className="text-xs text-slate-600 font-medium mt-2.5 bg-slate-100/70 px-3 py-1.5 rounded-xl inline-block max-w-full">
                {business.welcomeHeadline}
              </p>
            )}
          </div>

          {/* STEP 1: Interactive Rating & Choices */}
          {currentStep === 'SELECT' && (
            <div className="p-4 sm:p-5 space-y-4">
              {/* Section Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">
                  How was your experience today?
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Step 1 of 2
                </span>
              </div>

              {/* 5-Emoji Rating Bar (Ergonomic, Touch-First) */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {sentimentOptions.map((opt) => {
                  const isSelected = sentiment === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSentiment(opt.id)}
                      className={`relative py-2 px-1 rounded-2xl border-2 text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-center active:scale-90 ${
                        isSelected
                          ? `${opt.bgActive} ring-2 shadow-xs scale-[1.03]`
                          : 'bg-white border-slate-200/90 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl mb-0.5 filter drop-shadow-2xs">
                        {opt.emoji}
                      </span>
                      <span className="text-[9.5px] sm:text-[10px] font-bold block leading-tight">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Services Grid (Balanced 2-Column Touch Cards) */}
              {business.services && business.services.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      What did we help you with?
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      (Optional)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {business.services.map((svc) => {
                      const isSelected = selectedServiceIds.includes(svc.id);
                      return (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => toggleService(svc.id)}
                          className={`relative p-2.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-center space-x-2 active:scale-95 ${
                            isSelected
                              ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-2xs ring-1 ring-blue-500/30'
                              : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            ) : (
                              <div className="w-1 h-1 rounded-full bg-slate-300" />
                            )}
                          </div>
                          <span className="text-[11.5px] font-bold leading-tight line-clamp-2">
                            {svc.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Optional Experience Input */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Share your experience
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    (Optional)
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                  </div>
                  <textarea
                    ref={experienceTextareaRef}
                    rows={1}
                    placeholder="e.g. Fast repair, polite staff, reasonable price..."
                    value={experienceText}
                    onChange={handleExperienceChange}
                    className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white placeholder:text-slate-400 shadow-2xs resize-none overflow-hidden min-h-[44px] leading-relaxed transition-[height] duration-75 block"
                  />
                </div>
              </div>

              {/* System Error Banner */}
              {systemError && (
                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 space-y-2.5 animate-in fade-in duration-150 shadow-2xs">
                  <div className="flex items-start space-x-2.5">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <h4 className="text-xs font-black tracking-tight text-rose-900 uppercase">
                        System Error Encountered
                      </h4>
                      <p className="text-xs font-semibold text-rose-700 leading-relaxed">
                        {systemError}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleGenerateDraft()}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Primary CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isAiGenerating}
                  onClick={() => handleGenerateDraft()}
                  className="w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md transition-all duration-150 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer disabled:opacity-75"
                >
                  {isAiGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Writing review draft...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
                      <span>Generate Review Draft</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-1.5 font-medium">
                  Takes 5 seconds • Instant Google posting
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Review Preview, Multilingual & Google Action */}
          {currentStep === 'DRAFT' && (
            <div className="p-4 sm:p-5 space-y-4">
              {/* Step 2 Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">
                  Review Draft &amp; Post
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('SELECT');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  ← Edit Rating
                </button>
              </div>

              {/* System Error Alert in Step 2 */}
              {systemError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex items-start space-x-2.5 animate-in fade-in duration-150 shadow-2xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-rose-900">System Error</p>
                    <p className="text-rose-700 font-medium leading-relaxed">{systemError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemError(null)}
                    className="text-rose-400 hover:text-rose-700 text-xs font-bold px-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Review Section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-slate-900 text-sm tracking-tight">Review</span>
                    {isAiDraft && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-blue-600 animate-pulse" />
                        <span>AI Generated</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10.5px] text-slate-400 font-medium">
                    {reviewText.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    ref={reviewTextareaRef}
                    value={reviewText}
                    onChange={handleReviewTextChange}
                    className="w-full p-3.5 text-xs sm:text-sm text-slate-900 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 leading-relaxed font-sans shadow-inner transition-[height] duration-75 bg-white resize-none overflow-hidden block min-h-[90px]"
                    placeholder="Your review draft..."
                  />
                  {isRegenerating && (
                    <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center space-y-2 animate-in fade-in duration-150 z-10">
                      <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating fresh alternative style...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Regenerate Button & Tap Hint */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-slate-400" />
                    <span>Tap to edit text</span>
                  </p>

                  <button
                    type="button"
                    disabled={isRegenerating}
                    onClick={handleCycleNextDraft}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer active:scale-95 shadow-2xs shrink-0 disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Management Resolution Safe-Harbor for 1-3 Stars */}
              {(sentiment === 'terrible' || sentiment === 'critical' || sentiment === 'neutral') && !privateFeedbackSent && (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>Resolve with Management Directly</span>
                  </div>
                  <p className="text-[10.5px] text-amber-800 leading-relaxed">
                    We want to make this right. Send a private message to the owner so we can resolve any issue directly with you:
                  </p>
                  <textarea
                    rows={2}
                    placeholder="How can management resolve this for you?"
                    value={privateFeedbackText}
                    onChange={(e) => setPrivateFeedbackText(e.target.value)}
                    className="w-full p-2 text-xs bg-white text-slate-800 border border-amber-200 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (privateFeedbackText.trim() && !isSendingFeedback) {
                        setIsSendingFeedback(true);
                        try {
                          await fetch('/api/public/private-feedback', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              slug: business.slug,
                              sentiment,
                              message: privateFeedbackText,
                            }),
                          });
                          setPrivateFeedbackSent(true);
                        } catch (err) {
                          console.error('Failed to send private feedback:', err);
                        } finally {
                          setIsSendingFeedback(false);
                        }
                      }
                    }}
                    disabled={!privateFeedbackText.trim() || isSendingFeedback}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center space-x-1 shrink-0"
                  >
                    {isSendingFeedback ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Private Note</span>
                    )}
                  </button>
                </div>
              )}

              {privateFeedbackSent && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Your private message was sent to management. Thank you!</span>
                </div>
              )}

              {/* Single Continue Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSuperAction}
                  className="w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md transition-all duration-150 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer group"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                      <span>Copied! Opening Google...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* 3-Step Mini Guide */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                <span className="font-bold text-slate-800 block text-xs">
                  How to post on Google:
                </span>
                <div className="flex items-center space-x-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                    1
                  </span>
                  <span>Tap <strong>&quot;Continue&quot;</strong> (automatically copies your review)</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                    2
                  </span>
                  <span>Select <strong>5 stars</strong> on Google Maps</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                    3
                  </span>
                  <span><strong>Paste</strong> your review and tap <strong>Post</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Interactive Video-Like Animated Guide with Voice Guidance */}
      <GoogleReviewAnimationGuide
        key={showGuideModal ? 'guide-modal-active' : 'guide-modal-idle'}
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        business={business}
        reviewText={reviewText}
        onProceedToGoogle={handleProceedToGoogle}
      />

      {/* Full-Screen AI Draft Generation Loading Modal */}
      {isAiGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top Multi-Color Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              <div className="h-full w-1/4 bg-[#4285F4]" />
              <div className="h-full w-1/4 bg-[#EA4335]" />
              <div className="h-full w-1/4 bg-[#FBBC05]" />
              <div className="h-full w-1/4 bg-[#34A853]" />
            </div>

            {/* Glowing Gemini AI Orb */}
            <div className="relative w-20 h-20 mx-auto my-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-amber-400 opacity-25 blur-lg animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>

            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Generating Review Draft...
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Crafting an authentic, keyword-rich 5-star review tailored for <strong className="text-slate-800">{business.businessName}</strong>.
            </p>

            {/* Animated Skeleton Lines */}
            <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="h-3 bg-slate-200/80 rounded-full w-5/6 mx-auto animate-pulse" />
              <div className="h-3 bg-slate-200/80 rounded-full w-full mx-auto animate-pulse delay-75" />
              <div className="h-3 bg-slate-200/80 rounded-full w-4/6 mx-auto animate-pulse delay-150" />
            </div>

            {/* Live Status Pill */}
            <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[11px] font-bold text-blue-700">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Personalizing with Gemini AI</span>
            </div>
          </div>
        </div>
      )}

      {/* Clean Footer Branding */}
      <footer className="py-3 text-center text-[11px] text-slate-400">
        <p className="inline-flex items-center justify-center space-x-1.5">
          <span>Powered by</span>
          <img src="/logo-icon.png" alt="RANKORA" className="w-3.5 h-3.5 object-contain inline" />
          <strong className="text-slate-700">RANKORA</strong>
          <span>• Review Engine</span>
        </p>
      </footer>
    </div>
  );
}
