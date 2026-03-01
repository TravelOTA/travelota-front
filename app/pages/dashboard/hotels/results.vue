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

// Hotel Mock to paint UI (Matches user reference)
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
</script>

<template>
  <div class="max-w-[1400px] mx-auto pb-12">
    <!-- Header Resumen (Breadcrumb + Botón Editar) -->
    <SearchSummaryBar />

    <!-- Grid Layout Principal -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <!-- Columna Izquierda: Filtros -->
      <aside class="w-full lg:w-[320px] shrink-0 sticky top-24">
        <FiltersSidebar :total-results="139" :min-price="151" />
      </aside>

      <!-- Columna Derecha: Resultados -->
      <main class="flex-1 w-full min-w-0">
        <!-- Toolbar de Ordenación Superior -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <UButton
            color="neutral"
            variant="solid"
            class="bg-gray-400 hover:bg-gray-500 text-white rounded-none"
            >Recomendado</UButton
          >
          <USelectMenu
            :options="['Precio']"
            placeholder="Precio"
            class="w-32"
          />
          <USelectMenu
            :options="['Categoría']"
            placeholder="Categoría"
            class="w-32"
          />
          <USelectMenu
            :options="['Nombre']"
            placeholder="Nombre"
            class="w-32"
          />
        </div>

        <!-- Renderizado de Tarjetas -->
        <div>
          <ResultCard
            v-for="hotel in mockHotels"
            :key="hotel.id"
            :hotel="hotel"
          />
        </div>
      </main>
    </div>
  </div>
</template>
