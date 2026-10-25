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
    <aside className="w-64 border-r border-border-default bg-canvas flex flex-col shrink-0">
      <div className="p-4 border-b border-border-light flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-purple" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
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
                  ? 'bg-white border-brand-purple shadow-sm ring-2 ring-brand-purple/10'
                  : 'bg-white border-border-default hover:border-border-input'
              }`}
            >
              {/* Step Thumbnail */}
              <div className="w-14 h-10 rounded-lg bg-dark relative overflow-hidden shrink-0 border border-border-default">
                <Image
                  src={st.screenshotUrl}
                  alt={st.title}
                  fill
                  sizes="56px"
                  className="object-cover opacity-80"
                />
                <span className="absolute bottom-1 right-1 text-[9.5px] font-medium text-white bg-black/70 px-1 rounded">
                  Step {idx + 1}
                </span>
              </div>

              {/* Title & info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-[12.5px] font-medium text-heading truncate">
                  {st.title}
                </h4>
                <p className="text-[11px] text-body font-normal truncate mt-0.5">
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
                  className="p-1 rounded-md text-muted hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
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
