<script setup lang="ts">
import { ref, computed } from "vue";
import BookingSearchFilters from "~/components/b2b/hotel/checkout/BookingSearchFilters.vue";
import BookingMassPayment from "~/components/b2b/hotel/checkout/BookingMassPayment.vue";
import VoucherPreviewModal from "~/components/b2b/hotel/checkout/VoucherPreviewModal.vue";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Mis Reservas - TravelOTA B2B",
});

interface SearchFilters {
  pnr: string;
  titular: string;
  destination: string;
  statuses: string[];
  paymentStatuses: string[];
  createdFrom: string;
  createdTo: string;
  checkInFrom: string;
  checkInTo: string;
  agency: string;
  seller: string;
  [key: string]: string | string[];
}

// Types
interface BookingRow {
  id: string;
  createdAt: string;
  createdAtISO: string;
  titular: string;
  destination: string;
  checkIn: string;
  checkInISO: string;
  checkOut: string;
  total: number;
  salePrice: number;
  seller: string;
  paymentStatus: string;
  status: string;
  [key: string]: string | number;
}

// Expanded Mock Data
const allBookings = ref<BookingRow[]>([
  {
    id: "TRV-987654321",
    createdAt: "02/03/2026 15:30",
    createdAtISO: "2026-03-02",
    titular: "Juan Pérez",
    destination: "Punta Cana, DO",
    checkIn: "03/03/2026",
    checkInISO: "2026-03-03",
    checkOut: "10/03/2026",
    total: 6281.41,
    salePrice: 7035.0,
    seller: "Juan Pérez Vendedor",
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-123456789",
    createdAt: "28/02/2026 09:15",
    createdAtISO: "2026-02-28",
    titular: "María López",
    destination: "Cancún, MX",
    checkIn: "15/05/2026",
    checkInISO: "2026-05-15",
    checkOut: "22/05/2026",
    total: 3150.0,
    salePrice: 3530.0,
    seller: "María Gómez",
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-456789123",
    createdAt: "15/01/2026 11:20",
    createdAtISO: "2026-01-15",
    titular: "Carlos Gómez",
    destination: "Miami, US",
    checkIn: "20/02/2026",
    checkInISO: "2026-02-20",
    checkOut: "25/02/2026",
    total: 1840.5,
    salePrice: 2060.0,
    seller: "Juan Pérez Vendedor",
    paymentStatus: "Pendiente Pago",
    status: "Vencida",
  },
  {
    id: "TRV-789123456",
    createdAt: "05/12/2025 16:45",
    createdAtISO: "2025-12-05",
    titular: "Ana Martínez",
    destination: "Orlando, US",
    checkIn: "10/01/2026",
    checkInISO: "2026-01-10",
    checkOut: "17/01/2026",
    total: 4200.75,
    salePrice: 4705.0,
    seller: "María Gómez",
    paymentStatus: "Pagada",
    status: "Cancelada",
  },
  {
    id: "TRV-111222333",
    createdAt: "01/03/2026 10:00",
    createdAtISO: "2026-03-01",
    titular: "Laura Fernández",
    destination: "Barcelona, ES",
    checkIn: "20/04/2026",
    checkInISO: "2026-04-20",
    checkOut: "27/04/2026",
    total: 2890.0,
    salePrice: 3240.0,
    seller: "Carlos López",
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-444555666",
    createdAt: "25/02/2026 14:20",
    createdAtISO: "2026-02-25",
    titular: "Pedro Sánchez Ruiz",
    destination: "Madrid, ES",
    checkIn: "01/04/2026",
    checkInISO: "2026-04-01",
    checkOut: "05/04/2026",
    total: 1520.0,
    salePrice: 1700.0,
    seller: "Carlos López",
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-777888999",
    createdAt: "20/02/2026 08:45",
    createdAtISO: "2026-02-20",
    titular: "Sofia Torres",
    destination: "Dubai, AE",
    checkIn: "10/06/2026",
    checkInISO: "2026-06-10",
    checkOut: "17/06/2026",
    total: 8450.25,
    salePrice: 9465.0,
    seller: "Juan Pérez Vendedor",
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-333444555",
    createdAt: "10/02/2026 12:30",
    createdAtISO: "2026-02-10",
    titular: "Miguel Ángel Rodríguez",
    destination: "Riviera Maya, MX",
    checkIn: "15/03/2026",
    checkInISO: "2026-03-15",
    checkOut: "22/03/2026",
    total: 5100.0,
    salePrice: 5710.0,
    seller: "María Gómez",
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-666777888",
    createdAt: "18/02/2026 16:00",
    createdAtISO: "2026-02-18",
    titular: "Elena García",
    destination: "Roma, IT",
    checkIn: "05/04/2026",
    checkInISO: "2026-04-05",
    checkOut: "10/04/2026",
    total: 2340.6,
    salePrice: 2620.0,
    seller: "Carlos López",
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-999000111",
    createdAt: "12/01/2026 09:00",
    createdAtISO: "2026-01-12",
    titular: "Roberto Díaz",
    destination: "Tokio, JP",
    checkIn: "01/02/2026",
    checkInISO: "2026-02-01",
    checkOut: "08/02/2026",
    total: 6750.0,
    salePrice: 7560.0,
    seller: "Juan Pérez Vendedor",
    paymentStatus: "Pagada",
    status: "Cancelada",
  },
  {
    id: "TRV-101010101",
    createdAt: "14/02/2026 10:00",
    createdAtISO: "2026-02-14",
    titular: "Isabel Herrera",
    destination: "Los Cabos, MX",
    checkIn: "01/05/2026",
    checkInISO: "2026-05-01",
    checkOut: "08/05/2026",
    total: 3780.0,
    salePrice: 4235.0,
    seller: "María Gómez",
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-202020202",
    createdAt: "10/02/2026 15:30",
    createdAtISO: "2026-02-10",
    titular: "Andres Vidal",
    destination: "Cartagena, CO",
    checkIn: "12/04/2026",
    checkInISO: "2026-04-12",
    checkOut: "19/04/2026",
    total: 2100.5,
    salePrice: 2355.0,
    seller: "Carlos López",
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-303030303",
    createdAt: "05/02/2026 09:45",
    createdAtISO: "2026-02-05",
    titular: "Nuria Campos",
    destination: "Tenerife, ES",
    checkIn: "25/05/2026",
    checkInISO: "2026-05-25",
    checkOut: "01/06/2026",
    total: 1650.0,
    salePrice: 1850.0,
    seller: "Juan Pérez Vendedor",
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-404040404",
    createdAt: "22/01/2026 11:00",
    createdAtISO: "2026-01-22",
    titular: "Fernando Blanco",
    destination: "Playa del Carmen, MX",
    checkIn: "10/03/2026",
    checkInISO: "2026-03-10",
    checkOut: "17/03/2026",
    total: 4320.75,
    salePrice: 4840.0,
    seller: "María Gómez",
    paymentStatus: "Pagada",
    status: "Cancelada",
  },
  {
    id: "TRV-505050505",
    createdAt: "18/01/2026 14:20",
    createdAtISO: "2026-01-18",
    titular: "Carmen Reyes",
    destination: "Maldivas",
    checkIn: "20/07/2026",
    checkInISO: "2026-07-20",
    checkOut: "30/07/2026",
    total: 12400.0,
    salePrice: 13890.0,
    seller: "Carlos López",
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-606060606",
    createdAt: "15/01/2026 08:30",
    createdAtISO: "2026-01-15",
    titular: "Diego Fuentes",
    destination: "Nueva York, US",
    checkIn: "14/04/2026",
    checkInISO: "2026-04-14",
    checkOut: "20/04/2026",
    total: 3200.0,
    salePrice: 3585.0,
    seller: "Juan Pérez Vendedor",
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-707070707",
    createdAt: "08/01/2026 16:00",
    createdAtISO: "2026-01-08",
    titular: "Patricia Gil",
    destination: "Lisboa, PT",
    checkIn: "03/06/2026",
    checkInISO: "2026-06-03",
    checkOut: "10/06/2026",
    total: 1980.0,
    salePrice: 2220.0,
    seller: "María Gómez",
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-808080808",
    createdAt: "03/01/2026 12:15",
    createdAtISO: "2026-01-03",
    titular: "Ricardo Mora",
    destination: "Seychelles",
    checkIn: "15/08/2026",
    checkInISO: "2026-08-15",
    checkOut: "22/08/2026",
    total: 9850.0,
    salePrice: 11030.0,
    seller: "Carlos López",
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-909090909",
    createdAt: "28/12/2025 10:00",
    createdAtISO: "2025-12-28",
    titular: "Silvia Montoya",
    destination: "Amésterdam, NL",
    checkIn: "25/04/2026",
    checkInISO: "2026-04-25",
    checkOut: "30/04/2026",
    total: 2750.0,
    salePrice: 3080.0,
    seller: "Juan Pérez Vendedor",
    paymentStatus: "Pendiente Pago",
    status: "Vencida",
  },
  {
    id: "TRV-010101010",
    createdAt: "20/12/2025 09:30",
    createdAtISO: "2025-12-20",
    titular: "Javier Serrano",
    destination: "Bangkok, TH",
    checkIn: "10/05/2026",
    checkInISO: "2026-05-10",
    checkOut: "20/05/2026",
    total: 5600.0,
    salePrice: 6275.0,
    seller: "María Gómez",
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
]);

// Search state
const hasSearched = ref(false);
const filteredBookings = ref<BookingRow[]>([]);
const activeFilters = ref<SearchFilters>({
  pnr: "",
  titular: "",
  destination: "",
  statuses: [],
  paymentStatuses: [],
  createdFrom: "",
  createdTo: "",
  checkInFrom: "",
  checkInTo: "",
  agency: "",
  seller: "",
});

// Pagination
const PAGE_SIZE = 10;
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.ceil(filteredBookings.value.length / PAGE_SIZE),
);
const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return filteredBookings.value.slice(start, start + PAGE_SIZE);
});

