<script setup lang="ts">
import SearchSummaryBar from "~/components/b2b/hotel/SearchSummaryBar.vue";
import FiltersSidebar from "~/components/b2b/hotel/FiltersSidebar.vue";
import ResultCard from "~/components/b2b/hotel/ResultCard.vue";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Resultados: Punta Cana - TravelOTA B2B",
});

// Mobile filter panel toggle
const showMobileFilters = ref(false);

// Sort state: field + direction
const sortField = ref<"price" | "stars" | "name" | null>(null);
const sortDirection = ref<"asc" | "desc">("asc");

const toggleSort = (field: "price" | "stars" | "name") => {
  if (sortField.value === field) {
    // Same field clicked: toggle direction
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // New field: set it and default to ascending
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

// Sort icon helper
const sortIcon = (field: string): string => {
  if (sortField.value !== field) return "i-heroicons-chevron-up-down";
  return sortDirection.value === "asc"
    ? "i-heroicons-chevron-up"
    : "i-heroicons-chevron-down";
};

// Hotel Mock data (25 hotels to test pagination, sorting, etc.)
const hotelImages = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];
const mockHotels = [
  {
    id: 1,
    name: "Serenade Punta Cana Beach & Spa Resort",
    stars: 5,
    location: "Punta Cana, DO",
    image: hotelImages[0],
    bestPrice: 1041.33,
    rooms: [
      {
        name: "Luxury tropical garden view",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1041.33,
      },
      {
        name: "Luxury master suite",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1228.82,
      },
    ],
  },
  {
    id: 2,
    name: "JOIA Bavaro BY IBEROSTAR",
    stars: 5,
    location: "Punta Cana, DO",
    image: hotelImages[1],
    bestPrice: 2454.66,
    rooms: [
      {
        name: "Suite Premium",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 2454.66,
      },
      {
        name: "Suite Deluxe",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 2749.2,
      },
    ],
  },
  {
    id: 3,
    name: "Iberostar WAVES DOMINICANA",
    stars: 5,
    location: "Playa Bavaro, DO",
    image: hotelImages[2],
    bestPrice: 1118.76,
    rooms: [
      {
        name: "Premium vista tropical",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1118.76,
      },
      {
        name: "Premium cerca de la playa",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1171.68,
      },
    ],
  },
  {
    id: 4,
    name: "Grand Palladium Palace Resort",
    stars: 5,
    location: "Punta Cana, DO",
    image: hotelImages[3],
    bestPrice: 1350.0,
    rooms: [
      {
        name: "Junior Suite",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 1350.0,
      },
      {
        name: "Suite familiar",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1580.5,
      },
    ],
  },
  {
    id: 5,
    name: "Barceló Bávaro Beach",
    stars: 5,
    location: "Playa Bavaro, DO",
    image: hotelImages[4],
    bestPrice: 985.4,
    rooms: [
      {
        name: "Superior",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 985.4,
      },
      {
        name: "Premium",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 1120.0,
      },
    ],
  },
  {
    id: 6,
    name: "Riu Palace Punta Cana",
    stars: 5,
    location: "Punta Cana, DO",
    image: hotelImages[0],
    bestPrice: 1425.9,
    rooms: [
      {
        name: "Doble estándar",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1425.9,
      },
      {
        name: "Junior Suite",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 1650.0,
      },
    ],
  },
  {
    id: 7,
    name: "Meliá Caribe Beach Resort",
    stars: 5,
    location: "Playa Bavaro, DO",
    image: hotelImages[1],
    bestPrice: 1289.0,
    rooms: [
      {
        name: "The Level Suite",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 1289.0,
      },
    ],
  },
  {
    id: 8,
    name: "Secrets Royal Beach",
    stars: 5,
    location: "Punta Cana, DO",
    image: hotelImages[2],
    bestPrice: 2100.5,
    rooms: [
      {
        name: "Junior Suite Tropical",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 2100.5,
      },
      {
        name: "Preferred Club Suite",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 2450.0,
      },
    ],
  },
  {
    id: 9,
    name: "Hotel Whala Bávaro",
    stars: 3,
    location: "Playa Bavaro, DO",
    image: hotelImages[3],
    bestPrice: 420.0,
    rooms: [
      {
        name: "Habitación estándar",
        regimen: "SA",
        cancellation: "No reembolsable",
        price: 420.0,
      },
      {
        name: "Habitación superior",
        regimen: "CP",
        cancellation: "Gastos de cancelación",
        price: 510.75,
      },
    ],
  },
  {
    id: 10,
    name: "Occidental Punta Cana",
    stars: 4,
    location: "Punta Cana, DO",
    image: hotelImages[4],
    bestPrice: 780.25,
    rooms: [
      {
        name: "Doble estándar",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 780.25,
      },
      {
        name: "Suite",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 920.0,
      },
    ],
  },
  {
    id: 11,
    name: "Bahia Principe Fantasia",
    stars: 5,
    location: "Punta Cana, DO",
    image: hotelImages[0],
    bestPrice: 1195.6,
    rooms: [
      {
        name: "Junior Suite Deluxe",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 1195.6,
      },
    ],
  },
  {
    id: 12,
    name: "Hotel Vista Sol Punta Cana",
    stars: 4,
    location: "Playa Bavaro, DO",
    image: hotelImages[1],
    bestPrice: 550.0,
    rooms: [
      {
        name: "Standard Room",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 550.0,
      },
      {
        name: "Superior Room",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 680.3,
      },
    ],
  },
  {
    id: 13,
    name: "Hard Rock Hotel & Casino",
    stars: 5,
    location: "Punta Cana, DO",
    image: hotelImages[2],
    bestPrice: 3200.0,
    rooms: [
      {
        name: "Gold Room",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 3200.0,
      },
      {
        name: "Diamond Suite",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 4500.0,
      },
    ],
  },
  {
    id: 14,
    name: "Viva Wyndham Dominicus",
    stars: 4,
    location: "Bayahibe, DO",
    image: hotelImages[3],
    bestPrice: 625.8,
    rooms: [
      {
        name: "Garden View",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 625.8,
      },
    ],
  },
  {
    id: 15,
    name: "Catalonia Royal Bávaro",
    stars: 5,
    location: "Playa Bavaro, DO",
    image: hotelImages[4],
    bestPrice: 1560.0,
    rooms: [
      {
        name: "Privileged Suite",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 1560.0,
      },
      {
        name: "Honeymoon Suite",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1820.45,
      },
    ],
  },
  {
    id: 16,
    name: "Be Live Collection Punta Cana",
    stars: 4,
    location: "Punta Cana, DO",
    image: hotelImages[0],
    bestPrice: 710.0,
    rooms: [
      {
        name: "Deluxe Room",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 710.0,
      },
      {
        name: "Junior Suite",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 880.0,
      },
    ],
  },
  {
    id: 17,
    name: "Dreams Palm Beach",
    stars: 5,
    location: "Playa Bavaro, DO",
    image: hotelImages[1],
    bestPrice: 1850.3,
    rooms: [
      {
        name: "Deluxe Tropical",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 1850.3,
      },
    ],
  },
  {
    id: 18,
    name: "Coral Costa Caribe",
    stars: 3,
    location: "Juan Dolio, DO",
    image: hotelImages[2],
    bestPrice: 310.5,
    rooms: [
      {
        name: "Estándar",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 310.5,
      },
      {
        name: "Superior",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 395.0,
      },
    ],
  },
  {
    id: 19,
    name: "Lopesan Costa Bávaro",
    stars: 5,
    location: "Playa Bavaro, DO",
    image: hotelImages[3],
    bestPrice: 1680.0,
    rooms: [
      {
        name: "Standard Suite",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1680.0,
      },
      {
        name: "Swim-up Suite",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 2150.0,
      },
    ],
  },
  {
    id: 20,
    name: "Majestic Elegance",
    stars: 5,
    location: "Punta Cana, DO",
    image: hotelImages[4],
    bestPrice: 1920.0,
    rooms: [
      {
        name: "Elegance Club Suite",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1920.0,
      },
    ],
  },
  {
    id: 21,
    name: "Hotel Caribe Club Princess",
    stars: 4,
    location: "Playa Bavaro, DO",
    image: hotelImages[0],
    bestPrice: 490.0,
    rooms: [
      {
        name: "Standard",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 490.0,
      },
      {
        name: "Superior",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 590.0,
      },
    ],
  },
  {
    id: 22,
    name: "Breathless Punta Cana",
    stars: 5,
    location: "Punta Cana, DO",
    image: hotelImages[1],
    bestPrice: 2680.0,
    rooms: [
      {
        name: "Allure Suite",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 2680.0,
      },
      {
        name: "xhale Suite",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 3100.0,
      },
    ],
  },
  {
    id: 23,
    name: "Sunscape Dominicus La Romana",
    stars: 3,
    location: "La Romana, DO",
    image: hotelImages[2],
    bestPrice: 385.0,
    rooms: [
      {
        name: "Sun Club Deluxe",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 385.0,
      },
    ],
  },
  {
    id: 24,
    name: "Sanctuary Cap Cana",
    stars: 5,
    location: "Cap Cana, DO",
    image: hotelImages[3],
    bestPrice: 5200.0,
    rooms: [
      {
        name: "Ocean View Suite",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 5200.0,
      },
      {
        name: "Penthouse",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 8500.0,
      },
    ],
  },
  {
    id: 25,
    name: "Wyndham Garden Playa Dorada",
    stars: 2,
    location: "Puerto Plata, DO",
    image: hotelImages[4],
    bestPrice: 151.0,
    rooms: [
      {
        name: "Habitación doble",
        regimen: "SA",
        cancellation: "No reembolsable",
        price: 151.0,
      },
      {
        name: "Habitación triple",
        regimen: "CP",
        cancellation: "Gastos de cancelación",
        price: 198.5,
      },
    ],
  },
];

// Filter state from sidebar
interface FilterState {
  hotelName: string;
  priceMin: number;
  priceMax: number;
  categories: string[];
  regimes: string[];
}
const activeFilters = ref<FilterState>({
  hotelName: "",
  priceMin: 0,
  priceMax: 999999,
  categories: [],
  regimes: [],
});
const onFilterUpdate = (filters: FilterState) => {
  activeFilters.value = filters;
};

// Filtered hotels (apply sidebar filters)
const filteredHotels = computed(() => {
  const f = activeFilters.value;
  return mockHotels.filter((h) => {
    // Name search
    if (
      f.hotelName &&
      !h.name.toLowerCase().includes(f.hotelName.toLowerCase())
    )
      return false;
    // Price range
    if (h.bestPrice < f.priceMin || h.bestPrice > f.priceMax) return false;
    // Category (stars)
    if (f.categories.length > 0 && !f.categories.includes(String(h.stars)))
      return false;
    // Regime
    if (f.regimes.length > 0) {
      const hotelRegimes = h.rooms.map((r) => r.regimen);
      if (!f.regimes.some((reg) => hotelRegimes.includes(reg))) return false;
    }
    return true;
  });
});

// Sorted hotels computed (sorts filtered, not all)
const sortedHotels = computed(() => {
  const list = [...filteredHotels.value];
  if (!sortField.value) return list;

  const dir = sortDirection.value === "asc" ? 1 : -1;
  return list.sort((a, b) => {
    switch (sortField.value) {
      case "price":
        return (a.bestPrice - b.bestPrice) * dir;
      case "stars":
        return (a.stars - b.stars) * dir;
      case "name":
        return a.name.localeCompare(b.name) * dir;
      default:
        return 0;
    }
  });
});

// Min price for display (from filtered results)
const minPrice = computed(() =>
  filteredHotels.value.length
    ? Math.min(...filteredHotels.value.map((h) => h.bestPrice))
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
  window.scrollTo({ top: 0, behavior: "smooth" });
};
// Reset page when sort or filters change
watch(
  [sortField, sortDirection, activeFilters],
  () => {
    currentPage.value = 1;
  },
  { deep: true },
);
</script>

<template>
  <div class="max-w-[1400px] mx-auto pb-12">
    <!-- Header Resumen -->
    <SearchSummaryBar />

    <!-- Grid Layout Principal -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <!-- Columna Izquierda: Filtros (hidden on mobile) -->
      <aside
        class="hidden lg:block w-[320px] shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto"
      >
        <FiltersSidebar :hotels="mockHotels" @update:filters="onFilterUpdate" />
      </aside>

      <!-- Columna Derecha: Resultados -->
      <main class="flex-1 w-full min-w-0">
        <!-- Results count -->
        <p
          class="text-sm text-primary-600 dark:text-primary-400 font-medium mb-3"
        >
          <span class="font-bold">{{ filteredHotels.length }}</span> hoteles
          encontrados desde
          <span class="font-bold"
            >${{
              minPrice.toLocaleString("en-US", {
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
            Filtros
          </UButton>

          <UButton
            color="neutral"
            :variant="sortField === 'price' ? 'solid' : 'outline'"
            size="sm"
            :icon="sortIcon('price')"
            @click="toggleSort('price')"
          >
            Precio
          </UButton>
          <UButton
            color="neutral"
            :variant="sortField === 'stars' ? 'solid' : 'outline'"
            size="sm"
            :icon="sortIcon('stars')"
            @click="toggleSort('stars')"
          >
            Categoría
          </UButton>
          <UButton
            color="neutral"
            :variant="sortField === 'name' ? 'solid' : 'outline'"
            size="sm"
            :icon="sortIcon('name')"
            @click="toggleSort('name')"
          >
            Nombre
          </UButton>
        </div>

        <!-- Pagination top -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-between mb-4"
        >
          <span class="text-xs text-gray-500">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          <div class="flex items-center gap-1">
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="currentPage <= 1"
              @click="goToPage(currentPage - 1)"
            >
              ← Anterior
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
              Siguiente →
            </UButton>
          </div>
        </div>

        <!-- Renderizado de Tarjetas -->
        <div>
          <ResultCard
            v-for="hotel in paginatedHotels"
            :key="hotel.id"
            :hotel="hotel"
          />
        </div>

        <!-- Pagination bottom -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-between mt-6"
        >
          <span class="text-xs text-gray-500">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          <div class="flex items-center gap-1">
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              :disabled="currentPage <= 1"
              @click="goToPage(currentPage - 1)"
            >
              ← Anterior
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
              Siguiente →
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
            Filtros
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
            :hotels="mockHotels"
            @update:filters="onFilterUpdate"
          />
        </div>
      </template>
    </USlideover>
  </div>
</template>
