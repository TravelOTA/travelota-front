<script setup lang="ts">
import BookingSearchFilters from '~/components/b2b/hotel/checkout/BookingSearchFilters.vue';
import { useBookings, type SearchFilters } from '~/composables/useBookings';

interface FilterPayload {
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

definePageMeta({
  layout: 'dashboard',
});

useHead({
  title: 'Todas las Reservas - TravelOTA Admin',
});

const { t } = useI18n();
const { agencyOptions, sellerOptions, filterBookings } = useBookings();

// Search state
const hasSearched = ref(false);
const filteredBookings = ref<ReturnType<typeof filterBookings>>([]);

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

// Filter logic
const handleSearch = (filters: FilterPayload) => {
  filteredBookings.value = filterBookings(filters as unknown as SearchFilters);
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
    (b) => b.status === 'Confirmada',
  ).length;
  const pending = filteredBookings.value.filter(
    (b) => b.paymentStatus === 'Pendiente Pago',
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
const columns = computed(() => [
  { accessorKey: 'actions', header: '' },
  { accessorKey: 'id', header: t('admin.allBookings.tableHeaders.pnr') },
  { accessorKey: 'status', header: t('admin.allBookings.tableHeaders.status') },
  {
    accessorKey: 'paymentStatus',
    header: t('admin.allBookings.tableHeaders.payment'),
  },
  { accessorKey: 'prices', header: t('admin.allBookings.tableHeaders.prices') },
  {
    accessorKey: 'createdAt',
    header: t('admin.allBookings.tableHeaders.createdDate'),
  },
  {
    accessorKey: 'titular',
    header: t('admin.allBookings.tableHeaders.guestName'),
  },
  {
    accessorKey: 'destination',
    header: t('admin.allBookings.tableHeaders.destination'),
  },
  {
    accessorKey: 'dates',
    header: t('admin.allBookings.tableHeaders.travelDates'),
  },
  { accessorKey: 'agency', header: t('admin.allBookings.tableHeaders.agency') },
  { accessorKey: 'seller', header: t('admin.allBookings.tableHeaders.seller') },
]);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmada':
      return 'success';
    case 'Pendiente Pago':
      return 'warning';
    case 'Cancelada':
      return 'error';
    case 'Vencida':
      return 'neutral';
    default:
      return 'primary';
  }
};

const fmt = (v: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
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
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          {{ t('admin.allBookings.backToPanel') }}
        </NuxtLink>
        <h1
          class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3"
        >
          <UIcon
            name="i-heroicons-briefcase"
            class="w-8 h-8 text-primary-500"
          />
          {{ t('admin.allBookings.title') }}
        </h1>
        <p class="text-gray-500 mt-1 dark:text-gray-400">
          {{ t('admin.allBookings.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Net price alert -->
    <UAlert
      icon="i-heroicons-eye"
      color="info"
      variant="soft"
      class="mb-8"
      :title="t('admin.allBookings.netPriceAlert')"
      :description="t('admin.allBookings.netPriceDescription')"
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
              >{{ resultStats.confirmed }}
              {{ t('admin.allBookings.confirmed') }}</UBadge
            >
            <UBadge color="warning" variant="subtle" class="text-xs font-bold"
              >{{ resultStats.pending }}
              {{ t('admin.allBookings.pendingPayment') }}</UBadge
            >
          </div>
          <div class="h-4 w-px bg-gray-200 dark:bg-gray-700" />
          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-semibold text-gray-400 uppercase"
                >{{ t('admin.allBookings.priceLabels.net') }}:</span
              >
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{
                fmt(resultStats.totalNet)
              }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-semibold text-orange-500 uppercase"
                >{{ t('admin.allBookings.priceLabels.agency') }}:</span
              >
              <span
                class="text-sm font-bold text-orange-600 dark:text-orange-400"
                >{{ fmt(resultStats.totalAgency) }}</span
              >
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-semibold text-primary-500 uppercase"
                >{{ t('admin.allBookings.priceLabels.sale') }}:</span
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
                <span class="font-semibold text-gray-400 w-12">{{
                  t('admin.allBookings.priceLabels.net')
                }}</span>
                <span
                  class="font-bold text-gray-900 dark:text-white tabular-nums"
                >
                  {{ fmt((row as any).original.netPrice) }}
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-orange-500 w-12">{{
                  t('admin.allBookings.priceLabels.agency')
                }}</span>
                <span
                  class="font-bold text-orange-600 dark:text-orange-400 tabular-nums"
                >
                  {{ fmt((row as any).original.agencyPrice) }}
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-primary-500 w-12">{{
                  t('admin.allBookings.priceLabels.sale')
                }}</span>
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
              <UTooltip :text="t('admin.allBookings.tooltips.viewDetails')">
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
                {{ t('admin.allBookings.noResults') }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {{ t('admin.allBookings.noResultsDescription') }}
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
            {{ t('admin.allBookings.pagination.showing') }}
            <span class="font-semibold text-gray-900 dark:text-white">{{
              (currentPage - 1) * 10 + 1
            }}</span>
            –
            <span class="font-semibold text-gray-900 dark:text-white">{{
              Math.min(currentPage * 10, filteredBookings.length)
            }}</span>
            {{ t('admin.allBookings.pagination.of') }}
            <span class="font-semibold text-gray-900 dark:text-white">{{
              filteredBookings.length
            }}</span>
            {{ t('admin.allBookings.pagination.bookings') }}
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
            {{ t('admin.allBookings.noResults') }}
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
            {{ t('admin.allBookings.initialState') }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            {{ t('admin.allBookings.initialStateDescription') }}
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
