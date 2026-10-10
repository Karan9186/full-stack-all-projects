'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Card, Badge } from '@/components/ui';
import {
  Upload,
  Search,
  Filter,
  Image as ImageIcon,
  Video,
  FileCode,
  Download,
  Trash2,
  HardDrive,
  MoreHorizontal,
} from 'lucide-react';
import { WORKSPACE_ASSETS } from '@/lib/workspaceDashboardData';

export const AssetsTabContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'logo' | 'icon'>('all');

  const filteredAssets = WORKSPACE_ASSETS.filter((ast) => {
    if (typeFilter !== 'all' && ast.type !== typeFilter) return false;
    return ast.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#0f0f1a]">
            Asset library
          </h2>
          <p className="text-[13.5px] text-[#6b7280] font-normal mt-0.5">
            Manage screenshots, product recordings, brand marks, and video media.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Upload className="w-4 h-4" />}
        >
          Upload assets
        </Button>
      </div>

      {/* Storage Quota Card */}
      <div className="p-4 rounded-2xl bg-white border border-[#e5e7eb] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[13px] font-semibold text-[#0f0f1a]">Cloud Storage Quota</span>
            <p className="text-[12px] text-[#6b7280] font-normal">18.2 MB of 10 GB used (0.2%)</p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="w-full h-2 bg-[#f0f0f4] rounded-full overflow-hidden">
            <div className="w-2.5 h-full bg-[#5B5CE2] rounded-full" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {(['all', 'image', 'video', 'logo', 'icon'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                typeFilter === t
                  ? 'bg-[#5B5CE2] text-white shadow-xs'
                  : 'bg-white text-[#6b7280] hover:text-[#0f0f1a] border border-[#e5e7eb]'
              }`}
            >
              {t === 'all' ? 'All assets' : `${t}s`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-[#e5e7eb] text-[#0f0f1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/15 shadow-2xs"
          />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} hoverEffect className="group overflow-hidden flex flex-col justify-between">
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] bg-[#0f0f1a] overflow-hidden">
                <Image
                  src={asset.url}
                  alt={asset.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant="purple" size="sm" className="capitalize font-medium">
                    {asset.type}
                  </Badge>
                </div>
              </div>

              {/* Details */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-[13.5px] font-semibold text-[#0f0f1a] truncate group-hover:text-[#5B5CE2] transition-colors">
                    {asset.name}
                  </h4>
                  <button type="button" className="text-[#9ca3af] hover:text-[#0f0f1a] p-0.5">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[11.5px] text-[#9ca3af] font-normal">
                  <span>{asset.size}</span>
                  {asset.dimensions && (
                    <>
                      <span>·</span>
                      <span>{asset.dimensions}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-[#f0f0f4] bg-[#fafafc] flex items-center justify-between text-[11px] text-[#9ca3af]">
              <span>Uploaded {asset.uploadedAt}</span>
              <div className="flex items-center gap-2">
                <button type="button" className="hover:text-[#5B5CE2] p-1">
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="hover:text-red-500 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
