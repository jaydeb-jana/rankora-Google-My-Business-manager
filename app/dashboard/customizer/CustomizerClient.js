'use client';
import { useState } from 'react';
import {
  Sparkles,
  Save,
  Loader2,
  ExternalLink,
  Smartphone,
  Eye,
  CheckCircle2,
  Star,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function CustomizerClient({ user }) {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    welcomeHeadline: user.welcomeHeadline || `How was your experience at ${user.businessName}?`,
    instructions:
      user.instructions ||
      'Select the services you received below. We will help draft an authentic review you can review and paste into Google.',
    fallbackReviews: {
      enabled: Boolean(user.fallbackReviews?.enabled),
      items: Array.isArray(user.fallbackReviews?.items) && user.fallbackReviews.items.length > 0
        ? user.fallbackReviews.items
        : [],
    },
  });

  const [saving, setSaving] = useState(false);

  const handleAddFallbackDraft = () => {
    const currentItems = formData.fallbackReviews?.items || [];
    if (currentItems.length >= 8) {
      showToast('Maximum 8 fallback review drafts allowed.', 'info');
      return;
    }
    setFormData({
      ...formData,
      fallbackReviews: {
        ...formData.fallbackReviews,
        items: [...currentItems, ''],
      },
    });
  };

  const handleUpdateFallbackDraft = (index, value) => {
    const currentItems = [...(formData.fallbackReviews?.items || [])];
    currentItems[index] = value;
    setFormData({
      ...formData,
      fallbackReviews: {
        ...formData.fallbackReviews,
        items: currentItems,
      },
    });
  };

  const handleRemoveFallbackDraft = (index) => {
    const currentItems = (formData.fallbackReviews?.items || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      fallbackReviews: {
        ...formData.fallbackReviews,
        items: currentItems,
      },
    });
  };

  const handleToggleFallback = (enabled) => {
    setFormData({
      ...formData,
      fallbackReviews: {
        ...formData.fallbackReviews,
        enabled,
      },
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/business/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      showToast('Review page settings saved!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const previewServices = user.services && user.services.length > 0
    ? user.services.slice(0, 4)
    : [
        { id: '1', name: 'Customer Support' },
        { id: '2', name: 'Work Quality' },
        { id: '3', name: 'Timely Turnaround' },
      ];

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 w-full">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-[#202124]">
          Customer Review Page Settings
        </h2>
        <p className="text-xs text-[#5f6368] mt-1">
          Customize the message your customers see when they scan your QR code or open your review link.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start min-w-0">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-6 space-y-4 min-w-0">
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-4 sm:p-6 border border-[#dadce0] google-card-shadow space-y-4 min-w-0">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1.5">
                Welcome Headline
              </label>
              <input
                type="text"
                required
                value={formData.welcomeHeadline}
                onChange={(e) => setFormData({ ...formData, welcomeHeadline: e.target.value })}
                placeholder="e.g. How was your experience with us?"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
              />
              <span className="text-[11px] text-[#70757a] mt-1 block">
                The primary friendly greeting at the top of the customer review page.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1.5">
                Customer Instructions &amp; Subtitle
              </label>
              <textarea
                rows={3}
                required
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="e.g. Select what we helped you with today..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
              />
              <span className="text-[11px] text-[#70757a] mt-1 block">
                Clear, reassuring explanation of the simple 2-step process.
              </span>
            </div>

            {/* Fallback Reviews Safety Net Section */}
            <div className="pt-4 border-t border-[#f1f3f4] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#1a73e8]" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                      Fallback Reviews
                    </h3>
                    <p className="text-[11px] text-[#5f6368]">
                      Backup drafts shown only if Gemini AI fails repeatedly
                    </p>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(formData.fallbackReviews?.enabled)}
                  onClick={() => handleToggleFallback(!formData.fallbackReviews?.enabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.fallbackReviews?.enabled ? 'bg-[#1a73e8]' : 'bg-[#dadce0]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      formData.fallbackReviews?.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {formData.fallbackReviews?.enabled ? (
                <div className="space-y-3 p-3.5 bg-[#f8f9fa] rounded-xl border border-[#e8eaed]">
                  <p className="text-[11px] text-[#5f6368] leading-relaxed">
                    Add up to 8 real customer review drafts below. When active, customers will receive these backup drafts if AI generation experiences any network or API failure.
                  </p>

                  <div className="space-y-2.5">
                    {(formData.fallbackReviews?.items || []).map((draft, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[#5f6368]">
                          <span>Review Draft #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFallbackDraft(idx)}
                            className="text-[#d93025] hover:text-[#b31412] p-1 rounded-md hover:bg-[#fce8e6] transition-colors cursor-pointer"
                            title="Delete draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={draft}
                          onChange={(e) => handleUpdateFallbackDraft(idx, e.target.value)}
                          placeholder="e.g. Excellent service! The team was highly professional, transparent with pricing, and completed the job promptly. Will definitely visit again."
                          className="w-full px-2.5 py-1.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:outline-none focus:border-[#1a73e8]"
                        />
                      </div>
                    ))}
                  </div>

                  {(!formData.fallbackReviews?.items || formData.fallbackReviews.items.length < 8) && (
                    <button
                      type="button"
                      onClick={handleAddFallbackDraft}
                      className="w-full py-2 px-3 border border-dashed border-[#1a73e8] text-[#1a73e8] bg-[#e8f0fe]/40 hover:bg-[#e8f0fe] rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Fallback Review Draft ({(formData.fallbackReviews?.items || []).length}/8)</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#e8eaed] text-[11px] text-[#70757a] flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-[#9aa0a6] shrink-0" />
                  <span>
                    Fallback reviews are currently disabled. If AI generation fails, customers will see a standard technical error notification.
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#f1f3f4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <a
                href={`/r/${user.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-[#1a73e8] hover:underline font-medium self-center sm:self-auto"
              >
                <span>Open in new tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Settings</span>
              </button>
            </div>
          </form>

          {/* Ethical Tips */}
          <div className="p-4 bg-[#e6f4ea] border border-[#ceead6] rounded-2xl text-xs text-[#137333] space-y-1">
            <span className="font-semibold block flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ethical Review Best Practices</span>
            </span>
            <p className="leading-relaxed text-[11px]">
              Keep instructions welcoming and neutral. Remind customers that their authentic words matter most and that they have full control to edit anything before posting on Google.
            </p>
          </div>
        </div>

        {/* Right Column: Live Mobile Device Mockup */}
        <div className="lg:col-span-6 flex flex-col items-center min-w-0 w-full">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#5f6368] mb-3">
            <Smartphone className="w-4 h-4 text-[#1a73e8]" />
            <span>Interactive Live Customer Mobile Preview</span>
          </div>

          {/* Smartphone Frame */}
          <div className="w-full max-w-[320px] sm:max-w-[340px] bg-[#202124] p-2.5 sm:p-3 rounded-[32px] sm:rounded-[36px] shadow-2xl border-4 border-[#dadce0]">
            <div className="bg-white rounded-[26px] overflow-hidden min-h-[540px] flex flex-col">
              {/* Phone Status Notch */}
              <div className="h-6 bg-[#f8f9fa] border-b border-[#f1f3f4] flex items-center justify-between px-6 text-[10px] text-[#70757a]">
                <span>9:41</span>
                <div className="w-16 h-3 bg-[#e8eaed] rounded-full mx-auto" />
                <span>5G</span>
              </div>

              {/* Mockup Header */}
              <div className="p-4 border-b border-[#f1f3f4] text-center bg-white">
                <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-sm mx-auto mb-2 shadow-2xs">
                  {user.businessName?.charAt(0) || 'R'}
                </div>
                <h4 className="font-bold text-sm text-[#202124] truncate">
                  {user.businessName}
                </h4>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#fbbc04] text-[#fbbc04]" />
                  ))}
                  <span className="text-[10px] text-[#5f6368] ml-1 font-medium">Google Reviews</span>
                </div>
              </div>

              {/* Dynamic Content Preview */}
              <div className="p-4 flex-1 space-y-4">
                <div className="text-center">
                  <h5 className="font-semibold text-xs text-[#202124]">
                    {formData.welcomeHeadline}
                  </h5>
                  <p className="text-[11px] text-[#5f6368] mt-1 leading-snug">
                    {formData.instructions}
                  </p>
                </div>

                {/* Sample Services Pills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#70757a] block">
                    1. Select services received:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {previewServices.map((svc, i) => (
                      <span
                        key={svc.id || i}
                        className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium ${
                          i === 0
                            ? 'bg-[#e8f0fe] text-[#1a73e8] border-[#1a73e8]'
                            : 'bg-white text-[#3c4043] border-[#dadce0]'
                        }`}
                      >
                        {svc.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Draft Box Preview */}
                <div className="p-3 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-[11px] text-[#3c4043] leading-relaxed">
                  <span className="text-[9px] font-bold uppercase text-[#1a73e8] block mb-1">
                    AI Suggested Draft:
                  </span>
                  &ldquo;I had a great experience with {user.businessName}! They helped me with {previewServices[0]?.name}. Professional and prompt service.&rdquo;
                </div>

                {/* Action button preview */}
                <div className="w-full py-2 bg-[#1a73e8] text-white rounded-lg text-center text-xs font-semibold shadow-2xs">
                  Copy &amp; Continue to Google
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
