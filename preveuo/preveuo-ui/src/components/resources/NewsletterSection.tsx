import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { CheckCircle2, Mail } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <section className="mt-24 rounded-3xl bg-light border border-border-default p-8 sm:p-14 text-center max-w-[900px] mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto mb-5">
        <Mail className="w-6 h-6" />
      </div>
      <h2 className="text-[26px] sm:text-[32px] font-extrabold text-heading tracking-tight mb-3">
        Stories in your inbox
      </h2>
      <p className="text-[14.5px] sm:text-[16px] text-body max-w-[480px] mx-auto mb-8">
        Get bi-weekly teardowns of high-converting product walkthroughs, demo benchmarks, and SaaS growth playbooks.
      </p>

      {subscribed ? (
        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[14px] font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          You&apos;re subscribed! Look out for our next edition.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-start">
          <div className="w-full">
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              error={error}
              required
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="shrink-0 w-full sm:w-auto">
            Subscribe
          </Button>
        </form>
      )}
    </section>
  );
};
