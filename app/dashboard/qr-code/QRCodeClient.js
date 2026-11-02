'use client';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Star,
  Info,
  LayoutTemplate,
  X,
  Palette,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic Rankaro',
    tag: 'Clean Minimalist',
    details:
      'Clean white tabletop card with crisp Google Blue accents, five gold stars, and authentic review prompt. Specially tailored for checkout desks, reception counters, and standard acrylic stands.',
    colors: [
      { name: 'Card White', hex: '#FFFFFF', border: true },
      { name: 'Google Blue', hex: '#1A73E8' },
      { name: 'Charcoal Text', hex: '#202124' },
      { name: 'Star Gold', hex: '#FBBC04' },
      { name: 'Border Gray', hex: '#DADCE0' },
    ],
  },
  {
    id: 'google-five-star',
    name: 'Google Five Star',
    tag: 'Official Google Branding',
    details:
      'High-converting Google review display featuring the official 4-color top banner, vibrant G emblem, official Google wordmark, and bold FIVE STAR headline.',
    colors: [
      { name: 'Google Blue', hex: '#4285F4' },
      { name: 'Google Red', hex: '#EA4335' },
      { name: 'Google Yellow', hex: '#FBBC05' },
      { name: 'Google Green', hex: '#34A853' },
      { name: 'Background White', hex: '#FFFFFF', border: true },
      { name: 'Headline Charcoal', hex: '#202124' },
    ],
  },
  {
    id: 'google-review',
    name: 'Review on Google',
    tag: 'Modern Google Look',
    details:
      'Balanced official Google branding with business name focus, five gold rating stars, and clear "Rate your visit" call-to-action for maximum customer trust.',
    colors: [
      { name: 'Google Blue', hex: '#4285F4' },
      { name: 'Google Red', hex: '#EA4335' },
      { name: 'Google Yellow', hex: '#FBBC05' },
      { name: 'Google Green', hex: '#34A853' },
      { name: 'Card White', hex: '#FFFFFF', border: true },
      { name: 'Primary Text', hex: '#202124' },
      { name: 'Muted Gray', hex: '#5F6368' },
    ],
  },
  {
    id: 'navy-standee',
    name: 'Navy Standee',
    tag: 'Dark Executive',
    details:
      'High-contrast deep midnight navy background with crisp white business typography, vivid gold stars, and ice blue highlights. Ideal for executive offices, modern salons, dental clinics, and cocktail lounges.',
    colors: [
      { name: 'Deep Navy', hex: '#0B1F3A' },
      { name: 'Ice Sky Blue', hex: '#8AB4F8' },
      { name: 'Crisp White', hex: '#FFFFFF', border: true },
      { name: 'Star Gold', hex: '#FBBC04' },
      { name: 'Muted Silver', hex: '#9AA0A6' },
    ],
  },
  {
    id: 'gold-premium',
    name: 'Gold Premium',
    tag: 'Luxury Bronze & Gold',
    details:
      'Dark obsidian bronze background paired with antique gold trim, warm cream serif typography, and golden review stars. Tailored for fine dining, jewelry boutiques, luxury spas, and hotels.',
    colors: [
      { name: 'Dark Bronze', hex: '#1C1408' },
      { name: 'Antique Gold', hex: '#C9A227' },
      { name: 'Bright Gold', hex: '#E8C547' },
      { name: 'Warm Cream', hex: '#F8F1D8' },
      { name: 'Champagne Gold', hex: '#D4B56A' },
    ],
  },
  {
    id: 'mint-modern',
    name: 'Mint Modern',
    tag: 'Fresh Pastel',
    details:
      'Inviting pastel mint green card with calming forest green headings and sage borders. Perfect for cafes, wellness studios, eco-friendly retail shops, and healthcare practices.',
    colors: [
      { name: 'Soft Mint', hex: '#F1FBF4' },
      { name: 'Forest Green', hex: '#137333' },
      { name: 'Sage Border', hex: '#CEEAD6' },
      { name: 'Charcoal Text', hex: '#202124' },
      { name: 'Star Gold', hex: '#FBBC04' },
    ],
  },
  {
    id: 'bold-counter',
    name: 'Bold Counter',
    tag: 'High Contrast POS',
    details:
      'Vibrant Google Blue header bar combined with strong charcoal borders for high visibility from across the counter. Best suited for high-volume cash registers and billing desks.',
    colors: [
      { name: 'Header Blue', hex: '#1A73E8' },
      { name: 'Card White', hex: '#FFFFFF', border: true },
      { name: 'Solid Charcoal', hex: '#202124' },
      { name: 'Star Gold', hex: '#FBBC04' },
      { name: 'Border Gray', hex: '#DADCE0' },
    ],
  },
];

