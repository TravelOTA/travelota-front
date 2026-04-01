import { useState, useI18n } from '#imports';
import { computed } from 'vue';
import { apiFetch } from '~/composables/useApi';
import type { PaymentMethod as PaymentMethodKey } from '#shared/types/payment';

export interface Country {
  id: number;
  code: string;
  name: string;
}

export interface PaymentMethodConfig {
  key: PaymentMethodKey;
  label: string;
  description: string;
  icon: string;
}

const NATIONALITIES = [
  'Alemania',
  'Argentina',
  'Bolivia',
  'Brasil',
  'Canadá',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Ecuador',
  'El Salvador',
  'España',
  'Estados Unidos',
  'Francia',
  'Guatemala',
  'Honduras',
  'Italia',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'Portugal',
  'Puerto Rico',
  'Reino Unido',
  'República Dominicana',
  'Uruguay',
  'Venezuela',
];

const DESTINATIONS = [
  { label: 'Punta Cana, República Dominicana', code: 'PUJ' },
  { label: 'Cancún, México', code: 'CUN' },
  { label: 'Madrid, España', code: 'MAD' },
  { label: 'Barcelona, España', code: 'BCN' },
  { label: 'Santo Domingo, República Dominicana', code: 'SDQ' },
  { label: 'Cartagena, Colombia', code: 'CTG' },
  { label: 'Miami, Estados Unidos', code: 'MIA' },
  { label: 'Orlando, Estados Unidos', code: 'MCO' },
];

export function useConfig() {
  const { t } = useI18n();

  const countries = useState<Country[]>('config-countries', () => []);
  const loading = useState<boolean>('config-countries:loading', () => false);

  // Nationalities remain static — they represent all world nationalities for
  // passenger forms, not just countries in our catalog.
  const nationalities = useState<string[]>(
    'config-nationalities',
    () => NATIONALITIES,
  );

  const destinations = useState<{ label: string; code: string }[]>(
    'config-destinations',
    () => DESTINATIONS,
  );

  const countryNames = computed<string[]>(() =>
    countries.value.map((c) => c.name),
  );

  async function fetchCountries(): Promise<void> {
    if (countries.value.length > 0) return; // already loaded
    loading.value = true;
    try {
      const data = await apiFetch<Country[] | { results: Country[] }>(
        '/api/hotel/countries',
      );
      countries.value = Array.isArray(data) ? data : data.results;
    } catch {
      // fallback: leave empty, dropdowns will show nothing
    } finally {
      loading.value = false;
    }
  }

  const paymentMethods = computed<PaymentMethodConfig[]>(() => [
    {
      key: 'card',
      label: t('hotels.paymentMethods.card.label'),
      description: t('hotels.paymentMethods.card.description'),
      icon: 'i-heroicons-credit-card',
    },
    {
      key: 'transfer',
      label: t('hotels.paymentMethods.transfer.label'),
      description: t('hotels.paymentMethods.transfer.description'),
      icon: 'i-heroicons-building-library',
    },
    {
      key: 'agency_credit',
      label: t('hotels.paymentMethods.agencyCredit.label'),
      description: t('hotels.paymentMethods.agencyCredit.description'),
      icon: 'i-heroicons-banknotes',
    },
  ]);

  return {
    countries,
    countryNames,
    nationalities,
    destinations,
    paymentMethods,
    loading,
    fetchCountries,
  };
}
