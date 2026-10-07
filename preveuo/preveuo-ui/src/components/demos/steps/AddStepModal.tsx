'use client';

import React, { useState, useRef } from 'react';
import { IDemoScene, IDemoChapter } from '@/types/demo';
import { Button, Input, Select } from '@/components/ui';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Film,
  Link as LinkIcon,
  Layers,
  X,
  Plus,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AddStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    title: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    existingSceneId?: string;
    chapterId?: string;
  }) => Promise<void> | void;
  defaultChapterId?: string;
  nextStepNumber: number;
  scenes: IDemoScene[];
  chapters: IDemoChapter[];
}

type TabType = 'upload' | 'scenes' | 'url';

export const AddStepModal: React.FC<AddStepModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  defaultChapterId,
  nextStepNumber,
  scenes = [],
  chapters = [],
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [title, setTitle] = useState(`Step ${nextStepNumber}`);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    defaultChapterId || (chapters[0]?.id || '')
  );

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Existing Scene state
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    scenes[0]?.id || (scenes[0] as any)?._id || ''
  );

  // URL state
  const [customUrl, setCustomUrl] = useState('');
  const [customUrlType, setCustomUrlType] = useState<'image' | 'video'>('image');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // File selection handler
  const handleFileChange = (file: File) => {
    setErrorMessage(null);
    const mime = file.type || '';
    const isImg = mime.startsWith('image/');
    const isVid = mime.startsWith('video/');

    if (!isImg && !isVid) {
      setErrorMessage('Please select a valid image (.png, .jpg, .webp) or video (.mp4, .webm) file.');
      return;
    }

    // Size limit: 50MB for video, 20MB for image
    const maxSize = isVid ? 50 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed: ${
          isVid ? '50MB' : '20MB'
        }.`
      );
      return;
    }

    setSelectedFile(file);
    setMediaType(isVid ? 'video' : 'image');
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const stepTitle = title.trim() || `Step ${nextStepNumber}`;

    if (activeTab === 'upload') {
      if (!selectedFile) {
        setErrorMessage('Please select an image or video to upload.');
        return;
      }

      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to upload media.');
        }

        await onConfirm({
          title: stepTitle,
          mediaUrl: data.url,
          mediaType: data.type || mediaType,
          chapterId: selectedChapterId || undefined,
        });

        onClose();
      } catch (err: any) {
        setErrorMessage(err.message || 'Upload failed. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } else if (activeTab === 'scenes') {
      const chosenScene = scenes.find(
        (sc) => sc.id === selectedSceneId || (sc as any)._id === selectedSceneId
      );
      if (!chosenScene) {
        setErrorMessage('Please select an existing scene.');
        return;
      }

      const isVid =
        chosenScene.sourceType === 'recording' ||
        chosenScene.sourceAssetUrl?.match(/\.(mp4|webm|mov)$/i) !== null;

      await onConfirm({
        title: stepTitle,
        mediaUrl: chosenScene.sourceAssetUrl || '',
        mediaType: isVid ? 'video' : 'image',
        existingSceneId: chosenScene.id || (chosenScene as any)._id,
        chapterId: selectedChapterId || undefined,
      });

      onClose();
    } else if (activeTab === 'url') {
      const url = customUrl.trim();
      if (!url) {
        setErrorMessage('Please enter an image or video URL.');
        return;
      }

      await onConfirm({
        title: stepTitle,
        mediaUrl: url,
        mediaType: customUrlType,
        chapterId: selectedChapterId || undefined,
      });

      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f0f0f4] flex items-center justify-between bg-[#fafafc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0f0f1a]">Add New Step</h3>
              <p className="text-xs text-[#6b7280]">
                Upload an image screenshot or video recording to create this step.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#0f0f1a] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Navigation Tabs */}
        <div className="flex border-b border-[#f0f0f4] bg-white px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#5B5CE2] text-[#5B5CE2]'
                : 'border-transparent text-[#6b7280] hover:text-[#0f0f1a]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scenes')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'scenes'
                ? 'border-[#5B5CE2] text-[#5B5CE2]'
                : 'border-transparent text-[#6b7280] hover:text-[#0f0f1a]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Existing Scenes ({scenes.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'border-[#5B5CE2] text-[#5B5CE2]'
                : 'border-transparent text-[#6b7280] hover:text-[#0f0f1a]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Media URL</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: UPLOAD FILE (Image or Video) */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {!previewUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#5B5CE2] bg-[#5B5CE2]/5 scale-[0.99]'
                      : 'border-[#d1d5db] hover:border-[#5B5CE2] hover:bg-[#fafafc]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0f0f1a] mb-1">
                    Choose Image or Video to Upload
                  </h4>
                  <p className="text-xs text-[#6b7280] max-w-sm mb-3">
                    Drag and drop your file here, or click to browse. Supports screenshots (.png, .jpg, .webp) and screen recordings (.mp4, .webm).
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[#9ca3af]">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" /> Images up to 20MB
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Film className="w-3.5 h-3.5" /> Videos up to 50MB
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-[#e5e7eb] bg-[#0f0f1a] group">
                  {mediaType === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Upload Preview"
                      className="w-full aspect-[16/10] object-contain"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      autoPlay
                      muted
                      className="w-full aspect-[16/10] object-contain"
                    />
                  )}

                  {/* Media Type Badge & Replace Button */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    {mediaType === 'video' ? (
                      <>
                        <Video className="w-3 h-3 text-[#5B5CE2]" />
                        <span>Video Recording</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3 h-3 text-emerald-400" />
                        <span>Image Screenshot</span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="p-3 bg-white border-t border-[#e5e7eb] flex items-center justify-between text-xs text-[#6b7280]">
                    <span className="truncate max-w-xs font-medium text-[#0f0f1a]">
                      {selectedFile?.name}
                    </span>
                    <span>
                      {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : 0} MB
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CHOOSE EXISTING SCENE */}
          {activeTab === 'scenes' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#0f0f1a]">
                Select an existing scene screenshot:
              </label>
              {scenes.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#6b7280] bg-[#fafafc] rounded-xl border border-[#e5e7eb]">
                  No existing scenes found in this demo.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto p-1">
                  {scenes.map((sc, scIdx) => {
                    const sceneId = sc.id || (sc as any)._id;
                    const isSelected = selectedSceneId === sceneId;
                    return (
                      <div
                        key={sceneId || scIdx}
                        onClick={() => setSelectedSceneId(sceneId)}
                        className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#5B5CE2] ring-2 ring-[#5B5CE2]/30 shadow-md scale-[1.01]'
                            : 'border-[#e5e7eb] hover:border-[#cbd5e1]'
                        }`}
                      >
                        <div className="aspect-[16/10] bg-[#1e1e2d] overflow-hidden">
                          {sc.sourceAssetUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={sc.sourceAssetUrl}
                              alt={sc.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0f0f1a] truncate">
                            {sc.name || `Scene ${scIdx + 1}`}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#5B5CE2] shrink-0" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MEDIA URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <Input
                label="Image or Video URL"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/screenshot.png or https://example.com/recording.mp4"
                helperText="Direct link to hosted media asset"
              />
              <div className="flex items-center gap-3 pt-1">
                <label className="text-xs font-bold text-[#0f0f1a]">Media Type:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomUrlType('image')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                      customUrlType === 'image'
                        ? 'bg-[#5B5CE2] text-white border-[#5B5CE2]'
                        : 'bg-white text-[#6b7280] border-[#d1d5db]'
                    }`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomUrlType('video')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                      customUrlType === 'video'
                        ? 'bg-[#5B5CE2] text-white border-[#5B5CE2]'
                        : 'bg-white text-[#6b7280] border-[#d1d5db]'
                    }`}
                  >
                    Video
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step Metadata Settings */}
          <div className="pt-3 border-t border-[#f0f0f4] space-y-3.5">
            <Input
              label="Step Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Explore Dashboard"
            />

            {chapters.length > 0 && (
              <Select
                label="Assign to Chapter"
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                options={[
                  { value: '', label: 'None (Standalone Step)' },
                  ...chapters.map((ch, idx) => ({
                    value: ch.id,
                    label: `Chapter ${idx + 1}: ${ch.title}`,
                  })),
                ]}
              />
            )}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#f0f0f4] flex items-center justify-end gap-2.5">
            <Button variant="ghost" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isUploading}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Step
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
