import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { X, Copy, Check, ExternalLink } from 'lucide-react';

interface DemoShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoUrl: string;
}

export const DemoShareModal: React.FC<DemoShareModalProps> = ({
  isOpen,
  onClose,
  demoUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(demoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const embedCode = `<iframe src="${demoUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e5e7eb] relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9ca3af] hover:text-[#0f0f1a] hover:bg-[#f3f4f6]"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-[#0f0f1a] mb-1">Share Interactive Demo</h3>
        <p className="text-xs text-[#6b7280] mb-5">
          Share this public link with prospective buyers or embed directly on your website.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0f0f1a] mb-1.5">
              Direct Public Link
            </label>
            <div className="flex gap-2">
              <Input value={demoUrl} readOnly className="text-xs font-mono" />
              <Button
                variant="primary"
                size="md"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0f0f1a] mb-1.5">
              HTML Embed Code
            </label>
            <div className="p-3 bg-[#f8f8fc] rounded-xl border border-[#e5e7eb] text-xs font-mono text-[#4b5563] break-all select-all">
              {embedCode}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#f0f0f4] flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