// Reset to page 1 when results change
watch(filteredBookings, () => {
  currentPage.value = 1;
});

// Mass payment selection
const selectedIds = ref<Set<string>>(new Set());

// Seller options derived from data
const sellerOptions = computed(() => [
  ...new Set(allBookings.value.map((b) => b.seller)),
]);

// Filter logic
const handleSearch = (filters: SearchFilters) => {
  activeFilters.value = filters;
  let results = [...allBookings.value];

  // PNR filter
  if (filters.pnr) {
    const q = filters.pnr.toLowerCase();
    results = results.filter((b) => b.id.toLowerCase().includes(q));
  }

  // Titular filter
  if (filters.titular) {
    const q = filters.titular.toLowerCase();
    results = results.filter((b) => b.titular.toLowerCase().includes(q));
  }

  // Destination filter
  if (filters.destination) {
    const q = filters.destination.toLowerCase();
    results = results.filter((b) => b.destination.toLowerCase().includes(q));
  }

  // Status filter (reservation status only: Confirmada, Cancelada, Vencida)
  if (filters.statuses && filters.statuses.length > 0) {
    results = results.filter((b) => filters.statuses.includes(b.status));
  }

  // Payment status filter (Pagada, Pendiente de Pago)
  if (filters.paymentStatuses && filters.paymentStatuses.length > 0) {
    results = results.filter((b) =>
      filters.paymentStatuses.includes(b.paymentStatus),
    );
  }

  // Created date range
  if (filters.createdFrom) {
    results = results.filter((b) => b.createdAtISO >= filters.createdFrom);
  }
  if (filters.createdTo) {
    results = results.filter((b) => b.createdAtISO <= filters.createdTo);
  }

  // Check-in date range
  if (filters.checkInFrom) {
    results = results.filter((b) => b.checkInISO >= filters.checkInFrom);
  }
  if (filters.checkInTo) {
    results = results.filter((b) => b.checkInISO <= filters.checkInTo);
  }

  // Seller filter
  if (filters.seller && filters.seller !== "Todos") {
    results = results.filter((b) => b.seller === filters.seller);
  }

  filteredBookings.value = results;
  hasSearched.value = true;
  // Clear selections on new search
  selectedIds.value = new Set();
};

