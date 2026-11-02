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
  Languages,
  Edit3,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { generateReviewDrafts, SUPPORTED_LANGUAGES } from '@/lib/reviewEngine';

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
  const experienceTextareaRef = useRef(null);

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

  // Generated review draft states
  const [drafts, setDrafts] = useState([]);
  const [activeDraftIndex, setActiveDraftIndex] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [activeLang, setActiveLang] = useState('en');
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [privateFeedbackSent, setPrivateFeedbackSent] = useState(false);
  const [privateFeedbackText, setPrivateFeedbackText] = useState('');

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
  const handleGenerateDraft = (forceLang = null) => {
    const servicesList = business.services || [];
    const chosenServices = servicesList.filter((s) => selectedServiceIds.includes(s.id));

    const generated = generateReviewDrafts({
      businessName: business.businessName,
      businessCategory: business.businessCategory,
      city: business.city,
      address: business.address,
      description: business.description,
      selectedServices: chosenServices,
      sentiment,
      answers: {
        experience: experienceText,
        highlight: experienceText,
      },
      aiKnowledge: business.aiKnowledge,
      forceLanguage: forceLang,
    });

    setDrafts(generated);
    setActiveDraftIndex(0);
    setReviewText(generated[0]?.text || '');
    if (generated[0]?.lang) {
      setActiveLang(generated[0].lang);
    }
    setCurrentStep('DRAFT');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Call server to generate with account-specific Gemini AI (if configured)
    fetch('/api/public/generate-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: business.slug,
        selectedServiceIds,
        sentiment,
        answers: { experience: experienceText },
        forceLanguage: forceLang,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data?.drafts) && data.drafts.length > 0) {
          const isAi = data.drafts.some((d) => d.id?.startsWith('gemini_'));
          if (isAi) {
            setDrafts(data.drafts);
            setReviewText(data.drafts[0]?.text || '');
            if (data.drafts[0]?.lang) {
              setActiveLang(data.drafts[0].lang);
            }
          }
        }
      })
      .catch(() => {});
  };

  const handleRegenerateInLanguage = (langCode) => {
    setActiveLang(langCode);
    handleGenerateDraft(langCode);
  };

  const handleSelectDraftStyle = (index) => {
    setActiveDraftIndex(index);
    setReviewText(drafts[index]?.text || '');
  };

  const handleCycleNextDraft = () => {
    setIsRegenerating(true);
    setTimeout(() => setIsRegenerating(false), 400);

    if (drafts && drafts.length > 1) {
      const nextIndex = (activeDraftIndex + 1) % drafts.length;
      setActiveDraftIndex(nextIndex);
      setReviewText(drafts[nextIndex]?.text || '');
    } else {
      handleGenerateDraft(activeLang);
    }
  };

  // Handle Copy text
  const handleCopyReview = async () => {
    if (!reviewText.trim()) return;

    try {
      await navigator.clipboard.writeText(reviewText);
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

  // 1-Tap Super Action: Copy & Open Google Review
  const handleSuperAction = async () => {
    await handleCopyReview();
    setShowGuideModal(true);

    // Track Google action in background
    fetch('/api/public/track-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: business.slug,
        action: 'GOOGLE_REDIRECT',
      }),
    }).catch(() => {});

    // Open Google Review Link in new tab
    if (business.googleReviewUrl) {
      setTimeout(() => {
        window.open(business.googleReviewUrl, '_blank', 'noopener,noreferrer');
      }, 350);
    }
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
          {/* Rankaro Official Brand */}
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1a73e8] to-[#4285f4] text-white shadow-xs font-black text-sm ring-2 ring-blue-100">
              R
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#34a853] border-2 border-white rounded-full" />
            </div>
            <div className="leading-none">
              <span className="text-sm font-black tracking-tight text-slate-900 block">
                Rankaro
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

              {/* Primary CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleGenerateDraft()}
                  className="w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md transition-all duration-150 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
                  <span>Generate Review Draft</span>
                  <ArrowRight className="w-4 h-4" />
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

              {/* Language Switcher (if business configured multiple languages) */}
              {configuredLanguages.length > 1 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-between gap-1">
                  <div className="flex items-center space-x-1 text-xs font-bold text-slate-700 pl-1">
                    <Languages className="w-3.5 h-3.5 text-blue-600" />
                    <span>Language:</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {configuredLanguages.map((l) => {
                      const isActive = activeLang === l.code;
                      const meta = SUPPORTED_LANGUAGES.find((item) => item.code === l.code);
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => handleRegenerateInLanguage(l.code)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{meta?.flag || '🌐'}</span>
                          <span>{l.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Review Section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-900 text-sm tracking-tight">Review</span>
                  <span className="text-[10.5px] text-slate-400 font-medium">
                    {reviewText.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3.5 text-xs sm:text-sm text-slate-900 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 leading-relaxed font-sans shadow-inner transition-all bg-white"
                />

                {/* Regenerate Button & Tap Hint */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-slate-400" />
                    <span>Tap to edit text</span>
                  </p>

                  <button
                    type="button"
                    onClick={handleCycleNextDraft}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer active:scale-95 shadow-2xs shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
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
                    onClick={() => {
                      if (privateFeedbackText.trim()) {
                        setPrivateFeedbackSent(true);
                        fetch('/api/public/private-feedback', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            slug: business.slug,
                            sentiment,
                            message: privateFeedbackText,
                          }),
                        }).catch(() => {});
                      }
                    }}
                    disabled={!privateFeedbackText.trim()}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Send Private Note
                  </button>
                </div>
              )}

              {privateFeedbackSent && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Your private message was sent to management. Thank you!</span>
                </div>
              )}

              {/* Conversion Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1-Tap Super Action */}
                <button
                  type="button"
                  onClick={handleSuperAction}
                  className="w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md transition-all duration-150 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>Copy Review &amp; Open Google</span>
                  <ExternalLink className="w-4 h-4 ml-0.5" />
                </button>

                {/* Secondary Button: Copy Text Only */}
                <button
                  type="button"
                  onClick={handleCopyReview}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 ${
                    copied
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Text Only</span>
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
                  <span>Tap <strong>&quot;Copy Review &amp; Open Google&quot;</strong></span>
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

      {/* Floating Success Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full border border-slate-200 shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                Review Copied!
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Paste into Google to complete your review:
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 text-left space-y-1.5 border border-slate-200 text-xs">
              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-slate-700 text-[11px]">
                  Select <strong>5 stars</strong> on Google
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-slate-700 text-[11px]">
                  Tap box, select <strong>Paste</strong> &amp; tap <strong>Post</strong>!
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              {business.googleReviewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    window.open(business.googleReviewUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Re-open Google Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close &amp; Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Footer Branding */}
      <footer className="py-3 text-center text-[11px] text-slate-400">
        <p>Powered by <strong className="text-slate-600">Rankaro</strong> • Review Engine</p>
      </footer>
    </div>
  );
}
