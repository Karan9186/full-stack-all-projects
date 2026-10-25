'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, RotateCcw, ExternalLink, Share2, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRIMARY_COLOR, THEME_COLORS } from '@/lib/constants/theme';

export interface PlayerCompletionProps {
  demoName: string;
  onRestart: () => void;
  ctaText?: string;
  ctaUrl?: string;
  shareUrl?: string;
  className?: string;
}

export const PlayerCompletion: React.FC<PlayerCompletionProps> = ({
  demoName,
  onRestart,
  ctaText = 'Start Free Trial',
  ctaUrl = '/register',
  shareUrl,
  className = '',
}) => {
  const [copied, setCopied] = React.useState(false);

  // Trigger gentle confetti burst upon completion
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: [PRIMARY_COLOR, THEME_COLORS.primaryHover, THEME_COLORS.success, THEME_COLORS.warning, THEME_COLORS.primary],
        disableForReducedMotion: true,
      });
    } catch {
      // safe fallback if canvas is unavailable
    }
  }, []);

  const handleCopyShare = () => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tour Completed"
      className={`absolute inset-0 z-50 bg-dark/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300 ${className}`}
    >
      <div className="w-full max-w-md bg-white text-heading rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Header Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-[11px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3" />
          <span>Tour Completed</span>
        </div>

        <h3 className="text-2xl font-extrabold text-heading tracking-tight mb-2">
          You’re Ready to Get Started!
        </h3>

        <p className="text-[14px] text-body leading-relaxed mb-6">
          You’ve explored all key highlights of <strong className="text-heading">{demoName}</strong>. Ready to experience Preveuo in your own workspace?
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border-input text-heading font-semibold text-[14px] hover:border-brand-purple hover:text-brand-purple transition-colors cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Tour</span>
          </button>

          <a
            href={ctaUrl}
            target={ctaUrl.startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-[14px] shadow-md transition-all hover:-translate-y-0.5 active:scale-98"
          >
            <span>{ctaText}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Share Link */}
        <button
          type="button"
          onClick={handleCopyShare}
          className="mt-4 text-xs font-semibold text-body hover:text-brand-purple transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied to Clipboard!' : 'Share this interactive demo'}</span>
        </button>
      </div>
    </div>
  );
};
