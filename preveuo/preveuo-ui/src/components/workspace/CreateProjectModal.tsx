import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { X, Sparkles } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, category: string) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Product Onboarding');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    onCreate(name, category);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border-default relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-heading hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-[17px] font-semibold text-heading tracking-tight">Create Interactive Demo</h3>
          <p className="text-[13px] text-body mt-1 font-normal leading-normal">
            Capture or import workflow steps to produce a self-guided walkthrough.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Demo Name"
            placeholder="e.g. Q3 Analytics Walkthrough"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            error={error}
            required
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'Product Onboarding', label: 'Product Onboarding' },
              { value: 'Sales Enablement', label: 'Sales Enablement' },
              { value: 'Marketing Demos', label: 'Marketing Demos' },
              { value: 'Customer Success', label: 'Customer Success' },
            ]}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-light">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Start Builder
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
