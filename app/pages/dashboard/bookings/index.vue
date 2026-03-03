<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Mis Reservas - TravelOTA B2B",
});

// Types
interface BookingRow {
  id: string;
  createdAt: string;
  titular: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: string;
  [key: string]: string | number;
}

// Mock Bookings Data
const bookings = ref<BookingRow[]>([
  {
    id: "TRV-987654321",
    createdAt: "02/03/2026 15:30",
    titular: "Juan Pérez",
    destination: "Punta Cana, DO",
    checkIn: "03/03/2026",
    checkOut: "10/03/2026",
    total: 6281.41,
    status: "Confirmada",
  },
  {
    id: "TRV-123456789",
    createdAt: "28/02/2026 09:15",
    titular: "María López",
    destination: "Cancún, MX",
    checkIn: "15/05/2026",
    checkOut: "22/05/2026",
    total: 3150.0,
    status: "Pendiente Pago",
  },
  {
    id: "TRV-456789123",
    createdAt: "15/01/2026 11:20",
    titular: "Carlos Gómez",
    destination: "Miami, US",
    checkIn: "20/02/2026",
    checkOut: "25/02/2026",
    total: 1840.5,
    status: "Vencida",
  },
  {
    id: "TRV-789123456",
    createdAt: "05/12/2025 16:45",
    titular: "Ana Martínez",
    destination: "Orlando, US",
    checkIn: "10/01/2026",
    checkOut: "17/01/2026",
    total: 4200.75,
    status: "Cancelada",
  },
]);

// Search Logic
const searchQuery = ref("");

const filteredBookings = computed(() => {
  if (!searchQuery.value) return bookings.value;
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(
    (b) =>
      b.id.toLowerCase().includes(q) || b.titular.toLowerCase().includes(q),
  );
});

// Table Columns
const columns = [
  { accessorKey: "id", header: "Localizador PNR", sortable: true },
  { accessorKey: "createdAt", header: "F. Creación", sortable: true },
  {
    accessorKey: "titular",
    header: "Titular / Pasajero Principal",
    sortable: true,
  },
  { accessorKey: "destination", header: "Destino / Hotel" },
  { accessorKey: "dates", header: "Fechas de Viaje" },
  { accessorKey: "total", header: "Importe", sortable: true },
  { accessorKey: "status", header: "Estado", sortable: true },
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
</script>

<template>
  <div class="max-w-[1400px] mx-auto pb-12 pt-6">
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
          Gestiona y consulta el historial histórico de ventas realizadas por tu
          agencia.
        </p>
      </div>

      <!-- Action / Filters -->
      <div
        class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto"
      >
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Buscar por Localizador o Titular..."
          class="w-full sm:w-64"
        />
        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-plus"
          to="/dashboard"
        >
          Nueva Venta
        </UButton>
      </div>
    </div>

    <!-- Data Table -->
    <div
      class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden"
    >
      <UTable :data="filteredBookings" :columns="columns as any" class="w-full">
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
              Intenta ajustar tu búsqueda o empieza a vender creando una nueva
              reserva de hotel.
            </p>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>
