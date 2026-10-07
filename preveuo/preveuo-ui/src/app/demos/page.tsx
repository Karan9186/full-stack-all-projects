'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge } from '@/components/ui';
import {
  Search,
  Filter,
  Plus,
  Eye,
  TrendingUp,
  Share2,
  Trash2,
  Copy,
  ExternalLink,
  Edit3,
  Layers,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { IDemo } from '@/types/demo';

export default function DemosDashboardPage() {
  const router = useRouter();
  const [demos, setDemos] = useState<IDemo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchDemos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/demos');
      const data = await res.json();
      if (res.ok && data.success) {
        setDemos(data.data.demos || []);
      }
    } catch (err) {
      console.error('Failed to load demos:', err);
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
    if (!confirm('Are you sure you want to delete this interactive demo?')) return;
    try {
      const res = await fetch(`/api/demos/${demoId}`, { method: 'DELETE' });
      if (res.ok) {
        setDemos((prev) => prev.filter((d) => d.id !== demoId && d._id !== demoId));
      } else {
        alert('Failed to delete demo');
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

  const filteredDemos = demos.filter((demo) => {
    if (filterTab === 'published' && demo.status !== 'published') return false;
    if (filterTab === 'draft' && demo.status !== 'draft') return false;
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
    <div className="min-h-screen bg-[#f8f9fc] text-[#0f0f1a] font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-[#e5e7eb] bg-white px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/workspace"
            className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] hover:text-[#0f0f1a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Workspace</span>
          </Link>
          <span className="text-[#d1d5db]">/</span>
          <h1 className="text-lg font-extrabold text-[#0f0f1a] tracking-tight">
            Interactive Demos & Tours
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/demos/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Demo
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* Banner Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f0f1a] tracking-tight mb-1">
            Demo Management Studio
          </h2>
          <p className="text-sm text-[#6b7280]">
            Create, edit, personalize, and publish interactive walkthroughs with real-time viewer tracking.
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 border-b border-[#e5e7eb] sm:border-0 pb-2 sm:pb-0 overflow-x-auto">
            {(['all', 'published', 'draft', 'archived'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  filterTab === tab
                    ? 'bg-[#5B5CE2] text-white shadow-xs'
                    : 'bg-white border border-[#e5e7eb] text-[#6b7280] hover:text-[#0f0f1a]'
                }`}
              >
                {tab === 'all' ? `All Demos (${demos.length})` : tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search demos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-[#e5e7eb] text-[#0f0f1a] placeholder-[#9ca3af] focus:outline-none focus:border-[#5B5CE2] shadow-2xs"
            />
          </div>
        </div>

        {/* Demos Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-72 bg-white rounded-2xl border border-[#e5e7eb] animate-pulse p-4"
              />
            ))}
          </div>
        ) : filteredDemos.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e5e7eb] p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#5B5CE2]/10 text-[#5B5CE2] flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0f0f1a] mb-2">No Demos Found</h3>
            <p className="text-xs text-[#6b7280] mb-6 leading-relaxed">
              {searchTerm
                ? `No demos matched "${searchTerm}". Try another search keyword.`
                : 'Get started by creating your first interactive product tour or guided walkthrough.'}
            </p>
            <Link href="/demos/new">
              <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
                Create Your First Demo
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
                  <div>
                    {/* Thumbnail / Header Stage */}
                    <div className="h-44 relative bg-[#0f0f1a] overflow-hidden flex items-center justify-center border-b border-[#f0f0f4]">
                      {demo.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={demo.thumbnail}
                          alt={demo.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center text-white/40">
                          <Sparkles className="w-8 h-8" />
                        </div>
                      )}

                      {/* Top Pill Overlay */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-wider">
                          {demo.type}
                        </span>
                        <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                          {demo.stepsCount || 1} steps
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {demo.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white font-bold text-[10px] shadow-sm backdrop-blur-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 text-white/80 font-bold text-[10px] border border-white/10">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details Body */}
                    <div className="p-5">
                      <h3 className="font-extrabold text-[15px] text-[#0f0f1a] group-hover:text-[#5B5CE2] transition-colors truncate mb-1">
                        {demo.name}
                      </h3>
                      <p className="text-[12.5px] text-[#6b7280] line-clamp-2 mb-4 leading-relaxed">
                        {demo.description || 'Interactive product tour created in Preveuo Studio.'}
                      </p>

                      {/* Metrics Row */}
                      <div className="flex items-center gap-4 text-xs text-[#6b7280] pt-1">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-[#9ca3af]" />
                          {(demo.viewsCount || 0).toLocaleString()} views
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-[#9ca3af]" />
                          {demo.viewsCount && demo.viewsCount > 0
                            ? `${Math.round(((demo.completionsCount || 0) / demo.viewsCount) * 100)}% completed`
                            : '0% completed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="px-5 py-3.5 border-t border-[#f0f0f4] bg-[#fafafc] flex items-center justify-between">
                    <Link
                      href={`/demos/${demoId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B5CE2] hover:text-[#4a4bd4] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Open Studio</span>
                    </Link>

                    <div className="flex items-center gap-1">
                      {/* Copy Share Link if published */}
                      {demo.publicId && demo.status === 'published' && (
                        <button
                          type="button"
                          onClick={() => handleCopyShare(demo.publicId)}
                          className="p-1.5 rounded-lg text-[#6b7280] hover:text-[#5B5CE2] hover:bg-white transition-colors cursor-pointer"
                          title="Copy public link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Duplicate Demo */}
                      <button
                        type="button"
                        onClick={() => handleDuplicate(demoId!)}
                        className="p-1.5 rounded-lg text-[#6b7280] hover:text-[#0f0f1a] hover:bg-white transition-colors cursor-pointer"
                        title="Duplicate demo"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Demo */}
                      <button
                        type="button"
                        onClick={() => handleDelete(demoId!)}
                        className="p-1.5 rounded-lg text-[#6b7280] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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
      </main>
    </div>
  );
}
