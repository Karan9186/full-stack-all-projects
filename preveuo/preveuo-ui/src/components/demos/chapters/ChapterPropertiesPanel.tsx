'use client';

import React from 'react';
import {
  IDemoChapter,
  IDemoStep,
  IDemoScene,
  ChapterType,
  ChapterLayout,
  ChapterTheme,
  ChapterCoverType,
  ChapterButton,
  ChapterButtonActionType,
} from '@/types/demo';
import {
  Input,
  Textarea,
  Select,
  SegmentedControl,
  Switch,
  Button,
} from '@/components/ui';
import {
  SlidersHorizontal,
  Trash2,
  X,
  Save,
  Plus,
  ArrowRight,
  ExternalLink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Moon,
  Sun,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';

interface ChapterPropertiesPanelProps {
  chapter: IDemoChapter;
  steps: IDemoStep[];
  chapters: IDemoChapter[];
  scenes: IDemoScene[];
  onUpdate: (updates: Partial<IDemoChapter>) => void;
  onDelete: () => void;
  onClose: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const ChapterPropertiesPanel: React.FC<ChapterPropertiesPanelProps> = ({
  chapter,
  steps = [],
  chapters = [],
  scenes = [],
  onUpdate,
  onDelete,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const buttons = chapter.buttons && chapter.buttons.length > 0 ? chapter.buttons : [];

  // Add new button
  const handleAddButton = () => {
    const newBtn: ChapterButton = {
      id: `btn_${Date.now()}`,
      label: 'Continue',
      action: { type: 'next' },
      style: 'primary',
      visible: true,
    };
    onUpdate({ buttons: [...buttons, newBtn] });
  };

  // Update button by ID
  const handleUpdateButton = (btnId: string, patch: Partial<ChapterButton>) => {
    const nextButtons = buttons.map((b) => (b.id === btnId ? { ...b, ...patch } : b));
    onUpdate({ buttons: nextButtons });
  };

  // Delete button by ID
  const handleDeleteButton = (btnId: string) => {
    const nextButtons = buttons.filter((b) => b.id !== btnId);
    onUpdate({ buttons: nextButtons });
  };

  return (
    <aside className="w-80 border-l border-[#e5e7eb] bg-white flex flex-col shrink-0 h-full overflow-hidden select-none">
      {/* Header */}
      <div className="h-14 px-5 border-b border-[#f0f0f4] flex items-center justify-between shrink-0 bg-[#fafafc]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#5B5CE2]" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0f0f1a]">
            Chapter Settings
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#0f0f1a] hover:bg-white transition-colors cursor-pointer"
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* 1. CONTENT SECTION */}
        <section className="space-y-3.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5B5CE2]">
            Content
          </span>

          <Input
            label="Chapter Title"
            value={chapter.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Chapter title"
          />

          <Textarea
            label="Chapter Description"
            rows={3}
            value={chapter.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Add a description for this chapter."
          />

          {/* Buttons List */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[12.5px] font-bold text-[#0f0f1a]">
                Buttons ({buttons.length})
              </label>
              <button
                type="button"
                onClick={handleAddButton}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#5B5CE2] hover:text-[#4a4bd4] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Button</span>
              </button>
            </div>

            {buttons.map((btn, bIdx) => (
              <div
                key={btn.id}
                className="p-3 bg-[#fafafc] rounded-xl border border-[#e5e7eb] space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0f0f1a]">Button #{bIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteButton(btn.id)}
                    className="text-[#9ca3af] hover:text-red-500 cursor-pointer"
                    title="Delete button"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Input
                  label="Label"
                  value={btn.label}
                  onChange={(e) => handleUpdateButton(btn.id, { label: e.target.value })}
                  placeholder="Button text"
                />

                <Select
                  label="Action"
                  value={btn.action.type}
                  onChange={(e) =>
                    handleUpdateButton(btn.id, {
                      action: {
                        ...btn.action,
                        type: e.target.value as ChapterButtonActionType,
                      },
                    })
                  }
                  options={[
                    { value: 'next', label: 'Next (First Step)' },
                    { value: 'previous', label: 'Previous' },
                    { value: 'go_to_step', label: 'Go to Step' },
                    { value: 'go_to_chapter', label: 'Go to Chapter' },
                    { value: 'external_url', label: 'External URL' },
                  ]}
                />

                {/* Target Step */}
                {btn.action.type === 'go_to_step' && (
                  <Select
                    label="Target Step"
                    value={btn.action.targetId || ''}
                    onChange={(e) =>
                      handleUpdateButton(btn.id, {
                        action: { ...btn.action, targetId: e.target.value },
                      })
                    }
                    options={steps.map((st, sIdx) => ({
                      value: st.id,
                      label: `Step ${sIdx + 1}: ${st.title || 'Untitled'}`,
                    }))}
                  />
                )}

                {/* Target Chapter */}
                {btn.action.type === 'go_to_chapter' && (
                  <Select
                    label="Target Chapter"
                    value={btn.action.targetId || ''}
                    onChange={(e) =>
                      handleUpdateButton(btn.id, {
                        action: { ...btn.action, targetId: e.target.value },
                      })
                    }
                    options={chapters.map((ch, cIdx) => ({
                      value: ch.id,
                      label: `Chapter ${cIdx + 1}: ${ch.title}`,
                    }))}
                  />
                )}

                {/* External URL */}
                {btn.action.type === 'external_url' && (
                  <Input
                    label="URL"
                    value={btn.action.url || ''}
                    onChange={(e) =>
                      handleUpdateButton(btn.id, {
                        action: { ...btn.action, url: e.target.value },
                      })
                    }
                    placeholder="https://example.com"
                  />
                )}

                <SegmentedControl
                  value={btn.style || 'primary'}
                  onChange={(val) =>
                    handleUpdateButton(btn.id, {
                      style: val as 'primary' | 'secondary' | 'outline',
                    })
                  }
                  options={[
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' },
                    { value: 'outline', label: 'Outline' },
                  ]}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 2. APPEARANCE SECTION */}
        <section className="space-y-4 pt-4 border-t border-[#f0f0f4]">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5B5CE2]">
            Appearance
          </span>

          {/* Chapter Type */}
          <div>
            <label className="block text-[12.5px] font-bold text-[#0f0f1a] mb-1.5">
              Chapter Type
            </label>
            <SegmentedControl
              value={chapter.type || 'default'}
              onChange={(val) => onUpdate({ type: val as ChapterType })}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'form', label: 'Form' },
                { value: 'embed', label: 'Embed' },
                { value: 'password', label: 'Password' },
              ]}
            />
          </div>

          {/* Form Chapter Configuration */}
          {chapter.type === 'form' && (
            <div className="p-3 bg-[#fafafc] rounded-xl border border-[#e5e7eb] space-y-2.5 text-xs">
              <span className="font-bold text-[#0f0f1a]">Lead Capture Settings</span>
              <Input
                label="Submit Button Text"
                value={chapter.formConfig?.buttonLabel || 'Access Demo'}
                onChange={(e) =>
                  onUpdate({
                    formConfig: {
                      ...(chapter.formConfig || {}),
                      buttonLabel: e.target.value,
                    },
                  })
                }
                placeholder="Access Demo"
              />
              <Input
                label="Email Placeholder"
                value={chapter.formConfig?.emailPlaceholder || 'Enter your work email...'}
                onChange={(e) =>
                  onUpdate({
                    formConfig: {
                      ...(chapter.formConfig || {}),
                      emailPlaceholder: e.target.value,
                    },
                  })
                }
                placeholder="Enter work email..."
              />
              <Switch
                label="Require Full Name"
                description="Add full name input field"
                checked={chapter.formConfig?.requireName ?? false}
                onChange={(checked) =>
                  onUpdate({
                    formConfig: {
                      ...(chapter.formConfig || {}),
                      requireName: checked,
                    },
                  })
                }
              />
            </div>
          )}

          {/* Embed Chapter Configuration */}
          {chapter.type === 'embed' && (
            <div className="p-3 bg-[#fafafc] rounded-xl border border-[#e5e7eb] space-y-2.5 text-xs">
              <span className="font-bold text-[#0f0f1a]">Embed Settings</span>
              <Input
                label="Embed / Video URL"
                value={chapter.embedConfig?.embedUrl || ''}
                onChange={(e) =>
                  onUpdate({
                    embedConfig: {
                      embedUrl: e.target.value,
                    },
                  })
                }
                placeholder="https://www.youtube.com/embed/... or Loom URL"
              />
            </div>
          )}

          {/* Password Gate Chapter Configuration */}
          {chapter.type === 'password' && (
            <div className="p-3 bg-[#fafafc] rounded-xl border border-[#e5e7eb] space-y-2.5 text-xs">
              <span className="font-bold text-[#0f0f1a]">Password Gate Settings</span>
              <Input
                label="Passcode"
                type="password"
                value={chapter.passwordConfig?.password || ''}
                onChange={(e) =>
                  onUpdate({
                    passwordConfig: {
                      ...(chapter.passwordConfig || {}),
                      password: e.target.value,
                    },
                  })
                }
                placeholder="Demo password"
              />
              <Input
                label="Password Hint (Optional)"
                value={chapter.passwordConfig?.hint || ''}
                onChange={(e) =>
                  onUpdate({
                    passwordConfig: {
                      ...(chapter.passwordConfig || {}),
                      hint: e.target.value,
                    },
                  })
                }
                placeholder="e.g. Secret VIP code"
              />
            </div>
          )}

          {/* Layout */}
          <div>
            <label className="block text-[12.5px] font-bold text-[#0f0f1a] mb-1.5">Layout</label>
            <SegmentedControl
              value={chapter.layout || 'center'}
              onChange={(val) => onUpdate({ layout: val as ChapterLayout })}
              options={[
                { value: 'left', label: 'Left', icon: <AlignLeft className="w-3.5 h-3.5" /> },
                { value: 'center', label: 'Center', icon: <AlignCenter className="w-3.5 h-3.5" /> },
                { value: 'right', label: 'Right', icon: <AlignRight className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>

          {/* Theme */}
          <div>
            <label className="block text-[12.5px] font-bold text-[#0f0f1a] mb-1.5">Theme</label>
            <SegmentedControl
              value={chapter.theme || 'dark'}
              onChange={(val) => onUpdate({ theme: val as ChapterTheme })}
              options={[
                { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
                { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
                { value: 'custom', label: 'Custom', icon: <Palette className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12.5px] font-bold text-[#0f0f1a]">Overlay Opacity</label>
              <span className="text-xs font-mono font-bold text-[#5B5CE2]">
                {chapter.opacity ?? 24}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={chapter.opacity ?? 24}
              onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
              className="w-full accent-[#5B5CE2] cursor-pointer"
            />
          </div>

          {/* Blur Switch */}
          <Switch
            label="Background Blur"
            description="Apply blur filter to chapter background"
            checked={chapter.blur ?? false}
            onChange={(checked) => onUpdate({ blur: checked })}
          />

          {/* Logo Settings */}
          <div className="space-y-3 pt-2">
            <Switch
              label="Show Logo"
              description="Render brand logo on chapter screen"
              checked={chapter.logo?.visible ?? true}
              onChange={(checked) =>
                onUpdate({
                  logo: {
                    ...(chapter.logo || { altText: 'Logo' }),
                    visible: checked,
                  },
                })
              }
            />

            {chapter.logo?.visible !== false && (
              <div className="space-y-2.5 pl-2 border-l-2 border-[#5B5CE2]/30">
                <Input
                  label="Logo Image URL"
                  value={chapter.logo?.assetUrl || ''}
                  onChange={(e) =>
                    onUpdate({
                      logo: {
                        ...(chapter.logo || { visible: true, altText: 'Logo' }),
                        assetUrl: e.target.value,
                      },
                    })
                  }
                  placeholder="https://example.com/logo.png"
                />
                <Input
                  label="Logo Alt Text"
                  value={chapter.logo?.altText || 'Logo'}
                  onChange={(e) =>
                    onUpdate({
                      logo: {
                        ...(chapter.logo || { visible: true }),
                        altText: e.target.value,
                      },
                    })
                  }
                  placeholder="Brand logo"
                />
              </div>
            )}
          </div>

          {/* Cover Image Settings */}
          <div className="space-y-3 pt-2">
            <label className="block text-[12.5px] font-bold text-[#0f0f1a] mb-1">
              Cover Image
            </label>
            <SegmentedControl
              value={chapter.cover?.type || 'none'}
              onChange={(val) =>
                onUpdate({
                  cover: {
                    ...(chapter.cover || {}),
                    type: val as ChapterCoverType,
                  },
                })
              }
              options={[
                { value: 'none', label: 'None' },
                { value: 'steps', label: 'Steps' },
                { value: 'custom', label: 'Custom' },
              ]}
            />

            {chapter.cover?.type === 'steps' && (
              <Select
                label="Step Screenshot"
                value={chapter.cover?.stepId || (steps[0] ? (steps[0].id || (steps[0] as any)._id) : '')}
                onChange={(e) =>
                  onUpdate({
                    cover: {
                      type: 'steps',
                      stepId: e.target.value,
                    },
                  })
                }
                options={steps.map((st, idx) => ({
                  value: st.id || (st as any)._id,
                  label: `Step ${idx + 1}: ${st.title || 'Untitled'}`,
                }))}
              />
            )}

            {chapter.cover?.type === 'custom' && (
              <Input
                label="Custom Image URL"
                value={chapter.cover?.assetUrl || ''}
                onChange={(e) =>
                  onUpdate({
                    cover: {
                      type: 'custom',
                      assetUrl: e.target.value,
                    },
                  })
                }
                placeholder="https://example.com/cover.png"
              />
            )}

            <p className="text-[11px] text-[#9ca3af] italic">
              Cover image will not be visible on mobile view.
            </p>
          </div>
        </section>

        {/* 3. DANGER ZONE */}
        <section className="pt-4 border-t border-[#f0f0f4]">
          <Button
            variant="danger"
            size="sm"
            fullWidth
            onClick={onDelete}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete Chapter
          </Button>
        </section>
      </div>
    </aside>
  );
};
