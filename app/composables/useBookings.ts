// app/composables/useBookings.ts
import { useState } from "#imports";
import { computed } from "vue";
import { apiFetch } from "~/composables/useApi";
import type { IBooking } from "#shared/types/booking";

// ── BookingRow type (UI shape — kept for backward compatibility with existing components) ──
export interface BookingRow {
  id: string;
  titular: string;
  destination: string;
  checkIn: string;
  checkInISO: string;
  checkOut: string;
  status: string; // localized Spanish label: "Confirmada" | "Cancelada" | "Vencida"
  paymentStatus: string; // localized Spanish label: "Pagada" | "Pendiente de Pago" | ...
  total: number; // alias for compatibility with bookings/index.vue
  netPrice: number;
  agencyPrice: number;
  salePrice: number;
  seller: string;
  agency: string;
  createdAt: string;
  createdAtISO: string;
}

export interface SearchFilters {
  search: string;
  status: string;
  paymentStatus: string;
  dateFrom: string;
  dateTo: string;
  seller: string;
  agency: string;
  minPrice: number;
  maxPrice: number;
}

// ── Status label maps (machine key → Spanish, matching existing UI badge logic) ──
const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  expired: "Vencida",
};
const PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid: "Pagada",
  pending_payment: "Pendiente de Pago",
  pending_transfer: "Pendiente Transferencia",
  deferred: "Pago Aplazado",
};

// ── Adapter: IBooking → BookingRow ────────────────────────────────────────────
function toBookingRow(b: IBooking): BookingRow {
  const createdDate = new Date(b.createdAt);
  return {
    id: b.id,
    titular: `${b.titular.nombre} ${b.titular.apellido}`,
    destination: b.hotel.address,
    checkIn: b.checkIn,
    checkInISO: b.checkIn,
    checkOut: b.checkOut,
    status: STATUS_LABELS[b.status] ?? b.status,
    paymentStatus: PAYMENT_STATUS_LABELS[b.paymentStatus] ?? b.paymentStatus,
    total: b.totalPrice,
    netPrice: b.totalPrice,
    agencyPrice: b.totalPrice,
    salePrice: b.totalPrice,
    seller: b.createdBy,
    agency: b.agencyId,
    createdAt: createdDate.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    createdAtISO: b.createdAt.slice(0, 10),
  };
}

// ── Composable ────────────────────────────────────────────────────────────────
export function useBookings() {
  const bookings = useState<BookingRow[]>("bookings", () => []);
  const loading = useState<boolean>("bookings:loading", () => false);
  const error = useState<string | null>("bookings:error", () => null);

  async function fetchBookings(orderRef?: string) {
    loading.value = true;
    error.value = null;
    try {
      const qs = orderRef ? `?order_ref=${orderRef}` : "";
      const data = await apiFetch<IBooking[]>(`/api/bookings${qs}`);
      bookings.value = data.map(toBookingRow);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Error al cargar reservas";
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

  function filterBookings(filters: Partial<SearchFilters>): BookingRow[] {
    return bookings.value.filter((b) => {
      if (
        filters.search &&
        !b.titular.toLowerCase().includes(filters.search.toLowerCase()) &&
        !b.id.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.status && b.status !== filters.status) return false;
      if (filters.paymentStatus && b.paymentStatus !== filters.paymentStatus)
        return false;
      if (filters.dateFrom && b.checkInISO < filters.dateFrom) return false;
      if (filters.dateTo && b.checkInISO > filters.dateTo) return false;
      if (filters.seller && b.seller !== filters.seller) return false;
      if (filters.agency && b.agency !== filters.agency) return false;
      if (filters.minPrice && b.netPrice < filters.minPrice) return false;
      if (filters.maxPrice && b.netPrice > filters.maxPrice) return false;
      return true;
    });
  }

  const agencyOptions = computed(() =>
    [...new Set(bookings.value.map((b) => b.agency))].filter(Boolean),
  );
  const sellerOptions = computed(() =>
    [...new Set(bookings.value.map((b) => b.seller))].filter(Boolean),
  );

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    getBookingById,
    filterBookings,
    agencyOptions,
    sellerOptions,
  };
}