function GoogleG({ className = 'w-10 h-10' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function GoogleWordmark({ className = 'text-2xl' }) {
  return (
    <span className={`font-medium tracking-tight ${className}`} aria-label="Google">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  );
}

function FiveStars({ size = 'w-6 h-6', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${size} fill-[#fbbc04] text-[#fbbc04]`} />
      ))}
    </div>
  );
}

function QrFrame({ dataUrl, size = 'w-48 h-48', frameClass = '' }) {
  return (
    <div className={`inline-block bg-white ${frameClass}`}>
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt="Scan to review" className={`${size} object-contain mx-auto`} />
      ) : (
        <div className={`${size} flex items-center justify-center bg-[#f8f9fa] text-[10px] text-[#70757a]`}>
          Generating...
        </div>
      )}
    </div>
  );
}

function DisplayCard({ templateId, user, dataUrl }) {
  if (templateId === 'google-five-star') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden max-w-md mx-auto text-center border border-[#dadce0] shadow-xs">
        <div className="flex h-1.5">
          <div className="flex-1 bg-[#4285F4]" />
          <div className="flex-1 bg-[#EA4335]" />
          <div className="flex-1 bg-[#FBBC05]" />
          <div className="flex-1 bg-[#34A853]" />
        </div>
        <div className="px-8 py-8">
          <div className="flex flex-col items-center mb-5">
            <GoogleG className="w-12 h-12 mb-2" />
            <GoogleWordmark className="text-[28px] leading-none" />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5f6368] mb-1">
            Leave us a
          </p>
          <h2 className="text-[34px] leading-none font-black tracking-tight text-[#202124] mb-3">
            FIVE STAR
          </h2>
          <FiveStars size="w-7 h-7" className="mb-2" />
          <p className="text-xs text-[#5f6368] mb-5">
            review on Google
          </p>

          <QrFrame
            dataUrl={dataUrl}
            frameClass="p-3 rounded-xl border border-[#e8eaed] shadow-sm mb-5"
          />

          <p className="text-sm font-semibold text-[#202124] mb-1">
            {user.businessName}
          </p>
          <p className="text-[11px] text-[#5f6368]">
            Point your phone camera at this QR code
          </p>
        </div>
      </div>
    );
  }

  if (templateId === 'google-review') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden max-w-md mx-auto text-center border border-[#dadce0] shadow-xs">
        <div className="px-8 pt-8 pb-7">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GoogleG className="w-8 h-8" />
            <GoogleWordmark className="text-xl" />
          </div>
          <p className="text-xs font-medium text-[#5f6368] mb-1">Rate your visit</p>
          <h2 className="text-xl font-bold text-[#202124] mb-3">{user.businessName}</h2>
          <FiveStars className="mb-5" />
          <QrFrame
            dataUrl={dataUrl}
            frameClass="p-4 rounded-2xl border-2 border-[#f1f3f4] mb-5"
          />
          <p className="text-xs font-semibold text-[#202124]">Scan to review on Google</p>
          <p className="text-[11px] text-[#5f6368] mt-1">
            Your five-star feedback takes less than a minute
          </p>
        </div>
      </div>
    );
  }

  if (templateId === 'navy-standee') {
    return (
      <div className="bg-[#0b1f3a] rounded-2xl overflow-hidden max-w-md mx-auto text-center border border-[#0b1f3a] shadow-xs">
        <div className="px-8 py-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8ab4f8] mb-2">
            We value your visit
          </p>
          <h2 className="text-2xl font-bold text-white mb-3">{user.businessName}</h2>
          <FiveStars className="mb-5" />
          <QrFrame
            dataUrl={dataUrl}
            frameClass="p-3 rounded-2xl mb-5"
          />
          <p className="text-sm font-semibold text-white">Scan &amp; share your review</p>
          <p className="text-[11px] text-[#9aa0a6] mt-1">
            Draft copies straight to Google in one tap
          </p>
        </div>
      </div>
    );
  }

  if (templateId === 'gold-premium') {
    return (
      <div className="bg-[#1c1408] rounded-2xl overflow-hidden max-w-md mx-auto text-center border border-[#c9a227] shadow-xs">
        <div className="px-8 py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#e8c547] mb-2">
            A five star thank you
          </p>
          <h2 className="text-2xl font-serif font-bold text-[#f8f1d8] mb-3">{user.businessName}</h2>
          <FiveStars className="mb-5" />
          <QrFrame
            dataUrl={dataUrl}
            frameClass="p-3 rounded-xl border border-[#c9a227] mb-5"
          />
          <p className="text-sm font-medium text-[#f8f1d8]">Scan to leave a Google review</p>
          <p className="text-[11px] text-[#d4b56a] mt-1">
            Your kind words help others find us
          </p>
        </div>
      </div>
    );
  }

  if (templateId === 'mint-modern') {
    return (
      <div className="bg-[#f1fbf4] rounded-2xl overflow-hidden max-w-md mx-auto text-center border border-[#ceead6] shadow-xs">
        <div className="px-8 py-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#137333] mb-2">
            Thank you
          </p>
          <h2 className="text-2xl font-bold text-[#202124] mb-2">{user.businessName}</h2>
          <p className="text-xs text-[#5f6368] mb-4">
            If we earned it, a five-star review means the world.
          </p>
          <FiveStars className="mb-5" />
          <QrFrame
            dataUrl={dataUrl}
            frameClass="p-4 rounded-2xl border border-[#ceead6] shadow-sm mb-5"
          />
          <p className="text-xs font-semibold text-[#137333]">Point your camera here</p>
        </div>
      </div>
    );
  }

  if (templateId === 'bold-counter') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden max-w-md mx-auto text-center border-2 border-[#202124] shadow-xs">
        <div className="bg-[#1a73e8] px-6 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
            Scan to review
          </p>
          <h2 className="text-xl font-black text-white">{user.businessName}</h2>
        </div>
        <div className="px-8 py-6">
          <p className="text-lg font-black tracking-tight text-[#202124] mb-2">FIVE STAR</p>
          <FiveStars className="mb-5" />
          <QrFrame
            dataUrl={dataUrl}
            frameClass="p-2 rounded-xl border border-[#dadce0] mb-4"
          />
          <p className="text-xs font-semibold text-[#202124]">Open your camera and scan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#dadce0] rounded-2xl p-8 max-w-md mx-auto text-center shadow-xs">
      <div className="flex items-center justify-center space-x-1.5 mb-2">
        <span className="text-xs uppercase font-bold tracking-widest text-[#1a73e8]">
          Share Your Thoughts
        </span>
      </div>

      <h2 className="text-xl font-bold text-[#202124] mb-1">
        {user.businessName}
      </h2>

      <p className="text-xs text-[#5f6368] max-w-xs mx-auto mb-4">
        Thank you for visiting us! Your feedback helps us grow and assists others in finding honest service.
      </p>

      <FiveStars size="w-5 h-5" className="mb-4" />

      <QrFrame
        dataUrl={dataUrl}
        frameClass="p-4 rounded-2xl border border-[#dadce0] shadow-sm mb-4"
      />

      <div className="space-y-1">
        <p className="text-xs font-semibold text-[#202124]">
          Point your phone camera here
        </p>
        <p className="text-[11px] text-[#5f6368]">
          Select the services you received &amp; copy your draft directly to Google!
        </p>
      </div>

      <div className="mt-6 pt-3 border-t border-[#f1f3f4] flex items-center justify-between text-[10px] text-[#9aa0a6]">
        <span>Powered by Rankaro</span>
        <span>Fast • Easy • Authentic</span>
      </div>
    </div>
  );
}

