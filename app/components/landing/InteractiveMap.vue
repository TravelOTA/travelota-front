<script setup lang="ts">
import {
  LMap,
  LTileLayer,
  LCircleMarker,
  LTooltip,
} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

const zoom = 2;
const center: [number, number] = [25, 0];

const locations: { name: string; coords: [number, number] }[] = [
  { name: 'España', coords: [40.4168, -3.7038] },
  { name: 'Portugal', coords: [38.7223, -9.1393] },
  { name: 'Cabo Verde', coords: [14.9305, -23.5133] },
  { name: 'Marruecos', coords: [33.9716, -6.8498] },
  { name: 'Turquía', coords: [39.9334, 32.8597] },
  { name: 'México', coords: [19.4326, -99.1332] },
  { name: 'Cuba', coords: [23.1136, -82.3666] },
  { name: 'Finlandia', coords: [60.1699, 24.9384] },
  { name: 'Jamaica', coords: [17.997, -76.7936] },
  { name: 'Egipto', coords: [30.0444, 31.2357] },
  { name: 'República Dominicana', coords: [18.4861, -69.9312] },
];
</script>

<template>
  <ClientOnly>
    <div
      class="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200 dark:ring-gray-700"
      style="height: 380px"
    >
      <LMap
        :zoom="zoom"
        :center="center"
        :use-global-leaflet="false"
        class="w-full h-full"
      >
        <LTileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          :max-zoom="19"
        />
        <LCircleMarker
          v-for="loc in locations"
          :key="loc.name"
          :lat-lng="loc.coords"
          :radius="9"
          color="#16a34a"
          fill-color="#22c55e"
          :fill-opacity="0.85"
          :weight="2"
        >
          <LTooltip>{{ loc.name }}</LTooltip>
        </LCircleMarker>
      </LMap>
    </div>
    <template #fallback>
      <div
        class="h-[380px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
      />
    </template>
  </ClientOnly>
</template>
