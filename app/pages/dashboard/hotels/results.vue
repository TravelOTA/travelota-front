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

// Hotel Mock data
const mockHotels = [
  {
    id: 1,
    name: "Serenade Punta Cana Beach & Spa Resort",
    stars: 5,
    location: "Punta Cana, DO",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "recomendado",
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
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "hot",
    bestPrice: 2454.66,
    rooms: [
      {
        name: "Suite",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 2454.66,
      },
      {
        name: "Suite",
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
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "recomendado",
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
];

// Sorted hotels computed
const sortedHotels = computed(() => {
  const list = [...mockHotels];
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

// Min price for display
const minPrice = computed(() =>
  Math.min(...mockHotels.map((h) => h.bestPrice)),
);
</script>

<template>
  <div class="max-w-[1400px] mx-auto pb-12">
    <!-- Header Resumen -->
    <SearchSummaryBar />

    <!-- Grid Layout Principal -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <!-- Columna Izquierda: Filtros (hidden on mobile) -->
      <aside class="hidden lg:block w-[320px] shrink-0 sticky top-24">
        <FiltersSidebar />
      </aside>

      <!-- Columna Derecha: Resultados -->
      <main class="flex-1 w-full min-w-0">
        <!-- Results count -->
        <p
          class="text-sm text-primary-600 dark:text-primary-400 font-medium mb-3"
        >
          <span class="font-bold">{{ mockHotels.length }}</span> hoteles
          encontrados desde
          <span class="font-bold">${{ minPrice.toLocaleString("en-US") }}</span>
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

        <!-- Renderizado de Tarjetas -->
        <div>
          <ResultCard
            v-for="hotel in sortedHotels"
            :key="hotel.id"
            :hotel="hotel"
          />
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
          <FiltersSidebar />
        </div>
      </template>
    </USlideover>
  </div>
</template>