function TemplateModal({ isOpen, onClose, activeId, onSelect }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTemplate = TEMPLATES.find((t) => t.id === activeId) || TEMPLATES[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-[#dadce0] flex flex-col max-h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-[#f1f3f4] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 id="template-modal-title" className="text-base sm:text-lg font-bold text-[#202124]">
                Change Display Template
              </h3>
              <p className="text-xs text-[#5f6368]">
                Select a template style for your printable counter card ({TEMPLATES.length} templates)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Templates List without preview images, only Name, Details, and Colors */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {TEMPLATES.map((template) => {
            const isSelected = template.id === activeId;
            return (
              <div
                key={template.id}
                onClick={() => onSelect(template.id)}
                className={`cursor-pointer rounded-2xl p-4 sm:p-4.5 transition-all border text-left ${
                  isSelected
                    ? 'border-[#1a73e8] bg-[#f8fafd] ring-2 ring-[#1a73e8]/20 shadow-xs'
                    : 'border-[#dadce0] bg-white hover:border-[#1a73e8]/50 hover:bg-[#fafbfc]'
                }`}
              >
                {/* Top Row: Name, Tag & Radio */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 className="text-sm sm:text-base font-bold text-[#202124]">
                        {template.name}
                      </h4>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f1f3f4] text-[#5f6368]">
                        {template.tag}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#1e8e3e] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    {/* Details below name */}
                    <p className="text-xs text-[#5f6368] leading-relaxed mt-1.5">
                      {template.details}
                    </p>
                  </div>

                  {/* Radio indicator */}
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[#1a73e8] bg-[#1a73e8]'
                          : 'border-[#dadce0] bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>

                {/* Colors Used Section */}
                <div className="mt-3.5 pt-3 border-t border-[#f1f3f4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#3c4043]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]" />
                    <span>Colors Used:</span>
                  </div>

                  <div className="flex items-center flex-wrap gap-1.5">
                    {template.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center space-x-1.5 px-2 py-1 rounded-md bg-[#f8f9fa] border border-[#e8eaed] text-[11px] text-[#3c4043]"
                        title={`${color.name} (${color.hex})`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full shrink-0 shadow-2xs ${
                            color.border ? 'border border-[#dadce0]' : ''
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="font-medium text-[10.5px]">{color.name}</span>
                        <span className="font-mono text-[9.5px] text-[#70757a] uppercase">
                          {color.hex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 bg-[#f8f9fa] border-t border-[#dadce0] flex items-center justify-between shrink-0">
          <p className="text-xs text-[#5f6368]">
            Current: <strong className="text-[#202124]">{currentTemplate.name}</strong>
          </p>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl transition-colors shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QRCodeClient({ user }) {
  const { showToast } = useToast();
  const [dataUrl, setDataUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [copied, setCopied] = useState(false);
  const [templateId, setTemplateId] = useState('classic');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reviewUrl, setReviewUrl] = useState(`/r/${user.slug}`);
  const printCardRef = useRef(null);

  useEffect(() => {
    setReviewUrl(`${window.location.origin}/r/${user.slug}`);
    try {
      const saved = window.localStorage.getItem('rankaro-qr-template');
      if (saved && TEMPLATES.some((t) => t.id === saved)) {
        setTemplateId(saved);
      }
    } catch {
      /* ignore */
    }
  }, [user.slug]);

  useEffect(() => {
    QRCode.toDataURL(reviewUrl, {
      width: 800,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#202124',
        light: '#ffffff',
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));

    QRCode.toString(reviewUrl, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#202124',
        light: '#ffffff',
      },
    })
      .then((svg) => setSvgString(svg))
      .catch((err) => console.error('SVG QR error:', err));
  }, [reviewUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    showToast('Review link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `rankaro-${user.slug}-qrcode.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('High-resolution QR code PNG downloaded!', 'success');
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rankaro-${user.slug}-qrcode.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Vector QR code SVG downloaded!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectTemplate = (id) => {
    setTemplateId(id);
    try {
      window.localStorage.setItem('rankaro-qr-template', id);
    } catch {
      /* ignore */
    }
    const picked = TEMPLATES.find((t) => t.id === id);
    showToast(`${picked?.name || 'Template'} selected`, 'success');
  };

  const activeTemplate = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-[#202124]">
          Downloadable QR Code & Counter Displays
        </h2>
        <p className="text-xs text-[#5f6368] mt-1">
          Provide your customers with an instant scan target that launches your personalized Rankaro review assistant on any smartphone camera.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Code Visual & Downloads */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-[#dadce0] google-card-shadow flex flex-col items-center text-center">
            <span className="text-xs font-semibold text-[#5f6368] uppercase tracking-wider mb-4">
              Scannable QR Code
            </span>

            <div className="p-4 bg-white rounded-2xl border-2 border-[#e8eaed] shadow-xs mb-4">
              {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dataUrl}
                  alt={`QR code for ${user.businessName}`}
                  className="w-56 h-56 object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center bg-[#f8f9fa] text-xs text-[#70757a]">
                  Generating QR code...
                </div>
              )}
            </div>

            <p className="text-xs text-[#202124] font-medium mb-1">
              {user.businessName}
            </p>
            <p className="text-[11px] font-mono text-[#5f6368] mb-4 truncate max-w-xs">
              {reviewUrl}
            </p>

            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={!dataUrl}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadSvg}
                disabled={!svgString}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 text-xs font-semibold text-[#3c4043] bg-white hover:bg-[#f8f9fa] border border-[#dadce0] rounded-xl transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#5f6368]" />
                <span>Vector SVG</span>
              </button>
            </div>

            <div className="w-full pt-3 mt-4 border-t border-[#f1f3f4] flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center space-x-1 text-xs text-[#1a73e8] hover:underline font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#1e8e3e]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
              </button>

              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-[#5f6368] hover:text-[#202124]"
              >
                <span>Open Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#e8eaed] text-xs text-[#5f6368] space-y-2">
            <div className="flex items-center space-x-2 text-[#202124] font-semibold">
              <Info className="w-4 h-4 text-[#1a73e8]" />
              <span>Where to place your QR code</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#5f6368]">
              <li>Front desk / reception checkout counter</li>
              <li>Dining table tents or receipt bill presentation booklets</li>
              <li>Business cards, appointment reminders, and work order invoices</li>
              <li>Follow-up thank you emails or SMS texts</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Printable Table Tent / Counter Display Stand */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-[#dadce0] google-card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#202124]">
                  Printable Table Tent / Counter Card
                </h3>
                <p className="text-xs text-[#5f6368]">
                  Print this clean display card to place right at your checkout desk or tables.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#1e8e3e] hover:bg-[#188038] rounded-xl shadow-2xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Display Card</span>
              </button>
            </div>

            <div ref={printCardRef} id="printable-display-card">
              <DisplayCard templateId={templateId} user={user} dataUrl={dataUrl} />
            </div>

            <div className="mt-4 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setPickerOpen((open) => !open)}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 text-xs font-semibold text-[#1a73e8] bg-white hover:bg-[#f8f9fa] border border-[#dadce0] rounded-xl shadow-2xs transition-colors"
                aria-expanded={pickerOpen}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>Change Template</span>
              </button>
              <p className="text-[11px] text-[#5f6368] mt-2">
                Current: <span className="font-medium text-[#202124]">{activeTemplate.name}</span>
              </p>
            </div>

            {pickerOpen && (
              <div className="mt-4 pt-4 border-t border-[#f1f3f4]">
                <p className="text-xs font-semibold text-[#202124] mb-3">
                  Choose a display template
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TEMPLATES.map((template) => {
                    const selected = template.id === templateId;
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleSelectTemplate(template.id)}
                        className="text-left"
                      >
                        <TemplateThumb template={template} selected={selected} />
                        <p className="mt-2 text-[11px] font-semibold text-[#202124]">
                          {template.name}
                        </p>
                        <p className="text-[10px] text-[#5f6368]">{template.blurb}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-display-card,
          #printable-display-card * {
            visibility: visible;
          }
          #printable-display-card {
            position: absolute;
            left: 50%;
            top: 8%;
            transform: translateX(-50%);
            width: 80% !important;
            max-width: 500px !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
