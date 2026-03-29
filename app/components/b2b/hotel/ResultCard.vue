<script setup lang="ts">
import { ref } from "vue";
import { navigateTo } from "#imports";
import type { Hotel, HotelRoomOffer } from "~/composables/useHotels";
import { useCart } from "~/composables/useCart";
import { useHotelSearch } from "~/composables/useHotelSearch";
import ResultHotelSummary from "./ResultHotelSummary.vue";
import ResultRoomList from "./ResultRoomList.vue";

const props = defineProps<{ hotel: Hotel }>();

const emit = defineEmits<{
  (e: "open-map", hotel: Record<string, unknown>): void;
}>();

const isExpanded = ref(true); // Simulate that by default the first 2 are shown expanded

const { addItem } = useCart();
const { searchParams } = useHotelSearch();

async function handleReserve(room: HotelRoomOffer) {
  addItem(
    "hotel",
    {
      hotel: {
        id: props.hotel.id,
        name: props.hotel.name,
        stars: props.hotel.stars,
        image: props.hotel.image,
        address: props.hotel.location,
      },
      room,
      searchParams: searchParams.value,
    }
  );
  await navigateTo("/dashboard/cart/checkout");
}
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
      @reserve="handleReserve"
    />
  </div>
</template>
