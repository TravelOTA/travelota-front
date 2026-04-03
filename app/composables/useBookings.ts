// app/composables/useBookings.ts
import { useState } from '#imports';
import { apiFetch } from '~/composables/useApi';
import type { IBooking, IBookingListItem } from '#shared/types/booking';

// ── Search Filters ────────────────────────────────────────────────────────────
export interface SearchFilters {
  pnr?: string;
  hotel_name?: string;
  status?: string;
  check_in_from?: string;
  check_in_to?: string;
}

// ── BookingRow type (UI shape for the table) ──
export interface BookingRow {
  id: string;
  pnr: string;
  titular: string;
  hotel_name: string;
  order_ref: string;
  check_in: string;
  check_out: string;
  status: string; // raw API value: 'confirmed' | 'cancelled' | 'expired'
  payment_status: string; // raw API value: 'paid' | 'pending_payment' | 'pending_transfer' | 'deferred'
  sell_rate: number;
  net_rate: number;
  seller: string;
  created_at: string;
  created_at_iso: string;
}

// ── Adapter: IBookingListItem → BookingRow ────────────────────────────────────────────
function toBookingRow(b: IBookingListItem): BookingRow {
  return {
    id: String(b.id),
    pnr: b.pnr,
    titular: b.titular || '—',
    hotel_name: b.hotel_name,
    order_ref: b.order_ref,
    check_in: b.check_in,
    check_out: b.check_out,
    status: b.status,
    payment_status: b.payment_status ?? 'pending_payment',
    sell_rate: parseFloat(b.sell_rate),
    net_rate: parseFloat(b.sell_rate),
    seller: 'Sistema', // Default for now
    created_at: new Date(b.created_at).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    created_at_iso: b.created_at.slice(0, 10),
  };
}

// ── Composable ────────────────────────────────────────────────────────────────
export function useBookings() {
  const bookings = useState<BookingRow[]>('bookings', () => []);
  const loading = useState<boolean>('bookings:loading', () => false);
  const error = useState<string | null>('bookings:error', () => null);
  const agencyOptions = useState<string[]>('bookings:agencies', () => [
    'Todas',
  ]);
  const sellerOptions = useState<string[]>('bookings:sellers', () => [
    'Todos',
    'Sistema',
  ]);

  async function fetchBookings(orderRef?: string) {
    loading.value = true;
    error.value = null;
    try {
      const qs = orderRef ? `?order_ref=${orderRef}` : '';
      // The API might return { results: [] } or a raw array depending on the viewset (ModelViewSet with pagination)
      const data = await apiFetch<
        IBookingListItem[] | { results: IBookingListItem[] }
      >(`/api/agency/bookings${qs}`);
      const rawList: IBookingListItem[] = Array.isArray(data)
        ? data
        : data.results || [];

      bookings.value = rawList.map(toBookingRow);

      // Simple derivation of seller options from results if empty
      if (sellerOptions.value.length <= 2 && rawList.length > 0) {
        // In a real app, this would be a separate API call to /api/agency/sellers
        sellerOptions.value = ['Todos', 'Sistema', 'Admin'];
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al cargar reservas';
    } finally {
      loading.value = false;
    }
  }

  async function getBookingById(id: string): Promise<IBooking | null> {
    try {
      return await apiFetch<IBooking>(`/api/agency/bookings/${id}`);
    } catch {
      return null;
    }
  }

  function filterBookings(filters: SearchFilters): BookingRow[] {
    return bookings.value.filter((b) => {
      if (
        filters.pnr &&
        !b.pnr.toLowerCase().includes(String(filters.pnr).toLowerCase())
      )
        return false;
      if (
        filters.hotel_name &&
        !b.hotel_name
          .toLowerCase()
          .includes(String(filters.hotel_name).toLowerCase())
      )
        return false;
      if (filters.status && b.status !== filters.status) return false;
      if (filters.check_in_from && b.check_in < filters.check_in_from)
        return false;
      if (filters.check_in_to && b.check_in > filters.check_in_to) return false;
      return true;
    });
  }

  return {
    bookings,
    loading,
    error,
    agencyOptions,
    sellerOptions,
    fetchBookings,
    getBookingById,
    filterBookings,
  };
}
