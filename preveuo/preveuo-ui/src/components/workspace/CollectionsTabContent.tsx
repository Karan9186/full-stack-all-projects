'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { Search, Filter, Folder, ChevronRight, Plus } from 'lucide-react';
import { WORKSPACE_COLLECTIONS } from '@/lib/workspaceDashboardData';

export const CollectionsTabContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCollections = WORKSPACE_COLLECTIONS.filter((col) =>
    col.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    col.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-[#0f0f1a]">
            Collections
          </h2>
          <p className="text-[13.5px] text-[#6b7280] font-normal mt-0.5">
            Group demos into curated, shareable experiences.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Collection
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-[#e5e7eb] text-[#0f0f1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/15 shadow-2xs"
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white border border-[#e5e7eb] text-[#0f0f1a] shadow-2xs hover:border-[#d1d5db] transition-colors cursor-pointer shrink-0"
        >
          <Filter className="w-3.5 h-3.5 text-[#6b7280]" />
          <span>Filter</span>
        </button>
      </div>

      {/* Collections Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((col) => (
          <Card
            key={col.id}
            hoverEffect
            className="group flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            <div>
              {/* Banner with purple outline folder icon */}
              <div className="h-44 bg-[#fafafc] border-b border-[#f0f0f4] flex items-center justify-center p-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#5B5CE2] group-hover:scale-110 transition-transform">
                  <Folder className="w-8 h-8 stroke-[1.5]" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-[15px] text-[#0f0f1a] group-hover:text-[#5B5CE2] transition-colors mb-1.5">
                  {col.title}
                </h3>
                <p className="text-[12.5px] font-normal text-[#6b7280] line-clamp-1">
                  {col.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#f0f0f4] bg-white flex items-center justify-between text-[11.5px]">
              <span className="text-[#9ca3af] font-normal">{col.status}</span>
              <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#5B5CE2] group-hover:translate-x-0.5 transition-all" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
