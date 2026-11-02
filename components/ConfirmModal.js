'use client';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const isDanger = Boolean(isDestructive || danger);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#dadce0] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start space-x-3">
          <div
            className={`p-2.5 rounded-full ${
              isDanger ? 'bg-[#fce8e6] text-[#d93025]' : 'bg-[#e8f0fe] text-[#1a73e8]'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#202124]">{title}</h3>
            <p className="mt-1 text-sm text-[#5f6368] leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-[#5f6368] hover:text-[#202124] p-1 rounded-full hover:bg-[#f1f3f4] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-[#3c4043] bg-white border border-[#dadce0] rounded-lg hover:bg-[#f8f9fa] transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 ${
              isDanger
                ? 'bg-[#d93025] hover:bg-[#c5221f]'
                : 'bg-[#1a73e8] hover:bg-[#1557b0]'
            }`}
          >
            {loading ? 'Please wait...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
