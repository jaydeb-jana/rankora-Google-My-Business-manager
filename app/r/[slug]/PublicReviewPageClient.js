'use client';
import { useState } from 'react';
import {
  Star,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  User,
  HeartHandshake,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { generateReviewDrafts } from '@/lib/reviewEngine';

export default function PublicReviewPageClient({ business }) {
  // Step navigation: 'SELECT' -> 'DRAFT' -> 'READY'
  const [currentStep, setCurrentStep] = useState('SELECT');

  // Form selections
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [sentiment, setSentiment] = useState('exceptional'); // 'exceptional' (5), 'great' (4), 'neutral' (3), 'critical' (1-2)
  const [answers, setAnswers] = useState({
    staffMember: '',
    highlight: '',
    additionalNotes: '',
  });

  // Generated review draft states
  const [drafts, setDrafts] = useState([]);
  const [activeDraftIndex, setActiveDraftIndex] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [copied, setCopied] = useState(false);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [privateFeedbackSent, setPrivateFeedbackSent] = useState(false);
  const [privateFeedbackText, setPrivateFeedbackText] = useState('');

  // Toggle service selection
  const toggleService = (id) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Generate Review Drafts
  const handleGenerateDraft = async () => {
    setLoadingDrafts(true);

    const chosenServices = business.services.filter((s) => selectedServiceIds.includes(s.id));

    // Call client-side reviewEngine or server
    const generated = generateReviewDrafts({
      businessName: business.businessName,
      selectedServices: chosenServices,
      sentiment,
      answers,
      aiKnowledge: business.aiKnowledge,
    });

    setDrafts(generated);
    setActiveDraftIndex(0);
    setReviewText(generated[0]?.text || '');
    setCurrentStep('DRAFT');
    setLoadingDrafts(false);

    // Track generation event in background
    fetch('/api/public/generate-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: business.slug,
        selectedServiceIds,
        sentiment,
        answers,
      }),
    }).catch(() => {});
  };

  const handleSelectDraftStyle = (index) => {
    setActiveDraftIndex(index);
    setReviewText(drafts[index]?.text || '');
  };

  const handleCopyReview = async () => {
    if (!reviewText.trim()) return;

    try {
      await navigator.clipboard.writeText(reviewText);
      setCopied(true);

      // Track copy action in background
      fetch('/api/public/track-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: business.slug,
          action: 'COPIED',
        }),
      }).catch(() => {});

      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleProceedToGoogle = () => {
    // Track click to Google
    fetch('/api/public/track-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: business.slug,
        action: 'GOOGLE_REDIRECT',
      }),
    }).catch(() => {});

    if (business.googleReviewUrl) {
      window.open(business.googleReviewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const sentimentOptions = [
    { id: 'exceptional', label: 'Exceptional (5★)', stars: 5 },
    { id: 'great', label: 'Great (4★)', stars: 4 },
    { id: 'neutral', label: 'Good / Okay (3★)', stars: 3 },
    { id: 'critical', label: 'Needs Improvement', stars: 2 },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-between text-[#202124]">
      {/* Top Google-style Brand Bar */}
      <div className="bg-white border-b border-[#dadce0] py-3 px-4 shadow-2xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xs">
              R
            </div>
            <span className="text-xs font-semibold tracking-tight text-[#202124]">
              Rankaro Review Assistant
            </span>
          </div>

          <div className="flex items-center space-x-1 text-[11px] text-[#1e8e3e] font-medium bg-[#e6f4ea] px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Google Review Direct Link</span>
          </div>
        </div>
      </div>

      {/* Main Review Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 my-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dadce0] google-card-shadow space-y-6">
          {/* Business Header Profile */}
          <div className="text-center pb-6 border-b border-[#f1f3f4]">
            {business.logoUrl ? (
              <div className="w-20 h-20 rounded-2xl border border-[#dadce0] overflow-hidden bg-white p-1 mx-auto mb-3 shadow-xs flex items-center justify-center">
                <img
                  src={business.logoUrl}
                  alt={business.businessName}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1a73e8] to-[#4285f4] text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-xs">
                {business.businessName.charAt(0)}
              </div>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-[#202124]">
              {business.businessName}
            </h1>
            {business.businessCategory && (
              <p className="text-xs font-medium text-[#1a73e8] mt-0.5">
                {business.businessCategory} {business.city ? `• ${business.city}` : ''}
              </p>
            )}

            <div className="flex items-center justify-center space-x-1 mt-2.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[#fbbc04] text-[#fbbc04]" />
              ))}
              <span className="text-xs text-[#5f6368] font-medium ml-1.5">
                Google Verified Review Link
              </span>
            </div>

            <div className="mt-4 bg-[#f8f9fa] rounded-2xl p-4 border border-[#e8eaed]">
              <h2 className="text-sm font-semibold text-[#202124]">
                {business.welcomeHeadline}
              </h2>
              <p className="text-xs text-[#5f6368] mt-1 leading-relaxed">
                {business.instructions}
              </p>
            </div>
          </div>

          {/* STEP 1: Services Selection & Sentiment Rating */}
          {currentStep === 'SELECT' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Service Chips */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-3">
                  1. What did we take care of for you today? (Select all that apply)
                </label>

                {business.services && business.services.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {business.services.map((svc) => {
                      const isSelected = selectedServiceIds.includes(svc.id);
                      return (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => toggleService(svc.id)}
                          className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-start space-x-2.5 ${
                            isSelected
                              ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] shadow-2xs'
                              : 'bg-white border-[#dadce0] text-[#3c4043] hover:border-[#1a73e8]'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                              isSelected
                                ? 'bg-[#1a73e8] border-[#1a73e8] text-white'
                                : 'border-[#dadce0] bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="flex-1 min-w-0 font-semibold truncate">{svc.name}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[#5f6368]">
                    No specific service categories configured.
                  </p>
                )}
              </div>

              {/* Sentiment / Star Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-2.5">
                  2. How would you rate your overall experience?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {sentimentOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSentiment(opt.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        sentiment === opt.id
                          ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] font-bold shadow-2xs'
                          : 'bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-0.5 mb-1">
                        {Array.from({ length: opt.stars }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              sentiment === opt.id
                                ? 'fill-[#1a73e8] text-[#1a73e8]'
                                : 'fill-[#fbbc04] text-[#fbbc04]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs block">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Quick Prompts */}
              <div className="space-y-3 pt-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
                  3. Optional: Add details for a richer review
                </span>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5f6368]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Did a specific staff member assist you? (Optional)"
                      value={answers.staffMember}
                      onChange={(e) => setAnswers({ ...answers, staffMember: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2 text-xs text-[#202124] border border-[#dadce0] rounded-xl focus:outline-none focus:border-[#1a73e8]"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5f6368]">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      placeholder="What was the biggest highlight? (e.g. quick turnaround, clear explanation)"
                      value={answers.highlight}
                      onChange={(e) => setAnswers({ ...answers, highlight: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2 text-xs text-[#202124] border border-[#dadce0] rounded-xl focus:outline-none focus:border-[#1a73e8]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleGenerateDraft}
                  disabled={selectedServiceIds.length === 0}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-2xl shadow-sm hover:shadow transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {selectedServiceIds.length === 0
                      ? 'Select at least 1 service above'
                      : 'Generate My Review Draft'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Review Draft Approval & Editing */}
          {currentStep === 'DRAFT' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Draft Style Variations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
                    Suggested Review Options:
                  </label>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('SELECT')}
                    className="text-xs text-[#1a73e8] hover:underline"
                  >
                    ← Change selections
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {drafts.map((d, index) => (
                    <button
                      key={d.id || index}
                      type="button"
                      onClick={() => handleSelectDraftStyle(index)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all text-center ${
                        activeDraftIndex === index
                          ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] font-bold shadow-2xs'
                          : 'bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f8f9fa]'
                      }`}
                    >
                      {d.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Review Textarea */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1.5">
                  Review Text (You can edit or personalize anything below):
                </label>
                <textarea
                  rows={5}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-4 text-sm text-[#202124] border-2 border-[#dadce0] rounded-2xl focus:outline-none focus:border-[#1a73e8] leading-relaxed font-sans shadow-inner"
                />
                <span className="text-[11px] text-[#70757a] mt-1 block">
                  Feel free to add your own personal details or edit any word before copying.
                </span>
              </div>

              {/* Direct Owner Resolution Option for Critical Feedback */}
              {(sentiment === 'critical' || sentiment === 'neutral') && !privateFeedbackSent && (
                <div className="p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-[#202124]">
                    <MessageSquare className="w-4 h-4 text-[#ea4335]" />
                    <span>Had an issue? Message the owner directly</span>
                  </div>
                  <p className="text-[11px] text-[#5f6368] leading-relaxed">
                    If something went wrong, you can also leave a private message for management so we can resolve it directly with you.
                  </p>
                  <textarea
                    rows={2}
                    placeholder="Describe how we can make this right..."
                    value={privateFeedbackText}
                    onChange={(e) => setPrivateFeedbackText(e.target.value)}
                    className="w-full p-2 text-xs bg-white text-[#202124] border border-[#dadce0] rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (privateFeedbackText.trim()) {
                        setPrivateFeedbackSent(true);
                      }
                    }}
                    disabled={!privateFeedbackText.trim()}
                    className="px-3 py-1.5 bg-white border border-[#dadce0] hover:bg-[#f1f3f4] text-xs font-medium text-[#202124] rounded-lg disabled:opacity-50"
                  >
                    Submit Private Note
                  </button>
                </div>
              )}

              {privateFeedbackSent && (
                <div className="p-3 bg-[#e6f4ea] border border-[#ceead6] rounded-xl text-xs text-[#137333] flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Your private message was sent to management. Thank you for your feedback!</span>
                </div>
              )}

              {/* Action Buttons: Copy and Open Google */}
              <div className="space-y-3 pt-2">
                {/* 1. Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyReview}
                  className={`w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl text-sm font-semibold transition-all shadow-sm ${
                    copied
                      ? 'bg-[#1e8e3e] text-white'
                      : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 stroke-[2.5]" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>1. Copy Review Text</span>
                    </>
                  )}
                </button>

                {/* 2. Open Google Review Button */}
                {business.hasGoogleUrl ? (
                  <button
                    type="button"
                    onClick={handleProceedToGoogle}
                    className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl text-sm font-semibold text-[#202124] bg-white hover:bg-[#f8f9fa] border-2 border-[#dadce0] hover:border-[#1a73e8] transition-all shadow-2xs group"
                  >
                    <span>2. Continue to Google Review Page</span>
                    <ExternalLink className="w-4 h-4 text-[#1a73e8] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <div className="p-3 bg-[#fef7e0] border border-[#feefc3] rounded-xl text-xs text-[#b06000]">
                    The business review page has not linked their Google Maps URL yet. Your review is copied above to paste directly into Google.
                  </div>
                )}
              </div>

              {/* Instructions on how to paste */}
              <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-[#e8eaed] text-xs text-[#5f6368] space-y-1.5">
                <span className="font-semibold text-[#202124] block">How to publish on Google:</span>
                <ol className="list-decimal list-inside space-y-1 text-[11px]">
                  <li>Tap <strong>&quot;1. Copy Review Text&quot;</strong> above.</li>
                  <li>Tap <strong>&quot;2. Continue to Google Review Page&quot;</strong> to open Google.</li>
                  <li>Select your star rating and paste your copied text into the Google review box.</li>
                  <li>Tap Post on Google.</li>
                </ol>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-[#70757a] leading-relaxed">
                  Transparent &amp; Ethical Disclosure: Rankaro is an independent assistant designed to make composing reviews easier. You are under no obligation to post any specific text or rating and have 100% freedom to write whatever you choose directly on Google.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#70757a]">
        <p>Rankaro Review Platform • Independent Software</p>
      </footer>
    </div>
  );
}
