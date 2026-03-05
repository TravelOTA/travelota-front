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
