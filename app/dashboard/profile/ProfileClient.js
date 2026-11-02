'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Link as LinkIcon,
  Save,
  Loader2,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlertTriangle,
  Lock,
  Copy,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import GoogleReviewUrlHelpModal from '@/components/GoogleReviewUrlHelpModal';

export default function ProfileClient({ initialUser }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState(initialUser);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [copiedReviewUrl, setCopiedReviewUrl] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState('');
  const fileInputRef = useRef(null);
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const handleCopyReviewLink = () => {
    const link = `${currentOrigin || ''}/r/${user?.slug || ''}`;
    navigator.clipboard.writeText(link);
    setCopiedReviewUrl(true);
    showToast('Review link copied to clipboard!', 'success');
    setTimeout(() => setCopiedReviewUrl(false), 2000);
  };

  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    ownerName: user?.ownerName || '',
    phone: user?.phone || '',
    googleReviewUrl: user?.googleReviewUrl || '',
    businessCategory: user?.businessCategory || 'Professional Services',
    address: user?.address || '',
    city: user?.city || '',
    website: user?.website || '',
    description: user?.description || '',
    slug: user?.slug || '',
    logoUrl: user?.logoUrl || '',
  });

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setFormData((prev) => ({
        ...prev,
        businessName: initialUser.businessName || '',
        ownerName: initialUser.ownerName || '',
        phone: initialUser.phone || '',
        googleReviewUrl: initialUser.googleReviewUrl || '',
        businessCategory: initialUser.businessCategory || prev.businessCategory,
        address: initialUser.address || '',
        city: initialUser.city || '',
        website: initialUser.website || '',
        description: initialUser.description || '',
        slug: initialUser.slug || '',
        logoUrl: initialUser.logoUrl || '',
      }));
    }
  }, [initialUser]);

  const [saving, setSaving] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5 MB limit. Please select a file under 5 MB.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a valid image file (PNG, JPG, WEBP, or SVG).', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setLogoUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/business/upload-logo', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload logo');

      const newLogoUrl = data.logoUrl;
      setFormData((prev) => ({ ...prev, logoUrl: newLogoUrl }));
      setUser((prev) => ({ ...prev, logoUrl: newLogoUrl }));
      showToast('Business logo uploaded successfully!', 'success');
      router.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLogoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = async () => {
    setLogoUploading(true);
    try {
      const res = await fetch('/api/business/upload-logo', {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove logo');

      setFormData((prev) => ({ ...prev, logoUrl: '' }));
      setUser((prev) => ({ ...prev, logoUrl: '' }));
      showToast('Business logo removed.', 'info');
      router.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/business/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setUser(data.profile);
      showToast('Profile and business details updated successfully!', 'success');
      router.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {user?.status === 'suspended' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-900 space-y-1.5 shadow-2xs">
          <div className="flex items-center space-x-2 font-bold text-sm text-red-950">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Account Status: Suspended by Official Google Partner</span>
          </div>
          <p className="text-xs text-red-800 leading-relaxed">
            {user.suspensionReason
              ? `Notice from Official Google Partner: "${user.suspensionReason}"`
              : 'This account has been temporarily restricted by the Official Google Partner compliance desk.'}
          </p>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-[#202124]">
          Business Profile &amp; Google Review Link
        </h2>
        <p className="text-xs text-[#5f6368] mt-1">
          Manage your contact credentials, Google Maps Place link, and public page handle.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Google Review URL Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#dadce0] google-card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
                <LinkIcon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#202124]">
                  Official Google Review URL *
                </h3>
                <p className="text-xs text-[#5f6368]">
                  This is the link your customers are redirected to once they copy their review draft.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center space-x-1 text-xs text-[#1a73e8] hover:underline font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to find this?</span>
            </button>
          </div>

          <div>
            <input
              type="text"
              name="googleReviewUrl"
              value={formData.googleReviewUrl}
              onChange={handleChange}
              placeholder="Paste your link here (e.g. https://share.google/... or Google Review URL)"
              className="w-full px-3.5 py-2.5 text-sm text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
            />
          </div>

          {formData.googleReviewUrl && (
            <div className="flex items-center space-x-3 text-xs">
              <a
                href={formData.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[#1a73e8] hover:underline font-medium"
              >
                <span>Open Google link in new tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[#9aa0a6]">•</span>
              <span className="text-[#137333] flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Link configured</span>
              </span>
            </div>
          )}
        </div>

        {/* Business Brand & Logo Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#dadce0] google-card-shadow space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-[#e8f0fe] text-[#1a73e8]">
                <ImageIcon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#202124]">
                  Business Logo
                </h3>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Your logo appears on the customer review page, sidebar, and print materials.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-1 rounded-full shrink-0">
              Max 5 MB
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-1">
            {/* Logo Preview Avatar */}
            <div className="relative group shrink-0">
              {formData.logoUrl ? (
                <div className="w-24 h-24 rounded-2xl border-2 border-[#dadce0] overflow-hidden bg-white p-1.5 shadow-xs flex items-center justify-center">
                  <img
                    src={formData.logoUrl}
                    alt={formData.businessName || 'Business Logo'}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#dadce0] bg-[#f8f9fa] flex flex-col items-center justify-center text-[#5f6368] hover:border-[#1a73e8] transition-colors">
                  <span className="text-2xl font-bold text-[#1a73e8]">
                    {formData.businessName?.charAt(0) || 'B'}
                  </span>
                  <span className="text-[10px] font-medium mt-1 text-[#70757a]">No Logo</span>
                </div>
              )}

              {logoUploading && (
                <div className="absolute inset-0 bg-white/85 rounded-2xl flex items-center justify-center backdrop-blur-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1a73e8]" />
                </div>
              )}
            </div>

            {/* Actions & Guidelines */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={logoUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {logoUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{formData.logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                </button>

                {formData.logoUrl && (
                  <button
                    type="button"
                    disabled={logoUploading}
                    onClick={handleRemoveLogo}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-[#d93025] hover:bg-[#fce8e6] border border-[#fad2cf] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <div className="text-xs text-[#5f6368] space-y-1">
                <p>
                  Recommended size: Square ratio (e.g. 500 × 500 px).
                </p>
                <p className="text-[11px] text-[#70757a]">
                  Supported formats: <strong>PNG, JPG, WEBP, SVG</strong> · Max size: <strong>5 MB</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Business Information */}
        <div className="bg-white rounded-2xl p-6 border border-[#dadce0] google-card-shadow space-y-4">
          <h3 className="text-sm font-semibold text-[#202124]">
            Business Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1.5">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1.5">
                Owner / Manager Name *
              </label>
              <input
                type="text"
                name="ownerName"
                required
                value={formData.ownerName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1.5">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1.5">
                Business Category
              </label>
              <select
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] bg-white"
              >
                <option value="Healthcare & Dental">Healthcare & Dental</option>
                <option value="Home Services & Contracting">Home Services & Contracting</option>
                <option value="Restaurant & Cafe">Restaurant & Cafe</option>
                <option value="Auto Repair & Detailing">Auto Repair & Detailing</option>
                <option value="Salon, Spa & Wellness">Salon, Spa & Wellness</option>
                <option value="Computer Shop">Computer Shop</option>
                <option value="Legal & Financial">Legal & Financial</option>
                <option value="Retail & Shopping">Retail & Shopping</option>
                <option value="Professional Services">Professional Services</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1.5">
                Physical Address (Optional)
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 742 Evergreen Terrace"
                className="w-full px-3.5 py-2.5 text-sm text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1.5">
                City / Region
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Seattle, WA"
                className="w-full px-3.5 py-2.5 text-sm text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1.5">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                className="w-full px-3.5 py-2.5 text-sm text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
              />
            </div>
          </div>
        </div>

        {/* Account Info (Read Only) */}
        <div className="bg-white rounded-2xl p-6 border border-[#dadce0] google-card-shadow">
          <h3 className="text-sm font-semibold text-[#202124] mb-3">
            Account Credentials
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[#5f6368] block">Registered Email Address:</span>
              <span className="font-semibold text-[#202124]">{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#137333] font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Account</span>
              </span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl shadow-xs transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      <GoogleReviewUrlHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
