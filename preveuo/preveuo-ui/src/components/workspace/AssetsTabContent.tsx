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
          <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-heading">
            Asset library
          </h2>
          <p className="text-[13.5px] text-body font-normal mt-0.5">
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
      <div className="p-4 rounded-2xl bg-white border border-border-default mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[13px] font-semibold text-heading">Cloud Storage Quota</span>
            <p className="text-[12px] text-body font-normal">18.2 MB of 10 GB used (0.2%)</p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="w-full h-2 bg-border-light rounded-full overflow-hidden">
            <div className="w-2.5 h-full bg-brand-purple rounded-full" />
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
                  ? 'bg-brand-purple text-white shadow-xs'
                  : 'bg-white text-body hover:text-heading border border-border-default'
              }`}
            >
              {t === 'all' ? 'All assets' : `${t}s`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-border-default text-heading placeholder-muted focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 shadow-2xs"
          />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} hoverEffect className="group overflow-hidden flex flex-col justify-between">
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] bg-dark overflow-hidden">
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
                  <h4 className="text-[13.5px] font-semibold text-heading truncate group-hover:text-brand-purple transition-colors">
                    {asset.name}
                  </h4>
                  <button type="button" className="text-muted hover:text-heading p-0.5">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[11.5px] text-muted font-normal">
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
            <div className="px-4 py-2.5 border-t border-border-light bg-canvas flex items-center justify-between text-[11px] text-muted">
              <span>Uploaded {asset.uploadedAt}</span>
              <div className="flex items-center gap-2">
                <button type="button" className="hover:text-brand-purple p-1">
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
