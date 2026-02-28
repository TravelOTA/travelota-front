<script setup>
import { ref } from "vue";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Buscador de Hoteles - Portal B2B",
});

const searchForm = ref({
  destination: "",
  checkIn: "",
  checkOut: "",
  guests: 2,
  rooms: 1,
});

const handleSearch = () => {
  // Aquí se redirigiría a los resultados de búsqueda de hoteles
  console.log("Buscando hoteles internamente con:", searchForm.value);
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
    <UCard :ui="{ shadow: 'shadow-md', rounded: 'rounded-lg' }" class="mb-10">
      <form
        class="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-6 items-end"
        @submit.prevent="handleSearch"
      >
        <!-- Destino -->
        <UFormGroup label="Destino o nombre del hotel" class="md:col-span-4">
          <UInput
            v-model="searchForm.destination"
            icon="i-heroicons-map-pin"
            placeholder="Ej. Madrid, Cancún, Punta Cana..."
            size="lg"
            :ui="{ base: 'h-11' }"
          />
        </UFormGroup>

        <!-- Fechas (simplificado con 2 inputs de fecha por ahora) -->
        <UFormGroup label="Entrada" class="md:col-span-2">
          <UInput
            v-model="searchForm.checkIn"
            type="date"
            icon="i-heroicons-calendar"
            size="lg"
            :ui="{ base: 'h-11' }"
          />
        </UFormGroup>

        <UFormGroup label="Salida" class="md:col-span-2">
          <UInput
            v-model="searchForm.checkOut"
            type="date"
            icon="i-heroicons-calendar"
            size="lg"
            :ui="{ base: 'h-11' }"
          />
        </UFormGroup>

        <!-- Habitaciones y Huéspedes -->
        <UFormGroup label="Huéspedes" class="md:col-span-2">
          <UInput
            v-model="searchForm.guests"
            type="number"
            min="1"
            icon="i-heroicons-users"
            size="lg"
            :ui="{ base: 'h-11' }"
          />
        </UFormGroup>

        <!-- Botón Buscar -->
        <div class="md:col-span-2">
          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            icon="i-heroicons-magnifying-glass"
            class="font-bold tracking-wide h-11"
          >
            BUSCAR
          </UButton>
        </div>
      </form>
    </UCard>

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
              color="red"
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
              src="https://images.unsplash.com/photo-1539037116277-4db20202d03d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
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
