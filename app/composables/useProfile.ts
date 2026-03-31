import { useState } from "#imports";
import { apiFetch } from "~/composables/useApi";

export interface UserProfile {
  avatar: string | null;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  preferred_language: string;
  is_staff: boolean;
  is_active: boolean;
  is_locked: boolean;
}

export function useProfile() {
  const profile = useState<UserProfile | null>("profile:data", () => null);
  const loading = useState<boolean>("profile:loading", () => false);
  const error = useState<string | null>("profile:error", () => null);

  async function fetchProfile(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      profile.value = await apiFetch<UserProfile>("/api/auth/me");
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Error al cargar el perfil";
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(data: Partial<Pick<UserProfile, "first_name" | "last_name" | "phone_number" | "preferred_language" | "avatar">>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      profile.value = await apiFetch<UserProfile>("/api/auth/me", {
        method: "POST",
        body: data,
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Error al actualizar el perfil";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
}
