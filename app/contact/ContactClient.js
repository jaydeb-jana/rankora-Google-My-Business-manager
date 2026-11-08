'use client';
import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Building,
  HelpCircle,
  Calendar,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Copy,
  Check,
  Globe2,
  UserCheck
} from 'lucide-react';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'sales',
    businessName: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+91 7872490719');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('info@arventaventures.online');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: 'sales',
          businessName: '',
          message: '',
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to dispatch your inquiry. Please try again.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactChannels = [
    {
      title: 'WhatsApp Instant Chat',
      badge: 'Fastest Response (< 5 min)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: MessageCircle,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      primaryText: '+91 7872490719',
      subText: 'Live chat support available Monday – Saturday (9:00 AM – 9:00 PM IST).',
      actionLabel: 'Chat on WhatsApp',
      actionHref: 'https://wa.me/917872490719?text=Hello%20Arventa%20Ventures!%20I%20would%20like%20to%20inquire%20about%20Rankaro.',
      isExternal: true,
      highlight: true,
    },
    {
      title: 'General & Support Email',
      badge: '< 18 min SLA',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Mail,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      primaryText: 'info@arventaventures.online',
      subText: 'For customer onboarding, technical assistance, and invoice questions.',
      actionLabel: 'Email Support Desk',
      actionHref: 'mailto:info@arventaventures.online?subject=Rankaro%20Support%20Inquiry',
      isExternal: false,
    },
    {
      title: 'Founder & CEO Direct Desk',
      badge: 'Executive Office',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: UserCheck,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      primaryText: 'ceo@arventaventures.online',
      subText: 'Direct line to Jaydeb Jana, Founder & CEO of Arventa Ventures & Rankaro.',
      actionLabel: 'Email CEO Directly',
      actionHref: 'mailto:ceo@arventaventures.online?subject=Direct%20Inquiry%20to%20CEO%20Jaydeb%20Jana',
      isExternal: false,
    },
    {
      title: 'Global Headquarters',
      badge: 'West Bengal, India',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: MapPin,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      primaryText: 'Contai, West Bengal 721442',
      subText: 'Purba Gopinathpur, Chapatala, More, Contai, West Bengal, India.',
      actionLabel: 'Open in Google Maps',
      actionHref: 'https://maps.app.goo.gl/Uz4GYtFuQ692XVQG8',
      isExternal: true,
    },
  ];

  const offices = [
    {
      city: 'West Bengal (Global HQ)',
      country: 'India',
      badge: 'Corporate Headquarters',
      address: 'Purba Gopinathpur, Chapatala, More, Contai, West Bengal 721442',
      email: 'ceo@arventaventures.online',
      phone: '+91 7872490719',
      mapUrl: 'https://maps.app.goo.gl/Uz4GYtFuQ692XVQG8',
    },
    {
      city: 'London',
      country: 'United Kingdom',
      badge: 'European Operations',
      address: 'One Canada Square, Canary Wharf, E14 5AB',
      email: 'uk@arventaventures.online',
      phone: '+44 20 7946 0912',
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      badge: 'Asia-Pacific Hub',
      address: 'Marina Bay Financial Centre, Tower 1',
      email: 'sg@arventaventures.online',
      phone: '+65 6789 0123',
    },
    {
      city: 'New York',
      country: 'United States',
      badge: 'Americas Enterprise Desk',
      address: '100 Wall Street, Suite 500, NY 10005',
      email: 'us@arventaventures.online',
      phone: '+1 (212) 555-0199',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* 1. HERO HEADER */}
        <section className="relative pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Arventa Ventures Contact & Support Center</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            We&apos;re Here to Help Your Business{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Dominate Local Search
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about countertop hardware, multi-location rollouts, or custom integrations? Connect with our dedicated team in West Bengal, London, Singapore, or New York.
          </p>
        </section>

        {/* 2. PROMINENT TOP CONTACT CHANNELS (IMMEDIATE VISIBILITY) */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div
                  key={channel.title}
                  className={`rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                    channel.highlight
                      ? 'bg-gradient-to-b from-emerald-50/50 to-white border-emerald-200/90 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-400/20'
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl border ${channel.iconBg}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${channel.badgeColor}`}>
                        {channel.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        {channel.title}
                      </h3>
                      <p className="text-lg font-black text-slate-900 mt-1 break-all tracking-tight">
                        {channel.primaryText}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {channel.subText}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100">
                    <a
                      href={channel.actionHref}
                      target={channel.isExternal ? '_blank' : undefined}
                      rel={channel.isExternal ? 'noopener noreferrer' : undefined}
                      className={`inline-flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                        channel.highlight
                          ? 'bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>{channel.actionLabel}</span>
                      {channel.isExternal ? (
                        <ExternalLink className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. INTERACTIVE INQUIRY FORM + DIRECT CONTACT DESK SIDEBAR */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
              <div className="border-b border-slate-100 pb-5 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Priority Dispatch Form
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Send Us a Direct Message
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Fill in your details below and our team will get in touch within 18 minutes during business hours.
                </p>
              </div>

              {success ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                  <h3 className="text-2xl font-bold text-emerald-950">Inquiry Dispatched Successfully!</h3>
                  <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you! Your message has been routed to our technical desk at <strong className="font-bold">info@arventaventures.online</strong>. An architect will respond directly to your email shortly.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://wa.me/917872490719"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Also Ping on WhatsApp (+91 7872490719)</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Dr. Elena Ramos"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="elena@horizondental.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Business / Practice Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Horizon Dental Studio"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 7872490719"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Department / Inquiry Type
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white text-slate-800"
                    >
                      <option value="sales">Sales & Multi-Location Enterprise Rollouts</option>
                      <option value="support">Technical Support & Countertop QR Setup</option>
                      <option value="billing">Billing & Subscription Questions</option>
                      <option value="ceo">Direct Inquiries to Founder & CEO Desk</option>
                      <option value="agency">Agency & Reseller Partnerships</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      How Can We Help Your Business? *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your business, your locations, or specific questions about Google Review automation..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all rk-btn-shine disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Dispatching Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message to Team</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Direct Help & Contact Details Hub */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 1: Official Corporate Contacts */}
              <div className="p-7 rounded-3xl bg-slate-900 text-white space-y-6 shadow-xl border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                      Direct Communication Hub
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-0.5">
                      Arventa Ventures Helpdesk
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                </div>

                {/* WhatsApp Direct Line */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 font-bold">WhatsApp Direct Desk</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="text-slate-400 hover:text-white inline-flex items-center space-x-1 text-[11px]"
                    >
                      {copiedPhone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="text-xl font-black text-white font-mono tracking-tight">
                    +91 7872490719
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Instant chat assistance everyday (9:00 AM – 9:00 PM IST).
                  </p>
                  <a
                    href="https://wa.me/917872490719?text=Hello%20Arventa%20Ventures!%20I'd%20like%20to%20discuss%20Rankaro."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-1.5 w-full py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-sm mt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>

                {/* Email Desks */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                    <Mail className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-slate-400 text-[11px] font-semibold">General & Support Inquiries</div>
                      <a href="mailto:info@arventaventures.online" className="text-white hover:text-blue-300 font-bold text-sm">
                        info@arventaventures.online
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                    <UserCheck className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-slate-400 text-[11px] font-semibold">Founder & CEO Direct Desk</div>
                      <a href="mailto:ceo@arventaventures.online" className="text-white hover:text-purple-300 font-bold text-sm">
                        ceo@arventaventures.online
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                    <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-slate-400 text-[11px] font-semibold">Global Corporate Headquarters</div>
                      <p className="text-slate-300 font-medium text-xs leading-relaxed">
                        Purba Gopinathpur, Chapatala, More, Contai, West Bengal 721442, India
                      </p>
                      <a
                        href="https://maps.app.goo.gl/Uz4GYtFuQ692XVQG8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 text-[11px] font-bold inline-flex items-center space-x-1 mt-1"
                      >
                        <span>View on Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Operational Hours */}
                <div className="pt-4 border-t border-slate-800 flex items-start space-x-3 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">Operating Schedule</div>
                    <div className="text-slate-400 text-[11px]">
                      Monday – Saturday: <span className="text-emerald-400 font-semibold">9:00 AM – 7:00 PM IST</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Sunday: <span className="text-amber-400 font-semibold">Emergency WhatsApp Support Only</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Enterprise Strategy Consultation */}
              <div className="p-7 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Enterprise & Franchise Rollout</span>
                </div>
                <h3 className="font-black text-slate-900 text-lg sm:text-xl">
                  Book a 1-on-1 Architecture Walkthrough
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Managing 5 or more locations? Consult with Jaydeb Jana and our lead engineers to map your custom countertop stands, multi-unit franchise reporting, and POS workflows.
                </p>
                <div className="pt-1">
                  <a
                    href="mailto:ceo@arventaventures.online?subject=Schedule%20Enterprise%20Strategy%20Walkthrough"
                    className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    <span>Request Strategy Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. WORLDWIDE CORPORATE HUBS (4 ARVENTA LOCATIONS) */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              International Footprint
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1 tracking-tight">
              Our Regional Corporate Hubs
            </h2>
            <p className="mt-3 text-slate-600 text-sm max-w-xl mx-auto">
              Governed by Arventa Ventures with active operations serving merchants across India, Europe, Asia-Pacific, and the United States.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((off) => (
              <div
                key={off.city}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                    {off.badge}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{off.city}</h3>
                  <div className="text-xs text-slate-600 pt-1 flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{off.address}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/80 space-y-2 text-xs">
                  <div className="text-slate-600 flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-mono">{off.phone}</span>
                  </div>
                  <div className="text-blue-600 font-semibold flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <a href={`mailto:${off.email}`} className="hover:underline truncate">
                      {off.email}
                    </a>
                  </div>
                  {off.mapUrl && (
                    <div className="pt-1">
                      <a
                        href={off.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center space-x-1"
                      >
                        <span>Open Verified Google Pin</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. INTERACTIVE MAP & VISIT HEADQUARTERS BANNER */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Visit Global Corporate HQ</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Purba Gopinathpur, Contai, West Bengal
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                Our main engineering laboratory and client strategy nerve center is situated in Contai, West Bengal. Planning an in-person business visit or executive partnership session? Reach out to our CEO desk in advance to reserve conference slots.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="https://maps.app.goo.gl/Uz4GYtFuQ692XVQG8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-md"
              >
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Get Directions on Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <a
                href="https://wa.me/917872490719?text=Hello%20Jaydeb!%20I'd%20like%20to%20plan%20a%20visit%20to%20Arventa%20Ventures%20HQ."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Schedule Visit via WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
    </div>
  );
}
