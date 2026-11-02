'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Settings,
  Search,
  LogIn,
  Trash2,
  UserX,
  UserCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Mail,
  Key,
  Server,
  Globe,
  Sparkles,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  CreditCard,
  BarChart3,
  Copy,
  Check,
  Send,
  Pencil,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

const PLAN_STYLES = {
  free: { label: 'Free', bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200' },
  starter: { label: 'Starter', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  pro: { label: 'Pro', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  enterprise: { label: 'Enterprise', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
};

export default function AdminClient({ currentUser }) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'settings'

  // Users State
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Action States
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [planModalUser, setPlanModalUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [suspendModalUser, setSuspendModalUser] = useState(null);
  const [suspensionReasonInput, setSuspensionReasonInput] = useState('');
  const [copiedSlug, setCopiedSlug] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    smtp: {
      provider: 'gmail',
      user: '',
      pass: '',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      fromName: 'Rankaro',
    },
    ai: {
      provider: 'gemini',
      apiKey: '',
      model: 'gemini-1.5-flash',
    },
    general: {
      appName: 'Rankaro',
      appUrl: 'http://localhost:3000',
      supportEmail: '',
      allowPublicRegistration: true,
    },
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [showAiKey, setShowAiKey] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState(currentUser?.email || '');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState(null);

  // Change Admin Password State
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [updatingPwd, setUpdatingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  // Fetch users with filters
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        plan: planFilter,
        isVerified: verificationFilter,
        page: String(page),
        limit: '50',
      });
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users || []);
        setStats(data.stats || null);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      } else {
        showToast(data.error || 'Failed to load user directory.', 'error');
      }
    } catch (err) {
      showToast('Could not establish connection to the server.', 'error');
    } finally {
      setLoadingUsers(false);
    }
  }, [search, statusFilter, planFilter, verificationFilter, page, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (res.ok && data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchSettings();
    }
  }, [activeTab, fetchSettings]);

  // 1-Click Login (Impersonation)
  const handleImpersonate = async (targetUser) => {
    setActionLoadingId(`login_${targetUser._id}`);
    try {
      const res = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUser._id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Signed in as ${targetUser.businessName}`, 'success');
        window.location.href = data.redirect || '/dashboard';
      } else {
        showToast(data.error || 'Unable to sign in as user.', 'error');
        setActionLoadingId(null);
      }
    } catch (err) {
      showToast('Impersonation failed.', 'error');
      setActionLoadingId(null);
    }
  };

  // Toggle Suspend / Active status
  const handleToggleStatus = async (targetUser) => {
    if (targetUser.status !== 'suspended') {
      // Opening suspension modal to ask for reason
      setSuspendModalUser(targetUser);
      setSuspensionReasonInput('Your account has been temporarily suspended by an administrator. Please contact support.');
      return;
    }

    // Reactivate account
    setActionLoadingId(`status_${targetUser._id}`);
    try {
      const res = await fetch(`/api/admin/users/${targetUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', status: 'active' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, status: 'active', suspensionReason: '' } : u))
        );
        showToast(`Account reactivated for ${targetUser.businessName}`, 'success');
      } else {
        showToast(data.error || 'Failed to reactivate user status.', 'error');
      }
    } catch (err) {
      showToast('Error reactivating account status.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Confirm suspension with custom reason
  const handleConfirmSuspend = async () => {
    if (!suspendModalUser) return;
    const targetId = suspendModalUser._id;
    setActionLoadingId(`status_${targetId}`);
    try {
      const res = await fetch(`/api/admin/users/${targetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          status: 'suspended',
          suspensionReason: suspensionReasonInput || 'Account suspended by system administrator.',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === targetId
              ? { ...u, status: 'suspended', suspensionReason: suspensionReasonInput }
              : u
          )
        );
        showToast(`Account suspended for ${suspendModalUser.businessName}. Reason saved to profile.`, 'success');
        setSuspendModalUser(null);
      } else {
        showToast(data.error || 'Failed to suspend account.', 'error');
      }
    } catch (err) {
      showToast('Error suspending account.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Update Plan
  const handleUpdatePlan = async () => {
    if (!planModalUser) return;
    setActionLoadingId(`plan_${planModalUser._id}`);
    try {
      const res = await fetch(`/api/admin/users/${planModalUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_plan', plan: selectedPlan }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === planModalUser._id ? { ...u, plan: selectedPlan } : u))
        );
        showToast(`Plan successfully updated to ${selectedPlan.toUpperCase()}`, 'success');
        setPlanModalUser(null);
      } else {
        showToast(data.error || 'Failed to update subscription plan.', 'error');
      }
    } catch (err) {
      showToast('Error updating plan.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!deleteModalUser) return;
    setActionLoadingId(`delete_${deleteModalUser._id}`);
    try {
      const res = await fetch(`/api/admin/users/${deleteModalUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== deleteModalUser._id));
        setTotalCount((c) => Math.max(0, c - 1));
        showToast(data.message || 'User account permanently deleted.', 'success');
        setDeleteModalUser(null);
      } else {
        showToast(data.error || 'Failed to delete user account.', 'error');
      }
    } catch (err) {
      showToast('Error deleting account.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Save System Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        showToast('System and Gmail API settings saved successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to save system settings.', 'error');
      }
    } catch (err) {
      showToast('Error saving settings to server.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Test SMTP connection
  const handleTestEmail = async () => {
    if (!settings.smtp.user || !settings.smtp.pass) {
      showToast('Please provide both Gmail Address and App Password.', 'warning');
      return;
    }
    setTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/admin/settings/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: settings.smtp.user,
          pass: settings.smtp.pass,
          host: settings.smtp.host || 'smtp.gmail.com',
          port: settings.smtp.port || 465,
          secure: true,
          testRecipient: testEmailRecipient || currentUser.email,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestEmailResult({ success: true, message: data.message });
        showToast('Verification test email dispatched successfully!', 'success');
      } else {
        setTestEmailResult({ success: false, message: data.error || 'SMTP connection verification failed.' });
        showToast(data.error || 'SMTP verification failed.', 'error');
      }
    } catch (err) {
      setTestEmailResult({ success: false, message: err.message || 'Network error encountered.' });
      showToast('Failed to send test email.', 'error');
    } finally {
      setTestingEmail(false);
    }
  };

  // Change Admin Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirmPassword) {
      showToast('All password fields are required.', 'warning');
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    setUpdatingPwd(true);
    setPwdMsg(null);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pwdForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPwdMsg({ type: 'success', text: data.message });
        showToast('Admin password changed successfully!', 'success');
      } else {
        setPwdMsg({ type: 'error', text: data.error || 'Failed to update password.' });
        showToast(data.error || 'Failed to update password.', 'error');
      }
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.message || 'Network error occurred.' });
      showToast('Network error while updating password.', 'error');
    } finally {
      setUpdatingPwd(false);
    }
  };

  const copyReviewLink = (slug) => {
    const url = `${window.location.origin}/r/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    showToast('Review link copied to clipboard.', 'success');
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage users, direct account login, subscription tiers, and Gmail API configuration
          </p>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex items-center bg-stone-200/80 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'users'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>Users & Accounts ({totalCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Settings className="w-4 h-4 text-purple-600" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-stone-900 mt-2">{stats.totalUsers}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">{stats.verifiedUsers} verified accounts</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Active Users</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2">{stats.activeUsers}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Operating normally</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Suspended</span>
              <UserX className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-700 mt-2">{stats.suspendedUsers}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Access disabled</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Paid Plans</span>
              <CreditCard className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-700 mt-2">
              {(stats.planCounts?.starter || 0) + (stats.planCounts?.pro || 0) + (stats.planCounts?.enterprise || 0)}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Starter / Pro / Enterprise</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Drafts Generated</span>
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-2">{stats.draftsGenerated}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">{stats.totalVisits} page visits recorded</div>
          </div>
        </div>
      )}

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by business name, owner, email, phone, or slug..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-medium px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>

                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="text-xs font-medium px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>

                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="text-xs font-medium px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="all">All Verification</option>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>

                <button
                  onClick={fetchUsers}
                  disabled={loadingUsers}
                  className="p-2 text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition cursor-pointer"
                  title="Refresh User List"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Users Table / List */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            {loadingUsers ? (
              <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="text-sm">Loading user directory...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-stone-500 space-y-2">
                <Users className="w-10 h-10 mx-auto text-stone-300" />
                <p className="font-semibold text-stone-700">No users found</p>
                <p className="text-xs text-stone-400">Try adjusting your search criteria or active filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      <th className="py-3 px-4">Business & User</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Plan</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Activity</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm">
                    {users.map((u) => {
                      const planConfig = PLAN_STYLES[u.plan] || PLAN_STYLES.free;
                      const isSuspended = u.status === 'suspended';
                      const isActionBusy = actionLoadingId?.includes(u._id);

                      return (
                        <tr
                          key={u._id}
                          className={`hover:bg-stone-50/80 transition ${
                            isSuspended ? 'bg-red-50/30' : ''
                          }`}
                        >
                          {/* Business & Owner Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              {u.logoUrl ? (
                                <img
                                  src={u.logoUrl}
                                  alt={u.businessName}
                                  className="w-9 h-9 rounded-lg object-contain border border-stone-200 bg-white shrink-0 p-0.5"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 font-bold flex items-center justify-center shrink-0">
                                  {u.businessName ? u.businessName.charAt(0) : 'B'}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center space-x-1.5">
                                  <span className="font-semibold text-stone-900 truncate">
                                    {u.businessName}
                                  </span>
                                  {u.role === 'admin' && (
                                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-bold uppercase">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-stone-500 truncate">{u.ownerName}</div>
                                <div className="flex items-center space-x-1 text-[11px] text-purple-700 mt-0.5">
                                  <a
                                    href={`/r/${u.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline flex items-center space-x-0.5"
                                  >
                                    <span>/{u.slug}</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                  <button
                                    onClick={() => copyReviewLink(u.slug)}
                                    className="p-0.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                                    title="Copy review page link"
                                  >
                                    {copiedSlug === u.slug ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="py-3.5 px-4 text-xs text-stone-600">
                            <div className="font-medium text-stone-900">{u.email}</div>
                            <div className="text-stone-500 mt-0.5">{u.phone || 'No phone provided'}</div>
                            <div className="mt-1">
                              {u.isVerified ? (
                                <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  <span>Verified</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                                  <XCircle className="w-2.5 h-2.5" />
                                  <span>Unverified</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Subscription Plan */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-1.5">
                              <span
                                className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md border ${planConfig.bg} ${planConfig.text} ${planConfig.border}`}
                              >
                                {planConfig.label}
                              </span>
                              <button
                                onClick={() => {
                                  setPlanModalUser(u);
                                  setSelectedPlan(u.plan || 'free');
                                }}
                                className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition shadow-2xs cursor-pointer"
                                title="Change subscription plan"
                              >
                                <Pencil className="w-3 h-3 text-purple-600" />
                                <span>Edit</span>
                              </button>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {isSuspended ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                  <span>Suspended</span>
                                </span>
                                {u.suspensionReason && (
                                  <div
                                    className="text-[10px] text-red-600 truncate max-w-[140px] italic"
                                    title={u.suspensionReason}
                                  >
                                    &ldquo;{u.suspensionReason}&rdquo;
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>Active</span>
                              </span>
                            )}
                          </td>

                          {/* Analytics Stats */}
                          <td className="py-3.5 px-4 text-xs text-stone-600">
                            <div>
                              Drafts: <span className="font-semibold text-stone-800">{u.stats?.draftsGenerated || 0}</span>
                            </div>
                            <div className="text-[11px] text-stone-500">
                              Visits: {u.stats?.totalVisits || 0} • Copied: {u.stats?.reviewsCopied || 0}
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* 1-Click Login (Impersonation) */}
                              <button
                                onClick={() => handleImpersonate(u)}
                                disabled={isActionBusy}
                                className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-2xs transition disabled:opacity-50 cursor-pointer"
                                title="Login directly to this user account"
                              >
                                {actionLoadingId === `login_${u._id}` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <LogIn className="w-3.5 h-3.5" />
                                )}
                                <span className="hidden lg:inline">Login</span>
                              </button>

                              {/* Suspend / Activate Toggle */}
                              <button
                                onClick={() => handleToggleStatus(u)}
                                disabled={isActionBusy}
                                className={`p-1.5 rounded-lg border transition text-xs font-semibold cursor-pointer ${
                                  isSuspended
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
                                }`}
                                title={isSuspended ? 'Reactivate account' : 'Suspend account'}
                              >
                                {actionLoadingId === `status_${u._id}` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : isSuspended ? (
                                  <UserCheck className="w-3.5 h-3.5" />
                                ) : (
                                  <UserX className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Delete Account */}
                              <button
                                onClick={() => setDeleteModalUser(u)}
                                disabled={isActionBusy || String(currentUser?._id) === String(u._id)}
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition disabled:opacity-30 cursor-pointer"
                                title="Delete account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM & API SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* CARD 1: CHANGE ADMIN PASSWORD */}
          <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">
                    Change Admin Password
                  </h2>
                  <p className="text-xs text-stone-500">
                    Update your administrator login password by verifying your current password
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
                Security
              </span>
            </div>

            {pwdMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
                  pwdMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {pwdMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{pwdMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrentPwd ? 'text' : 'password'}
                    required
                    value={pwdForm.currentPassword}
                    onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full pl-9 pr-10 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={pwdForm.newPassword}
                    onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-10 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPwd ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={pwdForm.confirmPassword}
                    onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-10 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={updatingPwd}
                className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {updatingPwd ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Key className="w-4 h-4" />
                )}
                <span>Update Admin Password</span>
              </button>
            </div>
          </form>

          {/* CARD 2: GMAIL API & SMTP CONFIGURATION */}
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">
                    Gmail API & SMTP Settings
                  </h2>
                  <p className="text-xs text-stone-500">
                    Configure Gmail sender credentials for account verification OTPs and password reset emails
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                Live Service
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gmail Sender Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Gmail Address / Sender User <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={settings.smtp.user}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, user: e.target.value },
                      })
                    }
                    placeholder="example@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Gmail App Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Google 16-Digit App Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSmtpPass ? 'text' : 'password'}
                    required
                    value={settings.smtp.pass}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, pass: e.target.value },
                      })
                    }
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full pl-9 pr-10 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Display Sender Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-stone-700">Display Sender Name</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={settings.smtp.fromName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, fromName: e.target.value },
                      })
                    }
                    placeholder="Rankaro"
                    className="flex-1 px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                  <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium shrink-0">
                    <Server className="w-3.5 h-3.5 text-emerald-600" />
                    <span>System Default: <strong>smtp.gmail.com : 465 (SSL)</strong> &bull; Auto-Managed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction Callout for App Password */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
              <div className="font-semibold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>How to generate a 16-character Google App Password:</span>
              </div>
              <p className="text-blue-800 leading-relaxed">
                1. Navigate to your Google Account ➔ <strong>Security</strong> ➔ Enable <strong>2-Step Verification</strong>.
                <br />
                2. Search for <strong>App Passwords</strong> ➔ Name a new app key (e.g. &ldquo;Rankaro&rdquo;) ➔ Copy the generated 16-character code and paste it here.
              </p>
            </div>

            {/* Live SMTP Test Box */}
            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="email"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  placeholder="Recipient email address for test"
                  className="w-full max-w-xs px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={testingEmail}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {testingEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-stone-600" />
                  )}
                  <span>Send Test Email</span>
                </button>
              </div>

              {testEmailResult && (
                <div
                  className={`text-xs px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 ${
                    testEmailResult.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  {testEmailResult.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  )}
                  <span className="truncate max-w-sm">{testEmailResult.message}</span>
                </div>
              )}
            </div>

            {/* Save Button & Status */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center space-x-2 px-6 py-2.5 text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {savingSettings ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Save Gmail API Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PLAN CHANGE MODAL */}
      {planModalUser && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">Update Subscription Plan</h3>
              <button
                onClick={() => setPlanModalUser(null)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-600">
              Business: <strong>{planModalUser.businessName}</strong> ({planModalUser.email})
            </div>

            <div className="space-y-2">
              {['free', 'starter', 'pro', 'enterprise'].map((p) => {
                const config = PLAN_STYLES[p];
                return (
                  <label
                    key={p}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      selectedPlan === p
                        ? 'border-purple-600 bg-purple-50/50'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="plan"
                        checked={selectedPlan === p}
                        onChange={() => setSelectedPlan(p)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${config.bg} ${config.text} ${config.border}`}>
                          {config.label}
                        </span>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {p === 'free' && 'Basic features with standard review generation quota'}
                          {p === 'starter' && 'Standard QR generation, custom questions, and analytics'}
                          {p === 'pro' && 'Unlimited review drafts, AI multi-language, and priority badges'}
                          {p === 'enterprise' && 'Full platform capabilities with dedicated enterprise support'}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setPlanModalUser(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdatePlan}
                disabled={actionLoadingId === `plan_${planModalUser._id}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition cursor-pointer"
              >
                {actionLoadingId === `plan_${planModalUser._id}` && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Confirm Plan Update</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteModalUser && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-red-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-stone-900 text-lg">Confirm Account Deletion</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to permanently delete <strong>{deleteModalUser.businessName}</strong> ({deleteModalUser.email})?
              </p>
              <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg mt-2">
                Warning: All services, customer QR codes, and review activity history associated with this account will be permanently erased. This action cannot be reversed.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition cursor-pointer"
              >
                Cancel, Keep Account
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={actionLoadingId === `delete_${deleteModalUser._id}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition cursor-pointer"
              >
                {actionLoadingId === `delete_${deleteModalUser._id}` && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Yes, Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* SUSPEND REASON MODAL */}
      {suspendModalUser && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-red-200 p-6 space-y-4">
            <div className="flex items-center space-x-3 border-b border-stone-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">
                <UserX className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-stone-900 text-base">Suspend User Account</h3>
                <p className="text-xs text-stone-500 truncate">
                  {suspendModalUser.businessName} ({suspendModalUser.email})
                </p>
              </div>
              <button
                onClick={() => setSuspendModalUser(null)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">
                Official Google Partner Notice (Will be displayed to user on their profile):
              </label>
              <textarea
                rows={3}
                value={suspensionReasonInput}
                onChange={(e) => setSuspensionReasonInput(e.target.value)}
                placeholder="Write the Official Google Partner compliance reason for this suspension..."
                className="w-full p-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white resize-none"
              />
              <p className="text-[11px] text-stone-500">
                This exact notice will be displayed to the user with an Official Google Partner verified badge when they visit their account.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSuspendModalUser(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                disabled={actionLoadingId === `status_${suspendModalUser._id}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition cursor-pointer"
              >
                {actionLoadingId === `status_${suspendModalUser._id}` && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Issue Partner Suspension</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