const handleClear = () => {
  hasSearched.value = false;
  filteredBookings.value = [];
  activeFilters.value = {
    pnr: "",
    titular: "",
    destination: "",
    statuses: [],
    paymentStatuses: [],
    createdFrom: "",
    createdTo: "",
    checkInFrom: "",
    checkInTo: "",
    agency: "",
    seller: "",
  };
  selectedIds.value = new Set();
};

// Pending payment bookings in current results
const pendingPaymentBookings = computed(() => {
  return filteredBookings.value.filter(
    (b) => b.paymentStatus === "Pendiente Pago",
  );
});

// Selected bookings for mass payment
const selectedBookings = computed(() => {
  return pendingPaymentBookings.value.filter((b) =>
    selectedIds.value.has(b.id),
  );
});

// Toggle selection
const toggleSelection = (id: string) => {
  const newSet = new Set(selectedIds.value);
  if (newSet.has(id)) {
    newSet.delete(id);
  } else {
    newSet.add(id);
  }
  selectedIds.value = newSet;
};

const selectAllPending = () => {
  const newSet = new Set(selectedIds.value);
  pendingPaymentBookings.value.forEach((b) => newSet.add(b.id));
  selectedIds.value = newSet;
};

const deselectAllPending = () => {
  selectedIds.value = new Set();
};

