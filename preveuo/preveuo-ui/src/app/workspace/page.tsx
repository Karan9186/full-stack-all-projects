'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  WorkspaceSidebar,
  WorkspaceNavbar,
  WorkspaceGreetingHeader,
  WorkspaceMetricsRow,
  WorkspacePerformanceChart,
  WorkspaceQuickActions,
  WorkspaceRecentDemos,
  WorkspaceTeamActivity,
  DemosTabContent,
  CollectionsTabContent,
  TemplatesTabContent,
  AnalyticsTabContent,
  AudienceTabContent,
  AssetsTabContent,
  IntegrationsTabContent,
  AiStudioTabContent,
  ActivityTabContent,
  HelpTabContent,
  NotificationsTabContent,
  SettingsTabContent,
  CreateProjectModal,
} from '@/components/workspace';
import { authService } from '@/lib/api/authService';

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'home';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const session = authService.getStoredSession();
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('preveuo_token=');
    if (!session && !hasCookie) {
      window.location.replace('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleCreateProject = (name: string, category: string) => {
    window.location.href = `/create?name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`;
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#5B5CE2] border-t-transparent animate-spin" />
      </div>
    );
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'demos':
        return 'Demos';
      case 'collections':
        return 'Collections';
      case 'templates':
        return 'Templates';
      case 'analytics':
        return 'Analytics';
      case 'audience':
        return 'Audience';
      case 'assets':
        return 'Asset Library';
      case 'integrations':
        return 'Integrations';
      case 'ai-studio':
        return 'AI Studio';
      case 'activity':
        return 'Activity & Audit Log';
      case 'help':
        return 'Help & Resources';
      case 'notifications':
        return 'Notifications';
      case 'settings':
        return 'Settings';
      default:
        return 'Home';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0f0f1a] flex font-sans selection:bg-[#5B5CE2] selection:text-white">
      {/* Left Sidebar */}
      <WorkspaceSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.history.pushState(null, '', `/workspace?tab=${tab}`);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <WorkspaceNavbar
          pageTitle={getPageTitle()}
          onCreateDemo={() => setShowCreateModal(true)}
        />

        {/* Dashboard Dynamic Tab Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'demos' && (
            <DemosTabContent onCreateDemo={() => setShowCreateModal(true)} />
          )}

          {activeTab === 'collections' && (
            <CollectionsTabContent />
          )}

          {activeTab === 'templates' && (
            <TemplatesTabContent />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTabContent />
          )}

          {activeTab === 'audience' && (
            <AudienceTabContent />
          )}

          {activeTab === 'assets' && (
            <AssetsTabContent />
          )}

          {activeTab === 'integrations' && (
            <IntegrationsTabContent />
          )}

          {activeTab === 'ai-studio' && (
            <AiStudioTabContent />
          )}

          {activeTab === 'activity' && (
            <ActivityTabContent />
          )}

          {activeTab === 'help' && (
            <HelpTabContent />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTabContent />
          )}

          {activeTab === 'settings' && (
            <SettingsTabContent />
          )}

          {activeTab === 'home' && (
            <>
              {/* Greeting & Date Filter */}
              <WorkspaceGreetingHeader />

              {/* 4 Metric Stat Cards with Sparklines */}
              <WorkspaceMetricsRow />

              {/* Performance Chart & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                <div className="lg:col-span-8">
                  <WorkspacePerformanceChart />
                </div>
                <div className="lg:col-span-4">
                  <WorkspaceQuickActions />
                </div>
              </div>

              {/* Recent Demos & Team Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <WorkspaceRecentDemos />
                </div>
                <div className="lg:col-span-4">
                  <WorkspaceTeamActivity />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Floating Help Button */}
      <button
        type="button"
        aria-label="Help & Support"
        onClick={() => {
          setActiveTab('help');
          window.history.pushState(null, '', '/workspace?tab=help');
        }}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-[#0f0f1a] text-white flex items-center justify-center font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer z-40 border border-white/10"
      >
        ?
      </button>

      {/* Create Demo Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fc]" />}>
      <WorkspaceContent />
    </Suspense>
  );
}
