'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useAdmin } from '../admin-context';

export function AdminToastContainer() {
  const { toasts, removeToast } = useAdmin();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-sm shadow-elevated border text-xs transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-forest-900 text-white border-forest-800'
                : isError
                ? 'bg-red-900 text-white border-red-800'
                : 'bg-charcoal text-white border-charcoal-light'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />}
              {isError && <AlertTriangle className="w-4 h-4 text-red-300 flex-shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-sage-300 flex-shrink-0" />}
              <span className="font-medium leading-snug">{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
