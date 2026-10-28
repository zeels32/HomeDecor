'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface CustomerProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: CustomerProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<CustomerProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    const supabase = createClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const profileRow = data as any;
      if (!error && profileRow) {
        setProfile({
          id: profileRow.id,
          email,
          full_name: profileRow.full_name || 'Valued Customer',
          phone: profileRow.phone || undefined,
          is_admin: profileRow.is_admin || false,
        });
      } else {
        setProfile({
          id: userId,
          email,
          full_name: 'Valued Customer',
        });
      }
    } catch {
      setProfile({
        id: userId,
        email,
        full_name: 'Valued Customer',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const supabase = createClient();

    if (!supabase) {
      setIsLoading(false);
      return { success: false, error: 'Database service unavailable' };
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }

    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.email || email);
    }
    setIsLoading(false);
    return { success: true };
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const supabase = createClient();

    if (!supabase) {
      setIsLoading(false);
      return { success: false, error: 'Database service unavailable' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }

    if (data.user) {
      setUser(data.user);
      setProfile({
        id: data.user.id,
        email,
        full_name: fullName,
      });
    }
    setIsLoading(false);
    return { success: true };
  };

  const signOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/profile`,
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  };

  const updateProfile = async (data: Partial<CustomerProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!profile) return { success: false, error: 'No profile loaded' };

    const updated = { ...profile, ...data };
    setProfile(updated);

    const supabase = createClient();
    if (supabase) {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          full_name: updated.full_name,
          phone: updated.phone || null,
        })
        .eq('id', profile.id);

      if (error) return { success: false, error: error.message };
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
