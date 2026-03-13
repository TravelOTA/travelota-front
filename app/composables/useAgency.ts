import { computed } from "vue";
import type { Agency } from "~/utils/schemas";

const defaultAgency: Agency = {
  name: "",
  rut: "",
  country: "",
  email: "",
  phone: "",
  address: "",
  logo: undefined,
  primaryColor: "green",
  registeredAt: "",
  status: "",
  usersCount: 0,
  bookingsCount: 0,
  nextSettlement: "",
};

export const useAgency = () => {
  const { data, refresh } = useApi<Agency>("/api/agency", { key: "agency" });

  // Always non-null: falls back to defaults while loading
  const agency = computed<Agency>(() => data.value ?? defaultAgency);

  const updateAgency = (newData: Partial<Agency>) => {
    if (data.value) {
      data.value = { ...data.value, ...newData };
    }
  };

  return {
    agency,
    updateAgency,
    refresh,
  };
};
