'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Mail,
  MessageSquare,
  Building2,
  ExternalLink,
  PhoneCall,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Loader2,
  ShieldCheck,
  Globe,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function ContactClient({ user }) {
  const { showToast } = useToast();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.ownerName || user?.businessName || '',
    email: user?.email || '',
    phone: user?.phone || '+91 7872490719',
    subject: 'Google Business Profile Review Automation',
    message: '',
  });

  // Calculate live IST working status
  const istStatus = useMemo(() => {
    try {
      const now = new Date();
      // IST is UTC + 5:30
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const istTime = new Date(utcTime + 3600000 * 5.5);
      const day = istTime.getDay(); // 0 is Sunday, 1-6 Mon-Sat
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const currentMinutes = hours * 60 + minutes;

      const openMinutes = 9 * 60; // 9:00 AM
      const closeMinutes = 19 * 60; // 7:00 PM

      if (day === 0) {
        return {
          isOpen: false,
          statusText: 'Sunday: Emergency WhatsApp Support Only',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      }

      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        return {
          isOpen: true,
          statusText: 'Desk Open Now (9:00 AM – 7:00 PM IST)',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      }

      return {
        isOpen: false,
        statusText: 'Closed Now — Opens 9:00 AM IST (Mon-Sat)',
        badgeColor: 'bg-gray-100 text-[#5f6368] border-gray-200',
      };
    } catch (e) {
      return {
        isOpen: true,
        statusText: 'Available 6 Days / Week (9:00 AM – 7:00 PM IST)',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    }
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('info@arventaventures.online');
    setCopiedEmail(true);
    showToast('Email address copied to clipboard: info@arventaventures.online', 'success');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+91 7872490719');
    setCopiedPhone(true);
    showToast('WhatsApp number copied to clipboard: +91 7872490719', 'success');
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill out your name, email, and message.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedTicket(data.inquiryId || 'INQ-' + Date.now().toString(36).toUpperCase());
        showToast(data.message || 'Your inquiry has been sent successfully!', 'success');
        setFormData((prev) => ({ ...prev, message: '' }));
      } else {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }
    } catch (err) {
      showToast(err.message || 'Failed to send message. Please contact us via WhatsApp.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Arventa Ventures Team,\n\nI am contacting from RANKORA regarding: ${formData.subject}\n\n*Name:* ${formData.name || 'Not provided'}\n*Email:* ${formData.email || 'Not provided'}\n*Business:* ${user?.businessName || 'Business Profile'}\n\n*Message:* ${formData.message || 'I would like to inquire about RANKORA and Google Business Profile scaling.'}`
    );
    window.open(`https://wa.me/917872490719?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-[#5f6368]">
        <Link href="/dashboard" className="hover:text-[#1a73e8] transition-colors">
          Google Business Profile
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#202124]">Contact</span>
      </div>

      {/* Parent Operating Entity Hero Card */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-50 via-indigo-50/50 to-transparent -z-0 pointer-events-none rounded-bl-full" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
              <Building2 className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>Parent Operating Entity</span>
            </span>

            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f1f3f4] text-[#3c4043]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34a853]" />
              <span>Verified Business Provider</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202124]">
              Arventa Ventures
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#5f6368] max-w-3xl leading-relaxed">
              <strong className="text-[#202124] font-semibold">RANKORA</strong> is engineered and operated by{' '}
              <strong className="text-[#202124] font-semibold">Arventa Ventures</strong>, a performance-driven agency delivering full-funnel digital scaling, Google Business Profile local SEO ranking, and AI reputation automation.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="https://arventaventures.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Visit Official Website</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>

            <button
              onClick={handleWhatsAppDirect}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Chat Support</span>
            </button>
          </div>

          {/* User Account Context Bar */}
          <div className="pt-3 border-t border-[#f1f3f4] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#5f6368]">
            <div>
              <span className="text-[#70757a]">Business Account: </span>
              <strong className="text-[#202124] font-medium">{user?.businessName || 'raj computer and electronics'}</strong>
            </div>
            <div>
              <span className="text-[#70757a]">Account Email: </span>
              <span className="text-[#202124] font-medium">{user?.email || 'janajaydeb36@gmail.com'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Snapshot Bar */}
      <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-5 sm:p-6">
        <h2 className="text-xs uppercase tracking-wider font-bold text-[#5f6368] mb-4">
          Company Snapshot
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#e8eaed] space-y-1">
            <p className="text-xs text-[#70757a] font-medium">Official Domain</p>
            <a
              href="https://arventaventures.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base font-bold text-[#1a73e8] hover:underline flex items-center space-x-1"
            >
              <span>arventaventures.online</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e8eaed] space-y-1">
            <p className="text-xs text-[#70757a] font-medium">Customer Support</p>
            <p className="text-sm sm:text-base font-bold text-[#202124]">
              Available 6 Days / Week
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e8eaed] space-y-1">
            <p className="text-xs text-[#70757a] font-medium">Verification Status</p>
            <p className="text-sm sm:text-base font-bold text-[#1e8e3e] flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
              <span>Verified Business Provider</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3 Communication Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Official Email */}
        <div className="bg-white rounded-2xl border border-[#dadce0] p-6 hover:shadow-md hover:border-[#1a73e8]/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#1a73e8] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#202124]">Official Email</h3>
              <p className="mt-1 text-xs text-[#5f6368] leading-relaxed">
                For enterprise inquiries, partnerships, and technical questions.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="mailto:info@arventaventures.online"
                className="text-sm font-semibold text-[#1a73e8] hover:underline break-all"
              >
                info@arventaventures.online
              </a>
              <p className="text-[11px] text-[#70757a] mt-1 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-[#1e8e3e]" />
                <span>Response time: within 2 hours</span>
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f3f4] flex items-center space-x-2">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#3c4043] bg-[#f8f9fa] hover:bg-[#f1f3f4] border border-[#dadce0] transition-colors"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#1e8e3e]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
            </button>

            <a
              href="mailto:info@arventaventures.online"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1a73e8] hover:bg-[#e8f0fe] transition-colors"
            >
              <span>Email Now</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 2. WhatsApp Support */}
        <div className="bg-white rounded-2xl border border-[#dadce0] p-6 hover:shadow-md hover:border-[#25d366]/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-[#25d366] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#202124]">WhatsApp Support</h3>
              <p className="mt-1 text-xs text-[#5f6368] leading-relaxed">
                Direct instant messaging desk for priority customer support.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/917872490719"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-[#202124] hover:text-[#25d366] transition-colors font-mono tracking-tight"
              >
                +91 7872490719
              </a>
              <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <span>No phone calls — WhatsApp messages only</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f3f4] flex items-center space-x-2">
            <button
              onClick={handleCopyPhone}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#3c4043] bg-[#f8f9fa] hover:bg-[#f1f3f4] border border-[#dadce0] transition-colors"
            >
              {copiedPhone ? <Check className="w-3.5 h-3.5 text-[#1e8e3e]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleWhatsAppDirect}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#25d366] hover:bg-[#20ba5a] transition-colors shadow-2xs"
            >
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 3. Working Hours */}
        <div className="bg-white rounded-2xl border border-[#dadce0] p-6 hover:shadow-md hover:border-[#1a73e8]/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#202124]">Working Hours</h3>
              <p className="mt-1 text-xs text-[#5f6368] leading-relaxed">
                Standard operational schedule for customer engineering & strategy desk.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <div>
                <p className="text-xs font-semibold text-[#202124]">Monday to Saturday</p>
                <p className="text-sm font-bold text-[#1a73e8]">9:00 AM – 7:00 PM IST</p>
              </div>

              <div className="pt-1 border-t border-[#f1f3f4]">
                <p className="text-xs font-semibold text-[#202124]">Sunday</p>
                <p className="text-xs text-[#5f6368]">Emergency WhatsApp Support Only</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f3f4]">
            <span
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${istStatus.badgeColor}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              <span>{istStatus.statusText}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive "Send an Official Inquiry" Form */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="space-y-1 mb-6">
            <span className="text-xs font-bold text-[#1a73e8] uppercase tracking-wider">
              Priority Support Desk
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202124]">
              Send an Official Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-[#5f6368]">
              Leave us a note and our technical strategy team at Arventa Ventures will respond directly.
            </p>
          </div>

          {submittedTicket && (
            <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm space-y-2.5 animate-fadeIn">
              <div className="flex items-center space-x-2 font-bold text-emerald-950 text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Inquiry Dispatched Successfully! Reference Ticket: #{submittedTicket}</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                Your message has been sent to <strong className="text-emerald-950 underline font-semibold">info@arventaventures.online</strong> via our admin-configured verified mail engine (OTP sender). Our team at Arventa Ventures will review your request and respond shortly.
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#25d366] hover:bg-[#20ba5a] text-white transition-colors shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Also Ping on WhatsApp</span>
                </button>
                <span className="text-[11px] text-emerald-700">
                  (Priority response within 2 hours during IST working hours)
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                  Your Full Name <span className="text-[#d93025]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Jaydeb Jana"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#dadce0] rounded-xl text-sm text-[#202124] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all placeholder:text-[#9aa0a6]"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                  Your Email Address <span className="text-[#d93025]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., you@company.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#dadce0] rounded-xl text-sm text-[#202124] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all placeholder:text-[#9aa0a6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* WhatsApp / Phone */}
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                  Mobile / WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 7872490719"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#dadce0] rounded-xl text-sm text-[#202124] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all placeholder:text-[#9aa0a6]"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#dadce0] rounded-xl text-sm text-[#202124] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all"
                >
                  <option value="Google Business Profile Review Automation">
                    Google Business Profile Review Automation
                  </option>
                  <option value="Pro / Ultra Plan Upgrade Inquiry">
                    Pro / Ultra Plan Upgrade Inquiry
                  </option>
                  <option value="Multi-Location & Franchise Setup">
                    Multi-Location & Franchise Setup
                  </option>
                  <option value="Custom API & Webhook Integration">
                    Custom API & Webhook Integration
                  </option>
                  <option value="Data Security & Privacy Inquiry">
                    Data Security & Privacy Inquiry
                  </option>
                  <option value="Technical Support & Troubleshooting">
                    Technical Support & Troubleshooting
                  </option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                Message / Inquiries <span className="text-[#d93025]">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your business, multi-location requirements, custom integrations, or any support questions..."
                className="w-full px-3.5 py-2.5 bg-white border border-[#dadce0] rounded-xl text-sm text-[#202124] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all placeholder:text-[#9aa0a6] leading-relaxed resize-y"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-sm font-semibold shadow-xs transition-colors disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="inline-flex items-center space-x-2 px-5 py-3 bg-[#f8f9fa] hover:bg-[#e8f0fe] text-[#1a73e8] border border-[#dadce0] rounded-xl text-sm font-semibold transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#25d366]" />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Brand Footer Governance Note */}
      <div className="py-4 text-center border-t border-[#e8eaed]">
        <p className="text-xs text-[#70757a] flex items-center justify-center space-x-2">
          <span className="font-bold tracking-wider text-[#202124]">RANKORA</span>
          <span>•</span>
          <span>A Product by Arventa Ventures</span>
          <span>•</span>
          <span className="text-[#1a73e8]">Enterprise Digital Scaling</span>
        </p>
      </div>
    </div>
  );
}
