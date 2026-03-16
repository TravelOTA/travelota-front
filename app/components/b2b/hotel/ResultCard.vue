<script setup lang="ts">
import { ref } from "vue";
import type { Hotel } from "~/composables/useHotels";
import ResultHotelSummary from "./ResultHotelSummary.vue";
import ResultRoomList from "./ResultRoomList.vue";

defineProps<{ hotel: Hotel }>();

const emit = defineEmits<{
  (e: "open-map", hotel: Record<string, unknown>): void;
}>();

const isExpanded = ref(true); // Simulate that by default the first 2 are shown expanded
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6 shadow-sm hover:shadow transition-shadow"
  >
    <ResultHotelSummary :hotel="hotel" @open-map="emit('open-map', $event)" />

    <ResultRoomList
      v-if="hotel?.rooms?.length"
      :rooms="hotel.rooms"
      :hotel="hotel"
      :is-expanded="isExpanded"
    />
  </div>
</template>
