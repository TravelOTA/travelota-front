<script setup lang="ts">
import { ref, computed } from "vue";
import BookingSearchFilters from "~/components/b2b/hotel/checkout/BookingSearchFilters.vue";
import BookingMassPayment from "~/components/b2b/hotel/checkout/BookingMassPayment.vue";

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
  createdFrom: string;
  createdTo: string;
  checkInFrom: string;
  checkInTo: string;
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
    status: "Pendiente Pago",
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
    status: "Pendiente Pago",
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
    status: "Pendiente Pago",
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
    status: "Pendiente Pago",
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
    status: "Cancelada",
  },
]);

// Search state
const hasSearched = ref(false);
const filteredBookings = ref<BookingRow[]>([]);
const activeFilters = ref<SearchFilters>({} as SearchFilters);

// Mass payment selection
const selectedIds = ref<Set<string>>(new Set());

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

  // Status filter
  if (filters.statuses && filters.statuses.length > 0) {
    results = results.filter((b) => filters.statuses.includes(b.status));
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

  filteredBookings.value = results;
  hasSearched.value = true;
  // Clear selections on new search
  selectedIds.value = new Set();
};

const handleClear = () => {
  hasSearched.value = false;
  filteredBookings.value = [];
  activeFilters.value = {};
  selectedIds.value = new Set();
};

// Pending payment bookings in current results
const pendingPaymentBookings = computed(() => {
  return filteredBookings.value.filter((b) => b.status === "Pendiente Pago");
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
  // For now, update statuses in mock data
  selectedIds.value.forEach((id) => {
    const booking = allBookings.value.find((b) => b.id === id);
    if (booking) {
      booking.status = "Confirmada";
    }
  });
  selectedIds.value = new Set();
  // Re-run the search with current filters
  handleSearch(activeFilters.value);
};

// Table Columns
const columns = [
  { accessorKey: "select", header: "" },
  { accessorKey: "id", header: "Localizador PNR" },
  { accessorKey: "createdAt", header: "F. Creación" },
  { accessorKey: "titular", header: "Titular" },
  { accessorKey: "destination", header: "Destino / Hotel" },
  { accessorKey: "dates", header: "Fechas de Viaje" },
  { accessorKey: "total", header: "Importe" },
  { accessorKey: "status", header: "Estado" },
  { accessorKey: "actions", header: "Acciones" },
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
      <BookingSearchFilters @search="handleSearch" @clear="handleClear" />
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
          :data="filteredBookings"
          :columns="columns as any"
          class="w-full"
        >
          <!-- Select Column (Checkbox) -->
          <template #select-cell="{ row }">
            <div class="flex items-center justify-center">
              <UCheckbox
                v-if="(row as any).original.status === 'Pendiente Pago'"
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

          <!-- Total Column -->
          <template #total-cell="{ row }">
            <span class="font-bold text-gray-900 dark:text-white">
              ${{
                (row as any).original.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
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
  </div>
</template>
