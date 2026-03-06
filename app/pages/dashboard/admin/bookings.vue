<script setup lang="ts">
import BookingSearchFilters from "~/components/b2b/hotel/checkout/BookingSearchFilters.vue";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Todas las Reservas - TravelOTA Admin",
});

interface BookingRow {
  id: string;
  createdAt: string;
  createdAtISO: string;
  titular: string;
  destination: string;
  checkIn: string;
  checkInISO: string;
  checkOut: string;
  agency: string;
  seller: string;
  netPrice: number;
  agencyPrice: number;
  salePrice: number;
  paymentStatus: string;
  status: string;
}

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

// Mock data — todas las agencias, precios netos visibles
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
    agency: "Viajes El Corte Inglés",
    seller: "Juan Pérez Vendedor",
    netPrice: 5230.0,
    agencyPrice: 6281.41,
    salePrice: 6900.0,
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
    agency: "Destinia",
    seller: "María Gómez",
    netPrice: 2625.0,
    agencyPrice: 3150.0,
    salePrice: 3500.0,
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
    agency: "Viajes El Corte Inglés",
    seller: "Carlos López",
    netPrice: 1534.0,
    agencyPrice: 1840.5,
    salePrice: 2000.0,
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
    agency: "Agencia Demo B2B",
    seller: "Ana Ruiz",
    netPrice: 3500.0,
    agencyPrice: 4200.75,
    salePrice: 4600.0,
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
    agency: "Destinia",
    seller: "Pedro Morales",
    netPrice: 2408.0,
    agencyPrice: 2890.0,
    salePrice: 3100.0,
    paymentStatus: "Pendiente Pago",
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
    agency: "Viajes El Corte Inglés",
    seller: "Juan Pérez Vendedor",
    netPrice: 7042.0,
    agencyPrice: 8450.25,
    salePrice: 9200.0,
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
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
    agency: "Agencia Demo B2B",
    seller: "Ana Ruiz",
    netPrice: 3150.0,
    agencyPrice: 3780.0,
    salePrice: 4100.0,
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
    agency: "Destinia",
    seller: "Pedro Morales",
    netPrice: 1750.0,
    agencyPrice: 2100.5,
    salePrice: 2300.0,
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
    agency: "Viajes El Corte Inglés",
    seller: "Carlos López",
    netPrice: 1375.0,
    agencyPrice: 1650.0,
    salePrice: 1850.0,
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
    agency: "Agencia Demo B2B",
    seller: "Ana Ruiz",
    netPrice: 3600.0,
    agencyPrice: 4320.75,
    salePrice: 4800.0,
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
    agency: "Destinia",
    seller: "María Gómez",
    netPrice: 10333.0,
    agencyPrice: 12400.0,
    salePrice: 13500.0,
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
    agency: "Viajes El Corte Inglés",
    seller: "Juan Pérez Vendedor",
    netPrice: 2667.0,
    agencyPrice: 3200.0,
    salePrice: 3500.0,
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
    agency: "Agencia Demo B2B",
    seller: "Ana Ruiz",
    netPrice: 1650.0,
    agencyPrice: 1980.0,
    salePrice: 2200.0,
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
    agency: "Destinia",
    seller: "Pedro Morales",
    netPrice: 8208.0,
    agencyPrice: 9850.0,
    salePrice: 10800.0,
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
    agency: "Viajes El Corte Inglés",
    seller: "Carlos López",
    netPrice: 2292.0,
    agencyPrice: 2750.0,
    salePrice: 3000.0,
    paymentStatus: "Pendiente Pago",
    status: "Vencida",
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
watch(filteredBookings, () => {
  currentPage.value = 1;
});

// Derived options for filters
const agencyOptions = computed(() => [
  ...new Set(allBookings.value.map((b) => b.agency)),
]);
const sellerOptions = computed(() => [
  ...new Set(allBookings.value.map((b) => b.seller)),
]);

