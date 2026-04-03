<script setup lang="ts">
import SearchSummaryBar from '~/components/b2b/hotel/SearchSummaryBar.vue';
import FiltersSidebar from '~/components/b2b/hotel/FiltersSidebar.vue';
import ResultCard from '~/components/b2b/hotel/ResultCard.vue';
import HotelMap from '~/components/b2b/hotel/HotelMap.vue';
import {
  useHotels,
  type HotelFilterState,
  type Hotel,
} from '~/composables/useHotels';
import { useHotelSearch } from '~/composables/useHotelSearch';
import type { IRoomDistribution } from '#shared/types/booking';

definePageMeta({
  layout: 'dashboard',
});

const { hotels, searchHotels, filterHotels } = useHotels();
const { searchParams, hydrateFromRoute } = useHotelSearch();

onMounted(async () => {
  hydrateFromRoute();
  if (searchParams.value.destination_code) {
    const rooms: IRoomDistribution[] = (searchParams.value.rooms ?? []).map(
      (r) => ({
        adults: r.adults,
        children: r.children.length,
        children_ages: r.children.map((c) => c.age),
      }),
    );
    await searchHotels({
      destination_code: searchParams.value.destination_code,
      check_in: searchParams.value.check_in,
      check_out: searchParams.value.check_out,
      rooms,
    });
  }
});

useHead(
  computed(() => ({
    title: searchParams.value.destination_label
      ? `Resultados: ${searchParams.value.destination_label} - TravelOTA B2B`
      : 'Resultados de búsqueda - TravelOTA B2B',
  })),
);

// Mobile filter panel toggle
const showMobileFilters = ref(false);

// Sort state: field + direction
const sortField = ref<'price' | 'stars' | 'name' | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

const toggleSort = (field: 'price' | 'stars' | 'name') => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
};

const sortIcon = (field: string): string => {
  if (sortField.value !== field) return 'i-heroicons-chevron-up-down';
  return sortDirection.value === 'asc'
    ? 'i-heroicons-chevron-up'
    : 'i-heroicons-chevron-down';
};

const isMapOpen = ref(false);
const selectedHotelId = ref<string | null>(null);

const handleOpenMap = (hotel?: Hotel) => {
  if (hotel && hotel.hotel_code) {
    selectedHotelId.value = hotel.hotel_code;
  } else {
    selectedHotelId.value = null;
  }
  isMapOpen.value = true;
};

// Filter state from sidebar
const activeFilters = ref<HotelFilterState>({
  hotelName: '',
  priceMin: 0,
  priceMax: 999999,
  categories: [],
  regimes: [],
  hideNR: false,
  hideOR: false,
});
const onFilterUpdate = (filters: HotelFilterState) => {
  activeFilters.value = filters;
};

// Filtered hotels
const filteredHotels = computed(() => {
  return filterHotels(activeFilters.value);
});

// Sorted hotels
const sortedHotels = computed(() => {
  const list = [...filteredHotels.value];
  if (!sortField.value) return list;

  const dir = sortDirection.value === 'asc' ? 1 : -1;
  return list.sort((a: Hotel, b: Hotel) => {
    switch (sortField.value) {
      case 'price':
        return (a.best_price - b.best_price) * dir;
      case 'stars':
        return (a.category - b.category) * dir;
      case 'name':
        return a.hotel_name.localeCompare(b.hotel_name) * dir;
      default:
        return 0;
    }
  });
});

// Min price
const minPrice = computed(() =>
  filteredHotels.value.length
    ? Math.min(...filteredHotels.value.map((h) => h.best_price))
    : 0,
);

// Pagination
const ITEMS_PER_PAGE = 10;
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.ceil(sortedHotels.value.length / ITEMS_PER_PAGE),
);
const paginatedHotels = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return sortedHotels.value.slice(start, start + ITEMS_PER_PAGE);
});
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch(
  [sortField, sortDirection, activeFilters],
  () => {
    currentPage.value = 1;
  },
  { deep: true },
);
</script>

