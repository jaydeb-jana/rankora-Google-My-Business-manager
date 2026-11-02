import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Lock,
  ShieldCheck,
  Server,
  Key,
  FileCheck,
  Activity,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Globe2,
  HardDrive,
  EyeOff,
  Terminal,
  ArrowRight
} from 'lucide-react';

export const metadata = {
  title: 'Data Security, Encryption & Trust Center | Rankaro',
  description:
    'Detailed overview of Rankaro’s enterprise security architecture, AES-256 encryption, SOC 2 compliance posture, multi-tenant database isolation, and disaster recovery.',
};

export default function SecurityPage() {
  const securityPillars = [
    {
      title: 'Cryptographic Standards',
      desc: 'All sensitive merchant data is encrypted at rest using industry-standard AES-256 GCM. All data in transit across public and internal networks enforces TLS 1.3 with strict HSTS preloading.',
      icon: Key,
      badge: 'AES-256 / TLS 1.3',
    },
    {
      title: 'Database & Tenant Isolation',
      desc: 'Multi-tenant database records are enforced with application-level tenant context isolation, preventing cross-tenant data leakage. Automated queries enforce tenant scoping at the ORM layer.',
      icon: HardDrive,
      badge: 'Logical Tenant Isolation',
    },
    {
      title: 'Zero-Trust Edge Perimeter',
      desc: 'Fronted by Cloudflare enterprise network proxies offering automated Layer 3/4 and Layer 7 DDoS mitigation, Web Application Firewall (WAF) rule sets, and bot detection.',
      icon: Globe2,
      badge: 'Cloudflare WAF / DDoS Shield',
    },
    {
      title: 'Role-Based Access Control (RBAC)',
      desc: 'Production cloud infrastructure requires hardware-backed multi-factor authentication (FIDO2 WebAuthn / YubiKey), short-lived SSH session certificates, and least-privilege scoping.',
      icon: Lock,
      badge: 'Hardware MFA Enforced',
    },
    {
      title: 'Continuous Vulnerability Scanning',
      desc: 'Codebases undergo continuous static code analysis (SAST) and software composition analysis (SCA) for third-party vulnerabilities on every Git commit before staging or production rollout.',
      icon: Terminal,
      badge: 'Automated CI/CD Scanning',
    },
    {
      title: 'Disaster Recovery & Redundancy',
      desc: 'Point-in-time automated database snapshots replicated across geographically dispersed availability zones, providing a Recovery Point Objective (RPO) < 15 mins and RTO < 1 hour.',
      icon: Server,
      badge: 'Multi-AZ Active Failover',
    },
  ];

  const complianceStandards = [
    { name: 'SOC 2 Type II Alignment', status: 'Continuous Controls Monitoring', desc: 'Evaluated against Security, Availability, and Confidentiality Trust Services Criteria.' },
    { name: 'EU & UK GDPR Adherence', status: 'Fully Compliant', desc: 'Standard Contractual Clauses (SCCs) executed with all underlying infrastructure sub-processors.' },
    { name: 'California CCPA / CPRA', status: 'Fully Compliant', desc: 'Zero sale of personal data; automated self-serve data portability and erasure mechanisms.' },
    { name: 'Google API & Maps Compliance', status: 'Policy Certified', desc: 'Direct, unhindered deep-linking without review gating or algorithmic interference.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 space-y-24 pb-24">
        {/* HERO */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
            <Lock className="w-3.5 h-3.5" />
            <span>Enterprise Trust & Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Security That Protects Your Reputation and{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Customer Trust
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            At Rankaro and Arventa Ventures, security is not an afterthought or an add-on. We build bank-grade cryptographic protections into every line of code, cloud endpoint, and QR generation routine.
          </p>
        </section>

        {/* 6 SECURITY PILLARS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Technical Defense in Depth
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              Our Multi-Layer Security Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityPillars.map((pil) => {
              const Icon = pil.icon;
              return (
                <div
                  key={pil.title}
                  className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                        {pil.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {pil.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pil.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMPLIANCE STANDARDS LIST */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Certifications & Alignment
              </span>
              <h2 className="text-3xl font-black mt-2">
                Regulatory Standards & Audits
              </h2>
            </div>

            <div className="space-y-4">
              {complianceStandards.map((std) => (
                <div
                  key={std.name}
                  className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-bold text-white text-base">{std.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{std.desc}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex-shrink-0">
                    {std.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BUG BOUNTY & INCIDENT SLA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Coordinated Disclosure
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Bug Bounty & Security Researchers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We welcome responsible security disclosures from independent researchers. If you discover a potential vulnerability in our APIs, web app, or infrastructure, please submit details to our engineering team.
              </p>
              <div className="text-xs font-semibold text-blue-600">
                Email: security@arventaventures.online
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Rapid SLA
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Incident Response & Notification
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our Security Operations Center (SOC) operates 24/7/365 telemetry monitoring. In the improbable event of a data incident affecting customer records, we commit to notifying affected merchants within 72 hours in full alignment with GDPR Article 33.
              </p>
              <div className="text-xs font-semibold text-emerald-600">
                Targeted Triage Response Time: &lt; 20 minutes
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-3xl bg-blue-50/60 border border-blue-200 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              Need a Custom Security Review or Enterprise DPA?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Our compliance architecture team regularly assists healthcare, legal, and financial enterprise clients with third-party vendor risk assessments.
            </p>
            <a
              href="/contact?dept=security"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              <span>Contact Security Desk</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
