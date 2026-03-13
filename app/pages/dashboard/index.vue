<script setup lang="ts">
import { useRouter } from "vue-router";
import HotelSearchForm from "~/components/b2b/hotel/HotelSearchForm.vue";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Buscador de Hoteles - Portal B2B",
});

const router = useRouter();

const handleSearch = (data: Record<string, unknown>) => {
  // TODO: Pass searchForm data to Pinia store or via query params
  console.log("Starting search with payload:", data);
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
    label: "Comisión media",
    value: "14%",
    icon: "i-heroicons-currency-euro",
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

    <!-- Ofertas Destacadas o Inspiración -->
    <div>
      <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Ofertas Destacadas para Agencias
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Tarjeta 1 -->
        <UCard
          :ui="{
            body: { padding: 'p-0', base: 'p-0' },
            base: 'overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800',
          }"
        >
          <div class="h-48 bg-gray-200 dark:bg-gray-800 relative">
            <img
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Punta Cana"
              class="w-full h-full object-cover"
            />
            <UBadge
              color="error"
              class="absolute top-3 right-3 font-bold px-2 py-1"
              >-20%</UBadge
            >
          </div>
          <div class="p-5">
            <h3 class="font-bold text-lg mb-1 text-gray-900 dark:text-white">
              Resorts en Punta Cana
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Todo Incluido • Reservas hasta fin de mes
            </p>
            <div
              class="flex justify-between items-center mt-2 pt-4 border-t border-gray-100 dark:border-gray-800"
            >
              <span
                class="text-xs text-primary font-bold uppercase tracking-wider"
                >Comisión 15%</span
              >
              <UButton variant="soft" size="xs" color="primary"
                >Ver hoteles</UButton
              >
            </div>
          </div>
        </UCard>

        <!-- Tarjeta 2 -->
        <UCard
          :ui="{
            body: { padding: 'p-0', base: 'p-0' },
            base: 'overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800',
          }"
        >
          <div class="h-48 bg-gray-200 dark:bg-gray-800 relative">
            <img
              src="https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Madrid"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-5">
            <h3 class="font-bold text-lg mb-1 text-gray-900 dark:text-white">
              Escapadas Mágicas Madrid
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Hoteles céntricos 4 estrellas en Gran Vía
            </p>
            <div
              class="flex justify-between items-center mt-2 pt-4 border-t border-gray-100 dark:border-gray-800"
            >
              <span
                class="text-xs text-primary font-bold uppercase tracking-wider"
                >Comisión 12%</span
              >
              <UButton variant="soft" size="xs" color="primary"
                >Ver hoteles</UButton
              >
            </div>
          </div>
        </UCard>

        <!-- Tarjeta 3 -->
        <UCard
          :ui="{
            body: { padding: 'p-0', base: 'p-0' },
            base: 'overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800',
          }"
        >
          <div class="h-48 bg-gray-200 dark:bg-gray-800 relative">
            <img
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Dubai"
              class="w-full h-full object-cover"
            />
            <UBadge
              color="primary"
              class="absolute top-3 right-3 font-bold px-2 py-1"
              >NUEVO</UBadge
            >
          </div>
          <div class="p-5">
            <h3 class="font-bold text-lg mb-1 text-gray-900 dark:text-white">
              Lujo B2B en Dubai
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Condiciones especiales agencias TOP
            </p>
            <div
              class="flex justify-between items-center mt-2 pt-4 border-t border-gray-100 dark:border-gray-800"
            >
              <span
                class="text-xs text-primary font-bold uppercase tracking-wider"
                >Comisión 18%</span
              >
              <UButton variant="soft" size="xs" color="primary"
                >Ver hoteles</UButton
              >
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
