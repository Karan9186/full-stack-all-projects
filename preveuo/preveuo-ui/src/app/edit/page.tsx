'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function EditDemoRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      router.replace(`/demos/${id}`);
    } else {
      router.replace('/demos');
    }
  }, [router, searchParams]);

  return (
    <div className="h-screen w-screen bg-[#fafafc] flex items-center justify-center font-sans">
      <div className="w-8 h-8 rounded-full border-2 border-[#5B5CE2] border-t-transparent animate-spin" />
    </div>
  );
}

export default function EditDemoRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#fafafc] flex items-center justify-center font-sans">
          <div className="w-8 h-8 rounded-full border-2 border-[#5B5CE2] border-t-transparent animate-spin" />
        </div>
      }
    >
      <EditDemoRedirectContent />
    </Suspense>
  );
}
