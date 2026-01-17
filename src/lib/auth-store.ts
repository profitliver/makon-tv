"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

interface AuthState {
      user: Profile | null;
      isLoading: boolean;
      isAuthenticated: boolean;
      initialize: () => Promise<void>;
      login: (email: string, password: string) => Promise<{ error: string | null }>;
      register: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
      logout: () => Promise<void>;
      updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
      canWatch: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      initialize: async () => {
              const supabase = createClient();

        try {
                  const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                            const { data: profile } = await supabase
                              .from("profiles")
                              .select("*")
                              .eq("id", session.user.id)
                              .single();

                    set({
                                  user: profile,
                                  isAuthenticated: true,
                                  isLoading: false,
                    });
                } else {
                            set({ user: null, isAuthenticated: false, isLoading: false });
                }

                supabase.auth.onAuthStateChange(async (event, session) => {
                            if (session?.user) {
                                          const { data: profile } = await supabase
                                            .from("profiles")
                                            .select("*")
                                            .eq("id", session.user.id)
                                            .single();

                              set({
                                              user: profile,
                                              isAuthenticated: true,
                                              isLoading: false,
                              });
                            } else {
                                          set({ user: null, isAuthenticated: false, isLoading: false });
                            }
                });
        } catch (error) {
                  console.error("Auth initialization error:", error);
                  set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
              const supabase = createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
                  email,
                  password,
        });

        if (error) {
                  return { error: error.message };
        }

        if (data.user) {
                  const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", data.user.id)
                    .single();

                set({
                            user: profile,
                            isAuthenticated: true,
                });
        }

        return { error: null };
      },

      register: async (email: string, password: string, name: string) => {
              const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                              data: {
                                            display_name: name,
                              },
                  },
        });

        if (error) {
                  return { error: error.message };
        }

        if (data.user) {
                  const { error: profileError } = await supabase.from("profiles").insert({
                              id: data.user.id,
                              email: data.user.email,
                              display_name: name,
                              wallet_balance: 0,
                              admin_access: false,
                              preferred_language: "ru",
                              is_admin: false,
                  });

                if (profileError) {
                            console.error("Profile creation error:", profileError);
                }

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", data.user.id)
                    .single();

                set({
                            user: profile,
                            isAuthenticated: true,
                });
        }

        return { error: null };
      },

      logout: async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              set({ user: null, isAuthenticated: false });
      },

      updateProfile: async (updates: Partial<Profile>) => {
              const supabase = createClient();
              const user = get().user;

        if (!user) {
                  return { error: "Not authenticated" };
        }

        const { error } = await supabase
                .from("profiles")
                .update(updates)
                .eq("id", user.id);

        if (error) {
                  return { error: error.message };
        }

        set({ user: { ...user, ...updates } });
              return { error: null };
      },

      canWatch: () => {
              const user = get().user;

        if (!user) return false;

        if (user.admin_access) {
                  if (user.admin_access_until) {
                              return new Date() < new Date(user.admin_access_until);
                  }
                  return true;
        }

        if (user.subscription_tier && user.subscription_expires_at) {
                  return new Date() < new Date(user.subscription_expires_at);
        }

        return false;
      },
}));
