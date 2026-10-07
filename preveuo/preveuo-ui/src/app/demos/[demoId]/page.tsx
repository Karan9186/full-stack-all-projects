'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { FullDemoData } from '@/types/demo';
import { PreveuoStudioEditor } from '@/components/editor/PreveuoStudioEditor';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';

function DemoEditorContent({
  params,
}: {
  params: Promise<{ demoId: string }>;
}) {
  const resolvedParams = use(params);
  const demoId = resolvedParams.demoId;

  const [fullData, setFullData] = useState<FullDemoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDemo() {
      try {
        setLoading(true);
        const res = await fetch(`/api/demos/${demoId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error || 'Failed to load demo.');
          return;
        }

        setFullData(data.data);
      } catch (err: any) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    }

    loadDemo();
  }, [demoId]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#fafafc] flex flex-col items-center justify-center font-sans">
        <div className="w-9 h-9 rounded-full border-3 border-[#5B5CE2] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-[#6b7280]">Loading Preveuo Studio...</p>
      </div>
    );
  }

  if (error || !fullData) {
    return (
      <div className="h-screen w-screen bg-[#fafafc] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#0f0f1a] mb-2">Unable to Load Demo</h2>
        <p className="text-xs text-[#6b7280] max-w-sm mb-6 leading-relaxed">
          {error || 'This demo could not be found or you do not have permission to edit it.'}
        </p>
        <Link href="/demos">
          <Button variant="secondary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Demos
          </Button>
        </Link>
      </div>
    );
  }

  return <PreveuoStudioEditor initialData={fullData} />;
}

export default function DemoEditorPage(props: {
  params: Promise<{ demoId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#fafafc] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#5B5CE2] border-t-transparent animate-spin" />
        </div>
      }
    >
      <DemoEditorContent {...props} />
    </Suspense>
  );
}
