import React from 'react';
import { Button, Badge } from '@/components/ui';
import { Plus, Upload, Sparkles } from 'lucide-react';

interface WorkspaceHeaderProps {
  onNewDemo: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ onNewDemo }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border-default">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="purple" size="sm">
            Workspace
          </Badge>
          <span className="text-xs text-muted font-mono">Acme Corp Team</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-heading">
          Interactive Product Demos
        </h1>
        <p className="text-sm text-body mt-1">
          Manage your interactive tours, track engagement, and publish updates.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="md"
          leftIcon={<Upload className="w-4 h-4" />}
        >
          Import Figma
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onNewDemo}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Demo Tour
        </Button>
      </div>
    </div>
  );
};
