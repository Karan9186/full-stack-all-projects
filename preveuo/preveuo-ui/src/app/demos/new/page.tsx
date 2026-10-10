'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NewDemoPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeDemo() {
      try {
        const res = await fetch('/api/demos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'New Demo',
            description: '',
            type: 'walkthrough',
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to create new demo studio session.');
        }

        const newId = data.data.demo.id || data.data.demo._id;
        if (mounted) {
          router.replace(`/demos/${newId}`);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Unable to create demo.');
        }
      }
    }

    initializeDemo();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-[17px] font-semibold text-[#0f0f1a] mb-1 tracking-tight">Failed to Initialize Demo</h2>
        <p className="text-[13px] text-[#6b7280] mb-5 font-normal">{error}</p>
        <Link href="/demos">
          <Button variant="secondary" size="sm">
            Back to Demos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#f8f9fc] flex flex-col items-center justify-center font-sans">
      <div className="w-12 h-12 rounded-2xl bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center mb-4 animate-pulse">
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="w-7 h-7 rounded-full border-2 border-[#5B5CE2] border-t-transparent animate-spin mb-3" />
      <h3 className="text-[15px] font-semibold text-[#0f0f1a] tracking-tight">Creating Preveuo Studio...</h3>
      <p className="text-[13px] text-[#6b7280] mt-1 font-normal">Preparing your workspace...</p>
    </div>
  );
}