const handleMassPay = () => {
  // TODO: After real API call, refresh the data
  selectedIds.value.forEach((id) => {
    const booking = allBookings.value.find((b) => b.id === id);
    if (booking) {
      booking.paymentStatus = "Pagada";
    }
  });
  selectedIds.value = new Set();
  handleSearch(activeFilters.value);
};

// Voucher Modal State
const isVoucherModalOpen = ref(false);
const selectedVoucherBooking = ref<BookingRow | null>(null);

const openVoucher = (booking: BookingRow) => {
  selectedVoucherBooking.value = booking;
  isVoucherModalOpen.value = true;
};

// Table Columns
const columns = [
  { accessorKey: "actions", header: "" },
  { accessorKey: "select", header: "" },
  { accessorKey: "id", header: "Localizador PNR" },
  { accessorKey: "status", header: "Estado" },
  { accessorKey: "paymentStatus", header: "Pago" },
  { accessorKey: "prices", header: "Coste / Venta" },
  { accessorKey: "createdAt", header: "F. Creación" },
  { accessorKey: "titular", header: "Titular" },
  { accessorKey: "destination", header: "Destino / Hotel" },
  { accessorKey: "dates", header: "Fechas de Viaje" },
  { accessorKey: "seller", header: "Vendedor" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmada":
      return "success";
    case "Pendiente Pago":
      return "warning";
    case "Cancelada":
      return "error";
    case "Vencida":
      return "neutral";
    default:
      return "primary";
  }
};

