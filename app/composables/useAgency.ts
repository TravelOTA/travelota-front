import { computed } from 'vue';
import type { Agency } from '~/utils/schemas';

const defaultAgency: Agency = {
  commercial_name: '',
  fiscal_id: '',
  country: '',
  email: '',
  phone: '',
  address: '',
  logo: undefined,
  primary_color: 'green',
  created_at: '',
  status: '',
  user_count: 0,
  booking_count: 0,
  next_settlement: null,
  markup: 0,
};

export const useAgency = () => {
  // Nuxt server mock — llamada directa sin apiBaseUrl (no es el backend Django)
  const { data, refresh } = useAsyncData<Agency>('agency', () =>
    $fetch('/api/agency'),
  );

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
