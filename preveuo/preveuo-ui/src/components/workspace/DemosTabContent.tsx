'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge } from '@/components/ui';
import {
  Search,
  Filter,
  ChevronDown,
  LayoutGrid,
  List,
  Eye,
  TrendingUp,
  Share2,
  BarChart2,
  MoreHorizontal,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Check,
} from 'lucide-react';
import { IDemo } from '@/types/demo';

interface DemosTabContentProps {
  onCreateDemo: () => void;
}

export const DemosTabContent: React.FC<DemosTabContentProps> = ({ onCreateDemo }) => {
  const router = useRouter();
  const [filterTab, setFilterTab] = useState<'all' | 'published' | 'drafts' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [demos, setDemos] = useState<IDemo[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchDemos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/demos');
      const data = await res.json();
      if (res.ok && data.success && data.data?.demos) {
        setDemos(data.data.demos);
      }
    } catch (err) {
      console.error('Failed to fetch workspace demos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const handleDuplicate = async (demoId: string) => {
    try {
      const res = await fetch(`/api/demos/${demoId}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchDemos();
      } else {
        alert(data.error || 'Failed to duplicate demo');
      }
    } catch {
      alert('Error duplicating demo');
    }
  };

  const handleDelete = async (demoId: string) => {
    if (!confirm('Are you sure you want to delete this demo?')) return;
    try {
      const res = await fetch(`/api/demos/${demoId}`, { method: 'DELETE' });
      if (res.ok) {
        setDemos((prev) => prev.filter((d) => d.id !== demoId && d._id !== demoId));
      }
    } catch {
      alert('Error deleting demo');
    }
  };

  const handleCopyShare = (publicId?: string) => {
    if (!publicId) return;
    const url = `${window.location.origin}/d/${publicId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(publicId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filterTabs = [
    { id: 'all', label: 'All demos', count: demos.length },
    { id: 'published', label: 'Published' },
    { id: 'drafts', label: 'Drafts' },
    { id: 'archived', label: 'Archived' },
  ];

  const filteredDemos = demos.filter((demo) => {
    if (filterTab === 'published' && demo.status !== 'published') return false;
    if (filterTab === 'drafts' && demo.status !== 'draft') return false;
    if (filterTab === 'archived' && demo.status !== 'archived') return false;
    if (searchTerm) {
      return (
        demo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (demo.description && demo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return true;
  });

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-heading">
            Your demos
          </h2>
          <p className="text-[13.5px] text-body font-normal mt-0.5">
            Create, organize, and share interactive product stories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/demos/new">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create demo
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-6 border-b border-border-default mb-6 overflow-x-auto no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = filterTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id as typeof filterTab)}
              className={`pb-3 text-[13.5px] transition-all relative whitespace-nowrap cursor-pointer ${
                isActive ? 'text-heading font-semibold' : 'text-body font-medium hover:text-heading'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-2 text-xs font-mono text-muted">
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search demos input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search demos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-border-default text-heading placeholder-muted focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 shadow-2xs"
            />
          </div>

          {/* Filter button */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-border-default text-heading shadow-2xs hover:border-border-input transition-colors cursor-pointer shrink-0"
          >
            <Filter className="w-3.5 h-3.5 text-body" />
            <span>Filter</span>
          </button>
        </div>

        {/* View toggles */}
        <div className="flex items-center rounded-xl bg-white border border-border-default p-1 shadow-2xs self-end sm:self-auto">
          <button
            type="button"
            aria-label="Grid view"
            className="p-1.5 rounded-lg bg-border-light text-heading shadow-xs cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="List view"
            className="p-1.5 rounded-lg text-muted hover:text-heading transition-colors cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Demos Cards Grid (3 Columns) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-white rounded-2xl border border-border-default animate-pulse" />
          ))}
        </div>
      ) : filteredDemos.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border-default p-12 text-center max-w-md mx-auto my-6 shadow-sm">
          <h3 className="text-base font-bold text-heading mb-1">No demos found</h3>
          <p className="text-xs text-body mb-5">
            Create an interactive walkthrough to engage prospects and train customers.
          </p>
          <Link href="/demos/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Demo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDemos.map((demo) => {
            const demoId = demo.id || demo._id;
            return (
              <Card
                key={demoId}
                hoverEffect
                className="group flex flex-col justify-between overflow-hidden bg-white"
              >
                <Link href={`/demos/${demoId}`} className="block flex-1 cursor-pointer">
                  {/* Preview Banner */}
                  <div className="h-40 relative flex overflow-hidden border-b border-border-light bg-dark">
                    {demo.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={demo.thumbnail}
                        alt={demo.name}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-dark flex items-center justify-center text-white/30 text-xs font-medium">
                        No Preview
                      </div>
                    )}

                    {/* Step pill */}
                    <div className="absolute bottom-2 left-2">
                      <span className="text-[10px] font-bold text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 tracking-wide">
                        {demo.stepsCount || 1} steps
                      </span>
                    </div>

                    {/* Status pill */}
                    <div className="absolute top-2 right-2">
                      {demo.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-white/80 font-bold text-[10px] border border-white/10">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-semibold text-[15px] tracking-tight text-heading group-hover:text-brand-purple transition-colors truncate">
                        {demo.name}
                      </h4>
                    </div>

                    <p className="text-[12.5px] font-normal text-body line-clamp-1 mb-4 leading-relaxed">
                      {demo.description || 'Guided product tour created with Preveuo Studio.'}
                    </p>

                    {/* Metrics */}
                    <div className="flex items-center gap-3 text-xs font-normal text-body pt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-muted" />
                        {(demo.viewsCount || 0).toLocaleString()}
                      </span>

                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-muted" />
                        {demo.viewsCount && demo.viewsCount > 0
                          ? `${Math.round(((demo.completionsCount || 0) / demo.viewsCount) * 100)}%`
                          : '0%'}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Card Footer */}
                <div className="px-5 py-3 border-t border-border-light bg-canvas flex items-center justify-between text-[11px] text-muted font-normal">
                  <Link
                    href={`/demos/${demoId}`}
                    className="inline-flex items-center gap-1 font-medium text-xs text-brand-purple hover:underline"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Open Studio</span>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    {demo.publicId && demo.status === 'published' && (
                      <button
                        type="button"
                        onClick={() => handleCopyShare(demo.publicId)}
                        className="p-1 rounded-md text-muted hover:text-brand-purple hover:bg-white transition-colors cursor-pointer"
                        title="Copy public link"
                      >
                        {copiedId === demo.publicId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDuplicate(demoId!)}
                      className="p-1 rounded-md text-muted hover:text-heading hover:bg-white transition-colors cursor-pointer"
                      title="Duplicate demo"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(demoId!)}
                      className="p-1 rounded-md text-muted hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete demo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