// Stats computation
const resultStats = computed(() => {
  const total = filteredBookings.value.length;
  const confirmed = filteredBookings.value.filter(
    (b) => b.status === "Confirmada",
  ).length;
  const pending = pendingPaymentBookings.value.length;
  const cancelled = filteredBookings.value.filter(
    (b) => b.status === "Cancelada",
  ).length;
  const totalAmount = filteredBookings.value.reduce(
    (acc, b) => acc + b.total,
    0,
  );
  const pendingAmount = pendingPaymentBookings.value.reduce(
    (acc, b) => acc + b.total,
    0,
  );
  return { total, confirmed, pending, cancelled, totalAmount, pendingAmount };
});
</script>

<template>
  <div class="max-w-[1400px] mx-auto pb-24 pt-6">
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8"
    >
      <div>
        <h1
          class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3"
        >
          <UIcon
            name="i-heroicons-briefcase"
            class="w-8 h-8 text-primary-500"
          />
          Mis Reservas
        </h1>
        <p class="text-gray-500 mt-1 dark:text-gray-400">
          Busca, gestiona y realiza pagos de las reservas de tu agencia.
        </p>
      </div>
      <UButton
        color="primary"
        variant="solid"
        icon="i-heroicons-plus"
        to="/dashboard"
      >
        Nueva Venta
      </UButton>
    </div>

    <!-- Search Filters -->
    <div class="mb-8">
      <BookingSearchFilters
        :show-seller-filter="true"
        :seller-options="sellerOptions"
        @search="handleSearch"
        @clear="handleClear"
      />
    </div>

    <!-- Results Section (only after search) -->
    <template v-if="hasSearched">
      <!-- Results Stats Bar -->
      <div
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6 shadow-sm"
      >
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-document-text"
              class="w-5 h-5 text-gray-400"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >Resultados:</span
            >
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{
              resultStats.total
            }}</span>
          </div>
          <div class="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div class="flex items-center gap-2">
            <UBadge color="success" variant="subtle" class="text-xs font-bold"
              >{{ resultStats.confirmed }} Confirmadas</UBadge
            >
            <UBadge color="warning" variant="subtle" class="text-xs font-bold"
              >{{ resultStats.pending }} Pendientes Pago</UBadge
            >
            <UBadge
              v-if="resultStats.cancelled > 0"
              color="error"
              variant="subtle"
              class="text-xs font-bold"
              >{{ resultStats.cancelled }} Canceladas</UBadge
            >
          </div>
          <div class="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >Vol. Total:</span
            >
            <span class="text-sm font-bold text-gray-900 dark:text-white"
              >${{
                resultStats.totalAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}</span
            >
          </div>
          <div
            v-if="resultStats.pendingAmount > 0"
            class="flex items-center gap-2"
          >
            <span class="text-sm text-amber-600 dark:text-amber-400"
              >Pend. Pago:</span
            >
            <span class="text-sm font-bold text-amber-700 dark:text-amber-300"
              >${{
                resultStats.pendingAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}</span
            >
          </div>
        </div>
      </div>

      <!-- Mass Select Bar -->
      <div
        v-if="pendingPaymentBookings.length > 0"
        class="flex items-center justify-between bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-3 mb-6"
      >
        <div class="flex items-center gap-3">
          <UIcon
            name="i-heroicons-credit-card"
            class="w-5 h-5 text-amber-600 dark:text-amber-400"
          />
          <span class="text-sm font-medium text-amber-800 dark:text-amber-300">
            {{ pendingPaymentBookings.length }}
            {{
              pendingPaymentBookings.length === 1
                ? "reserva pendiente"
                : "reservas pendientes"
            }}
            de pago en los resultados
          </span>
        </div>
        <UButton
          v-if="selectedIds.size < pendingPaymentBookings.length"
          color="warning"
          variant="soft"
          size="sm"
          icon="i-heroicons-check-circle"
          class="font-bold"
          @click="selectAllPending"
        >
          Seleccionar todas las pendientes de pago
        </UButton>
        <UButton
          v-else
          color="neutral"
          variant="soft"
          size="sm"
          icon="i-heroicons-x-circle"
          class="font-bold"
          @click="deselectAllPending"
        >
          Deseleccionar todas
        </UButton>
      </div>

      <!-- Data Table -->
      <div
        v-if="filteredBookings.length > 0"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden"
      >
        <UTable
          :data="paginatedBookings"
          :columns="columns as any"
          class="w-full"
        >
          <!-- Select Column (Checkbox) -->
          <template #select-cell="{ row }">
            <div class="flex items-center justify-center">
              <UCheckbox
                v-if="(row as any).original.paymentStatus === 'Pendiente Pago'"
                :model-value="selectedIds.has((row as any).original.id)"
                @update:model-value="toggleSelection((row as any).original.id)"
              />
            </div>
          </template>

          <!-- Id Column -->
          <template #id-cell="{ row }">
            <NuxtLink
              :to="`/dashboard/hotels/booking/${(row as any).original.id}`"
              class="font-bold text-primary-600 dark:text-primary-400 hover:underline"
            >
              {{ (row as any).original.id }}
            </NuxtLink>
          </template>

          <!-- Dates Column -->
          <template #dates-cell="{ row }">
            <div class="text-sm">
              <span class="block text-gray-900 dark:text-white">{{
                (row as any).original.checkIn
              }}</span>
              <span class="block text-xs text-gray-500"
                >hasta {{ (row as any).original.checkOut }}</span
              >
            </div>
          </template>

          <!-- Seller Column -->
          <template #seller-cell="{ row }">
            <div class="flex items-center gap-1.5">
              <UIcon
                name="i-heroicons-user-circle"
                class="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">{{
                (row as any).original.seller
              }}</span>
            </div>
          </template>

          <!-- Prices Column (Coste / Venta) -->
          <template #prices-cell="{ row }">
            <div class="text-xs space-y-0.5">
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-gray-400 w-12">COSTE</span>
                <span
                  class="font-bold text-gray-900 dark:text-white tabular-nums"
                >
                  ${{
                    (row as any).original.total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-primary-500 w-12">VENTA</span>
                <span
                  class="font-bold text-primary-600 dark:text-primary-400 tabular-nums"
                >
                  ${{
                    (row as any).original.salePrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }}
                </span>
              </div>
            </div>
          </template>

          <!-- Payment Status Column -->
          <template #paymentStatus-cell="{ row }">
            <UBadge
              :color="
                (row as any).original.paymentStatus === 'Pagada'
                  ? 'success'
                  : 'warning'
              "
              variant="subtle"
              class="font-bold tracking-wider text-[10px] uppercase"
            >
              {{ (row as any).original.paymentStatus }}
            </UBadge>
          </template>

          <!-- Status Column -->
          <template #status-cell="{ row }">
            <UBadge
              :color="getStatusColor((row as any).original.status) as any"
              variant="soft"
              class="font-bold tracking-wider text-[10px] uppercase"
            >
              {{ (row as any).original.status }}
            </UBadge>
          </template>

          <!-- Actions Column -->
          <template #actions-cell="{ row }">
            <div class="flex items-center justify-end gap-2">
              <UTooltip text="Descargar Voucher">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-document-arrow-down"
                  class="text-gray-500 hover:text-primary-600"
                  @click="openVoucher((row as any).original)"
                />
              </UTooltip>
              <UTooltip text="Ver Detalles">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-eye"
                  class="text-gray-500 hover:text-primary-600"
                  :to="`/dashboard/hotels/booking/${(row as any).original.id}`"
                />
              </UTooltip>
            </div>
          </template>

          <!-- Empty State -->
          <template #empty-state>
            <div
              class="flex flex-col items-center justify-center py-12 px-4 text-center"
            >
              <div class="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                <UIcon
                  name="i-heroicons-inbox"
                  class="w-12 h-12 text-gray-400 dark:text-gray-500"
                />
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
                No se encontraron reservas
              </h3>
              <p class="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Intenta ajustar los filtros de búsqueda o realiza una nueva
                búsqueda con diferentes criterios.
              </p>
            </div>
          </template>
        </UTable>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-800"
        >
          <p
            class="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1"
          >
            Mostrando
            <span class="font-semibold text-gray-900 dark:text-white">{{
              (currentPage - 1) * 10 + 1
            }}</span>
            –
            <span class="font-semibold text-gray-900 dark:text-white">{{
              Math.min(currentPage * 10, filteredBookings.length)
            }}</span>
            de
            <span class="font-semibold text-gray-900 dark:text-white">{{
              filteredBookings.length
            }}</span>
            reservas
          </p>
          <UPagination
            v-model:page="currentPage"
            :total="filteredBookings.length"
            :items-per-page="10"
            class="order-1 sm:order-2"
          />
        </div>
      </div>

      <!-- No results state -->
      <div
        v-else
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm"
      >
        <div
          class="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
          <div class="bg-gray-100 dark:bg-gray-800 rounded-full p-5 mb-5">
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="w-12 h-12 text-gray-400 dark:text-gray-500"
            />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No se encontraron reservas
          </h3>
          <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            No hay reservas que coincidan con los filtros aplicados. Intenta
            modificar los criterios de búsqueda.
          </p>
        </div>
      </div>
    </template>

    <!-- Initial state: No search yet -->
    <template v-else>
      <div
        class="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl"
      >
        <div
          class="flex flex-col items-center justify-center py-20 px-4 text-center"
        >
          <div
            class="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-6"
          >
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="w-10 h-10 text-primary-400"
            />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Busca tus reservas
          </h3>
          <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Utiliza los filtros de arriba para buscar reservas por localizador,
            titular, destino, estado o fechas.
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <UBadge color="primary" variant="subtle" class="px-3 py-1 text-xs">
              <UIcon
                name="i-heroicons-document-text"
                class="w-3 h-3 mr-1 inline"
              />
              PNR
            </UBadge>
            <UBadge color="primary" variant="subtle" class="px-3 py-1 text-xs">
              <UIcon name="i-heroicons-user" class="w-3 h-3 mr-1 inline" />
              Titular
            </UBadge>
            <UBadge color="primary" variant="subtle" class="px-3 py-1 text-xs">
              <UIcon name="i-heroicons-map-pin" class="w-3 h-3 mr-1 inline" />
              Destino
            </UBadge>
            <UBadge color="primary" variant="subtle" class="px-3 py-1 text-xs">
              <UIcon name="i-heroicons-funnel" class="w-3 h-3 mr-1 inline" />
              Estado
            </UBadge>
            <UBadge color="primary" variant="subtle" class="px-3 py-1 text-xs">
              <UIcon
                name="i-heroicons-calendar-days"
                class="w-3 h-3 mr-1 inline"
              />
              Fechas
            </UBadge>
          </div>
        </div>
      </div>
    </template>

    <!-- Mass Payment Component -->
    <BookingMassPayment
      :selected-bookings="
        selectedBookings.map((b) => ({
          id: b.id,
          titular: b.titular,
          total: b.total,
        }))
      "
      :pending-count="pendingPaymentBookings.length"
      @select-all="selectAllPending"
      @deselect-all="deselectAllPending"
      @pay="handleMassPay"
    />

    <!-- Voucher Modal -->
    <VoucherPreviewModal
      v-if="selectedVoucherBooking"
      v-model:is-open="isVoucherModalOpen"
      :booking-id="selectedVoucherBooking.id"
      :hotel-name="selectedVoucherBooking.destination"
      :reservation="{
        titular: selectedVoucherBooking.titular,
        checkIn: selectedVoucherBooking.checkIn,
        checkOut: selectedVoucherBooking.checkOut,
        agent: selectedVoucherBooking.seller,
        rooms: [{ id: 1, name: 'Standard Room', pax: '2 Adultos' }],
      }"
    />
  </div>
</template>
