'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Badge } from '@/components/ui';
import { ChevronRight, Play } from 'lucide-react';
import { SAMPLE_PROJECTS } from '@/lib/demoData';

export const WorkspaceRecentDemos: React.FC = () => {
  const recentDemos = SAMPLE_PROJECTS.slice(0, 2);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#0f0f1a]">
            Recent demos
          </h3>
          <p className="text-[12px] text-[#6b7280] font-normal mt-0.5">
            Continue where your team left off
          </p>
        </div>

        <Link
          href="/workspace?tab=demos"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#5B5CE2] hover:underline"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recentDemos.map((demo) => (
          <div
            key={demo.id}
            className="group rounded-2xl border border-[#e5e7eb] hover:border-[#5B5CE2]/40 bg-white overflow-hidden transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-[#0f0f1a] overflow-hidden">
                <Image
                  src={demo.thumbnail}
                  alt={demo.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant="purple" size="sm">
                    {demo.category}
                  </Badge>
                </div>

                <Link
                  href={`/demo?id=${demo.id}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-full bg-[#5B5CE2] text-white flex items-center justify-center shadow-md">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </Link>
              </div>

              <div className="p-4">
                <h4 className="text-[13.5px] font-semibold text-[#0f0f1a] truncate group-hover:text-[#5B5CE2] transition-colors">
                  {demo.name}
                </h4>
                <div className="flex items-center gap-3 text-[11.5px] text-[#6b7280] font-normal mt-2">
                  <span>{demo.views.toLocaleString()} views</span>
                  <span>·</span>
                  <span className="text-emerald-600 font-medium">{demo.completionRate}% completion</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 border-t border-[#f0f0f4] bg-[#fafafc] flex items-center justify-between text-[11px] text-[#9ca3af] font-normal">
              <span>Updated {demo.createdAt}</span>
              <Link href={`/demos/${demo.id}`} className="font-medium text-[#5B5CE2] hover:underline">
                Edit tour
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
