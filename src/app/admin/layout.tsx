'use client';

import React from 'react';
import { AdminProvider, AdminShell, AdminGuard } from '@/features/admin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminProvider>
        <AdminShell>{children}</AdminShell>
      </AdminProvider>
    </AdminGuard>
  );
}
