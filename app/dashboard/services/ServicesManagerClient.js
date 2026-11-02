'use client';
import { useState } from 'react';
import { Plus, Trash2, RotateCcw, Sparkles, Layers, X, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';
import { INDUSTRY_TEMPLATES, DEFAULT_SERVICES } from '@/lib/presets';

export default function ServicesManagerClient({ initialServices }) {
  const { showToast } = useToast();
  const [services, setServices] = useState(initialServices);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const openAddModal = () => {
    setServiceName('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!serviceName.trim()) {
      showToast('Service name is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/business/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: serviceName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add service');

      setServices(data.services);
      showToast('New service added successfully!', 'success');
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    try {
      const res = await fetch(`/api/business/services?id=${serviceToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete service');

      setServices(data.services);
      showToast('Service deleted.', 'info');
      setServiceToDelete(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleApplyPreset = async (presetName, presetList) => {
    try {
      const res = await fetch('/api/business/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: presetList }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply preset');

      setServices(data.services);
      showToast(`Applied ${presetName} template!`, 'success');
      setIsPresetModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#202124]">AI Knowledge Base</h2>
          <p className="text-xs text-[#5f6368] mt-1">
            Manage the services, topics, and keywords AI uses to assist customer reviews.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsPresetModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-[#3c4043] bg-white hover:bg-[#f8f9fa] border border-[#dadce0] rounded-xl transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#5f6368]" />
            <span>Industry Presets</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {services.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#dadce0] google-card-shadow divide-y divide-[#f1f3f4]">
          {services.map((svc) => (
            <div key={svc.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <p className="text-sm font-medium text-[#202124] min-w-0 truncate">{svc.name}</p>
              <button
                type="button"
                onClick={() => setServiceToDelete(svc)}
                title="Delete Service"
                className="p-1.5 text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded-lg transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-[#dadce0]">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f1f3f4] text-[#5f6368] mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#202124]">No services added yet</h3>
          <p className="mt-1 text-xs text-[#5f6368] max-w-sm mx-auto">
            Add a service by name, or apply an industry starter pack.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-3">
            <button
              type="button"
              onClick={() => handleApplyPreset('Default Pack', DEFAULT_SERVICES)}
              className="px-4 py-2 text-xs font-medium text-[#1a73e8] bg-[#e8f0fe] rounded-lg hover:bg-[#d2e3fc]"
            >
              Load Default Options
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1a73e8] rounded-lg hover:bg-[#1557b0]"
            >
              Add First Service
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#dadce0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4]">
              <h3 className="text-base font-bold text-[#202124]">Add Service</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#5f6368] hover:text-[#202124] p-1 rounded-full hover:bg-[#f1f3f4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5f6368] mb-1">
                  Service name
                </label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Teeth Cleaning"
                  className="w-full px-3.5 py-2.5 text-sm text-[#202124] border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div className="pt-3 border-t border-[#f1f3f4] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#3c4043] border border-[#dadce0] rounded-lg hover:bg-[#f8f9fa]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Add Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#dadce0] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#fbbc04]" />
                <h3 className="text-base font-bold text-[#202124]">Load Industry Starter Pack</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPresetModalOpen(false)}
                className="text-[#5f6368] hover:text-[#202124] p-1 rounded-full hover:bg-[#f1f3f4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-[#5f6368] leading-relaxed">
              Choose an industry template to replace your services with a starter list:
            </p>

            <div className="mt-4 space-y-3">
              {Object.entries(INDUSTRY_TEMPLATES).map(([industry, items]) => (
                <div
                  key={industry}
                  className="p-4 border border-[#e8eaed] rounded-xl hover:border-[#1a73e8] hover:bg-[#f8f9fa] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-[#202124]">{industry}</h4>
                    <p className="text-xs text-[#5f6368] mt-0.5">
                      {items.map((it) => it.name).join(' • ')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(industry, items)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#1a73e8] bg-[#e8f0fe] hover:bg-[#d2e3fc] rounded-lg shrink-0 transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              ))}

              <div className="p-4 border border-[#e8eaed] rounded-xl hover:border-[#1a73e8] hover:bg-[#f8f9fa] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-[#202124]">General Business & Retail</h4>
                  <p className="text-xs text-[#5f6368] mt-0.5">
                    {DEFAULT_SERVICES.map((it) => it.name).join(' • ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('General Business', DEFAULT_SERVICES)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#1a73e8] bg-[#e8f0fe] hover:bg-[#d2e3fc] rounded-lg shrink-0 transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(serviceToDelete)}
        title="Delete this service?"
        message={`Are you sure you want to remove "${serviceToDelete?.name}"? Customers will no longer see it on your review page.`}
        confirmText="Delete Service"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setServiceToDelete(null)}
      />
    </div>
  );
}