// Filter logic
const handleSearch = (filters: SearchFilters) => {
  activeFilters.value = filters;
  let results = [...allBookings.value];

  if (filters.pnr) {
    const q = filters.pnr.toLowerCase();
    results = results.filter((b) => b.id.toLowerCase().includes(q));
  }
  if (filters.titular) {
    const q = filters.titular.toLowerCase();
    results = results.filter((b) => b.titular.toLowerCase().includes(q));
  }
  if (filters.destination) {
    const q = filters.destination.toLowerCase();
    results = results.filter((b) => b.destination.toLowerCase().includes(q));
  }
  if (filters.statuses && filters.statuses.length > 0) {
    results = results.filter((b) => filters.statuses.includes(b.status));
  }
  if (filters.paymentStatuses && filters.paymentStatuses.length > 0) {
    results = results.filter((b) =>
      filters.paymentStatuses.includes(b.paymentStatus),
    );
  }
  if (filters.createdFrom) {
    results = results.filter((b) => b.createdAtISO >= filters.createdFrom);
  }
  if (filters.createdTo) {
    results = results.filter((b) => b.createdAtISO <= filters.createdTo);
  }
  if (filters.checkInFrom) {
    results = results.filter((b) => b.checkInISO >= filters.checkInFrom);
  }
  if (filters.checkInTo) {
    results = results.filter((b) => b.checkInISO <= filters.checkInTo);
  }
  if (filters.agency && filters.agency !== "Todas") {
    results = results.filter((b) => b.agency === filters.agency);
  }
  if (filters.seller && filters.seller !== "Todos") {
    results = results.filter((b) => b.seller === filters.seller);
  }

  filteredBookings.value = results;
  hasSearched.value = true;
};

const handleClear = () => {
  hasSearched.value = false;
  filteredBookings.value = [];
};

// Stats
const resultStats = computed(() => {
  const total = filteredBookings.value.length;
  const confirmed = filteredBookings.value.filter(
    (b) => b.status === "Confirmada",
  ).length;
  const pending = filteredBookings.value.filter(
    (b) => b.paymentStatus === "Pendiente Pago",
  ).length;
  const totalNet = filteredBookings.value.reduce(
    (acc, b) => acc + b.netPrice,
    0,
  );
  const totalAgency = filteredBookings.value.reduce(
    (acc, b) => acc + b.agencyPrice,
    0,
  );
  const totalSale = filteredBookings.value.reduce(
    (acc, b) => acc + b.salePrice,
    0,
  );
  return { total, confirmed, pending, totalNet, totalAgency, totalSale };
});

