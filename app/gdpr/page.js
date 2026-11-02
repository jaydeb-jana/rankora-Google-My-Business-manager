import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  CheckCircle2,
  Globe,
  FileCheck,
  Lock,
  Mail,
  UserX,
  Database,
  ArrowRight
} from 'lucide-react';

export const metadata = {
  title: 'GDPR & International Data Compliance Hub | Rankaro',
  description:
    'Information regarding Rankaro’s compliance with the EU General Data Protection Regulation (GDPR), Data Processing Addendum (DPA), sub-processor directory, and Data Subject Rights.',
};

export default function GDPRPage() {
  const subProcessors = [
    { name: 'Cloudflare, Inc.', location: 'USA / Global Edge', purpose: 'Edge CDN, DDoS Shield, DNS resolution, TLS termination' },
    { name: 'Amazon Web Services (AWS)', location: 'USA / Frankfurt (EU)', purpose: 'Encrypted cloud application hosting, compute, and automated backup storage' },
    { name: 'MongoDB Atlas', location: 'Frankfurt / Ireland (EU)', purpose: 'Encrypted multi-tenant database clusters with customer profile records' },
    { name: 'Resend / Nodemailer SMTP', location: 'USA', purpose: 'Transactional security notifications, merchant verification codes, and alerts' },
  ];

  const rights = [
    {
      title: 'Right to Access (Article 15)',
      desc: 'You have the right to request confirmation of whether your data is being processed, along with a copy of all personal records we hold.',
    },
    {
      title: 'Right to Rectification (Article 16)',
      desc: 'You may correct inaccurate or incomplete merchant account details directly within your settings or by contacting our desk.',
    },
    {
      title: 'Right to Erasure / "To Be Forgotten" (Article 17)',
      desc: 'You can request complete deletion of your merchant account, scan history, and custom presets with permanent database shredding.',
    },
    {
      title: 'Right to Restrict Processing (Article 18)',
      desc: 'You may request that we limit the processing of your personal information in specific contested scenarios.',
    },
    {
      title: 'Right to Data Portability (Article 20)',
      desc: 'Receive your data in a structured, commonly used, machine-readable JSON or CSV format to transfer to another service provider.',
    },
    {
      title: 'Right to Object (Article 21)',
      desc: 'You have the right to object at any time to the processing of your personal data based on legitimate interests.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 space-y-20 pb-24">
        {/* HERO */}
        <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Globe className="w-4 h-4" />
            <span>European & Global Data Protection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            GDPR Compliance & Trust Portal
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Arventa Ventures is fully committed to upholding the rigorous standards of the EU General Data Protection Regulation (Regulation (EU) 2016/679) and UK GDPR across all Rankaro services.
          </p>
        </section>

        {/* DATA PROCESSING ADDENDUM (DPA) */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Contractual Framework
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Data Processing Addendum (DPA) for Merchants
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              If your business operates within the European Economic Area (EEA), the United Kingdom, or processes data of EU citizens, you may execute our standard Data Processing Addendum (DPA). Our DPA incorporates the European Commission&apos;s Standard Contractual Clauses (SCCs) to guarantee legally compliant international data transfers.
            </p>
            <div className="pt-2">
              <a
                href="mailto:dpo@arventaventures.online?subject=Request%20Signed%20DPA"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                <span>Request Counter-Signed DPA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* 6 GDPR DATA SUBJECT RIGHTS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Statutory Protections
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Your Rights Under GDPR
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rights.map((r) => (
              <div key={r.title} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base mb-2">{r.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AUTHORIZED SUB-PROCESSORS DIRECTORY */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 border border-slate-800">
            <div className="mb-6">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Vendor Transparency
              </span>
              <h2 className="text-2xl font-black mt-1">
                Authorized Cloud Infrastructure Sub-Processors
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                We maintain executed DPAs with every infrastructure vendor we utilize.
              </p>
            </div>

            <div className="space-y-4">
              {subProcessors.map((sp) => (
                <div key={sp.name} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-white text-sm">{sp.name}</span>
                    <span className="text-slate-400 ml-2">({sp.location})</span>
                    <div className="text-slate-300 text-[11px] mt-0.5">{sp.purpose}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] w-fit">
                    DPA Executed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DSAR SUBMISSION FORM / EMAIL */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-lg font-bold text-slate-900">
              Submit a Data Subject Access Request (DSAR)
            </h3>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              To request an export or permanent erasure of your data, send an email from your registered account address directly to our Data Protection Officer. We acknowledge all requests within 48 hours and complete fulfillment within 30 statutory days.
            </p>
            <div className="text-xs font-bold text-blue-600 pt-2">
              dpo@arventaventures.online • Subject: &ldquo;GDPR Data Subject Request&rdquo;
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
