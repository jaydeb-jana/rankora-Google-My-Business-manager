'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Crown,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Building2,
  ChevronRight,
  Loader2,
  QrCode,
  Copy,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  X,
  Receipt,
  Smartphone,
  Lock,
  Shield,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function PlansClient({ user, pricingConfig }) {
  const { showToast } = useToast();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const userPlan = user?.plan || 'free';
  const [currentPlan, setCurrentPlan] = useState(userPlan);

  const now = new Date();
  const expiresAt = user?.planExpiresAt ? new Date(user.planExpiresAt) : null;
  const isExpired = userPlan !== 'free' && expiresAt && expiresAt.getTime() <= now.getTime();
  const diffMs = expiresAt ? expiresAt.getTime() - now.getTime() : 0;
  const daysLeft = isExpired || !expiresAt ? 0 : Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  // Checkout Modal & Polling State
  const [planToUpgrade, setPlanToUpgrade] = useState(null);
  const [simulatingTest, setSimulatingTest] = useState(false);
  const [initiatingPlanId, setInitiatingPlanId] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'pending' | 'success' | 'expired' | 'failed'
  const [successDetails, setSuccessDetails] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600s) generous window
  const [copiedField, setCopiedField] = useState(null);
  const [activePayTab, setActivePayTab] = useState('qr'); // 'qr' | 'intent' | 'vpa'
  const [checkingNow, setCheckingNow] = useState(false);

  // Manual UTR submission fallback
  const [showUtrInput, setShowUtrInput] = useState(false);
  const [manualUtr, setManualUtr] = useState('');
  const [submittingUtr, setSubmittingUtr] = useState(false);

  // Invoices & Payment History
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  const pollIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const currency = pricingConfig?.currency || '₹';
  const starterMonthly = Number(pricingConfig?.starter?.monthly) || 499;
  const starterYearly = Number(pricingConfig?.starter?.yearly) || 399;
  const proMonthly = Number(pricingConfig?.pro?.monthly) || 999;
  const proYearly = Number(pricingConfig?.pro?.yearly) || 849;
  const entMonthly = Number(pricingConfig?.enterprise?.monthly) || 2499;
  const entYearly = Number(pricingConfig?.enterprise?.yearly) || 1999;

  const starterFeatures =
    Array.isArray(pricingConfig?.starter?.features) && pricingConfig.starter.features.length > 0
      ? pricingConfig.starter.features
      : [
          'Single Business Profile connection',
          'Standard QR Code Stand generation',
          'AI Review Drafts (Powered by Gemini)',
          'Basic review analytics & activity log',
          'Direct link to Google review box',
        ];

  const proFeatures =
    Array.isArray(pricingConfig?.pro?.features) && pricingConfig.pro.features.length > 0
      ? pricingConfig.pro.features
      : [
          'Everything in Starter, plus:',
          'Custom Branded QR Stands (Print Ready PDF)',
          'Unlimited AI Review Draft generations',
          'AI Knowledge Base customization with custom services',
          'WhatsApp instant inquiry desk priority',
          'Custom review landing page branding & colors',
          'Zero Google review link dropouts',
        ];

  const entFeatures =
    Array.isArray(pricingConfig?.enterprise?.features) && pricingConfig.enterprise.features.length > 0
      ? pricingConfig.enterprise.features
      : [
          'Everything in Pro, plus:',
          'Multi-location dashboard (up to 10 locations)',
          'Dedicated Technical Account Manager at Arventa Ventures',
          'Custom REST API & Webhook integration',
          'Priority SLA support via direct WhatsApp & phone',
          'Automated monthly Google Business Profile local SEO audits',
          'Custom domain support for review pages',
        ];

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Essential local reputation engine for individual storefronts.',
      priceMonthly: `${currency}${starterMonthly.toLocaleString('en-IN')}`,
      priceYearly: `${currency}${starterYearly.toLocaleString('en-IN')}`,
      period: 'per month',
      popular: false,
      badge: 'Starter Tier',
      features: starterFeatures,
      tierCode: 'STARTER',
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Ideal for growing businesses looking to dominate local Google search.',
      priceMonthly: `${currency}${proMonthly.toLocaleString('en-IN')}`,
      priceYearly: `${currency}${proYearly.toLocaleString('en-IN')}`,
      period: 'per month',
      popular: true,
      badge: 'Most Popular',
      features: proFeatures,
      tierCode: 'PRO',
    },
    {
      id: 'enterprise',
      name: 'Ultra Enterprise',
      description: 'Tailored for agencies, multi-location chains, and high-volume brands.',
      priceMonthly: `${currency}${entMonthly.toLocaleString('en-IN')}`,
      priceYearly: `${currency}${entYearly.toLocaleString('en-IN')}`,
      period: 'per month',
      popular: false,
      badge: 'Enterprise Grade',
      features: entFeatures,
      tierCode: 'ULTRA',
    },
  ];

  // Fetch recent invoices
  const fetchInvoices = useCallback(async () => {
    setLoadingInvoices(true);
    try {
      const res = await fetch('/api/payment/orders');
      const data = await res.json();
      if (res.ok && data.success) {
        setInvoices(data.orders || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingInvoices(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Clean intervals on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Check URL query parameters for returning payment orders (e.g., from hosted checkout)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const returnOrderId = urlParams.get('payment_order_id') || urlParams.get('order_id');
    if (returnOrderId) {
      handleManualCheck(returnOrderId);
    }
  }, []);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      });
    } catch {
      // ignore
    }
  };

  // Poll FamGateway & Local Backend for Status Verification
  const startPolling = useCallback((orderId) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status?order_id=${encodeURIComponent(orderId)}`);
        const data = await res.json();

        if (res.ok && data.isPaid) {
          // Success!
          clearInterval(pollIntervalRef.current);
          clearInterval(timerIntervalRef.current);
          setPaymentStatus('success');
          setSuccessDetails(data.order);
          if (data.order?.planId) {
            setCurrentPlan(data.order.planId);
          }
          triggerConfetti();
          showToast('Payment verified successfully! Your subscription is now active.', 'success');
          fetchInvoices();
        } else if (data.status === 'expired') {
          clearInterval(pollIntervalRef.current);
          clearInterval(timerIntervalRef.current);
          setPaymentStatus('expired');
          showToast('Payment session expired. Please generate a fresh QR code.', 'warning');
        }
      } catch (err) {
        console.warn('Status poll check failed:', err);
      }
    }, 3000); // 3-second recommended polling interval
  }, [fetchInvoices, showToast]);

  // Start comfortable 10-minute timer
  const startTimer = useCallback((durationInSeconds = 600) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimeLeft(durationInSeconds);

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          clearInterval(pollIntervalRef.current);
          setPaymentStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Extend session by 5 minutes
  const handleExtendSession = () => {
    setTimeLeft((prev) => prev + 300);
    showToast('Payment session extended by 5 minutes.', 'success');
  };

  // Manual Instant Status Check Button
  const handleManualCheck = async (explicitOrderId) => {
    const targetOrderId = explicitOrderId || activeOrder?.orderId;
    if (!targetOrderId) return;

    setCheckingNow(true);
    try {
      const res = await fetch(`/api/payment/status?order_id=${encodeURIComponent(targetOrderId)}`);
      const data = await res.json();

      if (res.ok && data.isPaid) {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setPaymentStatus('success');
        setSuccessDetails(data.order);
        if (data.order?.planId) {
          setCurrentPlan(data.order.planId);
        }
        triggerConfetti();
        showToast('Payment confirmed! Your plan is activated.', 'success');
        fetchInvoices();
      } else {
        showToast('Payment not detected yet. Please ensure UPI transfer completed on your phone.', 'info');
      }
    } catch {
      showToast('Could not reach payment verification switch.', 'error');
    } finally {
      setCheckingNow(false);
    }
  };

  // Manual UTR Submission
  const handleSubmitManualUtr = async (e) => {
    e.preventDefault();
    if (!manualUtr || !/^\d{12}$/.test(manualUtr.trim())) {
      showToast('Please enter a valid 12-digit NPCI Bank UTR number.', 'warning');
      return;
    }

    setSubmittingUtr(true);
    try {
      const res = await fetch('/api/payment/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: activeOrder?.orderId,
          utr: manualUtr.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.isPaid) {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setPaymentStatus('success');
        setSuccessDetails(data.order);
        if (data.order?.planId) {
          setCurrentPlan(data.order.planId);
        }
        triggerConfetti();
        showToast('Bank UTR verified successfully! Your subscription is now active.', 'success');
        fetchInvoices();
      } else {
        showToast(
          data.message || 'UTR recorded! Bank email notification is syncing in memory. Please check status in 10 seconds.',
          'info'
        );
      }
    } catch {
      showToast('Error validating Bank UTR.', 'error');
    } finally {
      setSubmittingUtr(false);
    }
  };

  // Close checkout modal
  const handleCloseModal = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setActiveOrder(null);
    setPaymentStatus('idle');
    setSuccessDetails(null);
    setInitiatingPlanId(null);
    setShowUtrInput(false);
    setManualUtr('');
  };

  // Open Checkout Mode Selection Modal
  const handleInitiateUpgrade = (plan) => {
    setPlanToUpgrade(plan);
  };

  // Simulate Instant Successful Test Payment
  const handleExecuteTestSuccess = async (plan) => {
    const targetPlan = plan || planToUpgrade;
    if (!targetPlan) return;

    setSimulatingTest(true);
    try {
      const res = await fetch('/api/payment/simulate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: targetPlan.id,
          billingCycle,
          orderId: activeOrder?.orderId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to simulate test payment.', 'error');
        return;
      }

      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      setPlanToUpgrade(null);
      setActiveOrder({
        orderId: data.order?.orderId || 'fg_TEST_' + Date.now(),
        planId: data.order?.planId || targetPlan.id,
        planName: data.order?.planName || targetPlan.name,
        amount: data.order?.amount || 0,
        payableAmount: data.order?.amount || 0,
        billingCycle,
      });
      setSuccessDetails(data.order || {
        orderId: data.order?.orderId || 'fg_TEST_' + Date.now(),
        planName: targetPlan.name,
        amount: data.order?.amount || 0,
        status: 'success',
      });
      setPaymentStatus('success');
      setCurrentPlan(data.order?.planId || targetPlan.id);

      triggerConfetti();
      showToast('Test payment successful! Subscription activated.', 'success');
      fetchInvoices();
    } catch (err) {
      console.error(err);
      showToast('Network error while simulating test payment.', 'error');
    } finally {
      setSimulatingTest(false);
    }
  };

  // Continue with Live Production Order Creation
  const handleContinueProduction = async (plan) => {
    const targetPlan = plan || planToUpgrade;
    setPlanToUpgrade(null);
    if (!targetPlan) return;
    await handlePlanClick(targetPlan);
  };

  // Trigger Plan Upgrade & Create Dynamic Order
  const handlePlanClick = async (plan) => {
    setInitiatingPlanId(plan.id);

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billingCycle,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.order) {
        showToast(data.error || 'Failed to initialize payment session.', 'error');
        setInitiatingPlanId(null);
        return;
      }

      setActiveOrder(data.order);
      setPaymentStatus('pending');
      startTimer(data.order.expiresInSeconds || 600);
      startPolling(data.order.orderId);
      showToast('Dynamic UPI QR code generated. Scan or click to pay!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Unable to connect to payment server. Please try again.', 'error');
    } finally {
      setInitiatingPlanId(null);
    }
  };

  // Copy helper
  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName} to clipboard!`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Format seconds to mm:ss
  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-[#5f6368]">
        <Link href="/dashboard" className="hover:text-[#1a73e8] transition-colors">
          Google Business Profile
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#202124]">Subscription Plans (Starter / Pro / Ultra)</span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
          <Crown className="w-3.5 h-3.5" />
          <span>Scale Your Google Business Profile</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202124]">
          Transparent Plans for Local Dominance
        </h1>
        <p className="text-sm sm:text-base text-[#5f6368]">
          Engineered by Arventa Ventures. Instant activation via zero-fee, non-custodial FamGateway UPI payments with automated bank verification.
        </p>

        {/* Billing Toggle */}
        <div className="pt-2 flex items-center justify-center space-x-3">
          <span className={`text-xs font-medium ${billingCycle === 'monthly' ? 'text-[#202124]' : 'text-[#70757a]'}`}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#1a73e8] transition-colors duration-200 ease-in-out focus:outline-none"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-medium ${billingCycle === 'yearly' ? 'text-[#202124]' : 'text-[#70757a]'}`}>
            Yearly <span className="text-[#1e8e3e] font-semibold">(Save 15%)</span>
          </span>
        </div>
      </div>

      {/* Expiration or Warning Notice */}
      {isExpired && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-red-950 flex items-center gap-1.5">
              <span>Subscription Expired</span>
              <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                Action Required
              </span>
            </h4>
            <p className="text-red-800/90 leading-relaxed">
              Your previous subscription expired on{' '}
              {expiresAt
                ? expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'recently'}
              . Renew your plan below to continue accessing AI draft features and Google Business Profile management.
            </p>
          </div>
        </div>
      )}

      {!isExpired && daysLeft > 0 && daysLeft <= 5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
              <span>Subscription Expiring Soon</span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {daysLeft} Day{daysLeft === 1 ? '' : 's'} Remaining
              </span>
            </h4>
            <p className="text-amber-800/90 leading-relaxed">
              Your active subscription renews on{' '}
              {expiresAt
                ? expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'soon'}
              . You can renew early below to stack full validity onto your account without any interruption.
            </p>
          </div>
        </div>
      )}

      {/* Active Subscription Rule Notice */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/70 to-emerald-50/80 border border-blue-200/90 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Zap className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-slate-900 flex flex-wrap items-center gap-1.5">
            <span>Single Active Subscription Policy</span>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              Instant Replacement
            </span>
          </h4>
          <p className="text-slate-600 leading-relaxed">
            Whenever you activate any subscription (monthly or yearly, whether smaller or larger), any previous subscription is immediately cancelled. Your new subscription begins fresh today for the full duration ({billingCycle === 'yearly' ? '365 days' : '30 days'}).
          </p>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isInitiating = initiatingPlanId === plan.id;

          return (
            <div
              key={plan.name}
              className={`rounded-2xl border bg-white p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'border-[#1a73e8] shadow-lg ring-2 ring-[#1a73e8]/20'
                  : 'border-[#dadce0] hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a73e8] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#202124]">{plan.name}</h3>
                    <p className="mt-1 text-xs text-[#5f6368] leading-relaxed min-h-[36px]">
                      {plan.description}
                    </p>
                  </div>
                  {isCurrent && (
                    <span
                      className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isExpired
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isExpired ? 'Plan Expired' : 'Active Plan'}
                    </span>
                  )}
                </div>

                <div className="pt-2 pb-4 border-b border-[#f1f3f4]">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#202124]">
                      {billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly}
                    </span>
                    <span className="text-xs text-[#70757a]">/{plan.period}</span>
                  </div>
                  <p className="text-[11px] text-[#70757a] mt-1">
                    {billingCycle === 'yearly' ? 'Billed annually with zero gateway fees' : 'Billed monthly with zero gateway fees'}
                  </p>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                    Included capabilities:
                  </p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-[#3c4043]">
                      <Check className="w-4 h-4 text-[#34a853] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#f1f3f4] space-y-2">
                <button
                  type="button"
                  disabled={isInitiating}
                  onClick={() => handleInitiateUpgrade(plan)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isCurrent && isExpired
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                      : plan.popular
                      ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#f8f9fa] hover:bg-[#e8f0fe] text-[#1a73e8] border border-[#dadce0]'
                  }`}
                >
                  {isInitiating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Dynamic UPI QR...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {isCurrent
                          ? isExpired
                            ? `Renew ${plan.name} Plan`
                            : `Renew / Extend ${plan.name}`
                          : `Upgrade to ${plan.name}`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center space-x-2 text-[10px] text-[#70757a]">
                  <ShieldCheck className="w-3 h-3 text-[#1e8e3e]" />
                  <span>Instant UPI Activation &bull; Zero Platform Fee</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Governed by Arventa Ventures Banner */}
      <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#1a73e8] uppercase tracking-wider flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Enterprise Strategy & Custom Contracts</span>
          </p>
          <h4 className="text-base font-bold text-[#202124]">
            Need a custom deployment across 50+ retail branches or franchise chains?
          </h4>
          <p className="text-xs text-[#5f6368]">
            Arventa Ventures provides white-glove onboarding, Google Business Profile API setup, and dedicated customer success.
          </p>
        </div>

        <Link
          href="/dashboard/contact"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-[#f1f3f4] text-[#202124] border border-[#dadce0] rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <span>Contact Sales Team</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#5f6368]" />
        </Link>
      </div>

      {/* RECENT INVOICES & PAYMENT RECEIPTS SECTION */}
      <div className="bg-white border border-[#dadce0] rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#202124]">Payment Invoices & Receipts</h3>
              <p className="text-xs text-[#5f6368]">
                Download official GST & MSME certified bank transaction receipts compiled for your accounts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchInvoices}
            disabled={loadingInvoices}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-[#5f6368] hover:text-[#202124] hover:bg-[#f8f9fa] border border-[#dadce0] rounded-lg transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingInvoices ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loadingInvoices ? (
          <div className="py-8 text-center text-xs text-[#70757a] flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#1a73e8]" />
            <span>Loading transaction history...</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-8 text-center space-y-1">
            <p className="text-xs font-medium text-[#202124]">No payment records found</p>
            <p className="text-[11px] text-[#70757a]">
              When you upgrade or renew your plan, official receipts and NPCI Bank UTRs will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f1f3f4] text-[#70757a] uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">NPCI Bank UTR</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f4]">
                {invoices.map((inv) => (
                  <tr key={inv.orderId} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-[#202124]">{inv.orderId}</td>
                    <td className="py-3 px-3 font-semibold text-[#202124]">{inv.planName}</td>
                    <td className="py-3 px-3 font-bold text-[#202124]">₹{Number(inv.amount).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 font-mono text-[#5f6368]">{inv.utr || '—'}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inv.status === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : inv.status === 'expired'
                            ? 'bg-stone-100 text-stone-600'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {inv.status === 'success' ? 'Confirmed' : inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#70757a]">
                      {inv.paidAt || inv.createdAt
                        ? new Date(inv.paidAt || inv.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {inv.receiptUrl ? (
                        <a
                          href={inv.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#1a73e8] hover:text-[#1557b0] hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-[#dadce0]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Brand Footer Governance Note */}
      <div className="py-4 text-center border-t border-[#e8eaed]">
        <p className="text-xs text-[#70757a] flex items-center justify-center space-x-2">
          <span className="font-bold tracking-wider text-[#202124]">RANKORA</span>
          <span>•</span>
          <span>A Product by Arventa Ventures</span>
        </p>
      </div>

      {/* CHECKOUT MODE SELECTION MODAL (Test Successful vs Continue Production) */}
      {planToUpgrade && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-stone-900 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Select Checkout Mode
                  </h3>
                  <p className="text-xs text-slate-300">
                    Upgrade to <span className="font-semibold text-white">{planToUpgrade.name}</span> ({billingCycle === 'yearly' ? planToUpgrade.priceYearly : planToUpgrade.priceMonthly}/{planToUpgrade.period})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPlanToUpgrade(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-stone-600">
                Please select how you would like to proceed with your upgrade:
              </p>

              {/* Option 1: Test Successful */}
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 p-4 space-y-3 hover:border-emerald-600 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">Test Mode (Zero Cost)</h4>
                      <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider block">
                        Instant Simulation &bull; Sandbox Test
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Instant Demo
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Simulates a verified UPI payment with a mock NPCI Bank UTR. Instantly activates the <strong>{planToUpgrade.name}</strong> subscription on your account without charging any real money.
                </p>
                <button
                  type="button"
                  disabled={simulatingTest}
                  onClick={() => handleExecuteTestSuccess(planToUpgrade)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center space-x-2 shadow-sm transition cursor-pointer disabled:opacity-60"
                >
                  {simulatingTest ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Activating Test Subscription...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Test Successful (Instant Activation)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Option 2: Continue Production */}
              <div className="rounded-2xl border-2 border-blue-500/40 bg-blue-50/50 p-4 space-y-3 hover:border-blue-600 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-950">Production Mode (Live Payment)</h4>
                      <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider block">
                        Live FamGateway UPI &bull; 100% P2P
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full">
                    Real Transfer
                  </span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed">
                  Generates an authoritative dynamic UPI QR code and deep intent links for Google Pay, PhonePe, Paytm, or BHIM. Verified via real-time merchant IMAP email sync.
                </p>
                <button
                  type="button"
                  disabled={initiatingPlanId === planToUpgrade.id}
                  onClick={() => handleContinueProduction(planToUpgrade)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2 shadow-sm transition cursor-pointer disabled:opacity-60"
                >
                  {initiatingPlanId === planToUpgrade.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Connecting to FamGateway...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>Continue Production (Live UPI QR)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 text-center">
              <p className="text-[11px] text-stone-500 flex items-center justify-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero gateway deduction &bull; Automated receipt generation &bull; Encrypted</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* INSTITUTIONAL FINTECH DUAL-PANE UPI CHECKOUT MODAL */}
      {activeOrder && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden relative my-auto">
            {/* Top Obsidian Security Header */}
            <div className="bg-[#0f172a] px-5 py-3.5 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold tracking-tight text-white">256-Bit Encrypted UPI Checkout</span>
                    <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/30">
                      NPCI Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Order Ref: <span className="font-mono text-slate-300 font-bold">{activeOrder.orderId}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>0% Platform Fees</span>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                  title="Close checkout modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Two-Column Fintech Layout on Desktop */}
            {paymentStatus === 'success' ? (
              /* CONFIRMED SUCCESS SCREEN */
              <div className="p-8 sm:p-10 text-center space-y-6 animate-scaleUp">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-md">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Payment Verified & Account Activated
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 pt-2">
                    Welcome to {activeOrder.planName}!
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                    Your UPI payment was settled directly with zero deductions. All pro capabilities are now active on your dashboard.
                  </p>
                </div>

                {/* Bank Receipt Snapshot */}
                <div className="max-w-md mx-auto bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs font-mono space-y-2.5 text-left">
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Order Session ID:</span>
                    <strong className="text-stone-900 font-sans">{successDetails?.orderId || activeOrder.orderId}</strong>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Settled Amount:</span>
                    <strong className="text-stone-900 font-sans font-bold text-sm">
                      ₹{successDetails?.amount || activeOrder.payableAmount} INR
                    </strong>
                  </div>
                  {successDetails?.utr && (
                    <div className="flex justify-between items-center text-stone-600">
                      <span>NPCI Bank UTR:</span>
                      <strong className="text-blue-700 select-all font-sans font-bold">{successDetails.utr}</strong>
                    </div>
                  )}
                  {successDetails?.senderName && (
                    <div className="flex justify-between items-center text-stone-600">
                      <span>Verified Payer:</span>
                      <strong className="text-stone-900 font-sans">{successDetails.senderName}</strong>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Status:</span>
                    <strong className="text-emerald-700 font-sans font-bold uppercase tracking-wider">Confirmed Paid</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  {successDetails?.receiptUrl && (
                    <a
                      href={successDetails.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Official PDF Receipt</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <span>Back to Dashboard</span>
                  </button>
                </div>
              </div>
            ) : paymentStatus === 'expired' ? (
              /* EXPIRED SCREEN */
              <div className="p-8 sm:p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border-2 border-red-200">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-stone-900">Payment Session Timed Out</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    To prevent stale transaction note collisions, dynamic QR sessions expire. Click below to generate an immediate fresh session.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlanClick({ id: activeOrder.planId, name: activeOrder.planName })}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate New Dynamic QR</span>
                </button>
              </div>
            ) : (
              /* DUAL PANE CHECKOUT */
              <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-stone-200">
                {/* LEFT COLUMN: ORDER SUMMARY & PLAN PRIVILEGES (2 COLS) */}
                <div className="md:col-span-2 p-6 bg-slate-50/70 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div>
                      <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                        <Crown className="w-3 h-3 text-blue-600" />
                        <span>Selected Subscription</span>
                      </div>
                      <h4 className="text-lg font-bold text-stone-900 leading-tight">
                        {activeOrder.planName} Plan
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {activeOrder.billingCycle === 'yearly' ? 'Annual Subscription (15% Savings)' : 'Monthly Subscription'}
                      </p>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2 text-xs shadow-2xs">
                      <div className="flex justify-between text-stone-600">
                        <span>Base Subscription:</span>
                        <span>₹{Number(activeOrder.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Convenience & Gateway Fee:</span>
                        <span>0% (₹0.00 FREE)</span>
                      </div>
                      <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline">
                        <span className="font-bold text-stone-900">Total Payable:</span>
                        <div className="text-right">
                          <span className="text-xl font-black text-blue-900 font-sans">
                            ₹{Number(activeOrder.payableAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] text-stone-500 block font-normal">Inclusive of all taxes</span>
                        </div>
                      </div>
                    </div>

                    {/* Plan Highlights */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                        Capabilities Unlocked:
                      </p>
                      <div className="space-y-1.5 text-xs text-stone-600">
                        <div className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Unlimited AI Review Drafts (Gemini powered)</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Print-Ready High-Res QR Stands (Vector PDF)</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>WhatsApp Direct Resolution & Inquiry Desk</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust Footer */}
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
                    <div className="flex items-center space-x-1.5 font-semibold text-stone-800">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Peer-to-Peer UPI Guarantee</span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-relaxed">
                      Zero intermediaries. Funds transfer directly into the merchant account with immediate automated Bank UTR confirmation.
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN: INTERACTIVE PAYMENT CONSOLE (3 COLS) */}
                <div className="md:col-span-3 p-6 space-y-4">
                  {/* Comfortable Timer & Session Header */}
                  <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200 px-3.5 py-2.5 rounded-xl">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-blue-950">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Session Active: <strong className="font-mono text-sm text-blue-900">{formatSeconds(timeLeft)}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={handleExtendSession}
                      className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-white border border-blue-200 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition cursor-pointer shadow-2xs"
                    >
                      +5 Mins
                    </button>
                  </div>

                  {/* Payment Mode Selector Tabs */}
                  <div className="flex items-center border border-stone-200 rounded-xl p-1 bg-stone-100 text-xs font-semibold text-stone-600">
                    <button
                      type="button"
                      onClick={() => setActivePayTab('qr')}
                      className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                        activePayTab === 'qr'
                          ? 'bg-white text-stone-900 shadow-2xs'
                          : 'hover:text-stone-900'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5 text-blue-600" />
                      <span>Scan Dynamic QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePayTab('intent')}
                      className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                        activePayTab === 'intent'
                          ? 'bg-white text-stone-900 shadow-2xs'
                          : 'hover:text-stone-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                      <span>Pay via App</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePayTab('vpa')}
                      className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                        activePayTab === 'vpa'
                          ? 'bg-white text-stone-900 shadow-2xs'
                          : 'hover:text-stone-900'
                      }`}
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-600" />
                      <span>UPI ID / VPA</span>
                    </button>
                  </div>

                  {/* TAB 1: DYNAMIC QR CODE DISPLAY */}
                  {activePayTab === 'qr' && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="relative mx-auto w-56 p-3 bg-white rounded-2xl border-2 border-stone-200 shadow-xs text-center">
                        {/* QR Scanner Target Brackets Visual */}
                        <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-blue-600 rounded-tl-sm"></div>
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-blue-600 rounded-tr-sm"></div>
                        <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-blue-600 rounded-bl-sm"></div>
                        <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-blue-600 rounded-br-sm"></div>

                        {activeOrder.qrUrl ? (
                          <img
                            src={activeOrder.qrUrl}
                            alt="FamGateway UPI Dynamic QR Code"
                            className="w-50 h-50 object-contain mx-auto rounded-lg"
                          />
                        ) : (
                          <div className="w-50 h-50 flex flex-col items-center justify-center text-stone-400">
                            <QrCode className="w-12 h-12 stroke-1" />
                            <span className="text-[11px] mt-2">Loading QR Code...</span>
                          </div>
                        )}
                      </div>

                      {/* 3-Step Simple Flow */}
                      <div className="text-center">
                        <p className="text-[11px] font-bold text-stone-800 flex items-center justify-center space-x-2">
                          <span>1. Open UPI App</span>
                          <span className="text-stone-400">&bull;</span>
                          <span>2. Scan QR</span>
                          <span className="text-stone-400">&bull;</span>
                          <span>3. Enter UPI PIN</span>
                        </p>
                      </div>

                      {/* Supported Apps Brand Bar */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-semibold text-stone-700">
                        <span className="px-2 py-0.5 rounded-full bg-white border border-stone-200 flex items-center space-x-1 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span>Google Pay</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-stone-200 flex items-center space-x-1 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                          <span>PhonePe</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-stone-200 flex items-center space-x-1 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                          <span>Paytm</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-stone-200 flex items-center space-x-1 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                          <span>BHIM</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-stone-200 flex items-center space-x-1 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-900"></span>
                          <span>CRED</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-stone-200 flex items-center space-x-1 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>FamPay</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PAY VIA INSTANT APP INTENT */}
                  {activePayTab === 'intent' && (
                    <div className="space-y-3 py-2 animate-fadeIn">
                      <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs text-purple-900 space-y-1">
                        <span className="font-bold flex items-center space-x-1.5">
                          <Smartphone className="w-4 h-4 text-purple-700" />
                          <span>1-Click UPI Mobile Payment:</span>
                        </span>
                        <p className="text-[11px] text-purple-800">
                          Click below to trigger Google Pay, PhonePe, or Paytm directly on your device without scanning.
                        </p>
                      </div>

                      {activeOrder.upiIntent && (
                        <a
                          href={activeOrder.upiIntent}
                          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition cursor-pointer"
                        >
                          <Zap className="w-4 h-4" />
                          <span>Launch UPI App Now (₹{activeOrder.payableAmount})</span>
                        </a>
                      )}

                      {activeOrder.checkoutUrl && (
                        <a
                          href={activeOrder.checkoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer shadow-2xs"
                        >
                          <span>Open Hosted FamGateway Checkout</span>
                          <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* TAB 3: MANUAL VPA & ORDER NOTE */}
                  {activePayTab === 'vpa' && (
                    <div className="space-y-2.5 py-1 animate-fadeIn">
                      {/* VPA Card */}
                      <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                          <span className="text-[10px] uppercase font-bold text-stone-500 block">Merchant UPI VPA</span>
                          <span className="font-mono font-bold text-stone-900 select-all">{activeOrder.upiId || 'janajaydeb@fam'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(activeOrder.upiId || 'janajaydeb@fam', 'UPI VPA')}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition cursor-pointer shrink-0 shadow-2xs"
                        >
                          {copiedField === 'UPI VPA' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'UPI VPA' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Payable Amount Card */}
                      <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-500 block">Exact Transfer Amount</span>
                          <span className="font-mono font-bold text-blue-900 text-sm">₹{activeOrder.payableAmount}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(String(activeOrder.payableAmount), 'Amount')}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition cursor-pointer shrink-0 shadow-2xs"
                        >
                          {copiedField === 'Amount' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'Amount' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Order Ref Note Card */}
                      <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-500 block">Transaction Reference Note</span>
                          <span className="font-mono font-bold text-stone-900">{activeOrder.orderId}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(activeOrder.orderId, 'Order Reference')}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition cursor-pointer shrink-0 shadow-2xs"
                        >
                          {copiedField === 'Order Reference' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'Order Reference' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ACTIVE LIVE VERIFICATION & MANUAL ACTIONS */}
                  <div className="pt-3 border-t border-stone-100 space-y-2.5">
                    {/* Live Listener Pulse */}
                    <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                      <div className="flex items-center space-x-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        <span>Auto-verifying bank credit in background...</span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400">every 3s</span>
                    </div>

                    {/* Instant Check Button */}
                    <button
                      type="button"
                      onClick={() => handleManualCheck()}
                      disabled={checkingNow}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition cursor-pointer disabled:opacity-60"
                    >
                      {checkingNow ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying with FamPay Bank Switch...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>I Have Paid &bull; Verify Payment Now</span>
                        </>
                      )}
                    </button>

                    {/* Collapsible Manual 12-Digit UTR Form */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowUtrInput(!showUtrInput)}
                        className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center space-x-1 mx-auto transition cursor-pointer"
                      >
                        <span>Paid via UPI app but taking long? Enter 12-digit UTR</span>
                        {showUtrInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {showUtrInput && (
                        <form onSubmit={handleSubmitManualUtr} className="mt-2 p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2 animate-fadeIn">
                          <label className="text-[10px] font-bold text-stone-600 block uppercase">
                            12-Digit Bank Reference (UTR / UPI Ref Number)
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              maxLength={12}
                              value={manualUtr}
                              onChange={(e) => setManualUtr(e.target.value.replace(/\D/g, ''))}
                              placeholder="e.g. 420987654321"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="submit"
                              disabled={submittingUtr || manualUtr.length !== 12}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 cursor-pointer shrink-0"
                            >
                              {submittingUtr ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm'}
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-400">
                            Find the 12-digit UPI Ref / UTR number in your Google Pay, PhonePe, or Paytm receipt details.
                          </p>
                        </form>
                      )}
                    </div>

                    {/* Test Successful Sandbox Action */}
                    <div className="pt-2 text-center border-t border-stone-100">
                      <button
                        type="button"
                        disabled={simulatingTest}
                        onClick={() => handleExecuteTestSuccess({ id: activeOrder.planId, name: activeOrder.planName })}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer disabled:opacity-50"
                      >
                        {simulatingTest ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Simulating Test Success...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Test Successful (Instant Activation)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
