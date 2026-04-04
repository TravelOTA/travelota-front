import { useState } from "#imports";
import { computed } from "vue";
import { apiFetch } from "~/composables/useApi";
import { useAuth } from "~/composables/useAuth";
import type { Agency } from "~/utils/schemas";

const defaultAgency: Agency = {
  commercial_name: "",
  fiscal_id: "",
  country: "",
  email: "",
  phone: "",
  address: "",
  logo: undefined,
  primary_color: "green",
  agency_group: null,
  markup: 0,
  status: "pending",
  created_at: "",
  next_settlement: null,
};

export const useAgency = () => {
  const { currentUser } = useAuth();
  const data = useState<Agency | null>("agency:data", () => null);
  const loading = useState<boolean>("agency:loading", () => false);
  const error = useState<string | null>("agency:error", () => null);

  const agency = computed<Agency>(() => data.value ?? defaultAgency);

  async function fetchAgency(): Promise<void> {
    // Agency ID comes from the authenticated user profile
    const agencyId = currentUser.value?.agency?.id;
    if (!agencyId) return;

    loading.value = true;
    error.value = null;
    try {
      data.value = await apiFetch<Agency>(`/api/agency/agencies/${agencyId}`);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Error al cargar la agencia";
    } finally {
      loading.value = false;
    }
  }

  async function updateAgency(patch: Partial<Agency>): Promise<void> {
    const agencyId = currentUser.value?.agency?.id;
    if (!agencyId) return;

    loading.value = true;
    error.value = null;
    try {
      data.value = await apiFetch<Agency>(`/api/agency/agencies/${agencyId}`, {
        method: "PATCH",
        body: patch,
      });
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Error al actualizar la agencia";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    agency,
    loading,
    error,
    fetchAgency,
    updateAgency,
  };
};
