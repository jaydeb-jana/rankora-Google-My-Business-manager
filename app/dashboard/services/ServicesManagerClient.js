'use client';
import { useState } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  Layers,
  X,
  Loader2,
  Save,
  Languages,
  Store,
  BookOpen,
  Info,
  Sliders,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';
import { INDUSTRY_TEMPLATES, DEFAULT_SERVICES } from '@/lib/presets';

const ALL_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
];

export default function ServicesManagerClient({ initialServices, initialAiKnowledge }) {
  const { showToast } = useToast();
  const [services, setServices] = useState(initialServices || []);

  // AI Knowledge States
  const [shopDetails, setShopDetails] = useState(initialAiKnowledge?.shopDetails || '');
  const [reviewStyleRules, setReviewStyleRules] = useState(initialAiKnowledge?.reviewStyleRules || '');
  const [languages, setLanguages] = useState(() => {
    if (initialAiKnowledge?.languages && initialAiKnowledge.languages.length > 0) {
      return initialAiKnowledge.languages;
    }
    return [{ code: 'en', name: 'English', ratio: 100 }];
  });
  const [savingKnowledge, setSavingKnowledge] = useState(false);
  const [selectedLangToAdd, setSelectedLangToAdd] = useState('');

  // Service Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ---------------------------------------------------------------------------
  // AI Knowledge Handlers
  // ---------------------------------------------------------------------------
  const handleAddLanguage = (code) => {
    if (!code) return;
    if (languages.length >= 2) {
      showToast('Maximum 2 languages can be selected.', 'error');
      setSelectedLangToAdd('');
      return;
    }

    if (languages.some((l) => l.code === code)) {
      showToast('This language is already added.', 'error');
      setSelectedLangToAdd('');
      return;
    }

    const langObj = ALL_LANGUAGES.find((l) => l.code === code);
    if (!langObj) return;

    // When adding a second language, set default ratio to 80 / 20 or 50 / 50
    const newLangs = [
      { ...languages[0], ratio: 80 },
      { code: langObj.code, name: langObj.name, ratio: 20 },
    ];

    setLanguages(newLangs);
    setSelectedLangToAdd('');
    showToast(`Added ${langObj.name} (${langObj.native})!`, 'success');
  };

  const handleRemoveLanguage = (code) => {
    if (languages.length <= 1) {
      showToast('At least 1 language must remain.', 'error');
      return;
    }

    const remaining = languages.filter((l) => l.code !== code);
    if (remaining.length === 1) {
      remaining[0].ratio = 100;
    }
    setLanguages(remaining);
    showToast('Language removed.', 'info');
  };

  const handleRatioSliderChange = (newRatio0) => {
    if (languages.length !== 2) return;
    const r0 = Math.max(0, Math.min(100, Math.round(Number(newRatio0))));
    const r1 = 100 - r0;
    setLanguages([
      { ...languages[0], ratio: r0 },
      { ...languages[1], ratio: r1 },
    ]);
  };

  const handleSaveKnowledge = async () => {
    setSavingKnowledge(true);
    try {
      const res = await fetch('/api/business/ai-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopDetails,
          reviewStyleRules,
          languages,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save AI Knowledge');

      showToast('AI Knowledge configuration saved successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingKnowledge(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Service Item Handlers
  // ---------------------------------------------------------------------------
  const openAddModal = () => {
    setServiceName('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!serviceName.trim()) {
      showToast('Service name is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/business/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: serviceName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add service');

      setServices(data.services);
      showToast('New service added successfully!', 'success');
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    try {
      const res = await fetch(`/api/business/services?id=${serviceToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete service');

      setServices(data.services);
      showToast('Service deleted.', 'info');
      setServiceToDelete(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleApplyPreset = async (presetName, presetList) => {
    try {
      const res = await fetch('/api/business/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: presetList }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply preset');

      setServices(data.services);
      showToast(`Applied ${presetName} template!`, 'success');
      setIsPresetModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const unaddedLanguages = ALL_LANGUAGES.filter(
    (al) => !languages.some((l) => l.code === al.code)
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#202124]">AI Knowledge &amp; Context</h2>
          </div>
          <p className="text-xs text-[#5f6368] mt-1.5 leading-relaxed">
            Configure store context, review style rules, and multilingual distribution so AI writes hyper-authentic customer reviews.
          </p>
        </div>

        <button
          type="button"
          disabled={savingKnowledge}
          onClick={handleSaveKnowledge}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          {savingKnowledge ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save AI Knowledge</span>
        </button>
      </div>

      {/* 1. Main AI Knowledge Settings Card (Shop Details & Style) */}
      <div className="bg-white rounded-2xl p-6 border border-[#dadce0] google-card-shadow space-y-6">
        {/* Shop Details Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Store className="w-4 h-4 text-[#1a73e8]" />
            <label className="text-sm font-semibold text-[#202124]">
              Shop &amp; Business Details
            </label>
          </div>
          <p className="text-xs text-[#5f6368] leading-relaxed">
            Write key details about your shop (e.g. products sold, top brands, specialities, warranties, store timings, or landmarks). The AI uses this context to mention real store facts in reviews.
          </p>
          <textarea
            rows={4}
            value={shopDetails}
            onChange={(e) => setShopDetails(e.target.value)}
            placeholder="e.g. We are a trusted computer shop & service center. We sell branded laptops (Dell, HP, Asus, Lenovo), custom gaming PC builds, original computer accessories, SSDs, and RAM. We also provide fast same-day laptop repair with 6 months warranty."
            className="w-full px-4 py-3 text-sm text-[#202124] border border-[#dadce0] rounded-xl focus:outline-none focus:border-[#1a73e8] focus:ring-3 focus:ring-[#e8f0fe] transition-all bg-[#fafafa] focus:bg-white"
          />
        </div>

        {/* Review Writing Style & Rules Section */}
        <div className="space-y-2 pt-2 border-t border-[#f1f3f4]">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#1a73e8]" />
            <label className="text-sm font-semibold text-[#202124]">
              Review Writing Style &amp; Rules
            </label>
          </div>
          <p className="text-xs text-[#5f6368] leading-relaxed">
            Define tone, persona, and guidelines for the AI (e.g. natural tone, avoid robotic buzzwords, emphasize courteous staff, keep it authentic and believable).
          </p>
          <textarea
            rows={3}
            value={reviewStyleRules}
            onChange={(e) => setReviewStyleRules(e.target.value)}
            placeholder="e.g. Write in a warm, enthusiastic, and natural customer tone. Mention polite behavior and fast turnaround. Never sound like a robotic advertisement or use repetitive clichés."
            className="w-full px-4 py-3 text-sm text-[#202124] border border-[#dadce0] rounded-xl focus:outline-none focus:border-[#1a73e8] focus:ring-3 focus:ring-[#e8f0fe] transition-all bg-[#fafafa] focus:bg-white"
          />
        </div>
      </div>

      {/* 2. Customer Pickable Services (Placed Above Language Section) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
                <Layers className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-[#202124]">
                Customer Pickable Services ({services.length})
              </h3>
            </div>
            <p className="text-xs text-[#5f6368] mt-1">
              These are the tap-to-select services customers choose on your public review page before generating drafts.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </button>
          </div>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-white p-3.5 rounded-xl border border-[#dadce0] google-card-shadow flex items-center justify-between gap-3 group hover:border-[#1a73e8] transition-all"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#202124] truncate">{svc.name}</h4>
                </div>

                <button
                  type="button"
                  onClick={() => setServiceToDelete(svc)}
                  className="p-1.5 text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-[#dadce0] text-center space-y-3">
            <Layers className="w-8 h-8 text-[#9aa0a6] mx-auto" />
            <h4 className="text-sm font-semibold text-[#202124]">No services added yet</h4>
            <p className="text-xs text-[#5f6368] max-w-sm mx-auto">
              Add the specific services or products you want customers to pick from when writing a review.
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Service</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Review Languages & Ratio Section (Placed Below Services) */}
      <div className="bg-white rounded-2xl p-6 border border-[#dadce0] google-card-shadow space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-[#1a73e8]" />
              <label className="text-sm font-semibold text-[#202124]">
                Review Languages &amp; Ratio Distribution
              </label>
            </div>
            <p className="text-xs text-[#5f6368] mt-0.5">
              Configure 1 to 2 review languages. When 2 languages are chosen, you can customize their percentage distribution (e.g. 20% and 80%).
            </p>
          </div>

          {/* Add Language Dropdown (shown only when count < 2) */}
          {languages.length < 2 && (
            <div className="flex items-center space-x-2 shrink-0">
              <select
                value={selectedLangToAdd}
                onChange={(e) => {
                  const code = e.target.value;
                  setSelectedLangToAdd(code);
                  if (code) handleAddLanguage(code);
                }}
                className="px-3 py-1.5 text-xs bg-white text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] cursor-pointer"
              >
                <option value="">+ Add Language (Max 2)</option>
                {unaddedLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.native})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Active Languages Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {languages.map((lang) => {
            const meta = ALL_LANGUAGES.find((l) => l.code === lang.code) || {
              flag: '🌐',
              native: lang.name,
            };
            const canDelete = languages.length > 1;

            return (
              <div
                key={lang.code}
                className="p-3.5 rounded-xl border border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">{meta.flag}</span>
                  <div>
                    <p className="text-xs font-semibold text-[#202124]">
                      {lang.name}{' '}
                      <span className="text-[11px] font-normal text-[#5f6368]">
                        ({meta.native})
                      </span>
                    </p>
                    <span className="text-[10px] text-[#1a73e8] font-bold">
                      {languages.length === 1 ? '100% of reviews' : `${lang.ratio}% distribution`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {canDelete ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(lang.code)}
                      title={`Remove ${lang.name}`}
                      className="p-1.5 text-[#d93025] hover:bg-[#fce8e6] rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span
                      className="text-[10px] text-[#70757a] bg-[#e8eaed] px-2 py-0.5 rounded-md"
                      title="At least 1 language must remain"
                    >
                      Default (Min 1)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ratio Slider & Quick Presets (when exactly 2 languages are chosen) */}
        {languages.length === 2 && (
          <div className="p-4 rounded-xl bg-[#f0f6ff] border border-[#d2e3fc] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1a73e8]">
              <span>
                {languages[0].name}: <strong className="text-base text-[#1557b0]">{languages[0].ratio}%</strong>
              </span>
              <span className="text-[#5f6368]">vs</span>
              <span>
                {languages[1].name}: <strong className="text-base text-[#1557b0]">{languages[1].ratio}%</strong>
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={languages[0].ratio}
              onChange={(e) => handleRatioSliderChange(e.target.value)}
              className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#1a73e8] border border-[#bdc1c6]"
            />

            {/* Visual Split Bar */}
            <div className="h-3 w-full rounded-full overflow-hidden flex border border-[#dadce0] bg-white">
              <div
                className="h-full bg-[#1a73e8] transition-all duration-200"
                style={{ width: `${languages[0].ratio}%` }}
              />
              <div
                className="h-full bg-[#34a853] transition-all duration-200"
                style={{ width: `${languages[1].ratio}%` }}
              />
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
              <span className="text-[11px] text-[#5f6368]">Quick Presets:</span>
              <div className="flex items-center space-x-1.5">
                {[
                  { label: '50% / 50%', r0: 50 },
                  { label: '80% / 20%', r0: 80 },
                  { label: '20% / 80%', r0: 20 },
                  { label: '70% / 30%', r0: 70 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleRatioSliderChange(preset.r0)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer ${
                      languages[0].ratio === preset.r0
                        ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                        : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f8f9fa]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Knowledge CTA */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={savingKnowledge}
            onClick={handleSaveKnowledge}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {savingKnowledge ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save AI Knowledge</span>
          </button>
        </div>
      </div>

      {/* Add Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-[#dadce0] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#202124]">Add New Service</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#5f6368] hover:text-[#202124] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1.5">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laptop Repair, Hardware Upgrade"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#5f6368] hover:bg-[#f1f3f4] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg shadow-2xs"
                >
                  {submitting ? 'Adding...' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Industry Presets Modal */}
      {isPresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 border border-[#dadce0] shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#202124]">Load Industry Template</h3>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Select a starter package suited to your line of work:
                </p>
              </div>
              <button
                onClick={() => setIsPresetModalOpen(false)}
                className="p-1 text-[#5f6368] hover:text-[#202124] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(INDUSTRY_TEMPLATES).map(([industry, items]) => (
                <div
                  key={industry}
                  className="p-4 rounded-xl border border-[#dadce0] hover:border-[#1a73e8] transition-all bg-[#f8f9fa] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#202124]">{industry}</h4>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(industry, items)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg shadow-2xs"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-[11px] text-[#5f6368] line-clamp-2">
                    {items.map((it) => it.name).join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Service Confirmation */}
      <ConfirmModal
        isOpen={Boolean(serviceToDelete)}
        title="Delete Service?"
        message={`Are you sure you want to delete "${serviceToDelete?.name}"?`}
        confirmText="Delete"
        danger
        onCancel={() => setServiceToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
