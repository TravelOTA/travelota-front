<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Component } from 'vue';

const { t } = useI18n();

export interface HotelData {
  id: number | string;
  name: string;
  stars: number;
  bestPrice: number;
  coordinates: number[];
  image?: string;
  [key: string]: unknown;
}

const props = defineProps<{
  hotels: HotelData[];
  modelValue: boolean;
  selectedHotelId?: number | string | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

// Map settings
const zoom = ref(11);
const internalCenter = ref<number[]>([18.6656, -68.3979]); // Punta Cana approx center

interface MarkerRef {
  leafletObject?: {
    getPopup: () => unknown;
    openPopup: () => void;
  };
}

const markerRefs = ref<Record<string, MarkerRef>>({});
const registerMarker = (el: unknown, id: number | string) => {
  if (el) {
    markerRefs.value[String(id)] = el as MarkerRef;
  }
};

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      // Determine target hotel map center
      let targetHotel = null;
      if (props.selectedHotelId) {
        targetHotel = props.hotels.find(
          (h) => String(h.id) === String(props.selectedHotelId),
        );
      }

      if (targetHotel && targetHotel.coordinates) {
        internalCenter.value = targetHotel.coordinates;
        zoom.value = 14;

        // Auto-open point popup: polling
        let attempts = 0;
        const targetId = String(targetHotel.id);

        const tryOpenPopup = setInterval(() => {
          attempts++;
          const targetMarker = markerRefs.value[targetId];

          if (targetMarker && targetMarker.leafletObject) {
            // Ensure popup is fully mounted
            if (
              typeof targetMarker.leafletObject.getPopup === 'function' &&
              targetMarker.leafletObject.getPopup()
            ) {
              targetMarker.leafletObject.openPopup();
              clearInterval(tryOpenPopup);
            }
          } else if (attempts > 50) {
            clearInterval(tryOpenPopup); // Give up after 5 seconds
          }
        }, 100);
      } else {
        internalCenter.value = [18.6656, -68.3979];
        zoom.value = 11;
      }
    } else {
      // Clear refs when closed to prevent memory leaks or stale elements
      markerRefs.value = {};
    }
  },
);

// Dynamic import needed for Leaflet in Nuxt to avoid SSR window errors
const LMap = ref<Component | null>(null);
const LTileLayer = ref<Component | null>(null);
const LMarker = ref<Component | null>(null);
const LPopup = ref<Component | null>(null);
const LIcon = ref<Component | null>(null);
const mapReady = ref(false);

onMounted(async () => {
  // Only import on client-side
  if (import.meta.client) {
    const L = await import('@vue-leaflet/vue-leaflet');
    LMap.value = L.LMap;
    LTileLayer.value = L.LTileLayer;
    LMarker.value = L.LMarker;
    LPopup.value = L.LPopup;
    LIcon.value = L.LIcon;

    // Fix default icon paths for Leaflet
    const leaflet = await import('leaflet');
    delete (leaflet.Icon.Default.prototype as Record<string, unknown>)
      ._getIconUrl;
    leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    mapReady.value = true;
  }
});
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900"
  >
    <!-- Custom Header -->
    <div
      class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0"
    >
      <h3
        class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
      >
        {{ t('hotels.map.title') }}
      </h3>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-x-mark-20-solid"
        class="-my-1"
        @click="emit('update:modelValue', false)"
      />
    </div>

    <!-- Map Container -->
    <div class="flex-1 w-full relative bg-gray-100 dark:bg-gray-800">
      <ClientOnly>
        <div v-if="mapReady" class="absolute inset-0 z-0">
          <component
            :is="LMap"
            v-model:zoom="zoom"
            :center="internalCenter"
            :use-global-leaflet="false"
            class="h-full w-full z-0"
          >
            <component
              :is="LTileLayer"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            />

            <!-- Hotel Markers -->
            <component
              :is="LMarker"
              v-for="hotel in hotels"
              :key="hotel.id"
              :ref="(el: unknown) => registerMarker(el, hotel.id)"
              :lat-lng="hotel.coordinates"
            >
              <!-- Custom Marker Icon with Price (Button Style) -->
              <component
                :is="LIcon"
                :icon-anchor="[30, 16]"
                :popup-anchor="[0, -16]"
                class-name="custom-price-marker"
              >
                <div
                  class="inline-flex items-center justify-center bg-primary-600 dark:bg-primary-500 text-white font-bold text-sm px-3 py-1 rounded shadow-sm hover:bg-primary-700 dark:hover:bg-primary-600 hover:shadow transition-all pointer-events-auto cursor-pointer border border-primary-700 dark:border-primary-400 w-max"
                >
                  ${{ Math.round(hotel.bestPrice) }}
                </div>
              </component>

              <!-- Popup Details -->
              <component :is="LPopup">
                <div class="p-1 min-w-[200px]">
                  <img
                    :src="hotel.image"
                    class="w-full h-24 object-cover rounded-md mb-2"
                  />
                  <h4
                    class="font-bold text-sm mb-1 leading-tight text-gray-900"
                  >
                    {{ hotel.name }}
                  </h4>
                  <div class="flex text-yellow-400 mb-2">
                    <span v-for="i in hotel.stars" :key="i" class="text-xs"
                      >★</span
                    >
                  </div>
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-500 text-xs">{{
                      t('hotels.results.bestPrice')
                    }}</span>
                    <span class="font-bold text-primary-600"
                      >${{
                        hotel.bestPrice.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      }}</span
                    >
                  </div>
                  <UButton
                    size="xs"
                    color="primary"
                    block
                    class="mt-2 font-bold cursor-pointer"
                    :to="`/dashboard/hotels/${hotel.id}`"
                    >{{ t('hotels.map.details') }}</UButton
                  >
                </div>
              </component>
            </component>
          </component>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<style>
@import 'leaflet/dist/leaflet.css';

/* Ensure Leaflet controls are above the map but below the modal header if any overlap */
.leaflet-container {
  z-index: 1 !important;
}
.leaflet-pane {
  z-index: 1 !important;
}
.leaflet-top,
.leaflet-bottom {
  z-index: 2 !important;
}

/* Base class for our custom marker div */
.custom-price-marker {
  background: transparent;
  border: none;
}
</style>
