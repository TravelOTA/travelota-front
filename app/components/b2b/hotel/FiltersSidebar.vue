<script setup lang="ts">
defineProps({
  totalResults: {
    type: Number,
    default: 139,
  },
  minPrice: {
    type: Number,
    default: 151,
  },
});

// Reactive variables for visual filters
const hotelName = ref("");
const nearPoint = ref("");
const nearAddress = ref("");
const priceRange = ref([151, 31764]);

// Category Filters
const categories = [
  { label: "★★★★★", count: 80, value: "5", color: "text-yellow-400" },
  { label: "★★★★", count: 17, value: "4", color: "text-yellow-400" },
  { label: "★★★", count: 30, value: "3", color: "text-yellow-400" },
  { label: "★★", count: 8, value: "2", color: "text-yellow-400" },
  { label: "★", count: 1, value: "1", color: "text-yellow-400" },
  { label: "Apartamentos", count: 5, value: "apt", icon: "i-heroicons-key" },
];
const selectedCategories = ref([]);

// Board/Regime Filters
const regimes = [
  { label: "Alojamiento y Desayuno", value: "ad" },
  { label: "Media Pension", value: "mp" },
  { label: "Pension Completa", value: "pc" },
  { label: "Solo Alojamiento", value: "sa" },
  { label: "Solo Habitacion", value: "sh" },
  { label: "Todo Incluido", value: "ti" },
];
const selectedRegimes = ref([]);

// Rate Options (Interactive radios)
const rateOptions = [
  { value: "all", label: "Mostrar todas las tarifas" },
  { value: "non_refundable", label: "Mostrar tarifas no reembolsables" },
  { value: "refundable", label: "Ocultar tarifas no reembolsables" },
];
const selectedRateOption = ref("all");
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <!-- Header de Filtros (Caja Negra) -->
    <div class="bg-[#5c6670] rounded-t-lg overflow-hidden">
      <div class="py-4 px-6 text-center text-white">
        <p
          class="text-xs uppercase font-bold tracking-wider text-gray-300 mb-1"
        >
          Resultados Encontrados
        </p>
        <p class="text-2xl font-light">
          <span class="font-bold text-3xl">{{ totalResults }}</span> hoteles
          desde <span class="font-bold text-3xl">${{ minPrice }}</span>
        </p>
      </div>

      <!-- Falso Mapa embebido -->
      <div class="relative h-32 bg-gray-200">
        <!-- Mapa dummy -->
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Mapa"
          class="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <UButton
            color="neutral"
            class="bg-gray-800/90 hover:bg-black uppercase tracking-wider text-xs font-bold px-4"
          >
            Ver hoteles en el mapa
          </UButton>
        </div>
      </div>
    </div>

    <!-- Controles de Filtros Internos -->
    <div
      class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-b-lg p-5 flex flex-col gap-6"
    >
      <!-- Nombre de Hotel -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2"
          >Nombre de Hotel</label
        >
        <UInput
          v-model="hotelName"
          placeholder="Nombre de hotel"
          icon="i-heroicons-magnifying-glass"
          trailing
        />
      </div>

      <!-- Cerca De -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2"
          >Cerca De</label
        >
        <div class="space-y-2">
          <USelectMenu
            v-model="nearPoint"
            :options="['Punto de interés', 'Aeropuerto', 'Playa']"
            placeholder="Punto de interés"
          />
          <UInput
            v-model="nearAddress"
            placeholder="Dirección"
            icon="i-heroicons-magnifying-glass"
            trailing
          />
        </div>
      </div>

      <!-- Rango de Precios -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4"
          >Rango de Precios</label
        >
        <!-- Selector de Rango (usaremos Range simulado visual por UI UX) -->
        <URange
          v-model="priceRange[0]"
          :min="151"
          :max="31764"
          class="accent-green-500"
        />
        <div
          class="flex justify-between items-center text-xs text-gray-500 mt-2"
        >
          <span>{{ priceRange[0] }}</span>
          <span>31.764</span>
        </div>
      </div>

      <!-- Categoría -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3"
          >Categoría</label
        >
        <div class="space-y-2">
          <UCheckbox
            v-for="cat in categories"
            :key="cat.value"
            v-model="selectedCategories"
            :value="cat.value"
            color="primary"
          >
            <template #label>
              <div
                class="flex items-center text-sm text-gray-700 dark:text-gray-300"
              >
                <span :class="cat.color">{{ cat.label }}</span>
                <span v-if="cat.icon" class="flex items-center gap-1"
                  ><UIcon :name="cat.icon" class="w-4 h-4 text-gray-500" />
                  aptos</span
                >
                <span class="text-gray-400 ml-1">({{ cat.count }})</span>
              </div>
            </template>
          </UCheckbox>
        </div>
      </div>

      <!-- Características (Dummy form) -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2"
          >Características</label
        >
        <UInput placeholder="..." />
      </div>

      <!-- Régimen -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3"
          >Régimen</label
        >
        <div class="space-y-2">
          <UCheckbox
            v-for="reg in regimes"
            :key="reg.value"
            v-model="selectedRegimes"
            :value="reg.value"
            :label="reg.label"
            color="primary"
            class="text-sm text-gray-700 dark:text-gray-300"
          />
        </div>
      </div>

      <!-- Tarifas Checkboxes -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3"
          >Tarifas</label
        >
        <div class="space-y-2">
          <UCheckbox
            label="Mostrar sólo ofertas"
            class="text-sm text-gray-700 dark:text-gray-300"
          />
          <UCheckbox
            label="Descartar tarifas bajo petición"
            class="text-sm text-gray-700 dark:text-gray-300"
          />
        </div>
      </div>

      <!-- Tarifas no Reembolsables (Radios) -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3"
          >Tarifas No Reembolsables</label
        >
        <URadioGroup
          v-model="selectedRateOption"
          :options="rateOptions"
          class="text-sm text-gray-700 dark:text-gray-300 space-y-2"
        />
      </div>
    </div>
  </div>
</template>
