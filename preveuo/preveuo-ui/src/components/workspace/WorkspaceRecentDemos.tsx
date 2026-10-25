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
          <h3 className="text-[15px] sm:text-[16px] font-semibold text-heading">
            Recent demos
          </h3>
          <p className="text-[12px] text-body font-normal mt-0.5">
            Continue where your team left off
          </p>
        </div>

        <Link
          href="/workspace?tab=demos"
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-purple hover:underline"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recentDemos.map((demo) => (
          <div
            key={demo.id}
            className="group rounded-2xl border border-border-default hover:border-brand-purple/40 bg-white overflow-hidden transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-dark overflow-hidden">
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
                  <div className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-md">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </Link>
              </div>

              <div className="p-4">
                <h4 className="text-[13.5px] font-semibold text-heading truncate group-hover:text-brand-purple transition-colors">
                  {demo.name}
                </h4>
                <div className="flex items-center gap-3 text-[11.5px] text-body font-normal mt-2">
                  <span>{demo.views.toLocaleString()} views</span>
                  <span>·</span>
                  <span className="text-emerald-600 font-medium">{demo.completionRate}% completion</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 border-t border-border-light bg-canvas flex items-center justify-between text-[11px] text-muted font-normal">
              <span>Updated {demo.createdAt}</span>
              <Link href={`/demos/${demo.id}`} className="font-medium text-brand-purple hover:underline">
                Edit tour
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
