'use client';

import React, { useState } from 'react';
import { User, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';

export default function AccountProfilePage() {
  const { profile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess(false);

    const result = await updateProfile({
      full_name: fullName,
      phone,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Failed to update profile.');
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-sm border border-subtle-border shadow-soft space-y-6">
      <div className="border-b border-subtle-border pb-4">
        <h2 className="font-serif text-2xl text-charcoal">Profile Settings</h2>
        <p className="text-xs text-muted-gray mt-0.5">
          Update your personal details and concierge contact information.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-800 flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="max-w-md space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-charcoal">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-charcoal">Registered Email</label>
          <input
            type="email"
            disabled
            value={profile?.email || ''}
            className="w-full p-2.5 bg-sand-50 border border-subtle-border rounded-xs text-muted-gray cursor-not-allowed"
          />
          <p className="text-[10px] text-muted-gray">Email cannot be modified directly.</p>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-charcoal">Contact Mobile</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm flex items-center space-x-2 disabled:bg-muted-gray"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span>Save Profile</span>
          )}
        </button>
      </form>
    </div>
  );
}
