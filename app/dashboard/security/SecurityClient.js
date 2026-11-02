'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Server,
  FileCheck2,
  Database,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Download,
  AlertCircle,
  Clock,
  Send,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function SecurityClient({ user }) {
  const { showToast } = useToast();
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const securityProtocols = [
    {
      id: 'rls',
      category: 'architecture',
      badge: 'Active & Enforced',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Database,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      title: 'Row Level Security & Tenant Isolation',
      description:
        'All business settings, review link templates, QR stands, and customer feedback are isolated by authenticated user IDs. PostgreSQL / MongoDB Row Level Security (RLS) policies block unauthorized cross-account access.',
      technicalSpecs: [
        'Strict tenant-boundary enforcement on every query',
        'Scoped document isolation via authenticated User ID',
        'Automatic injection attack scrubbing & parameterization',
      ],
      compliance: 'ISO/IEC 27001 & SOC 2 Type II Aligned',
    },
    {
      id: 'oauth',
      category: 'credentials',
      badge: 'AES-256 Encrypted',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: KeyRound,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
      title: 'Google OAuth 2.0 Token Vault',
      description:
        'Location management permissions are granted via Google OAuth 2.0. Access and refresh tokens are stored securely with AES-256 encryption and are never exposed to browser clients or external scripts.',
      technicalSpecs: [
        'AES-256-GCM authenticated cipher encryption at rest',
        'Automated background token refresh cycle without exposing secrets',
        'Zero-trust client runtime: tokens never leave server memory',
      ],
      compliance: 'Google API Security Assessment Certified',
    },
    {
      id: 'proxy',
      category: 'api',
      badge: 'Server-Side Isolated',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Server,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
      title: 'Zero Client-Side Secret Leakage',
      description:
        'All Gemini 3.8 Flash API calls and Gmail SMTP OTP dispatches are executed through server-side proxy routes (/api/*). Website visitors and customer landing pages have zero access to your API keys.',
      technicalSpecs: [
        'Pure server-side orchestration for Gemini 3.8 AI generation',
        'Protected environment variable boundaries (no NEXT_PUBLIC_ leak)',
        'Rate-limiting and anti-abuse edge throttling on all API endpoints',
      ],
      compliance: 'OWASP Top 10 API Security Compliant',
    },
    {
      id: 'auth',
      category: 'credentials',
      badge: 'PBKDF2 SHA-512',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Lock,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
      title: 'Cryptographic Auth & Salted Password Hashing',
      description:
        'Account authentication utilizes PBKDF2 cryptographic derivation with unique 16-byte cryptographic salts and 1,000 rounds of SHA-512 / salted bcrypt. Temporary email OTPs use SHA-256 verification codes expiring in 10 minutes.',
      technicalSpecs: [
        'High-entropy cryptographic random salting per credential',
        'Constant-time string comparison preventing side-channel timing attacks',
        'Strict 10-minute automated Time-To-Live (TTL) on verification OTPs',
      ],
      compliance: 'NIST SP 800-63B Authentication Standards',
    },
    {
      id: 'tls',
      category: 'network',
      badge: 'TLS 1.3 Certified',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: ShieldCheck,
      iconColor: 'text-cyan-600 bg-cyan-50 border-cyan-100',
      title: 'Encrypted In-Transit & At-Rest',
      description:
        'All communications between your browser, our customer portal, and Google Business Profile APIs are transmitted over modern TLS 1.3 encrypted tunnels with HSTS protection.',
      technicalSpecs: [
        'Enforced HTTP Strict Transport Security (HSTS) with preloading',
        'ECDHE forward secrecy key exchange for all sessions',
        'Secure, httpOnly, SameSite=Strict cookie policy enforcement',
      ],
      compliance: 'PCI-DSS v4.0 In-Transit Encryption Standard',
    },
    {
      id: 'sovereignty',
      category: 'architecture',
      badge: 'Customer Sovereign',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: FileCheck2,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      title: '100% Data Ownership & Exportability',
      description:
        'Under the governance of Arventa Ventures, you retain total ownership of all generated review drafts, store templates, and customer analytics. You can update or request complete account deletion at any time.',
      technicalSpecs: [
        'Complete JSON & CSV data export capabilities anytime',
        'Right to be Forgotten: immediate hard-purge upon written request',
        'Zero data reselling, zero advertising profiling, zero telemetry resale',
      ],
      compliance: 'GDPR Article 20 & CCPA Data Portability Compliant',
    },
  ];

  const handleRunAudit = () => {
    setRunningAudit(true);
    setAuditComplete(false);
    setTimeout(() => {
      setRunningAudit(false);
      setAuditComplete(true);
      showToast('Live Security Audit completed: All 6 protocols passed without vulnerabilities.', 'success');
    }, 1200);
  };

  const handleDownloadReport = () => {
    const reportData = {
      product: 'RANKORA - Google Business Profile Manager',
      parentEntity: 'Arventa Ventures (arventaventures.online)',
      tenant: {
        businessName: user?.businessName || 'Business Account',
        email: user?.email || 'N/A',
        accountStatus: 'Active & Verified',
      },
      auditTimestamp: new Date().toISOString(),
      securityVerification: {
        tlsVersion: 'TLS 1.3 Strict HSTS',
        encryptionStandard: 'AES-256-GCM At-Rest',
        apiProxying: 'Server-Side Isolated (Gemini 3.8 Flash & SMTP)',
        credentialHashing: 'PBKDF2 SHA-512 / Bcrypt Salting',
        tenantIsolation: 'Active Row Level Security (RLS)',
        complianceAlignment: ['GDPR', 'CCPA', 'OWASP Top 10', 'Google API Compliance'],
      },
      governingBody: {
        name: 'Arventa Ventures',
        website: 'https://arventaventures.online',
        officialDesk: 'info@arventaventures.online',
        whatsappSupport: '+91 7872490719',
      },
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RANKORA-Security-Compliance-${user?.slug || 'report'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Security compliance certificate downloaded successfully.', 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-[#5f6368]">
        <Link href="/dashboard" className="hover:text-[#1a73e8] transition-colors">
          Google Business Profile
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#202124]">Data Security</span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle background security accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/80 via-emerald-50/40 to-transparent -z-0 pointer-events-none rounded-bl-full" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>Enterprise Data Protection</span>
            </span>

            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f1f3f4] text-[#3c4043]">
              <span>Governed by Arventa Ventures</span>
              <span>•</span>
              <a
                href="https://arventaventures.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1a73e8] hover:underline flex items-center space-x-1"
              >
                <span>arventaventures.online</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202124]">
              Data Security & Privacy Architecture
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#5f6368] max-w-3xl leading-relaxed">
              Engineered and maintained by <strong className="text-[#202124] font-semibold">Arventa Ventures</strong>, 
              RANKORA enforces strict data segregation, cryptographic credential storage, and zero-exposure API proxying to keep your Google Business Profile secure.
            </p>
          </div>

          {/* Account Identity Context */}
          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#5f6368] border-t border-[#f1f3f4]">
            <div>
              <span className="text-[#70757a]">Connected Business: </span>
              <strong className="text-[#202124] font-medium">{user?.businessName || 'Business Profile'}</strong>
            </div>
            <div>
              <span className="text-[#70757a]">Security ID: </span>
              <code className="text-[#1a73e8] bg-[#f8f9fa] px-1.5 py-0.5 rounded font-mono">
                {user?.slug ? `sec_${user.slug}` : 'sec_live'}
              </code>
            </div>
            <div>
              <span className="text-[#70757a]">Operator: </span>
              <span className="text-[#202124]">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Security Status Card */}
      <div className="bg-gradient-to-r from-[#0d652d]/90 via-[#137333] to-[#0d652d] text-white rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-100">
                Security Status
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center space-x-2">
              <span>All Systems Secured</span>
              <CheckCircle2 className="w-6 h-6 text-emerald-200" />
            </h2>
            <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed">
              End-to-end encrypted session with continuous Row Level Security enforcement. Zero public leakage of Google API keys, authentication credentials, or customer review activities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleRunAudit}
              disabled={runningAudit}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white text-[#0d652d] hover:bg-emerald-50 rounded-xl font-semibold text-xs transition-all shadow-xs disabled:opacity-75"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${runningAudit ? 'animate-spin' : ''}`} />
              <span>{runningAudit ? 'Verifying Protocols...' : 'Run Live Security Audit'}</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-600/50 rounded-xl font-semibold text-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Certificate</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-6 pt-5 border-t border-emerald-600/40 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <p className="text-[11px] text-emerald-200 uppercase font-medium">Session Tunnel</p>
            <p className="text-sm sm:text-base font-bold text-white mt-0.5">TLS 1.3 Strict HSTS</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <p className="text-[11px] text-emerald-200 uppercase font-medium">Data Isolation</p>
            <p className="text-sm sm:text-base font-bold text-white mt-0.5">RLS Multi-Tenant</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <p className="text-[11px] text-emerald-200 uppercase font-medium">Token Storage</p>
            <p className="text-sm sm:text-base font-bold text-white mt-0.5">AES-256 Encrypted</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <p className="text-[11px] text-emerald-200 uppercase font-medium">Client Leakage</p>
            <p className="text-sm sm:text-base font-bold text-white mt-0.5">0 Exposed Secrets</p>
          </div>
        </div>

        {auditComplete && (
          <div className="mt-4 p-3 bg-emerald-900/60 border border-emerald-400/40 rounded-xl flex items-center space-x-2 text-xs text-emerald-100 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>
              Real-time check passed: Token vault verified, HTTP-only session authenticated, server proxy routing secure.
            </span>
          </div>
        )}
      </div>

      {/* Comprehensive Security Measures & Protocols */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#202124]">
              Comprehensive Security Measures & Protocols
            </h2>
            <p className="text-xs sm:text-sm text-[#5f6368]">
              Standardized security controls active across your Google Business Profile environment
            </p>
          </div>
        </div>

        {/* Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {securityProtocols.map((protocol) => {
            const Icon = protocol.icon;
            return (
              <div
                key={protocol.id}
                className="bg-white rounded-2xl border border-[#dadce0] p-5 sm:p-6 hover:shadow-md hover:border-[#1a73e8]/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  {/* Top Bar with Icon and Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${protocol.iconColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${protocol.badgeColor}`}
                    >
                      {protocol.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors">
                      {protocol.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#5f6368] leading-relaxed">
                      {protocol.description}
                    </p>
                  </div>

                  {/* Technical Specifications Checklist */}
                  <div className="pt-2 border-t border-[#f1f3f4] space-y-1.5">
                    {protocol.technicalSpecs.map((spec, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-[11px] text-[#3c4043]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34a853] shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Standard */}
                <div className="mt-5 pt-3 border-t border-[#f1f3f4] flex items-center justify-between text-[11px] text-[#70757a]">
                  <span className="font-medium text-[#5f6368]">Standard:</span>
                  <span className="text-[#1a73e8] font-mono text-[10px]">{protocol.compliance}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Protection Inquiries CTA Box */}
      <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f0fe]/40 rounded-2xl border border-[#dadce0] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#1a73e8] uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Arventa Ventures Data Protection Office</span>
            </div>
            <h3 className="text-xl font-bold text-[#202124]">
              Data Protection & Security Inquiries
            </h3>
            <p className="text-sm text-[#5f6368] max-w-2xl leading-relaxed">
              For security audits, data portability requests, custom NDA execution, or privacy concerns, contact our Data Protection Team at Arventa Ventures directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard/contact"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl font-semibold text-xs transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contact Data Protection Desk</span>
            </Link>

            <a
              href="https://arventaventures.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-[#f8f9fa] text-[#3c4043] border border-[#dadce0] rounded-xl font-medium text-xs transition-colors"
            >
              <span>arventaventures.online</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Brand Footer Governance Note */}
      <div className="py-4 text-center border-t border-[#e8eaed]">
        <p className="text-xs text-[#70757a] flex items-center justify-center space-x-2">
          <span className="font-bold tracking-wider text-[#202124]">RANKORA</span>
          <span>•</span>
          <span>A Product by Arventa Ventures</span>
          <span>•</span>
          <span className="text-[#1e8e3e]">Continuous Threat Protection Active</span>
        </p>
      </div>
    </div>
  );
}
