'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  ArrowRight
} from 'lucide-react';

export default function ContactPage() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const offices = [
    {
      city: 'West Bengal (Global HQ)',
      country: 'India',
      address: 'Purba Gopinathpur, Chapatala, More, Contai, West Bengal 721442',
      email: 'ceo@arventaventures.online',
      phone: '+91 7872490719',
    },
    {
      city: 'London',
      country: 'United Kingdom',
      address: 'One Canada Square, Canary Wharf, E14 5AB',
      email: 'uk@arventaventures.online',
      phone: '+44 20 7946 0912',
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      address: 'Marina Bay Financial Centre, Tower 1',
      email: 'sg@arventaventures.online',
      phone: '+65 6789 0123',
    },
    {
      city: 'New York',
      country: 'United States',
      address: '100 Wall Street, Suite 500, NY 10005',
      email: 'us@arventaventures.online',
      phone: '+1 (212) 555-0199',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 space-y-20 pb-24">
        {/* HERO */}
        <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Enterprise Support & Sales</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            We&apos;re Here to Help Your Business{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Dominate Local Search
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about custom countertop hardware, multi-location rollouts, or compliance? Our team responds within 18 minutes during business hours.
          </p>
        </section>

        {/* INTERACTIVE FORM + CONTACT SIDEBAR */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Interactive Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Direct Message</h2>
              <p className="text-slate-600 text-sm mb-6">
                Fill in your details below and our technical architects will get in touch immediately.
              </p>

              {success ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold text-emerald-950">Inquiry Dispatched!</h3>
                  <p className="text-sm text-emerald-800">
                    Thank you! Your message has been routed to our team. A dedicated representative will respond to your email shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        placeholder="Dr. Elena Ramos"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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
                        placeholder="+1 (555) 019-2834"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Routing Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                    >
                      <option value="sales">Sales & Enterprise Multi-Location Plans</option>
                      <option value="support">Technical Support & QR Configuration</option>
                      <option value="billing">Billing & Invoice Assistance</option>
                      <option value="security">Security, Compliance & DPA Execution</option>
                      <option value="partnership">Agency & Reseller Partnerships</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      How Can We Help You? *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your business, the number of locations, or your specific questions..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all rk-btn-shine disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Routing Your Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message Directly</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Response SLA & Details */}
            <div className="lg:col-span-5 space-y-6">
              {/* SLA Card */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-lg border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>Rapid Response Guarantee</span>
                </div>
                <div className="text-3xl font-black">18 Minutes</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Average first response time for sales and technical inquiries submitted during operational business hours (9am - 8pm EST).
                </p>
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>support@arventaventures.online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>ceo@arventaventures.online (Direct Desk)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <a href="https://wa.me/917872490719" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300">
                      WhatsApp: +91 7872490719
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-blue-400" />
                    <span>Governed by Arventa Ventures (CEO: Jaydeb Jana)</span>
                  </div>
                </div>
              </div>

              {/* Enterprise Schedule a Demo Card */}
              <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>Enterprise Multi-Location?</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Book a 15-Minute 1-on-1 Strategy Walkthrough
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Have 5 or more locations? Let our local SEO architects demo our franchise rollup, staff attribution, and POS receipt integrations.
                </p>
                <a
                  href="mailto:sales@arventaventures.online?subject=Schedule%20Enterprise%20Demo"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 pt-1"
                >
                  <span>Request Custom Demo Slot →</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* GLOBAL OFFICES DIRECTORY */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Worldwide Presence
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Our Regional Corporate Hubs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offices.map((off) => (
              <div
                key={off.city}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm space-y-2"
              >
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">{off.country}</div>
                <h3 className="text-xl font-bold text-slate-900">{off.city}</h3>
                <div className="text-xs text-slate-600 pt-1 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{off.address}</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{off.phone}</span>
                </div>
                <div className="text-xs text-blue-600 font-semibold flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>{off.email}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
