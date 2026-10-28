'use client';

import React, { useState } from 'react';
import {
  WorkspaceSidebar,
  WorkspaceNavbar,
  AnalyticsTabContent,
  CreateProjectModal,
} from '@/components/workspace';

export default function AnalyticsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateProject = (name: string, category: string) => {
    window.location.href = `/create?name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`;
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-light text-heading flex font-sans selection:bg-brand-purple selection:text-white">
      {/* Left Sidebar with active Analytics tab */}
      <WorkspaceSidebar
        activeTab="analytics"
        onSelectTab={(tab) => {
          window.location.href = `/workspace?tab=${tab}`;
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <WorkspaceNavbar
          pageTitle="Analytics"
        />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <AnalyticsTabContent />
        </main>
      </div>

      {/* Floating Help Button */}
      <button
        type="button"
        aria-label="Help & Support"
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-dark text-white flex items-center justify-center font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer z-50 border border-white/10"
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
