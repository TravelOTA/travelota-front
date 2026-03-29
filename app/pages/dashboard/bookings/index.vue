<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import BookingSearchFilters from "~/components/b2b/hotel/checkout/BookingSearchFilters.vue";
import BookingMassPayment from "~/components/b2b/hotel/checkout/BookingMassPayment.vue";
import VoucherPreviewModal from "~/components/b2b/hotel/checkout/VoucherPreviewModal.vue";
import { useBookings } from "~/composables/useBookings";
import type { BookingRow } from "~/composables/useBookings";

const { t } = useI18n();

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: () => t("bookings.pageTitle"),
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

const {
  bookings,
  fetchBookings,
  sellerOptions: composableSellerOptions,
} = useBookings();

onMounted(async () => {
  await fetchBookings();
  filteredBookings.value = [...bookings.value];
  hasSearched.value = true;
});

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

const orderRefFilter = ref('');

const handleOrderRefSearch = async () => {
  await fetchBookings(orderRefFilter.value);
  filteredBookings.value = [...bookings.value];
  hasSearched.value = true;
};

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

// Seller options derived from composable
const sellerOptions = computed(() => composableSellerOptions.value);

// Filter logic
const handleSearch = (filters: SearchFilters) => {
  activeFilters.value = filters;
  let results = [...bookings.value];

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
    (b) => b.paymentStatus === "Pendiente de Pago",
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
  selectedIds.value = new Set();
  fetchBookings().then(() => handleSearch(activeFilters.value));
};

// Voucher Modal State
const isVoucherModalOpen = ref(false);
const selectedVoucherBooking = ref<BookingRow | null>(null);

const openVoucher = (booking: BookingRow) => {
  selectedVoucherBooking.value = booking;
  isVoucherModalOpen.value = true;
};

// Table Columns
const columns = computed(() => [
  { accessorKey: "actions", header: "" },
  { accessorKey: "select", header: "" },
  { accessorKey: "id", header: t("bookings.tableColumns.pnr") },
  { accessorKey: "status", header: t("bookings.tableColumns.status") },
  { accessorKey: "paymentStatus", header: t("bookings.tableColumns.payment") },
  { accessorKey: "prices", header: t("bookings.tableColumns.prices") },
  { accessorKey: "createdAt", header: t("bookings.tableColumns.createdAt") },
  { accessorKey: "titular", header: t("bookings.tableColumns.titular") },
  { accessorKey: "destination", header: t("bookings.tableColumns.destination") },
  { accessorKey: "dates", header: t("bookings.tableColumns.dates") },
  { accessorKey: "seller", header: t("bookings.tableColumns.seller") },
]);

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmada":
      return "success";
    case "Pendiente de Pago":
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
          {{ t('bookings.title') }}
        </h1>
        <p class="text-gray-500 mt-1 dark:text-gray-400">
          {{ t('bookings.subtitle') }}
        </p>
      </div>
      <UButton
        color="primary"
        variant="solid"
        icon="i-heroicons-plus"
        to="/dashboard"
      >
        {{ t('bookings.newSale') }}
      </UButton>
    </div>

    <!-- Search Filters -->
    <div class="mb-8 flex flex-col gap-4">
      <div class="flex items-center justify-end">
        <UInput
          v-model="orderRefFilter"
          :placeholder="t('cart.confirmation.orderRef') + '...'"
          icon="i-heroicons-tag"
          clearable
          size="sm"
          class="w-64"
          @keyup.enter="handleOrderRefSearch"
          @blur="handleOrderRefSearch"
          @clear="handleOrderRefSearch"
        />
      </div>
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
              >{{ t('bookings.resultsLabel') }}</span
            >
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{
              resultStats.total
            }}</span>
          </div>
          <div class="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div class="flex items-center gap-2">
            <UBadge color="success" variant="subtle" class="text-xs font-bold"
              >{{ t('bookings.badgeConfirmed', { count: resultStats.confirmed }) }}</UBadge
            >
            <UBadge color="warning" variant="subtle" class="text-xs font-bold"
              >{{ t('bookings.badgePending', { count: resultStats.pending }) }}</UBadge
            >
            <UBadge
              v-if="resultStats.cancelled > 0"
              color="error"
              variant="subtle"
              class="text-xs font-bold"
              >{{ t('bookings.badgeCancelled', { count: resultStats.cancelled }) }}</UBadge
            >
          </div>
          <div class="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >{{ t('bookings.totalVolume') }}</span
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
              >{{ t('bookings.pendingAmount') }}</span
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
            {{ t('bookings.pendingCount', pendingPaymentBookings.length) }}
            {{ t('bookings.pendingInResults') }}
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
          {{ t('bookings.selectAllPending') }}
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
          {{ t('bookings.deselectAll') }}
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
                v-if="
                  (row as any).original.paymentStatus === 'Pendiente de Pago'
                "
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
                >{{ t('bookings.checkoutUntil', { date: (row as any).original.checkOut }) }}</span
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
                <span class="font-semibold text-gray-400 w-12">{{ t('bookings.colCost') }}</span>
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
                <span class="font-semibold text-primary-500 w-12">{{ t('bookings.colSale') }}</span>
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
              <UTooltip :text="t('bookings.tooltipVoucher')">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-document-arrow-down"
                  class="text-gray-500 hover:text-primary-600"
                  @click="openVoucher((row as any).original)"
                />
              </UTooltip>
              <UTooltip :text="t('bookings.tooltipDetails')">
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
                {{ t('bookings.emptyTitle') }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {{ t('bookings.emptyDescription') }}
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
            {{ t('bookings.paginationShowing') }}
            <span class="font-semibold text-gray-900 dark:text-white">{{
              (currentPage - 1) * 10 + 1
            }}</span>
            –
            <span class="font-semibold text-gray-900 dark:text-white">{{
              Math.min(currentPage * 10, filteredBookings.length)
            }}</span>
            {{ t('bookings.paginationOf') }}
            <span class="font-semibold text-gray-900 dark:text-white">{{
              filteredBookings.length
            }}</span>
            {{ t('bookings.paginationBookings') }}
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
            {{ t('bookings.noResultsTitle') }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {{ t('bookings.noResultsDescription') }}
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
            {{ t('bookings.searchTitle') }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            {{ t('bookings.searchDescription') }}
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <UBadge color="primary" variant="subtle" class="px-3 py-1 text-xs">
              <UIcon
                name="i-heroicons-document-text"
                class="w-3 h-3 mr-1 inline"
              />
              {{ t('bookings.badgePNR') }}
            </UBadge>
            <UBadge color="primary" variant="subtle" class="px-3 py-1 text-xs">
              <UIcon name="i-heroicons-user" class="w-3 h-3 mr-1 inline" />
              {{ t('bookings.badgeTitular') }}
            </UBadge>
            <UBadge color="primary" variant="subtle" class="px-3 py-1 text-xs">
              <UIcon name="i-heroicons-map-pin" class="w-3 h-3 mr-1 inline" />
              {{ t('bookings.badgeDestination') }}
            </UBadge>
            <UBadge color="primary" variant="subtle" class="px-3 py-1 text-xs">
              <UIcon name="i-heroicons-funnel" class="w-3 h-3 mr-1 inline" />
              {{ t('bookings.badgeStatus') }}
            </UBadge>
            <UBadge color="primary" variant="subtle" class="px-3 py-1 text-xs">
              <UIcon
                name="i-heroicons-calendar-days"
                class="w-3 h-3 mr-1 inline"
              />
              {{ t('bookings.badgeDates') }}
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
