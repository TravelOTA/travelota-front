<script setup lang="ts">
interface Hotel {
  id: number;
  name: string;
  stars: number;
  bestPrice: number;
  rooms: { regimen: string; cancellation?: string }[];
}

const props = defineProps<{
  hotels: Hotel[];
}>();

const emit = defineEmits<{
  (e: "update:filters", filters: FilterState): void;
  (e: "open-map"): void;
}>();

interface FilterState {
  hotelName: string;
  priceMin: number;
  priceMax: number;
  categories: string[];
  regimes: string[];
  hideNR: boolean;
  hideOR: boolean;
}

// Reactive filter state
const hotelName = ref("");

// Derive price bounds from actual hotel data
const PRICE_FLOOR = computed(() =>
  props.hotels.length
    ? Math.floor(Math.min(...props.hotels.map((h) => h.bestPrice)))
    : 0,
);
const PRICE_CEIL = computed(() =>
  props.hotels.length
    ? Math.ceil(Math.max(...props.hotels.map((h) => h.bestPrice)))
    : 10000,
);

const priceMin = ref(0);
const priceMax = ref(10000);

// Initialize price range when hotels change
watch(
  () => props.hotels,
  () => {
    priceMin.value = PRICE_FLOOR.value;
    priceMax.value = PRICE_CEIL.value;
  },
  { immediate: true },
);

// Price distribution histogram – compute from actual hotel data
const HISTOGRAM_BARS = 30;
const priceDistribution = computed(() => {
  const bars = new Array(HISTOGRAM_BARS).fill(0);
  const floor = PRICE_FLOOR.value;
  const ceil = PRICE_CEIL.value;
  const range = ceil - floor || 1;
  for (const h of props.hotels) {
    const idx = Math.min(
      Math.floor(((h.bestPrice - floor) / range) * HISTOGRAM_BARS),
      HISTOGRAM_BARS - 1,
    );
    bars[idx]++;
  }
  return bars;
});
const maxBar = computed(() => Math.max(...priceDistribution.value, 1));

// Computed positions for dual slider overlay
const minPercent = computed(
  () =>
    ((priceMin.value - PRICE_FLOOR.value) /
      (PRICE_CEIL.value - PRICE_FLOOR.value || 1)) *
    100,
);
const maxPercent = computed(
  () =>
    ((priceMax.value - PRICE_FLOOR.value) /
      (PRICE_CEIL.value - PRICE_FLOOR.value || 1)) *
    100,
);

// Clamp values on blur
const clampMin = () => {
  if (priceMin.value < PRICE_FLOOR.value) priceMin.value = PRICE_FLOOR.value;
  if (priceMin.value > PRICE_CEIL.value) priceMin.value = PRICE_CEIL.value;
  if (priceMin.value >= priceMax.value) priceMin.value = priceMax.value - 1;
};
const clampMax = () => {
  if (priceMax.value < PRICE_FLOOR.value) priceMax.value = PRICE_FLOOR.value;
  if (priceMax.value > PRICE_CEIL.value) priceMax.value = PRICE_CEIL.value;
  if (priceMax.value <= priceMin.value) priceMax.value = priceMin.value + 1;
};

// Enforce limits reactively
watch(priceMin, (val) => {
  if (val < PRICE_FLOOR.value) priceMin.value = PRICE_FLOOR.value;
  if (val > PRICE_CEIL.value) priceMin.value = PRICE_CEIL.value;
});
watch(priceMax, (val) => {
  if (val < PRICE_FLOOR.value) priceMax.value = PRICE_FLOOR.value;
  if (val > PRICE_CEIL.value) priceMax.value = PRICE_CEIL.value;
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
  const floor = PRICE_FLOOR.value;
  const ceil = PRICE_CEIL.value;
  const range = ceil - floor || 1;
  const barStart = floor + (barIndex / HISTOGRAM_BARS) * range;
  const barEnd = floor + ((barIndex + 1) / HISTOGRAM_BARS) * range;
  return barEnd >= priceMin.value && barStart <= priceMax.value;
};

// Category filters – compute counts from hotel data
const categories = computed(() => [
  {
    label: "★★★★★",
    count: props.hotels.filter((h) => h.stars === 5).length,
    value: "5",
  },
  {
    label: "★★★★",
    count: props.hotels.filter((h) => h.stars === 4).length,
    value: "4",
  },
  {
    label: "★★★",
    count: props.hotels.filter((h) => h.stars === 3).length,
    value: "3",
  },
  {
    label: "★★",
    count: props.hotels.filter((h) => h.stars === 2).length,
    value: "2",
  },
  {
    label: "★",
    count: props.hotels.filter((h) => h.stars === 1).length,
    value: "1",
  },
]);
const selectedCategories = ref<string[]>([]);

// Board/regime filters
const regimes = computed(() => {
  const baseRegimes = [
    { label: "Solo Alojamiento", value: "SA" },
    { label: "Alojamiento y Desayuno", value: "CP" },
    { label: "Media Pensión", value: "MP" },
    { label: "Pensión Completa", value: "PC" },
    { label: "Todo Incluido", value: "TI" },
  ];

  return baseRegimes.map((reg) => {
    // A hotel counts for a regime if ANY of its rooms have that regime
    const count = props.hotels.filter((h) =>
      h.rooms.some((r) => r.regimen === reg.value),
    ).length;
    return { ...reg, count };
  });
});
const selectedRegimes = ref<string[]>([]);

const hideNR = ref(false);
const hideOR = ref(false);

// Emit filter state whenever any filter changes
watch(
  [
    hotelName,
    priceMin,
    priceMax,
    selectedCategories,
    selectedRegimes,
    hideNR,
    hideOR,
  ],
  () => {
    emit("update:filters", {
      hotelName: hotelName.value,
      priceMin: priceMin.value,
      priceMax: priceMax.value,
      categories: selectedCategories.value,
      regimes: selectedRegimes.value,
      hideNR: hideNR.value,
      hideOR: hideOR.value,
    });
  },
  { deep: true },
);
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
            @click="emit('open-map')"
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
            <span class="text-gray-700 dark:text-gray-300">{{
              reg.label
            }}</span>
            <span class="text-gray-400 ml-auto">({{ reg.count }})</span>
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
              v-model="hideNR"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 accent-green-600 focus:ring-primary-500"
            />
            <span>Ocultar Ofertas No Reembolsables</span>
          </label>
          <label
            class="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
          >
            <input
              v-model="hideOR"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 accent-green-600 focus:ring-primary-500"
            />
            <span>Ocultar Ofertas Bajo Petición</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
