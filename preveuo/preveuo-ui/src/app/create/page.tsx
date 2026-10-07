'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CreateDemoRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const name = searchParams.get('name');
    if (name) {
      router.replace(`/demos/new?name=${encodeURIComponent(name)}`);
    } else {
      router.replace('/demos/new');
    }
  }, [router, searchParams]);

  return (
    <div className="h-screen w-screen bg-[#fafafc] flex items-center justify-center font-sans">
      <div className="w-8 h-8 rounded-full border-2 border-[#5B5CE2] border-t-transparent animate-spin" />
    </div>
  );
}

export default function CreateDemoRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#fafafc] flex items-center justify-center font-sans">
          <div className="w-8 h-8 rounded-full border-2 border-[#5B5CE2] border-t-transparent animate-spin" />
        </div>
      }
    >
      <CreateDemoRedirectContent />
    </Suspense>
  );
}
