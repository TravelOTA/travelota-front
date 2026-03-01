<script setup lang="ts">
// Reactive filter state
const hotelName = ref("");

// Price range (dual slider)
const priceMin = ref(151);
const priceMax = ref(31764);
const PRICE_FLOOR = 151;
const PRICE_CEIL = 31764;

// Price distribution histogram (mock data simulating a decreasing curve)
const priceDistribution = [
  95, 88, 82, 76, 70, 65, 60, 55, 50, 46, 42, 38, 35, 32, 29, 26, 24, 22, 20,
  18, 16, 14, 12, 10, 9, 8, 7, 6, 5, 4,
];
const maxBar = Math.max(...priceDistribution);

// Computed positions for dual slider overlay
const minPercent = computed(
  () => ((priceMin.value - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100,
);
const maxPercent = computed(
  () => ((priceMax.value - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100,
);

// Clamp values on blur and reactively
const clampMin = () => {
  if (priceMin.value < 0) priceMin.value = 0;
  if (priceMin.value > PRICE_CEIL) priceMin.value = PRICE_CEIL;
  if (priceMin.value >= priceMax.value) priceMin.value = priceMax.value - 1;
};
const clampMax = () => {
  if (priceMax.value < 0) priceMax.value = 0;
  if (priceMax.value > PRICE_CEIL) priceMax.value = PRICE_CEIL;
  if (priceMax.value <= priceMin.value) priceMax.value = priceMin.value + 1;
};

// Also enforce limits reactively via watch (prevents histogram overflow while typing)
watch(priceMin, (val) => {
  if (val < 0) priceMin.value = 0;
  if (val > PRICE_CEIL) priceMin.value = PRICE_CEIL;
});
watch(priceMax, (val) => {
  if (val < 0) priceMax.value = 0;
  if (val > PRICE_CEIL) priceMax.value = PRICE_CEIL;
});

// Slider input handlers
const onMinSlider = (e: Event) => {
  priceMin.value = Math.min(
    Number((e.target as HTMLInputElement).value),
    priceMax.value - 1,
  );
};
const onMaxSlider = (e: Event) => {
  priceMax.value = Math.max(
    Number((e.target as HTMLInputElement).value),
    priceMin.value + 1,
  );
};

// Which histogram bars are inside the selected range
const barInRange = (barIndex: number): boolean => {
  const totalBars = priceDistribution.length;
  const barStart =
    PRICE_FLOOR + (barIndex / totalBars) * (PRICE_CEIL - PRICE_FLOOR);
  const barEnd =
    PRICE_FLOOR + ((barIndex + 1) / totalBars) * (PRICE_CEIL - PRICE_FLOOR);
  return barEnd >= priceMin.value && barStart <= priceMax.value;
};

// Category filters
const categories = [
  { label: "★★★★★", count: 80, value: "5" },
  { label: "★★★★", count: 17, value: "4" },
  { label: "★★★", count: 30, value: "3" },
  { label: "★★", count: 8, value: "2" },
  { label: "★", count: 1, value: "1" },
];
const selectedCategories = ref<string[]>([]);

// Board/regime filters
const regimes = [
  { label: "Solo Alojamiento", value: "SA" },
  { label: "Alojamiento y Desayuno", value: "CP" },
  { label: "Media Pension", value: "MP" },
  { label: "Pension Completa", value: "PC" },
  { label: "Todo Incluido", value: "TI" },
];
const selectedRegimes = ref<string[]>([]);
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <!-- Map placeholder -->
    <div class="rounded-lg overflow-hidden">
      <div class="relative h-32 bg-gray-700">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Map"
          class="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <UButton
            color="primary"
            variant="solid"
            class="uppercase tracking-wider text-xs font-bold px-4"
          >
            Ver hoteles en el mapa
          </UButton>
        </div>
      </div>
    </div>

    <!-- Filter controls -->
    <div
      class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-b-lg p-5 flex flex-col gap-6"
    >
      <!-- Hotel name -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2"
        >
          Nombre de Hotel
        </label>
        <UInput
          v-model="hotelName"
          placeholder="Nombre de hotel"
          icon="i-heroicons-magnifying-glass"
          size="md"
          class="w-full"
          trailing
        />
      </div>

      <!-- Price range -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3"
        >
          Precio total
        </label>

        <!-- Editable Min / Max inputs -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div
            class="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus-within:border-primary-500 transition-colors"
          >
            <label
              class="block text-xs text-primary-600 dark:text-primary-400 font-medium mb-0.5"
            >
              Mínimo
            </label>
            <div class="flex items-center">
              <span class="text-sm font-bold text-gray-900 dark:text-white"
                >$</span
              >
              <input
                v-model.number="priceMin"
                type="number"
                :min="PRICE_FLOOR"
                :max="priceMax - 1"
                class="w-full bg-transparent text-sm font-bold text-gray-900 dark:text-white outline-none pl-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                @blur="clampMin"
              />
            </div>
          </div>
          <div
            class="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus-within:border-primary-500 transition-colors"
          >
            <label
              class="block text-xs text-primary-600 dark:text-primary-400 font-medium mb-0.5"
            >
              Máximo
            </label>
            <div class="flex items-center">
              <span class="text-sm font-bold text-gray-900 dark:text-white"
                >$</span
              >
              <input
                v-model.number="priceMax"
                type="number"
                :min="priceMin + 1"
                :max="PRICE_CEIL"
                class="w-full bg-transparent text-sm font-bold text-gray-900 dark:text-white outline-none pl-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                @blur="clampMax"
              />
              <span class="text-sm font-bold text-gray-900 dark:text-white"
                >+</span
              >
            </div>
          </div>
        </div>

        <!-- Histogram bars -->
        <div class="flex items-end gap-[2px] h-16 mb-1 px-1">
          <div
            v-for="(bar, i) in priceDistribution"
            :key="i"
            class="flex-1 rounded-t-sm transition-colors"
            :style="{ height: `${(bar / maxBar) * 100}%` }"
            :class="
              barInRange(i) ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
            "
          />
        </div>

        <!-- Dual range slider -->
        <div class="relative h-6">
          <!-- Track background -->
          <div
            class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"
          />
          <!-- Active track -->
          <div
            class="absolute top-1/2 -translate-y-1/2 h-1 bg-primary-500 rounded-full"
            :style="{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }"
          />
          <!-- Min slider -->
          <input
            type="range"
            :min="PRICE_FLOOR"
            :max="PRICE_CEIL"
            :value="priceMin"
            class="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
            @input="onMinSlider"
          />
          <!-- Max slider -->
          <input
            type="range"
            :min="PRICE_FLOOR"
            :max="PRICE_CEIL"
            :value="priceMax"
            class="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
            @input="onMaxSlider"
          />
        </div>
      </div>

      <!-- Category -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3"
        >
          Categoría
        </label>
        <div class="space-y-2">
          <label
            v-for="cat in categories"
            :key="cat.value"
            class="flex items-center gap-2 cursor-pointer text-sm"
          >
            <input
              v-model="selectedCategories"
              type="checkbox"
              :value="cat.value"
              class="w-4 h-4 rounded border-gray-300 accent-green-600 focus:ring-primary-500"
            />
            <span class="text-yellow-400">{{ cat.label }}</span>
            <span class="text-gray-400 ml-auto">({{ cat.count }})</span>
          </label>
        </div>
      </div>

      <!-- Regime -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3"
        >
          Régimen
        </label>
        <div class="space-y-2">
          <label
            v-for="reg in regimes"
            :key="reg.value"
            class="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
          >
            <input
              v-model="selectedRegimes"
              type="checkbox"
              :value="reg.value"
              class="w-4 h-4 rounded border-gray-300 accent-green-600 focus:ring-primary-500"
            />
            {{ reg.label }}
          </label>
        </div>
      </div>

      <!-- Rate checkboxes -->
      <div>
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3"
        >
          Tarifas
        </label>
        <div class="space-y-2">
          <label
            class="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
          >
            <input
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 accent-green-600 focus:ring-primary-500"
            />
            Todas las Ofertas
          </label>
          <label
            class="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
          >
            <input
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 accent-green-600 focus:ring-primary-500"
            />
            Descartar Ofertas Bajo Petición
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
