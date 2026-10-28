'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';
import { AdminToastContainer } from './admin-toast';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sand-50/60 flex flex-col font-sans">
      <AdminHeader onToggleMobileMenu={() => setIsMobileOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <AdminSidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>

      <AdminToastContainer />
    </div>
  );
}