// Table columns
const columns = [
  { accessorKey: "actions", header: "" },
  { accessorKey: "id", header: "Localizador PNR" },
  { accessorKey: "status", header: "Estado" },
  { accessorKey: "paymentStatus", header: "Pago" },
  { accessorKey: "prices", header: "Precios (Neto / Agencia / Venta)" },
  { accessorKey: "createdAt", header: "F. Creación" },
  { accessorKey: "titular", header: "Titular" },
  { accessorKey: "destination", header: "Destino / Hotel" },
  { accessorKey: "dates", header: "Fechas de Viaje" },
  { accessorKey: "agency", header: "Agencia" },
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

const fmt = (v: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(v);
</script>

<template>
  <div class="max-w-[1500px] mx-auto pb-24 pt-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8"
    >
      <div>
        <NuxtLink
          to="/dashboard/admin"
          class="text-sm font-medium text-primary-500 hover:underline mb-2 inline-flex items-center gap-1"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" /> Panel Admin
        </NuxtLink>
        <h1
          class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3"
        >
          <UIcon
            name="i-heroicons-briefcase"
            class="w-8 h-8 text-primary-500"
          />
          Todas las Reservas
        </h1>
        <p class="text-gray-500 mt-1 dark:text-gray-400">
          Monitor global. Precios netos visibles — solo para uso interno de
          TravelOTA.
        </p>
      </div>
    </div>

    <!-- Net price alert -->
    <UAlert
      icon="i-heroicons-eye"
      color="info"
      variant="soft"
      class="mb-8"
      title="Vista de precios netos"
      description="Estás viendo los 3 niveles de precio: Neto (coste TravelOTA), Agencia (precio de venta de la agencia) y Venta final (precio al cliente). Esta información es confidencial."
    />

    <!-- Search Filters -->
    <div class="mb-8">
      <BookingSearchFilters
        :show-agency-filter="true"
        :show-seller-filter="true"
        :agency-options="agencyOptions"
        :seller-options="sellerOptions"
        :status-options="[
          { label: 'Confirmada', value: 'Confirmada' },
          { label: 'Cancelada', value: 'Cancelada' },
          { label: 'Vencida', value: 'Vencida' },
        ]"
        @search="handleSearch"
        @clear="handleClear"
      />
    </div>

    <!-- Results -->
    <template v-if="hasSearched">
      <!-- Stats bar -->
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
          <div class="h-4 w-px bg-gray-200 dark:bg-gray-700" />
          <div class="flex items-center gap-2">
            <UBadge color="success" variant="subtle" class="text-xs font-bold"
              >{{ resultStats.confirmed }} Confirmadas</UBadge
            >
            <UBadge color="warning" variant="subtle" class="text-xs font-bold"
              >{{ resultStats.pending }} Pend. Pago</UBadge
            >
          </div>
          <div class="h-4 w-px bg-gray-200 dark:bg-gray-700" />
          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-semibold text-gray-400 uppercase"
                >Neto:</span
              >
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{
                fmt(resultStats.totalNet)
              }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-semibold text-orange-500 uppercase"
                >Agencia:</span
              >
              <span
                class="text-sm font-bold text-orange-600 dark:text-orange-400"
                >{{ fmt(resultStats.totalAgency) }}</span
              >
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-semibold text-primary-500 uppercase"
                >Venta:</span
              >
              <span class="text-sm font-bold text-primary-600">{{
                fmt(resultStats.totalSale)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div
        v-if="filteredBookings.length > 0"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden"
      >
        <UTable
          :data="paginatedBookings"
          :columns="columns as any"
          class="w-full"
        >
          <!-- PNR -->
          <template #id-cell="{ row }">
            <NuxtLink
              :to="`/dashboard/hotels/booking/${(row as any).original.id}`"
              class="font-bold text-primary-600 dark:text-primary-400 hover:underline font-mono text-sm"
            >
              {{ (row as any).original.id }}
            </NuxtLink>
          </template>

          <!-- Dates -->
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

          <!-- Agency -->
          <template #agency-cell="{ row }">
            <div class="flex items-center gap-1.5">
              <UIcon
                name="i-heroicons-building-storefront"
                class="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
              />
              <span class="text-sm">{{ (row as any).original.agency }}</span>
            </div>
          </template>

          <!-- Seller -->
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

          <!-- Prices: Net / Agency / Sale -->
          <template #prices-cell="{ row }">
            <div class="text-xs space-y-0.5">
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-gray-400 w-12">NETO</span>
                <span
                  class="font-bold text-gray-900 dark:text-white tabular-nums"
                >
                  {{ fmt((row as any).original.netPrice) }}
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-orange-500 w-12">AGENC.</span>
                <span
                  class="font-bold text-orange-600 dark:text-orange-400 tabular-nums"
                >
                  {{ fmt((row as any).original.agencyPrice) }}
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-primary-500 w-12">VENTA</span>
                <span
                  class="font-bold text-primary-600 dark:text-primary-400 tabular-nums"
                >
                  {{ fmt((row as any).original.salePrice) }}
                </span>
              </div>
            </div>
          </template>

          <!-- Payment Status -->
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

          <!-- Status -->
          <template #status-cell="{ row }">
            <UBadge
              :color="getStatusColor((row as any).original.status) as any"
              variant="soft"
              class="font-bold tracking-wider text-[10px] uppercase"
            >
              {{ (row as any).original.status }}
            </UBadge>
          </template>

          <!-- Actions -->
          <template #actions-cell="{ row }">
            <div class="flex items-center justify-end gap-2 pr-2">
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

          <!-- Empty state -->
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
                Ajusta los filtros de búsqueda e inténtalo de nuevo.
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

      <!-- No results -->
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
            No hay reservas que coincidan con los filtros aplicados. Prueba con
            otros criterios.
          </p>
        </div>
      </div>
    </template>

    <!-- Initial state -->
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
            Busca entre todas las reservas
          </h3>
          <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Utiliza los filtros para buscar por localizador, titular, destino,
            agencia, vendedor, estado o fechas.
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <UBadge
              v-for="label in [
                'PNR',
                'Titular',
                'Destino',
                'Agencia',
                'Vendedor',
                'Estado',
                'Fechas',
              ]"
              :key="label"
              color="primary"
              variant="subtle"
              class="px-3 py-1 text-xs"
              >{{ label }}</UBadge
            >
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
