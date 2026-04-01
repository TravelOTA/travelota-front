import { useState } from '#imports';
import { apiFetch } from '~/composables/useApi';
import type { IRoomDistribution } from '#shared/types/booking';

export interface RoomRate {
  room_code: string;
  room_name: string;
  rate_key: string;
  net_rate: string; // decimal string
  currency: string;
  cancellation_policy: string;
  meal_plan: string;
}

export interface RoomOption {
  rate_key: string;
  total_net_rate: string; // decimal string
  currency: string;
  rooms: RoomRate[];
}

export interface Hotel {
  hotel_code: string;
  hotel_name: string;
  category: number; // stars 1–5
  destination_name: string;
  latitude: number | null;
  longitude: number | null;
  thumbnail: string | null;
  options: RoomOption[];
  // Derived
  best_price: number;
}

export interface HotelFilterState {
  hotelName: string;
  priceMin: number;
  priceMax: number;
  categories: string[];
  regimes: string[];
  hideNR: boolean;
  hideOR: boolean;
}

export interface HotelSearchPayload {
  destination_code: string;
  check_in: string;
  check_out: string;
  rooms: IRoomDistribution[];
}

export function useHotels() {
  const hotels = useState<Hotel[]>('hotels', () => []);
  const loading = useState<boolean>('hotels:loading', () => false);
  const error = useState<string | null>('hotels:error', () => null);

  async function searchHotels(payload: HotelSearchPayload): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const results = await apiFetch<Hotel[]>('/api/hotel/search', {
        method: 'POST',
        body: payload,
      });
      hotels.value = results.map((h) => ({
        ...h,
        best_price: Math.min(
          ...h.options.map((o) => parseFloat(o.total_net_rate)),
        ),
      }));
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al buscar hoteles';
    } finally {
      loading.value = false;
    }
  }

  function getHotelByCode(code: string): Hotel | undefined {
    return hotels.value.find((h) => h.hotel_code === code);
  }

  function filterHotels(filters: HotelFilterState): Hotel[] {
    return hotels.value
      .filter((h) => {
        if (
          filters.hotelName &&
          !h.hotel_name.toLowerCase().includes(filters.hotelName.toLowerCase())
        )
          return false;
        if (h.best_price < filters.priceMin || h.best_price > filters.priceMax)
          return false;
        if (
          filters.categories.length > 0 &&
          !filters.categories.includes(String(h.category))
        )
          return false;
        if (filters.regimes.length > 0) {
          const hotelRegimes = h.options.flatMap((o) =>
            o.rooms.map((r) => r.meal_plan),
          );
          if (!filters.regimes.some((reg) => hotelRegimes.includes(reg)))
            return false;
        }
        if (filters.hideNR) {
          const hasRefundable = h.options.some((o) =>
            o.rooms.some(
              (r) =>
                !r.cancellation_policy
                  .toLowerCase()
                  .includes('no reembolsable') &&
                !r.cancellation_policy.toLowerCase().includes('non-refundable'),
            ),
          );
          if (!hasRefundable) return false;
        }
        if (filters.hideOR) {
          const hasInstant = h.options.some((o) =>
            o.rooms.some(
              (r) =>
                !r.cancellation_policy.toLowerCase().includes('on request'),
            ),
          );
          if (!hasInstant) return false;
        }
        return true;
      })
      .map((h) => {
        let filteredOptions = h.options;
        if (filters.hideNR) {
          filteredOptions = filteredOptions.filter((o) =>
            o.rooms.some(
              (r) =>
                !r.cancellation_policy
                  .toLowerCase()
                  .includes('no reembolsable') &&
                !r.cancellation_policy.toLowerCase().includes('non-refundable'),
            ),
          );
        }
        if (filters.hideOR) {
          filteredOptions = filteredOptions.filter((o) =>
            o.rooms.some(
              (r) =>
                !r.cancellation_policy.toLowerCase().includes('on request'),
            ),
          );
        }
        return { ...h, options: filteredOptions };
      });
  }

  return {
    hotels,
    loading,
    error,
    searchHotels,
    getHotelByCode,
    filterHotels,
  };
}
