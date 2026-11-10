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
  QrCode,
  Zap,
  Clock,
  Calendar,
  Sliders,
  Award,
  MessageSquareCheck,
  FileText,
  StickyNote,
  Pin,
  Plus,
  Download,
  Tag,
  Save,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

const PLAN_STYLES = {
  starter: { label: 'Starter', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  pro: { label: 'Pro', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  enterprise: { label: 'Enterprise', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  free: { label: 'Starter', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Action States
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [planModalUser, setPlanModalUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [planBillingCycle, setPlanBillingCycle] = useState('monthly');
  const [planStartDate, setPlanStartDate] = useState('');
  const [planEndDate, setPlanEndDate] = useState('');
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [suspendModalUser, setSuspendModalUser] = useState(null);
  const [suspensionReasonInput, setSuspensionReasonInput] = useState('');
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [metricsModalUser, setMetricsModalUser] = useState(null);
  const [scoreInput, setScoreInput] = useState(94);
  const [totalRepliesInput, setTotalRepliesInput] = useState(0);

  const openPlanModal = (u) => {
    setPlanModalUser(u);
    setSelectedPlan(u.plan && u.plan !== 'free' ? u.plan : 'starter');
    setPlanBillingCycle('monthly');

    // Initialize Start Date (YYYY-MM-DD)
    const startDateObj = u.planUpdatedAt ? new Date(u.planUpdatedAt) : new Date();
    const startStr = !isNaN(startDateObj) ? startDateObj.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    setPlanStartDate(startStr);

    // Initialize End Date (YYYY-MM-DD)
    const endDateObj = u.planExpiresAt ? new Date(u.planExpiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const endStr = !isNaN(endDateObj) ? endDateObj.toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setPlanEndDate(endStr);
  };

  const handleApplyPresetDuration = (cycle) => {
    setPlanBillingCycle(cycle);
    const baseDate = planStartDate ? new Date(planStartDate) : new Date();
    if (cycle === 'monthly') {
      const target = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      setPlanEndDate(target.toISOString().split('T')[0]);
    } else if (cycle === 'yearly') {
      const target = new Date(baseDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      setPlanEndDate(target.toISOString().split('T')[0]);
    } else if (cycle === 'expired') {
      const target = new Date(Date.now() - 24 * 60 * 60 * 1000);
      setPlanEndDate(target.toISOString().split('T')[0]);
    }
  };

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
    pricing: {
      currency: '₹',
      starter: {
        monthly: 499,
        yearly: 399,
        features: [
          'Single Business Profile connection',
          'Standard QR Code Stand generation',
          'AI Review Drafts (Powered by Gemini)',
          'Basic review analytics & activity log',
          'Direct link to Google review box',
        ],
      },
      pro: {
        monthly: 999,
        yearly: 849,
        features: [
          'Everything in Starter, plus:',
          'Custom Branded QR Stands (Print Ready PDF)',
          'Unlimited AI Review Draft generations',
          'AI Knowledge Base customization with custom services',
          'WhatsApp instant inquiry desk priority',
          'Custom review landing page branding & colors',
          'Zero Google review link dropouts',
        ],
      },
      enterprise: {
        monthly: 2499,
        yearly: 1999,
        features: [
          'Everything in Pro, plus:',
          'Multi-location dashboard (up to 10 locations)',
          'Dedicated Technical Account Manager at Arventa Ventures',
          'Custom REST API & Webhook integration',
          'Priority SLA support via direct WhatsApp & phone',
          'Automated monthly Google Business Profile local SEO audits',
          'Custom domain support for review pages',
        ],
      },
    },
    famgateway: {
      enabled: false,
      apiKey: '',
    },
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPricing, setSavingPricing] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [showAiKey, setShowAiKey] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState(currentUser?.email || '');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState(null);

  // FamGateway UPI Gateway State
  const [savingFamGateway, setSavingFamGateway] = useState(false);
  const [showFamGatewayKey, setShowFamGatewayKey] = useState(false);
  const [testingFamGateway, setTestingFamGateway] = useState(false);
  const [famGatewayTestResult, setFamGatewayTestResult] = useState(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

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

  // Admin Notepad State
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteForm, setNoteForm] = useState({
    id: '',
    title: '',
    content: '',
    category: 'General',
    isPinned: false,
  });
  const [scratchpad, setScratchpad] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [savingScratchpad, setSavingScratchpad] = useState(false);
  const [scratchpadSavedNotice, setScratchpadSavedNotice] = useState(false);
  const [noteSearch, setNoteSearch] = useState('');
  const [noteCategoryFilter, setNoteCategoryFilter] = useState('All');
  const [deleteNoteModal, setDeleteNoteModal] = useState({ isOpen: false, noteId: null, noteTitle: '' });
  const [copiedNoteId, setCopiedNoteId] = useState(null);

  // Fetch users with filters
  const fetchUsers = useCallback(async () => {
    await Promise.resolve();
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        plan: planFilter,
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
  }, [search, statusFilter, planFilter, page, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (res.ok && data.success && data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...data.settings,
          pricing: {
            currency: data.settings.pricing?.currency || '₹',
            starter: {
              monthly: Number(data.settings.pricing?.starter?.monthly) || 499,
              yearly: Number(data.settings.pricing?.starter?.yearly) || 399,
              features: Array.isArray(data.settings.pricing?.starter?.features) && data.settings.pricing.starter.features.length > 0
                ? data.settings.pricing.starter.features
                : prev.pricing?.starter?.features || [],
            },
            pro: {
              monthly: Number(data.settings.pricing?.pro?.monthly ?? 999),
              yearly: Number(data.settings.pricing?.pro?.yearly ?? 849),
              features: Array.isArray(data.settings.pricing?.pro?.features) && data.settings.pricing.pro.features.length > 0
                ? data.settings.pricing.pro.features
                : prev.pricing?.pro?.features || [],
            },
            enterprise: {
              monthly: Number(data.settings.pricing?.enterprise?.monthly ?? 2499),
              yearly: Number(data.settings.pricing?.enterprise?.yearly ?? 1999),
              features: Array.isArray(data.settings.pricing?.enterprise?.features) && data.settings.pricing.enterprise.features.length > 0
                ? data.settings.pricing.enterprise.features
                : prev.pricing?.enterprise?.features || [],
            },
          },
          famgateway: {
            enabled: data.settings.famgateway?.enabled ?? false,
            apiKey: data.settings.famgateway?.apiKey || '',
          },
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'settings') {
      const timer = setTimeout(() => {
        fetchSettings();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab, fetchSettings]);

  // Fetch Admin Notes
  const fetchNotes = useCallback(async () => {
    setLoadingNotes(true);
    try {
      const res = await fetch('/api/admin/notes');
      const data = await res.json();
      if (res.ok && data.success) {
        const fetchedNotes = Array.isArray(data.notes) ? data.notes : [];
        setNotes(fetchedNotes);
        setScratchpad(typeof data.scratchpad === 'string' ? data.scratchpad : '');
        if (fetchedNotes.length > 0) {
          setSelectedNoteId((prevId) => {
            const found = fetchedNotes.find((n) => n.id === prevId);
            const active = found || fetchedNotes[0];
            setNoteForm({
              id: active.id,
              title: active.title || '',
              content: active.content || '',
              category: active.category || 'General',
              isPinned: Boolean(active.isPinned),
            });
            return active.id;
          });
        }
      } else {
        showToast(data.error || 'Failed to load notes.', 'error');
      }
    } catch {
      showToast('Could not load notes from database.', 'error');
    } finally {
      setLoadingNotes(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeTab === 'notepad') {
      const timer = setTimeout(() => {
        fetchNotes();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab, fetchNotes]);

  const handleSelectNote = (note) => {
    setSelectedNoteId(note.id);
    setNoteForm({
      id: note.id,
      title: note.title || '',
      content: note.content || '',
      category: note.category || 'General',
      isPinned: Boolean(note.isPinned),
    });
  };

  const handleNewNote = () => {
    const newId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setSelectedNoteId(newId);
    setNoteForm({
      id: newId,
      title: '',
      content: '',
      category: 'General',
      isPinned: false,
    });
  };

  const handleSaveNote = async () => {
    if (!noteForm.title.trim() && !noteForm.content.trim()) {
      showToast('Please enter a note title or content before saving.', 'error');
      return;
    }
    setSavingNote(true);
    try {
      const noteToSave = {
        ...noteForm,
        id: noteForm.id || `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: noteForm.title.trim() || 'Untitled Note',
      };
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_note', note: noteToSave }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotes(data.notes || []);
        setSelectedNoteId(data.note.id);
        setNoteForm({
          id: data.note.id,
          title: data.note.title,
          content: data.note.content,
          category: data.note.category,
          isPinned: data.note.isPinned,
        });
        showToast('Note saved to database successfully.', 'success');
      } else {
        showToast(data.error || 'Failed to save note.', 'error');
      }
    } catch {
      showToast('Error saving note.', 'error');
    } finally {
      setSavingNote(false);
    }
  };

  const handleTogglePinNote = async (noteId, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_pin', noteId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotes(data.notes || []);
        if (noteForm.id === noteId) {
          setNoteForm((prev) => ({ ...prev, isPinned: !prev.isPinned }));
        }
      }
    } catch {
      showToast('Error updating pin status.', 'error');
    }
  };

  const handleDeleteNoteConfirm = async () => {
    if (!deleteNoteModal.noteId) return;
    setActionLoadingId('delete_note');
    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_note', noteId: deleteNoteModal.noteId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const remaining = data.notes || [];
        setNotes(remaining);
        showToast('Note permanently deleted.', 'success');
        if (selectedNoteId === deleteNoteModal.noteId) {
          if (remaining.length > 0) {
            handleSelectNote(remaining[0]);
          } else {
            handleNewNote();
          }
        }
        setDeleteNoteModal({ isOpen: false, noteId: null, noteTitle: '' });
      } else {
        showToast(data.error || 'Failed to delete note.', 'error');
      }
    } catch {
      showToast('Error deleting note.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveScratchpad = async () => {
    setSavingScratchpad(true);
    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_scratchpad', scratchpad }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setScratchpadSavedNotice(true);
        setTimeout(() => setScratchpadSavedNotice(false), 2500);
        showToast('Scratchpad saved successfully.', 'success');
      } else {
        showToast(data.error || 'Failed to save scratchpad.', 'error');
      }
    } catch {
      showToast('Failed to save scratchpad.', 'error');
    } finally {
      setSavingScratchpad(false);
    }
  };

  const handleCopyNoteText = (text, id) => {
    if (!text) {
      showToast('Note is empty.', 'info');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedNoteId(id);
    setTimeout(() => setCopiedNoteId(null), 2000);
    showToast('Copied to clipboard!', 'success');
  };

  const handleDownloadNoteFile = (note) => {
    const title = (note.title || 'Note').replace(/[^a-z0-9_\-\s]/gi, '_');
    const content = `Title: ${note.title || 'Untitled'}\nCategory: ${note.category || 'General'}\nDate: ${new Date().toLocaleString()}\n----------------------------------------\n\n${note.content || ''}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Note downloaded as text file.', 'success');
  };

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

  // Update Plan with Full Duration & Dates Management
  const handleUpdatePlan = async () => {
    if (!planModalUser) return;
    setActionLoadingId(`plan_${planModalUser._id}`);
    try {
      const res = await fetch(`/api/admin/users/${planModalUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_plan',
          plan: selectedPlan,
          billingCycle: planBillingCycle,
          planUpdatedAt: planStartDate ? new Date(planStartDate).toISOString() : new Date().toISOString(),
          planExpiresAt: planEndDate ? new Date(planEndDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === planModalUser._id
              ? {
                  ...u,
                  plan: selectedPlan,
                  planUpdatedAt: planStartDate ? new Date(planStartDate).toISOString() : u.planUpdatedAt,
                  planExpiresAt: planEndDate ? new Date(planEndDate).toISOString() : u.planExpiresAt,
                }
              : u
          )
        );
        showToast(`Plan successfully updated to ${selectedPlan.toUpperCase()} with active validity!`, 'success');
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

  // Update Profile Score & Total Replies (Admin Controlled)
  const handleUpdateMetrics = async (e) => {
    e?.preventDefault();
    if (!metricsModalUser) return;
    const scoreNum = Math.min(100, Math.max(0, parseInt(scoreInput, 10) || 0));
    const repliesNum = Math.max(0, parseInt(totalRepliesInput, 10) || 0);

    setActionLoadingId(`metrics_${metricsModalUser._id}`);
    try {
      const res = await fetch(`/api/admin/users/${metricsModalUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_metrics',
          profileScore: scoreNum,
          totalReplies: repliesNum,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === metricsModalUser._id
              ? { ...u, profileScore: scoreNum, totalReplies: repliesNum }
              : u
          )
        );
        showToast(`Score & total replies updated for ${metricsModalUser.businessName}!`, 'success');
        setMetricsModalUser(null);
      } else {
        showToast(data.error || 'Failed to update metrics.', 'error');
      }
    } catch (err) {
      showToast('Error updating metrics.', 'error');
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

  // Save Subscription Plan Pricing & Features
  const handleSavePricing = async (e) => {
    e?.preventDefault();
    setSavingPricing(true);
    try {
      const normalizeFeatures = (feat) => {
        if (Array.isArray(feat)) return feat.map((f) => String(f).trim()).filter(Boolean);
        if (typeof feat === 'string') return feat.split('\n').map((f) => f.trim()).filter(Boolean);
        return [];
      };

      const payload = {
        pricing: {
          currency: settings.pricing?.currency || '₹',
          starter: {
            monthly: Number(settings.pricing?.starter?.monthly) || 0,
            yearly: Number(settings.pricing?.starter?.yearly) || 0,
            features: normalizeFeatures(settings.pricing?.starter?.features),
          },
          pro: {
            monthly: Number(settings.pricing?.pro?.monthly) || 0,
            yearly: Number(settings.pricing?.pro?.yearly) || 0,
            features: normalizeFeatures(settings.pricing?.pro?.features),
          },
          enterprise: {
            monthly: Number(settings.pricing?.enterprise?.monthly) || 0,
            yearly: Number(settings.pricing?.enterprise?.yearly) || 0,
            features: normalizeFeatures(settings.pricing?.enterprise?.features),
          },
        },
      };

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.settings?.pricing) {
          setSettings((prev) => ({
            ...prev,
            pricing: data.settings.pricing,
          }));
        }
        showToast('Subscription plan pricing and features saved successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to update plan pricing.', 'error');
      }
    } catch (err) {
      showToast('Error saving pricing to server.', 'error');
    } finally {
      setSavingPricing(false);
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

  // Save FamGateway UPI Payment Gateway Settings
  const handleSaveFamGateway = async (e) => {
    e?.preventDefault();
    setSavingFamGateway(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          famgateway: {
            enabled: settings.famgateway?.enabled !== false,
            apiKey: settings.famgateway?.apiKey ? settings.famgateway.apiKey.trim() : '',
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.settings?.famgateway) {
          setSettings((prev) => ({
            ...prev,
            famgateway: data.settings.famgateway,
          }));
        }
        showToast('FamGateway payment gateway credentials saved successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to save FamGateway credentials.', 'error');
      }
    } catch (err) {
      showToast('Error saving FamGateway settings to server.', 'error');
    } finally {
      setSavingFamGateway(false);
    }
  };

  // Test FamGateway API Key Handshake
  const handleTestFamGateway = async () => {
    if (!settings.famgateway?.apiKey?.trim()) {
      showToast('Please enter your FamGateway API Key first.', 'warning');
      return;
    }
    setTestingFamGateway(true);
    setFamGatewayTestResult(null);
    try {
      const res = await fetch('/api/admin/settings/test-famgateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: settings.famgateway?.apiKey?.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFamGatewayTestResult({ success: true, message: data.message });
        showToast('FamGateway API Key verified successfully!', 'success');
      } else {
        setFamGatewayTestResult({ success: false, message: data.error || 'Authentication failed.' });
        showToast(data.error || 'Failed to verify FamGateway API key.', 'error');
      }
    } catch (err) {
      setFamGatewayTestResult({ success: false, message: 'Network error connecting to FamGateway.' });
      showToast('Network error while testing FamGateway API key.', 'error');
    } finally {
      setTestingFamGateway(false);
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

  const filteredNotes = notes
    .filter((n) => {
      const q = noteSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.content && n.content.toLowerCase().includes(q));
      const matchesCategory =
        noteCategoryFilter === 'All' || (n.category || 'General') === noteCategoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
    });

  const wordCount = (noteForm.content || '').trim() ? (noteForm.content || '').trim().split(/\s+/).length : 0;
  const charCount = (noteForm.content || '').length;

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
          <button
            onClick={() => setActiveTab('notepad')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'notepad'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Notepad</span>
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
            <div className="text-[11px] text-stone-500 mt-0.5">Verified active accounts</div>
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
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
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
                      <th className="py-3 px-4">Score & SLA</th>
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

                          {/* Contact Info & Password */}
                          <td className="py-3.5 px-4 text-xs text-stone-600">
                            <div className="font-medium text-stone-900">{u.email}</div>
                            <div className="text-stone-500 mt-0.5">{u.phone || 'No phone provided'}</div>
                            {/* Password Reveal Button for Admin */}
                            <div className="flex items-center space-x-1.5 mt-1.5">
                              <span className="font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded border border-stone-200 select-all font-semibold text-stone-700">
                                {visiblePasswords[u._id] ? (u.password || 'Encrypted') : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setVisiblePasswords((prev) => ({ ...prev, [u._id]: !prev[u._id] }))}
                                className="inline-flex items-center space-x-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-stone-100 hover:bg-purple-100 text-stone-600 hover:text-purple-700 border border-stone-200 transition cursor-pointer"
                                title={visiblePasswords[u._id] ? 'Hide password' : 'Show user password'}
                              >
                                {visiblePasswords[u._id] ? (
                                  <>
                                    <EyeOff className="w-3 h-3" />
                                    <span>Hide</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    <span>Show Password</span>
                                  </>
                                )}
                              </button>
                              {visiblePasswords[u._id] && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(u.password || '');
                                    showToast('User password copied!', 'success');
                                  }}
                                  className="p-1 text-stone-400 hover:text-purple-600 rounded transition cursor-pointer"
                                  title="Copy password"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Subscription Plan & Duration */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1.5">
                                <span
                                  className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md border ${planConfig.bg} ${planConfig.text} ${planConfig.border}`}
                                >
                                  {planConfig.label}
                                </span>
                                <button
                                  onClick={() => openPlanModal(u)}
                                  className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition shadow-2xs cursor-pointer"
                                  title="Manage subscription plan, cycle & dates"
                                >
                                  <Pencil className="w-3 h-3 text-purple-600" />
                                  <span>Manage</span>
                                </button>
                              </div>

                              <div className="text-[11px] font-medium">
                                {u.plan === 'free' ? (
                                  <span className="text-stone-400">Free / Inactive</span>
                                ) : u.planExpiresAt && new Date(u.planExpiresAt) < new Date() ? (
                                  <span className="text-red-600 font-semibold flex items-center space-x-1">
                                    <Clock className="w-3 h-3 shrink-0" />
                                    <span>Expired {new Date(u.planExpiresAt).toLocaleDateString()}</span>
                                  </span>
                                ) : u.planExpiresAt ? (
                                  <span className="text-emerald-700 flex items-center space-x-1">
                                    <Calendar className="w-3 h-3 shrink-0 text-emerald-600" />
                                    <span>Valid till {new Date(u.planExpiresAt).toLocaleDateString()}</span>
                                  </span>
                                ) : (
                                  <span className="text-stone-500">30-day standard</span>
                                )}
                              </div>
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

                          {/* Score & Reply SLA (Admin Controlled) */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2">
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {u.profileScore !== undefined && u.profileScore !== null ? u.profileScore : 94}/100
                                  </span>
                                </div>
                                <div className="text-[11px] text-stone-500 flex items-center space-x-1 mt-1 font-medium">
                                  <MessageSquareCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span className="truncate max-w-[130px]">{u.totalReplies !== undefined ? u.totalReplies : 0} Replied</span>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setMetricsModalUser(u);
                                  setScoreInput(u.profileScore !== undefined && u.profileScore !== null ? u.profileScore : 94);
                                  setTotalRepliesInput(u.totalReplies !== undefined ? u.totalReplies : 0);
                                }}
                                className="inline-flex items-center p-1.5 text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition shadow-2xs cursor-pointer"
                                title="Update Score & Total Replies"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* Edit Score & Total Replies */}
                              <button
                                onClick={() => {
                                  setMetricsModalUser(u);
                                  setScoreInput(u.profileScore !== undefined && u.profileScore !== null ? u.profileScore : 94);
                                  setTotalRepliesInput(u.totalReplies !== undefined ? u.totalReplies : 0);
                                }}
                                className="p-1.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition cursor-pointer"
                                title="Edit Profile Score & Total Replies"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                              </button>

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

          {/* CARD 2: SUBSCRIPTION PLAN PRICING & FEATURES */}
          <form onSubmit={handleSavePricing} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">
                    Subscription Plan Pricing & Features
                  </h2>
                  <p className="text-xs text-stone-500">
                    Configure live customer pricing and included feature checklists displayed across the platform
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
                Plans & Features
              </span>
            </div>

            {/* Price Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Plan 1: Starter */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <h3 className="text-sm font-bold text-stone-900">Starter Plan</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    Tier 1
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Monthly Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-semibold">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={settings.pricing?.starter?.monthly ?? 499}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              starter: {
                                ...settings.pricing?.starter,
                                monthly: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Yearly Price (₹/mo)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-semibold">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={settings.pricing?.starter?.yearly ?? 399}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              starter: {
                                ...settings.pricing?.starter,
                                yearly: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-stone-200/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-stone-700">Features Included</label>
                      <span className="text-[10px] text-stone-400">1 per line</span>
                    </div>
                    <textarea
                      rows={6}
                      value={Array.isArray(settings.pricing?.starter?.features) ? settings.pricing.starter.features.join('\n') : (settings.pricing?.starter?.features || '')}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricing: {
                            ...settings.pricing,
                            starter: {
                              ...settings.pricing?.starter,
                              features: e.target.value.split('\n'),
                            },
                          },
                        })
                      }
                      placeholder="Single Business Profile connection&#10;Standard QR Code Stand generation..."
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Plan 2: Pro */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                    <h3 className="text-sm font-bold text-purple-900">Pro Plan</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                    Tier 2 (Popular)
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Monthly Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-semibold">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={settings.pricing?.pro?.monthly ?? 999}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              pro: {
                                ...settings.pricing?.pro,
                                monthly: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Yearly Price (₹/mo)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-semibold">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={settings.pricing?.pro?.yearly ?? 849}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              pro: {
                                ...settings.pricing?.pro,
                                yearly: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-stone-200/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-stone-700">Features Included</label>
                      <span className="text-[10px] text-stone-400">1 per line</span>
                    </div>
                    <textarea
                      rows={6}
                      value={Array.isArray(settings.pricing?.pro?.features) ? settings.pricing.pro.features.join('\n') : (settings.pricing?.pro?.features || '')}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricing: {
                            ...settings.pricing,
                            pro: {
                              ...settings.pricing?.pro,
                              features: e.target.value.split('\n'),
                            },
                          },
                        })
                      }
                      placeholder="Everything in Starter, plus:&#10;Custom Branded QR Stands..."
                      className="w-full px-3 py-2 text-xs bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Plan 3: Ultra Enterprise */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                    <h3 className="text-sm font-bold text-amber-900">Ultra Enterprise</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    Tier 3
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Monthly Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-semibold">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={settings.pricing?.enterprise?.monthly ?? 2499}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              enterprise: {
                                ...settings.pricing?.enterprise,
                                monthly: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">Yearly Price (₹/mo)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-semibold">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={settings.pricing?.enterprise?.yearly ?? 1999}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              enterprise: {
                                ...settings.pricing?.enterprise,
                                yearly: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-stone-200/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-stone-700">Features Included</label>
                      <span className="text-[10px] text-stone-400">1 per line</span>
                    </div>
                    <textarea
                      rows={6}
                      value={Array.isArray(settings.pricing?.enterprise?.features) ? settings.pricing.enterprise.features.join('\n') : (settings.pricing?.enterprise?.features || '')}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricing: {
                            ...settings.pricing,
                            enterprise: {
                              ...settings.pricing?.enterprise,
                              features: e.target.value.split('\n'),
                            },
                          },
                        })
                      }
                      placeholder="Everything in Pro, plus:&#10;Multi-location dashboard..."
                      className="w-full px-3 py-2 text-xs bg-white border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informational Callout */}
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>System Notice:</strong> Plan prices and feature checklists are fully customizable from this control center. Saving updates will immediately synchronize customer-facing plan cards and pricing pages.
              </span>
            </div>

            {/* Save Button */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingPricing}
                className="inline-flex items-center space-x-2 px-6 py-2.5 text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {savingPricing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Save Plans & Features</span>
              </button>
            </div>
          </form>

          {/* CARD 3: GMAIL API & SMTP CONFIGURATION */}
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

          {/* CARD 4: FAMGATEWAY ZERO-FEE UPI PAYMENT GATEWAY */}
          <form onSubmit={handleSaveFamGateway} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-stone-100 pb-4 gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center space-x-2">
                    <span>FamGateway UPI Payment Gateway</span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                      0% Fee Peer-to-Peer
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    Automate instant, non-custodial UPI subscription collections with real-time IMAP bank verification
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                  Payments Engine
                </span>
              </div>
            </div>

            {/* Active Toggle & Credentials */}
            <div className="space-y-4">
              {/* Enable Gateway Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-stone-900">
                    Enable FamGateway Live Payment Processing
                  </label>
                  <p className="text-[11px] text-stone-500">
                    When enabled, users on the Plans page can pay directly using dynamic UPI QR codes and instant deep links.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.famgateway?.enabled ?? false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        famgateway: {
                          ...settings.famgateway,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* FamGateway API Key */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">
                    FamGateway Master API Key <span className="text-red-500">*</span>
                  </label>
                  <a
                    href="https://famgateway.in/api-keys.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium inline-flex items-center space-x-1"
                  >
                    <span>Get API Key from FamGateway Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showFamGatewayKey ? 'text' : 'password'}
                    required
                    value={settings.famgateway?.apiKey || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        famgateway: {
                          ...settings.famgateway,
                          apiKey: e.target.value,
                        },
                      })
                    }
                    placeholder="fam_xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono text-stone-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFamGatewayKey(!showFamGatewayKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showFamGatewayKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500">
                  Your API Key is kept safe and server-isolated. It is also used as the cryptographic secret to verify HMAC-SHA256 signatures for incoming payment webhooks.
                </p>
              </div>

              {/* Webhook Configuration Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">
                    Your Webhook Listener URL (Instant Server-to-Server Payment Callback)
                  </label>
                  <a
                    href="https://famgateway.in/webhooks.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium inline-flex items-center space-x-1"
                  >
                    <span>FamGateway Webhook Settings</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/webhooks/famgateway`}
                    className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-lg text-stone-700 font-mono select-all focus:outline-none cursor-default"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/webhooks/famgateway`;
                      navigator.clipboard.writeText(url);
                      setCopiedWebhook(true);
                      showToast('Webhook URL copied to clipboard!', 'success');
                      setTimeout(() => setCopiedWebhook(false), 2000);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition shadow-2xs cursor-pointer shrink-0"
                  >
                    {copiedWebhook ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-500" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500">
                  Register this URL in your FamGateway dashboard with event <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">payment.success</code> to receive instant sub-150ms verification callbacks.
                </p>
              </div>

              {/* Informational Guidance Callout */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1.5">
                <div className="font-semibold flex items-center space-x-1.5 text-blue-800">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>FamGateway UPI Architecture & Advantages:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-900/90 text-[11px] pt-1">
                  <div className="flex items-start space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                    <span><strong>100% Non-Custodial:</strong> Customer funds settle instantly into your personal FamPay UPI wallet with zero third-party holding delays.</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                    <span><strong>Zero Transaction Cuts (0% MDR):</strong> Keep 100% of your subscription revenue without intermediate percentage fees.</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                    <span><strong>Concurrency Engine 2.0 (ACE):</strong> Eliminates collisions through adaptive micro-paisa shield and bank UTR idempotency deduplication.</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                    <span><strong>Bank-Grade PDF Receipts:</strong> Official GST & MSME certified receipts automatically compile for every customer transaction.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Connection Button & Result Alert */}
            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTestFamGateway}
                disabled={testingFamGateway || !settings.famgateway?.apiKey}
                className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition disabled:opacity-50 cursor-pointer shrink-0"
              >
                {testingFamGateway ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>Test Gateway Handshake</span>
              </button>

              {famGatewayTestResult && (
                <div
                  className={`text-xs px-3.5 py-2 rounded-lg border flex items-center space-x-2 ${
                    famGatewayTestResult.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  {famGatewayTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span className="truncate max-w-md">{famGatewayTestResult.message}</span>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingFamGateway}
                className="inline-flex items-center space-x-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {savingFamGateway ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Save FamGateway Credentials</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ADMIN NOTEPAD */}
      {activeTab === 'notepad' && (
        <div className="space-y-6">
          {/* Notepad Header Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span>Administrative Notepad</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
                  </span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Securely store credentials, client remarks, system tokens, tasks, and administrative scratch records synced with the database.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleNewNote}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Note</span>
              </button>
            </div>
          </div>

          {/* Main Dual-Pane Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Note Directory (5 Cols on LG) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={noteSearch}
                    onChange={(e) => setNoteSearch(e.target.value)}
                    placeholder="Search notes by title or content..."
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                  />
                  {noteSearch && (
                    <button
                      type="button"
                      onClick={() => setNoteSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {['All', 'General', 'Credentials', 'Tasks', 'Customer Notes', 'Ideas'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNoteCategoryFilter(cat)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                        noteCategoryFilter === cat
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                {loadingNotes ? (
                  <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-3">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
                    <p className="text-xs text-stone-500 font-medium">Loading saved notes from database...</p>
                  </div>
                ) : filteredNotes.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                      <StickyNote className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-800">No notes found</h4>
                      <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                        {noteSearch || noteCategoryFilter !== 'All'
                          ? 'No notes match your active search or category filters.'
                          : 'Your admin notepad is currently empty. Start drafting your first note.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleNewNote}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create First Note</span>
                    </button>
                  </div>
                ) : (
                  filteredNotes.map((item) => {
                    const isSelected = selectedNoteId === item.id;
                    const previewText = (item.content || '').replace(/\s+/g, ' ').trim();
                    const categoryColors = {
                      General: 'bg-stone-100 text-stone-700 border-stone-200',
                      Credentials: 'bg-rose-50 text-rose-700 border-rose-200',
                      Tasks: 'bg-blue-50 text-blue-700 border-blue-200',
                      'Customer Notes': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      Ideas: 'bg-amber-50 text-amber-700 border-amber-200',
                    };
                    const badgeClass = categoryColors[item.category] || categoryColors.General;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectNote(item)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'bg-purple-50/60 border-purple-400 shadow-sm ring-1 ring-purple-300'
                            : 'bg-white border-stone-200 hover:border-purple-200 hover:bg-stone-50/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2 min-w-0">
                            {item.isPinned && (
                              <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                            )}
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                              {item.title || 'Untitled Note'}
                            </h4>
                          </div>

                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${badgeClass}`}>
                            {item.category || 'General'}
                          </span>
                        </div>

                        <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                          {previewText || <span className="italic text-stone-400">Empty note body</span>}
                        </p>

                        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-stone-100 text-[11px] text-stone-400">
                          <span>
                            {item.updatedAt
                              ? new Date(item.updatedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Recently'}
                          </span>

                          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => handleTogglePinNote(item.id, e)}
                              className={`p-1 rounded hover:bg-stone-200 transition cursor-pointer ${
                                item.isPinned ? 'text-amber-500' : 'text-stone-400 hover:text-stone-600'
                              }`}
                              title={item.isPinned ? 'Unpin note' : 'Pin note to top'}
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyNoteText(item.content, item.id)}
                              className="p-1 rounded text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition cursor-pointer"
                              title="Copy content"
                            >
                              {copiedNoteId === item.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteNoteModal({
                                  isOpen: true,
                                  noteId: item.id,
                                  noteTitle: item.title || 'Untitled Note',
                                })
                              }
                              className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              title="Delete note"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Note Editor Workspace (7 Cols on LG) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                {/* Note Editor Header */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-100 pb-3.5">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Note Title (e.g. Server Access Keys, Client Meeting Details)..."
                      className="w-full text-base sm:text-lg font-bold text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-0 border-none p-0 bg-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <select
                      value={noteForm.category}
                      onChange={(e) => setNoteForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    >
                      <option value="General">General</option>
                      <option value="Credentials">Credentials</option>
                      <option value="Tasks">Tasks</option>
                      <option value="Customer Notes">Customer Notes</option>
                      <option value="Ideas">Ideas</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setNoteForm((prev) => ({ ...prev, isPinned: !prev.isPinned }))}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        noteForm.isPinned
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'bg-stone-50 text-stone-400 border-stone-200 hover:text-stone-700'
                      }`}
                      title={noteForm.isPinned ? 'Note is pinned to top' : 'Pin note to top'}
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveNote}
                      disabled={savingNote}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition cursor-pointer disabled:opacity-50"
                    >
                      {savingNote ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>{savingNote ? 'Saving...' : 'Save Note'}</span>
                    </button>
                  </div>
                </div>

                {/* Textarea Editor */}
                <div className="relative">
                  <textarea
                    rows={15}
                    value={noteForm.content}
                    onChange={(e) => setNoteForm((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Type or paste your notes here... You can store confidential passwords, API tokens, customer follow-up notes, to-do lists, or draft messages."
                    className="w-full p-3.5 text-xs sm:text-sm text-stone-800 bg-stone-50/70 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition leading-relaxed resize-y font-mono sm:font-sans"
                  />
                </div>

                {/* Editor Bottom Status & Action Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs text-stone-500 border-t border-stone-100">
                  <div className="flex items-center space-x-4">
                    <span>
                      <strong>{wordCount}</strong> {wordCount === 1 ? 'word' : 'words'}
                    </span>
                    <span>
                      <strong>{charCount}</strong> characters
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleCopyNoteText(noteForm.content, noteForm.id || 'editor')}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition cursor-pointer"
                      title="Copy note content"
                    >
                      {copiedNoteId === (noteForm.id || 'editor') ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadNoteFile(noteForm)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition cursor-pointer"
                      title="Download as text file (.txt)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .txt</span>
                    </button>

                    {noteForm.id && (
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteNoteModal({
                            isOpen: true,
                            noteId: noteForm.id,
                            noteTitle: noteForm.title || 'Untitled Note',
                          })
                        }
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Instant Scratchpad Card */}
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <StickyNote className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                      Instant Cloud Scratchpad
                    </h3>
                  </div>
                  {scratchpadSavedNotice && (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved to Database
                    </span>
                  )}
                </div>

                <p className="text-xs text-amber-800/80">
                  Quick scratch workspace for rapid notes, one-liners, temporary links, or transient info without creating a formal document.
                </p>

                <textarea
                  rows={4}
                  value={scratchpad}
                  onChange={(e) => setScratchpad(e.target.value)}
                  placeholder="Type temporary scratch notes here..."
                  className="w-full p-3 text-xs sm:text-sm bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-mono text-stone-800"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-amber-800/70">
                    Auto-saved to cloud when you click Save Scratchpad
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveScratchpad}
                    disabled={savingScratchpad}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {savingScratchpad ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{savingScratchpad ? 'Saving...' : 'Save Scratchpad'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED PLAN MANAGEMENT MODAL */}
      {planModalUser && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Subscription Plan Management</h3>
                  <p className="text-xs text-stone-500">Configure tier, billing duration, and active dates</p>
                </div>
              </div>
              <button
                onClick={() => setPlanModalUser(null)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Target Account Identity */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-center justify-between">
              <div>
                <span className="text-stone-500">Account: </span>
                <strong className="text-stone-900">{planModalUser.businessName}</strong>
                <span className="text-stone-500 ml-1">({planModalUser.email})</span>
              </div>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-stone-200">
                /{planModalUser.slug}
              </span>
            </div>

            {/* Step 1: Select Plan Tier */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                1. Select Subscription Tier
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'starter', label: 'Starter', desc: 'Standard review QR, questions, analytics', color: 'border-blue-500 bg-blue-50/40 text-blue-800' },
                  { id: 'pro', label: 'Growth Pro', desc: 'AI reviews, priority ranking badges', color: 'border-purple-500 bg-purple-50/40 text-purple-800' },
                  { id: 'enterprise', label: 'Enterprise', desc: 'Full custom features & top support', color: 'border-amber-500 bg-amber-50/40 text-amber-800' },
                  { id: 'free', label: 'Free (Inactive)', desc: 'No active plan • Review page restricted', color: 'border-stone-400 bg-stone-100/60 text-stone-800' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlan(item.id);
                      if (item.id === 'free') {
                        handleApplyPresetDuration('expired');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      selectedPlan === item.id
                        ? `${item.color} ring-2 ring-purple-600 shadow-2xs font-semibold`
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        selectedPlan === item.id ? 'border-purple-600 bg-purple-600' : 'border-stone-300'
                      }`}>
                        {selectedPlan === item.id && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1 leading-snug">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Duration Presets */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  2. Billing Duration &amp; Cycle
                </label>
                <span className="text-[11px] text-purple-700 font-medium">Quick Presets</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPresetDuration('monthly')}
                  className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-center transition cursor-pointer ${
                    planBillingCycle === 'monthly'
                      ? 'border-purple-600 bg-purple-600 text-white shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Monthly (+30 Days)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetDuration('yearly')}
                  className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-center transition cursor-pointer ${
                    planBillingCycle === 'yearly'
                      ? 'border-purple-600 bg-purple-600 text-white shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Yearly (+365 Days)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetDuration('expired')}
                  className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-center transition cursor-pointer ${
                    planBillingCycle === 'expired'
                      ? 'border-red-600 bg-red-600 text-white shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Mark Expired
                </button>
              </div>
            </div>

            {/* Step 3: Explicit Start Date & End Date Editor */}
            <div className="space-y-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                <span>3. Subscription Validity Dates</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Starting Date */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Starting Date (Plan Activated)
                  </label>
                  <input
                    type="date"
                    required
                    value={planStartDate}
                    onChange={(e) => setPlanStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-stone-800"
                  />
                </div>

                {/* Ending Date */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Ending Date (Expiration)
                  </label>
                  <input
                    type="date"
                    required
                    value={planEndDate}
                    onChange={(e) => {
                      setPlanEndDate(e.target.value);
                      setPlanBillingCycle('custom');
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-stone-800"
                  />
                </div>
              </div>

              {/* Status Preview */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-200">
                <span className="text-stone-500">Live Status:</span>
                {planEndDate && new Date(planEndDate) > new Date() && selectedPlan !== 'free' ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>
                      Active ({Math.ceil((new Date(planEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Days Left)
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    <span>Expired / Inactive Review Page</span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100">
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
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {actionLoadingId === `plan_${planModalUser._id}` && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Save &amp; Apply Plan Dates</span>
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

      {/* METRICS & SLA MODAL (SCORE & REPLY TIME) */}
      {metricsModalUser && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center space-x-3 border-b border-stone-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-stone-900 text-base">
                  Update Profile Score &amp; Total Replies
                </h3>
                <p className="text-xs text-stone-500 truncate">
                  {metricsModalUser.businessName} ({metricsModalUser.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMetricsModalUser(null)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateMetrics} className="space-y-4">
              {/* Profile Score (0-100) */}
              <div className="space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-purple-600" />
                    <span>Profile Performance Score (0 – 100)</span>
                  </label>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border ${
                        Number(scoreInput) >= 90
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : Number(scoreInput) >= 75
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : Number(scoreInput) >= 50
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {Number(scoreInput) >= 90
                        ? 'Excellent (Top 5%)'
                        : Number(scoreInput) >= 75
                        ? 'Optimal Ranking'
                        : Number(scoreInput) >= 50
                        ? 'Average'
                        : 'Needs Attention'}
                    </span>
                    <span className="text-sm font-extrabold text-stone-900 bg-white px-2.5 py-0.5 rounded-lg border border-stone-300">
                      {scoreInput} / 100
                    </span>
                  </div>
                </div>

                {/* Range Slider and Number Input */}
                <div className="flex items-center space-x-3 pt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(Number(e.target.value))}
                    className="flex-1 accent-purple-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scoreInput}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (isNaN(val)) setScoreInput(0);
                      else setScoreInput(Math.min(100, Math.max(0, val)));
                    }}
                    className="w-16 px-2.5 py-1 text-center font-bold text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Quick Score Presets */}
                <div className="flex items-center flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-stone-500 font-medium mr-1">Presets:</span>
                  {[85, 90, 94, 96, 98, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setScoreInput(val)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded transition cursor-pointer ${
                        Number(scoreInput) === val
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Reviews Replied */}
              <div className="space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1.5">
                    <MessageSquareCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Total Reviews Replied</span>
                  </label>
                  <span className="text-[11px] text-stone-500">Google Business Metric</span>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="0"
                    required
                    value={totalRepliesInput}
                    onChange={(e) => setTotalRepliesInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm font-semibold bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Quick Reply Count Presets */}
                <div className="flex items-center flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-stone-500 font-medium mr-1">Quick Select:</span>
                  {[0, 15, 30, 48, 75, 120, 250].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTotalRepliesInput(preset)}
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded transition cursor-pointer ${
                        Number(totalRepliesInput) === preset
                          ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                          : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Informational SLA Hint */}
              <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-[11px] text-purple-900 leading-relaxed flex items-start space-x-2">
                <Zap className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  These values are controlled strictly by administrators and displayed directly on the user&apos;s live dashboard under <strong>Performance &amp; Response Metrics</strong>.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setMetricsModalUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId === `metrics_${metricsModalUser._id}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition cursor-pointer"
                >
                  {actionLoadingId === `metrics_${metricsModalUser._id}` && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>Save Business Metrics</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE NOTE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={deleteNoteModal.isOpen}
        title="Delete Administrative Note?"
        message={`Are you sure you want to permanently delete "${deleteNoteModal.noteTitle || 'this note'}"? This action cannot be reversed.`}
        confirmText="Delete Note"
        cancelText="Cancel"
        isDestructive={true}
        loading={actionLoadingId === 'delete_note'}
        onConfirm={handleDeleteNoteConfirm}
        onCancel={() => setDeleteNoteModal({ isOpen: false, noteId: null, noteTitle: '' })}
      />
    </div>
  );
}
