'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import { DemoRuntimeSnapshot, DemoAnalyticsEventType } from '@/types/demo';
import { DemoRuntimePlayer } from '@/components/runtime/DemoRuntimePlayer';
import { getCanonicalDemoAspectRatio } from '@/lib/utils/aspectRatio';
import { Share2, Code2, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function PublicDemoPlayerContent({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const resolvedParams = use(params);
  const publicId = resolvedParams.publicId;

  const [snapshot, setSnapshot] = useState<DemoRuntimeSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  useEffect(() => {
    // Generate visitor session id
    const newSessionId = 'sess_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    setSessionId(newSessionId);

    async function loadPublishedDemo() {
      try {
        setLoading(true);
        const res = await fetch(`/api/d/${publicId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error || 'Published tour could not be loaded.');
          return;
        }

        setSnapshot(data.data);
      } catch (err: any) {
        setError(err.message || 'Network error while loading demo.');
      } finally {
        setLoading(false);
      }
    }

    loadPublishedDemo();
  }, [publicId]);

  const handleTrackEvent = (
    eventType: DemoAnalyticsEventType,
    payload: {
      sceneId?: string;
      stepId?: string;
      elementId?: string;
      metadata?: Record<string, unknown>;
    }
  ) => {
    if (!sessionId || !publicId) return;

    fetch(`/api/d/${publicId}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        eventType,
        sceneId: payload.sceneId,
        stepId: payload.stepId,
        elementId: payload.elementId,
        metadata: payload.metadata,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      }),
    }).catch(() => {
      // Non-blocking analytics logging
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://preveuo.com/d/${publicId}`;
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="650px" frameborder="0" allowfullscreen allow="clipboard-write"></iframe>`;

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a10] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 rounded-full border-3 border-[#5B5CE2] border-t-transparent animate-spin mb-4" />
        <p className="text-white/60 text-sm font-medium">Loading interactive demo...</p>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a10] flex flex-col items-center justify-center text-white p-6 font-sans text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#5B5CE2]">
          <Code2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Demo Unavailable</h1>
        <p className="text-white/60 text-sm max-w-md mb-6 leading-relaxed">
          {error || 'This interactive walkthrough is private or has not been published yet.'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B5CE2] text-white text-sm font-semibold hover:bg-[#4a4bd4] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Preveuo Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#07070b] flex flex-col font-sans select-none">
      {/* Top Bar */}
      <header className="h-14 px-6 border-b border-white/10 bg-[#0e0e17] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#5B5CE2] flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              P
            </span>
            <span className="font-extrabold text-white text-[15px] tracking-tight">Preveuo</span>
          </Link>
          <span className="text-white/30 text-xs">/</span>
          <span className="text-white/90 text-sm font-semibold truncate max-w-[200px] sm:max-w-md">
            {snapshot.demo.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Share button */}
          <button
            type="button"
            onClick={handleCopyShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Embed button */}
          <button
            type="button"
            onClick={() => setShowEmbedModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Embed</span>
          </button>
        </div>
      </header>

      {/* Center Player Stage with Canonical Aspect Ratio */}
      <main className="flex-1 p-3 sm:p-6 flex items-center justify-center overflow-hidden">
        <div
          style={{
            aspectRatio: getCanonicalDemoAspectRatio(snapshot.demo as any, snapshot.scenes).cssRatio,
          }}
          className="w-full max-w-[1440px] max-h-[85vh] relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 mx-auto"
        >
          <DemoRuntimePlayer
            demoName={snapshot.demo.name}
            demoSettings={snapshot.demo.settings}
            scenes={snapshot.scenes}
            steps={snapshot.steps}
            chapters={snapshot.chapters}
            elements={snapshot.elements}
            interactions={snapshot.interactions}
            onTrackEvent={handleTrackEvent}
          />
        </div>
      </main>

      {/* Embed Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12121a] border border-white/15 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-1">Embed Interactive Demo</h3>
            <p className="text-white/60 text-xs mb-4">
              Copy this snippet to embed this live walkthrough on your marketing website, docs, or blog.
            </p>

            <div className="bg-black/60 rounded-xl p-3 border border-white/10 font-mono text-xs text-white/80 break-all select-all mb-4">
              {embedCode}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEmbedModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCopyEmbed}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B5CE2] hover:bg-[#4a4bd4] text-white text-xs font-bold shadow-md"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{copiedEmbed ? 'Snippet Copied!' : 'Copy Embed Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicDemoPlayerPage(props: {
  params: Promise<{ publicId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07070b] flex items-center justify-center text-white">
          <div className="w-8 h-8 rounded-full border-2 border-[#5B5CE2] border-t-transparent animate-spin" />
        </div>
      }
    >
      <PublicDemoPlayerContent {...props} />
    </Suspense>
  );
}
