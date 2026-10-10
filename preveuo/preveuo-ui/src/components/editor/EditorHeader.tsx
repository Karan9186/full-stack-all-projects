import React from 'react';
import Link from 'next/link';
import { Button, IconButton, Badge } from '@/components/ui';
import { ArrowLeft, Save, Eye, Share2, Sparkles } from 'lucide-react';

interface EditorHeaderProps {
  tourName: string;
  onTourNameChange: (name: string) => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  isSaved: boolean;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  tourName,
  onTourNameChange,
  isPreviewMode,
  onTogglePreview,
  onSave,
  isSaved,
}) => {
  return (
    <header className="h-16 border-b border-[#e5e7eb] bg-white px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Back & Tour Title Input */}
      <div className="flex items-center gap-3">
        <Link href="/workspace">
          <IconButton
            variant="secondary"
            size="sm"
            aria-label="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4 text-[#0f0f1a]" />
          </IconButton>
        </Link>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tourName}
            onChange={(e) => onTourNameChange(e.target.value)}
            className="text-[14px] sm:text-[15px] font-semibold text-[#0f0f1a] bg-transparent border-b border-transparent hover:border-[#d1d5db] focus:border-[#5B5CE2] focus:outline-none px-1 py-0.5 transition-colors"
          />
          <Badge variant={isSaved ? 'success' : 'warning'} size="sm" dot>
            {isSaved ? 'Saved' : 'Unsaved changes'}
          </Badge>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          {isPreviewMode ? 'Edit Mode' : 'Preview'}
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onSave}
          leftIcon={<Save className="w-3.5 h-3.5" />}
        >
          Publish Demo
        </Button>
      </div>
    </header>
  );
};
