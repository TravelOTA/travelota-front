// app/composables/useBookings.ts
import { useState } from '#imports';
import { computed } from 'vue';
import { apiFetch } from '~/composables/useApi';
import type { IBooking, IBookingListItem } from '#shared/types/booking';

// ── BookingRow type (UI shape for the table) ──
export interface BookingRow {
  id: string;
  pnr: string;
  titular: string;
  hotel_name: string;
  order_ref: string;
  check_in: string;
  check_out: string;
  status: string; // localized or raw
  payment_status: string; // localized or raw
  sell_rate: number;
  net_rate: number;
  created_at: string;
  created_at_iso: string;
}

// ── Status label maps (machine key → Spanish) ──
const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  expired: 'Vencida',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid: 'Pagada',
  pending_payment: 'Pendiente de Pago',
  pending_transfer: 'Pendiente Transferencia',
  deferred: 'Pago Aplazado',
};

// ── Adapter: IBookingListItem → BookingRow ────────────────────────────────────────────
function toBookingRow(b: IBookingListItem): BookingRow {
  return {
    id: String(b.id),
    pnr: b.pnr,
    titular: '—', // ListItem doesn't have titular, mapped in detail
    hotel_name: b.hotel_name,
    order_ref: b.order_ref,
    check_in: b.check_in,
    check_out: b.check_out,
    status: STATUS_LABELS[b.status] ?? b.status,
    payment_status: '—', // ListItem might not have payment_status, needs API check
    sell_rate: parseFloat(b.sell_rate),
    net_rate: parseFloat(b.sell_rate), // Placeholder
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

  async function fetchBookings(orderRef?: string) {
    loading.value = true;
    error.value = null;
    try {
      const qs = orderRef ? `?order_ref=${orderRef}` : '';
      const data = await apiFetch<{ results: IBookingListItem[] }>(`/api/agency/bookings${qs}`);
      bookings.value = (data.results || []).map(toBookingRow);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al cargar reservas';
    } finally {
      loading.value = false;
    }
  }

  async function getBookingById(id: string): Promise<IBooking | null> {
    try {
      return await apiFetch<IBooking>(`/api/bookings/${id}`);
    } catch {
      return null;
    }
  }

  function filterBookings(filters: Record<string, any>): BookingRow[] {
    return bookings.value.filter((b) => {
      if (filters.pnr && !b.pnr.toLowerCase().includes(filters.pnr.toLowerCase())) return false;
      if (filters.hotel_name && !b.hotel_name.toLowerCase().includes(filters.hotel_name.toLowerCase())) return false;
      if (filters.status && b.status !== filters.status) return false;
      if (filters.check_in_from && b.check_in < filters.check_in_from) return false;
      if (filters.check_in_to && b.check_in > filters.check_in_to) return false;
      return true;
    });
  }

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    getBookingById,
    filterBookings,
  };
}

