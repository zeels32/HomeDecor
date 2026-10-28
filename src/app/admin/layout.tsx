'use client';

import React from 'react';
import { AdminProvider, AdminShell } from '@/features/admin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
