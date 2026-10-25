import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { RegisterStep2WorkspaceData } from '@/types/auth';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface RegisterStep2WorkspaceFormProps {
  initialData: RegisterStep2WorkspaceData;
  onBack: () => void;
  onSubmit: (data: RegisterStep2WorkspaceData) => void;
  isLoading: boolean;
  serverError?: string | null;
}

export const RegisterStep2WorkspaceForm: React.FC<RegisterStep2WorkspaceFormProps> = ({
  initialData,
  onBack,
  onSubmit,
  isLoading,
  serverError,
}) => {
  const [formData, setFormData] = useState<RegisterStep2WorkspaceData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    setFormData((prev) => ({
      ...prev,
      workspaceName: val,
      workspaceSlug: slug,
    }));
    if (errors.workspaceName) setErrors((prev) => ({ ...prev, workspaceName: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.workspaceName.trim()) newErrors.workspaceName = 'Workspace name is required';
    if (!formData.workspaceSlug.trim()) newErrors.workspaceSlug = 'Workspace URL is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{serverError}</span>
        </div>
      )}

      <Input
        label="Workspace name"
        placeholder="Acme Corp"
        value={formData.workspaceName}
        onChange={handleNameChange}
        error={errors.workspaceName}
        required
      />

      <div>
        <Input
          label="Workspace URL"
          placeholder="acme-corp"
          value={formData.workspaceSlug}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              workspaceSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
            }));
            if (errors.workspaceSlug) setErrors((prev) => ({ ...prev, workspaceSlug: '' }));
          }}
          leftIcon={<span className="text-xs text-gray-400 font-mono">preveuo.com/w/</span>}
          error={errors.workspaceSlug}
          required
        />
        <p className="text-[11.5px] text-body mt-1 font-mono">
          Live domain: preveuo.com/w/{formData.workspaceSlug || 'your-slug'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Your role"
          value={formData.role}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, role: e.target.value }));
            if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
          }}
          error={errors.role}
          options={[
            { value: '', label: 'Select your role' },
            { value: 'product-manager', label: 'Product Manager' },
            { value: 'product-marketing', label: 'Product Marketing' },
            { value: 'sales-engineer', label: 'Sales / Solutions Eng' },
            { value: 'founder', label: 'Founder / Executive' },
            { value: 'customer-success', label: 'Customer Success' },
          ]}
          required
        />

        <Select
          label="Team size"
          value={formData.teamSize}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              teamSize: e.target.value as RegisterStep2WorkspaceData['teamSize'],
            }))
          }
          options={[
            { value: '1-10', label: '1 - 10 employees' },
            { value: '11-50', label: '11 - 50 employees' },
            { value: '51-200', label: '51 - 200 employees' },
            { value: '201+', label: '201+ employees' },
          ]}
        />
      </div>

      <Select
        label="Primary use case"
        value={formData.primaryGoal}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            primaryGoal: e.target.value as RegisterStep2WorkspaceData['primaryGoal'],
          }))
        }
        options={[
          { value: 'sales', label: 'Sales & Deal Acceleration' },
          { value: 'marketing', label: 'Website Tours & Marketing' },
          { value: 'onboarding', label: 'User Onboarding & Activation' },
          { value: 'support', label: 'Customer Education & Support' },
        ]}
      />

      <div className="flex items-center gap-3 pt-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Create Workspace & Launch
        </Button>
      </div>
    </form>
  );
};
