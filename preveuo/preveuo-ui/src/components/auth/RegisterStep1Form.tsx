import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Checkbox } from '@/components/ui';
import { RegisterStep1Data } from '@/types/auth';
import { ChevronRight } from 'lucide-react';

interface RegisterStep1FormProps {
  initialData: RegisterStep1Data;
  onNext: (data: RegisterStep1Data) => void;
}

export const RegisterStep1Form: React.FC<RegisterStep1FormProps> = ({
  initialData,
  onNext,
}) => {
  const [formData, setFormData] = useState<RegisterStep1Data>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Valid work email is required';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms of Service';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full name"
        placeholder="Sarah Jenkins"
        value={formData.fullName}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, fullName: e.target.value }));
          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
        }}
        error={errors.fullName}
        required
      />

      <Input
        label="Work email"
        type="email"
        placeholder="sarah@company.com"
        value={formData.email}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, email: e.target.value }));
          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
        }}
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        isPassword
        placeholder="At least 8 characters"
        value={formData.password}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, password: e.target.value }));
          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
        }}
        error={errors.password}
        helperText="Must contain at least 8 characters."
        required
      />

      <div className="pt-1">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={formData.agreedToTerms}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, agreedToTerms: e.target.checked }));
            if (errors.agreedToTerms) setErrors((prev) => ({ ...prev, agreedToTerms: '' }));
          }}
          error={errors.agreedToTerms}
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          Continue to Workspace Setup
        </Button>
      </div>
    </form>
  );
};
