'use client';

import React, { useEffect, useRef } from 'react';
import { IDemoChapter, IDemoStep } from '@/types/demo';
import { X, CheckCircle2, ChevronRight, Layers, FileText, Lock, Globe } from 'lucide-react';

export interface PlayerChapterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: IDemoChapter[];
  steps: IDemoStep[];
  activeChapterId?: string | null;
  onSelectChapter: (chapterId: string) => void;
}

export const PlayerChapterMenu: React.FC<PlayerChapterMenuProps> = ({
  isOpen,
  onClose,
  chapters,
  steps,
  activeChapterId,
  onSelectChapter,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        ref={menuRef}
        className="w-full max-w-md bg-[#111119] border border-white/10 rounded-3xl p-5 shadow-2xl text-white flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5B5CE2]/15 text-[#5B5CE2] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] leading-tight text-white">Chapters</h3>
              <p className="text-white/50 text-[11px]">Select a chapter to jump directly</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close chapter menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto py-2.5 space-y-2 pr-1 custom-scrollbar">
          {chapters.map((chapter, index) => {
            const isActive =
              chapter.id === activeChapterId ||
              (chapter as any)._id === activeChapterId;

            // Count steps belonging to this chapter
            const chapterStepCount = steps.filter(
              (s) =>
                s.chapterId === chapter.id ||
                s.chapterId === (chapter as any)._id ||
                String(s.chapterId) === String(chapter.id)
            ).length;

            const iconMap = {
              default: <Layers className="w-4 h-4" />,
              form: <FileText className="w-4 h-4" />,
              password: <Lock className="w-4 h-4" />,
              embed: <Globe className="w-4 h-4" />,
            };

            return (
              <button
                key={chapter.id || (chapter as any)._id || index}
                type="button"
                onClick={() => {
                  onSelectChapter(chapter.id || (chapter as any)._id);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isActive
                    ? 'bg-[#5B5CE2]/15 border-[#5B5CE2] text-white shadow-xs'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15 text-white/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-colors ${
                      isActive
                        ? 'bg-[#5B5CE2] text-white shadow-xs'
                        : 'bg-white/10 text-white/60 group-hover:text-white'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[13.5px] truncate text-white">
                        {chapter.title || `Chapter ${index + 1}`}
                      </span>
                      {chapter.type && chapter.type !== 'default' && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-white/10 text-white/70">
                          {chapter.type}
                        </span>
                      )}
                    </div>
                    {chapter.description ? (
                      <p className="text-[11.5px] text-white/50 truncate mt-0.5">
                        {chapter.description}
                      </p>
                    ) : (
                      <p className="text-[11px] text-white/40 mt-0.5">
                        {chapterStepCount} {chapterStepCount === 1 ? 'step' : 'steps'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-[#5B5CE2] animate-pulse" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/80 transition-transform group-hover:translate-x-0.5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
