<script setup lang="ts">
import { useRouter } from "vue-router";
import HotelSearchForm from "~/components/b2b/hotel/HotelSearchForm.vue";
import B2bLandingPromotionCard from "~/components/b2b/landing/PromotionCard.vue";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Buscador de Hoteles - Portal B2B",
});

const router = useRouter();
const { promotions } = usePromotions();

const handleSearch = (data: Record<string, unknown>) => {
  // TODO: Pass searchForm data to Pinia store or via query params
  console.log("Starting search with payload:", data);
  router.push("/dashboard/hotels/results");
};

const handlePromotionSearch = (destination: string) => {
  console.log("Promotion search for:", destination);
  router.push("/dashboard/hotels/results");
};

const quickStats = [
  {
    label: "Reservas activas",
    value: "24",
    icon: "i-heroicons-briefcase",
    iconBg: "bg-primary-50 dark:bg-primary-950",
    iconColor: "text-primary-500",
  },
  {
    label: "Hoteles disponibles",
    value: "500k+",
    icon: "i-heroicons-building-office-2",
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-500",
  },
  {
    label: "Destinos activos",
    value: "180",
    icon: "i-heroicons-map-pin",
    iconBg: "bg-amber-50 dark:bg-amber-950",
    iconColor: "text-amber-500",
  },
  {
    label: "Reservas este mes",
    value: "8",
    icon: "i-heroicons-calendar-days",
    iconBg: "bg-green-50 dark:bg-green-950",
    iconColor: "text-green-500",
  },
];
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Buscar Hoteles
      </h1>
      <p class="text-gray-500 dark:text-gray-400">
        Encuentra y reserva el alojamiento perfecto para tus clientes al mejor
        precio neto B2B.
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <UCard
        v-for="stat in quickStats"
        :key="stat.label"
        class="border border-gray-100 dark:border-gray-800"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            :class="stat.iconBg"
          >
            <UIcon :name="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stat.value }}
            </p>
            <p
              class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ stat.label }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Buscador Principal -->
    <div class="mb-10">
      <HotelSearchForm @search="handleSearch" />
    </div>

    <!-- Promociones Destacadas -->
    <div>
      <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Destinos Destacados
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <B2bLandingPromotionCard
          v-for="promo in promotions"
          :key="promo.id"
          :promotion="promo"
          @search="handlePromotionSearch"
        />
      </div>
    </div>
  </div>
</template>
