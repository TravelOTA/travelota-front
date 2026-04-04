import { useState, computed } from "#imports";
import { apiFetch } from "~/composables/useApi";

export interface AdminAgency {
  id: number;
  url: string;
  commercial_name: string;
  fiscal_id: string;
  address: string;
  web: string;
  contact_name: string;
  country: string;
  /** Corporate registration email — read-only, only editable by SuperAdmin */
  email: string;
  /** Corporate registration phone — read-only, only editable by SuperAdmin */
  phone: string;
  /** Public contact email shown to clients — editable via whitelabel config */
  public_email: string;
  /** Public contact phone shown to clients — editable via whitelabel config */
  public_phone: string;
  logo: string;
  primary_color: string;
  agency_group: { id: number; name: string } | null;
  markup: number;
  status: "active" | "pending" | "blocked" | "denied";
  user_count: number;
  booking_count: number;
  created_at: string;
  next_settlement: string | null;
}

interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export function useAgencies() {
  const agencies = useState<AdminAgency[]>("admin:agencies", () => []);
  const loading = useState<boolean>("admin:agencies:loading", () => false);
  const error = useState<string | null>("admin:agencies:error", () => null);

  const agencyStats = computed(() => ({
    total: agencies.value.length,
    active: agencies.value.filter((a) => a.status === "active").length,
    pending: agencies.value.filter((a) => a.status === "pending").length,
    blocked: agencies.value.filter((a) => a.status === "blocked").length,
    denied: agencies.value.filter((a) => a.status === "denied").length,
  }));

  async function fetchAgencies(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiFetch<
        PaginatedResponse<AdminAgency> | AdminAgency[]
      >("/api/agency/agencies");
      agencies.value = Array.isArray(response) ? response : response.results;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Error al cargar las agencias";
    } finally {
      loading.value = false;
    }
  }

  function getAgencyById(id: number | string): AdminAgency | undefined {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    return agencies.value.find((a) => a.id === numericId);
  }

  async function updateAgency(
    id: number | string,
    data: Partial<AdminAgency>,
  ): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const updated = await apiFetch<AdminAgency>(
        `/api/agency/agencies/${id}`,
        { method: "PATCH", body: data },
      );
      const idx = agencies.value.findIndex((a) => a.id === updated.id);
      if (idx !== -1) agencies.value[idx] = updated;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Error al actualizar la agencia";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function approveAgency(
    id: number | string,
    groupId: number,
  ): Promise<void> {
    await updateAgency(id, {
      status: "active",
      agency_group: { id: groupId, name: "" },
    });
  }

  async function denyAgency(id: number | string): Promise<void> {
    await updateAgency(id, { status: "denied" });
  }

  async function toggleBlock(id: number | string): Promise<void> {
    const agency = getAgencyById(id);
    if (!agency) return;
    const newStatus = agency.status === "blocked" ? "active" : "blocked";
    await updateAgency(id, { status: newStatus });
  }

  async function deleteAgency(id: number | string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await apiFetch(`/api/agency/agencies/${id}`, { method: "DELETE" });
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      agencies.value = agencies.value.filter((a) => a.id !== numericId);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Error al eliminar la agencia";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    agencies,
    agencyStats,
    loading,
    error,
    fetchAgencies,
    getAgencyById,
    updateAgency,
    approveAgency,
    denyAgency,
    toggleBlock,
    deleteAgency,
  };
}
