import { useState } from "#imports";
import { computed } from "vue";
import { apiFetch } from "~/composables/useApi";

export interface SupportUser {
  id: number;
  url: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  is_locked: boolean;
  role: string;
  group_names: string;
}

export function useSupportUsers() {
  const users = useState<SupportUser[]>("support-users", () => []);
  const loading = useState<boolean>("support-users:loading", () => false);
  const error = useState<string | null>("support-users:error", () => null);

  const stats = computed(() => ({
    total: users.value.length,
    active: users.value.filter((u) => u.is_active).length,
    admins: users.value.filter((u) => u.is_staff).length,
    support: users.value.filter((u) => !u.is_staff && u.is_active).length,
  }));

  async function fetchUsers(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const data = await apiFetch<SupportUser[] | { results: SupportUser[] }>(
        "/api/auth/users",
      );
      users.value = Array.isArray(data) ? data : data.results;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Error al cargar usuarios";
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(
    id: number,
    data: Partial<Pick<SupportUser, "is_active" | "is_locked">>,
  ): Promise<void> {
    await apiFetch(`/api/auth/users/${id}`, { method: "PATCH", body: data });
    const idx = users.value.findIndex((u) => u.id === id);
    if (idx !== -1)
      users.value[idx] = { ...users.value[idx], ...data } as SupportUser;
  }

  return { users, stats, loading, error, fetchUsers, updateUser };
}