<template>
  <div class="pb-12">
    <!-- Header Resumen -->
    <SearchSummaryBar />

    <!-- Grid Layout Principal -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <!-- Columna Izquierda: Filtros (hidden on mobile) -->
      <aside
        class="hidden lg:block w-[320px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        <FiltersSidebar
          :hotels="hotels"
          @update:filters="onFilterUpdate"
          @open-map="handleOpenMap()"
        />
      </aside>

      <!-- Columna Derecha: Resultados -->
      <main class="flex-1 w-full min-w-0">
        <!-- Results count -->
        <p
          class="text-sm text-primary-600 dark:text-primary-400 font-medium mb-3"
        >
          <span class="font-bold">{{ filteredHotels.length }}</span>
          {{ $t('hotels.results.hotelsFoundFrom') }}
          <span class="font-bold"
            >${{
              minPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}</span
          >
        </p>

        <!-- Sort toolbar -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <!-- Mobile-only filter button -->
          <UButton
            color="primary"
            variant="outline"
            icon="i-heroicons-funnel"
            class="lg:hidden"
            @click="showMobileFilters = true"
          >
            {{ $t('hotels.results.filters') }}
          </UButton>

          <UButton
            color="neutral"
            :variant="sortField === 'price' ? 'solid' : 'outline'"
            size="sm"
            :icon="sortIcon('price')"
            @click="toggleSort('price')"
          >
            {{ $t('hotels.results.sortPrice') }}
          </UButton>
          <UButton
            color="neutral"
            :variant="sortField === 'stars' ? 'solid' : 'outline'"
            size="sm"
            :icon="sortIcon('stars')"
            @click="toggleSort('stars')"
          >
            {{ $t('hotels.results.sortCategory') }}
          </UButton>
          <UButton
            color="neutral"
            :variant="sortField === 'name' ? 'solid' : 'outline'"
            size="sm"
            :icon="sortIcon('name')"
            @click="toggleSort('name')"
          >
            {{ $t('hotels.results.sortName') }}
          </UButton>
        </div>

        <!-- Pagination top -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-between mb-4"
        >
          <span class="text-xs text-gray-500">
            {{
              $t('hotels.results.pageOf', {
                current: currentPage,
                total: totalPages,
              })
            }}
          </span>
          <div class="flex items-center gap-1">
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="currentPage <= 1"
              @click="goToPage(currentPage - 1)"
            >
              {{ $t('hotels.results.prev') }}
            </UButton>
            <UButton
              v-for="p in totalPages"
              :key="p"
              size="xs"
              :color="p === currentPage ? 'primary' : 'neutral'"
              :variant="p === currentPage ? 'solid' : 'ghost'"
              @click="goToPage(p)"
            >
              {{ p }}
            </UButton>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="currentPage >= totalPages"
              @click="goToPage(currentPage + 1)"
            >
              {{ $t('hotels.results.next') }}
            </UButton>
          </div>
        </div>

        <!-- Renderizado de Tarjetas -->
        <div>
          <ResultCard
            v-for="hotel in paginatedHotels"
            :key="hotel.hotel_code"
            :hotel="hotel"
            @open-map="handleOpenMap($event)"
          />
        </div>

        <!-- Pagination bottom -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-between mt-6"
        >
          <span class="text-xs text-gray-500">
            {{
              $t('hotels.results.pageOf', {
                current: currentPage,
                total: totalPages,
              })
            }}
          </span>
          <div class="flex items-center gap-1">
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="currentPage <= 1"
              @click="goToPage(currentPage - 1)"
            >
              {{ $t('hotels.results.prev') }}
            </UButton>
            <UButton
              v-for="p in totalPages"
              :key="p"
              size="xs"
              :color="p === currentPage ? 'primary' : 'neutral'"
              :variant="p === currentPage ? 'solid' : 'ghost'"
              @click="goToPage(p)"
            >
              {{ p }}
            </UButton>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="currentPage >= totalPages"
              @click="goToPage(currentPage + 1)"
            >
              {{ $t('hotels.results.next') }}
            </UButton>
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile Filters Slideover -->
    <USlideover v-model:open="showMobileFilters" side="left" class="lg:hidden">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ $t('hotels.results.filters') }}
          </h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="showMobileFilters = false"
          />
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <FiltersSidebar
            :hotels="hotels"
            @update:filters="onFilterUpdate"
            @open-map="handleOpenMap()"
          />
        </div>
      </template>
    </USlideover>

    <!-- Modals -->
    <HotelMap
      v-model="isMapOpen"
      :hotels="filteredHotels"
      :selected-hotel-id="selectedHotelId"
    />
  </div>
</template>
