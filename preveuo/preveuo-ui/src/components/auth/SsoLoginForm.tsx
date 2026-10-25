'use client';

import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { authService } from '@/lib/api/authService';
import { AlertCircle, Sparkles } from 'lucide-react';

interface SsoLoginFormProps {
  onSuccess: (redirectUrl?: string) => void;
}

export const SsoLoginForm: React.FC<SsoLoginFormProps> = ({ onSuccess }) => {
  const [workspaceSlug, setWorkspaceSlug] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fillDemoDomain = () => {
    setWorkspaceSlug('acme-corp');
    setError('');
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!workspaceSlug.trim()) {
      setError('Workspace domain is required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.ssoLogin({
        workspaceSlug: workspaceSlug.trim(),
      });

      if (!response.success) {
        setServerError(response.error || 'Enterprise workspace not found.');
        setIsLoading(false);
        return;
      }

      onSuccess(response.data?.redirectUrl);
    } catch {
      setServerError('Failed to connect to SSO provider. Please verify your domain.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Demo SSO Pill */}
      <div className="p-3 bg-brand-purple/5 border border-brand-purple/20 rounded-xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-heading">
          <Sparkles className="w-4 h-4 text-brand-purple shrink-0" />
          <span>Configured SSO: <strong className="font-semibold text-brand-purple">acme-corp</strong></span>
        </div>
        <button
          type="button"
          onClick={fillDemoDomain}
          className="text-[11px] font-bold text-brand-purple hover:underline bg-white px-2 py-1 rounded-md border border-brand-purple/30 cursor-pointer shadow-2xs"
        >
          Auto-fill
        </button>
      </div>

      {serverError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{serverError}</span>
        </div>
      )}

      <Input
        label="Workspace domain"
        placeholder="your-company"
        value={workspaceSlug}
        onChange={(e) => {
          setWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
          if (error) setError('');
          if (serverError) setServerError(null);
        }}
        rightIcon={<span className="text-[12px] font-mono text-muted">.preveuo.com</span>}
        helperText="Enter your team's workspace slug to authenticate via SAML/Okta SSO."
        error={error}
        required
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          {isLoading ? 'Verifying SSO Identity Provider...' : 'Continue with SSO'}
        </Button>
      </div>
    </form>
  );
};
