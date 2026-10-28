import React from 'react';
import { DemoStep } from '@/types/demo';
import { Input, Textarea, Select } from '@/components/ui';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface EditorPropertiesPanelProps {
  step: DemoStep;
  onUpdateStep: (updates: Partial<DemoStep>) => void;
  onUpdateCallout: (updates: Partial<DemoStep['callout']>) => void;
}

export const EditorPropertiesPanel: React.FC<EditorPropertiesPanelProps> = ({
  step,
  onUpdateStep,
  onUpdateCallout,
}) => {
  return (
    <aside className="w-[360px] border-l border-border-default bg-white p-5 overflow-y-auto shrink-0 flex flex-col gap-5">
      <div className="flex items-center gap-2 pb-3 border-b border-border-light">
        <SlidersHorizontal className="w-4 h-4 text-brand-purple" />
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
          Step Properties
        </h3>
      </div>

      <div className="space-y-4">
        {/* Step Title */}
        <Input
          label="Internal Step Name"
          value={step.title}
          onChange={(e) => onUpdateStep({ title: e.target.value })}
        />

        {/* Callout Header */}
        <Input
          label="Tooltip Heading"
          value={step.callout.title}
          onChange={(e) => onUpdateCallout({ title: e.target.value })}
        />

        {/* Callout Description */}
        <Textarea
          label="Tooltip Message"
          rows={3}
          value={step.callout.description}
          onChange={(e) => onUpdateCallout({ description: e.target.value })}
        />

        {/* CTA Button Text */}
        <Input
          label="Button CTA Text"
          value={step.callout.buttonText || 'Next Step'}
          onChange={(e) => onUpdateCallout({ buttonText: e.target.value })}
        />

        {/* Hotspot Coordinates (X, Y) */}
        <div>
          <label className="block text-[12.5px] font-medium text-gray-700 mb-1.5">
            Hotspot Position (% from top/left)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              label="X Axis (%)"
              value={step.targetPoint.x}
              onChange={(e) =>
                onUpdateStep({
                  targetPoint: { ...step.targetPoint, x: Number(e.target.value) },
                })
              }
            />
            <Input
              type="number"
              label="Y Axis (%)"
              value={step.targetPoint.y}
              onChange={(e) =>
                onUpdateStep({
                  targetPoint: { ...step.targetPoint, y: Number(e.target.value) },
                })
              }
            />
          </div>
        </div>

        {/* Autoplay Delay */}
        <Select
          label="Pacing Duration"
          value={String(step.delayMs || 3500)}
          onChange={(e) => onUpdateStep({ delayMs: Number(e.target.value) })}
          options={[
            { value: '2000', label: 'Fast (2.0s)' },
            { value: '3500', label: 'Normal (3.5s)' },
            { value: '5000', label: 'Deliberate (5.0s)' },
          ]}
        />
      </div>
    </aside>
  );
};
