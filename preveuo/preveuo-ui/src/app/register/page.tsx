'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { RegisterStep1Data, RegisterStep2WorkspaceData, RegisterRequestPayload } from '@/types/auth';
import { authService } from '@/lib/api/authService';
import {
  AuthShowcaseSidebar,
  RegisterStep1Form,
  RegisterStep2WorkspaceForm,
} from '@/components/auth';

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const session = authService.getStoredSession();
    if (session) {
      window.location.replace('/workspace');
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  // Step 1: User Account Credentials
  const [accountData, setAccountData] = useState<RegisterStep1Data>({
    fullName: '',
    email: '',
    password: '',
    agreedToTerms: false,
  });

  // Step 2: Multi-Tenant Workspace Configuration
  const [workspaceData, setWorkspaceData] = useState<RegisterStep2WorkspaceData>({
    workspaceName: '',
    workspaceSlug: '',
    role: '',
    teamSize: '11-50',
    primaryGoal: 'sales',
  });

  const handleStep1Complete = (data: RegisterStep1Data) => {
    setAccountData(data);
    // Autofill default workspace name from email domain if possible
    if (!workspaceData.workspaceName && data.email.includes('@')) {
      const domain = data.email.split('@')[1].split('.')[0];
      const capitalized = domain.charAt(0).toUpperCase() + domain.slice(1);
      setWorkspaceData((prev) => ({
        ...prev,
        workspaceName: capitalized,
        workspaceSlug: domain.toLowerCase(),
      }));
    }
    setStep(2);
  };

  const handleStep2Submit = async (data: RegisterStep2WorkspaceData) => {
    setWorkspaceData(data);
    setServerError(null);
    setIsLoading(true);

    try {
      const payload: RegisterRequestPayload = {
        fullName: accountData.fullName,
        email: accountData.email,
        password: accountData.password,
        agreedToTerms: accountData.agreedToTerms,
        workspaceName: data.workspaceName,
        workspaceSlug: data.workspaceSlug,
        role: data.role,
        teamSize: data.teamSize,
        primaryGoal: data.primaryGoal,
      };

      const response = await authService.register(payload);

      if (!response.success) {
        setServerError(response.error || 'Failed to create workspace.');
        setIsLoading(false);
        return;
      }

      window.location.href = response.data?.redirectUrl || `/workspace?slug=${data.workspaceSlug}`;
    } catch {
      setServerError('An unexpected network error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#5B5CE2] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0f0f1a] flex font-sans selection:bg-[#5B5CE2] selection:text-white">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5B5CE2] flex items-center justify-center text-white font-black text-sm shadow-sm">
              P
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#0f0f1a]">
              Preveuo
            </span>
          </Link>
          <span className="text-xs text-[#6b7280]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#5B5CE2] hover:underline">
              Log in
            </Link>
          </span>
        </div>

        {/* Center Container */}
        <div className="max-w-md w-full mx-auto my-auto py-6">
          {/* Stepper Progress Indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 1
                    ? 'bg-[#5B5CE2] text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                1
              </span>
              <span className={`text-xs font-semibold ${step === 1 ? 'text-[#0f0f1a]' : 'text-gray-400'}`}>
                Account
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2
                    ? 'bg-[#5B5CE2] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                2
              </span>
              <span className={`text-xs font-semibold ${step === 2 ? 'text-[#0f0f1a]' : 'text-gray-400'}`}>
                Workspace
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f0f1a]">
              {step === 1 ? 'Start your 14-day free trial' : 'Setup your workspace'}
            </h1>
            <p className="text-sm text-[#6b7280] mt-1.5">
              {step === 1
                ? 'Create your account to start building interactive demos. No credit card required.'
                : 'Configure your company workspace domain and team preferences.'}
            </p>
          </div>

          {/* Social Auth (Only on step 1) */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button variant="social" size="md" fullWidth>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="social" size="md" fullWidth>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e5e7eb]" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                  or sign up with email
                </span>
              </div>
            </>
          )}

          {step === 1 ? (
            <RegisterStep1Form
              initialData={accountData}
              onNext={handleStep1Complete}
            />
          ) : (
            <RegisterStep2WorkspaceForm
              initialData={workspaceData}
              onBack={() => setStep(1)}
              onSubmit={handleStep2Submit}
              isLoading={isLoading}
              serverError={serverError}
            />
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#f0f0f4] flex items-center justify-between text-xs text-[#9ca3af]">
          <span>© 2026 Preveuo Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Showcase Sidebar */}
      <AuthShowcaseSidebar mode="register" />
    </div>
  );
}
