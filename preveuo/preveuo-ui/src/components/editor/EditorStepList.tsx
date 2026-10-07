import React from 'react';
import Image from 'next/image';
import { DemoStep } from '@/types/demo';
import { Button, IconButton } from '@/components/ui';
import { Plus, Trash2, Layers } from 'lucide-react';

interface EditorStepListProps {
  steps: DemoStep[];
  activeStepIndex: number;
  onSelectStep: (idx: number) => void;
  onAddStep: () => void;
  onDeleteStep: (idx: number) => void;
}

export const EditorStepList: React.FC<EditorStepListProps> = ({
  steps,
  activeStepIndex,
  onSelectStep,
  onAddStep,
  onDeleteStep,
}) => {
  return (
    <aside className="w-64 border-r border-[#e5e7eb] bg-[#fafafc] flex flex-col shrink-0">
      <div className="p-4 border-b border-[#f0f0f4] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#5B5CE2]" />
          <span className="text-xs font-bold text-[#0f0f1a] uppercase tracking-wider">
            Steps ({steps.length})
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddStep}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add
        </Button>
      </div>

      {/* Step Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {steps.map((st, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <div
              key={st.id}
              onClick={() => onSelectStep(idx)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group flex gap-2.5 items-center ${
                isActive
                  ? 'bg-white border-[#5B5CE2] shadow-sm ring-2 ring-[#5B5CE2]/10'
                  : 'bg-white border-[#e5e7eb] hover:border-[#d1d5db]'
              }`}
            >
              {/* Step Thumbnail */}
              <div className="w-14 h-10 rounded-lg bg-[#0f0f1a] relative overflow-hidden shrink-0 border border-[#e5e7eb]">
                <Image
                  src={st.screenshotUrl}
                  alt={st.title}
                  fill
                  sizes="56px"
                  className="object-cover opacity-80"
                />
                <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white bg-black/70 px-1 rounded">
                  #{idx + 1}
                </span>
              </div>

              {/* Title & info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#0f0f1a] truncate">
                  {st.title}
                </h4>
                <p className="text-[11px] text-[#9ca3af] truncate mt-0.5">
                  {st.callout.title}
                </p>
              </div>

              {/* Delete Step */}
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteStep(idx);
                  }}
                  className="p-1 rounded-md text-[#9ca3af] hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete step"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
