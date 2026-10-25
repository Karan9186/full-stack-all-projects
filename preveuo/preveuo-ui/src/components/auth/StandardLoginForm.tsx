'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Checkbox } from '@/components/ui';
import { authService } from '@/lib/api/authService';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface StandardLoginFormProps {
  onSuccess: (redirectUrl?: string) => void;
}

export const StandardLoginForm: React.FC<StandardLoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fillDemoAccount = () => {
    setEmail('karan@acme.co');
    setPassword('Password123!');
    setServerError(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = 'Email address is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({
        email,
        password,
        rememberMe,
      });

      if (!response.success) {
        setServerError(response.error || 'Invalid credentials. Please try again.');
        setIsLoading(false);
        return;
      }

      onSuccess(response.data?.redirectUrl);
    } catch {
      setServerError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Quick Demo Credentials Pill */}
      <div className="p-3 bg-brand-purple/5 border border-brand-purple/20 rounded-xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-heading">
          <Sparkles className="w-4 h-4 text-brand-purple shrink-0" />
          <span>Demo Account: <strong className="font-semibold text-brand-purple">karan@acme.co</strong></span>
        </div>
        <button
          type="button"
          onClick={fillDemoAccount}
          className="text-[11px] font-bold text-brand-purple hover:underline bg-white px-2 py-1 rounded-md border border-brand-purple/30 cursor-pointer shadow-2xs"
        >
          Auto-fill
        </button>
      </div>

      {/* Server Error Alert Banner */}
      {serverError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{serverError}</span>
        </div>
      )}

      <Input
        label="Work email"
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
          if (serverError) setServerError(null);
        }}
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        isPassword
        placeholder="••••••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
          if (serverError) setServerError(null);
        }}
        error={errors.password}
        required
      />

      <div className="flex items-center justify-between pt-1">
        <Checkbox
          label="Remember this device"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <Link
          href="/contact"
          className="text-[12.5px] font-semibold text-brand-purple hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          {isLoading ? 'Authenticating...' : 'Sign in to Preveuo'}
        </Button>
      </div>
    </form>
  );
};
