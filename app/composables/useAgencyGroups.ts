import { useState } from "#imports";
import { apiFetch } from "~/composables/useApi";

export interface AgencyGroup {
  id: number;
  name: string;
  description: string;
  agency_count: number;
}

export function useAgencyGroups() {
  const groups = useState<AgencyGroup[]>("agency-groups", () => []);
  const loading = useState<boolean>("agency-groups:loading", () => false);
  const error = useState<string | null>("agency-groups:error", () => null);

  async function fetchGroups(): Promise<void> {
    if (groups.value.length > 0) return;
    loading.value = true;
    error.value = null;
    try {
      const data = await apiFetch<AgencyGroup[] | { results: AgencyGroup[] }>(
        "/api/agency/agency_groups",
      );
      groups.value = Array.isArray(data) ? data : data.results;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Error al cargar grupos";
    } finally {
      loading.value = false;
    }
  }

  return { groups, loading, error, fetchGroups };
}
