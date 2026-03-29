<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { navigateTo } from "#imports";
import type { Hotel, HotelRoomOffer } from "~/composables/useHotels";
import { useCart } from "~/composables/useCart";
import { useHotelSearch } from "~/composables/useHotelSearch";
import SearchSummaryBar from "~/components/b2b/hotel/SearchSummaryBar.vue";
import ResultHotelSummary from "~/components/b2b/hotel/ResultHotelSummary.vue";
import HotelGallery from "~/components/b2b/hotel/detail/HotelGallery.vue";
import ResultRoomList from "~/components/b2b/hotel/ResultRoomList.vue";
import HotelInfo from "~/components/b2b/hotel/detail/HotelInfo.vue";
import HotelPriceBox from "~/components/b2b/hotel/detail/HotelPriceBox.vue";
import HotelMap from "~/components/b2b/hotel/HotelMap.vue";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();
const isMapOpen = ref(false);
const hotelId = route.params.id as string;

const { addItem: addToCart } = useCart();
const { searchParams } = useHotelSearch();

function handleReserve(room: HotelRoomOffer) {
  addToCart('hotel', {
    hotel: hotel.value,
    room,
    searchParams: searchParams.value,
  });
  navigateTo("/dashboard/cart/checkout");
}

function handleAddToCart() {
  if (!hotel.value.rooms.length) return;
  const cheapestRoom = hotel.value.rooms.reduce((min, r) => (min && r.price < min.price ? r : min), hotel.value.rooms[0] as HotelRoomOffer);
  if (cheapestRoom) {
    addToCart('hotel', {
      hotel: hotel.value,
      room: cheapestRoom,
      searchParams: searchParams.value,
    });
  }
}

// Mock images
const hotelImages = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

// Mock Data
const hotel = ref<Hotel>({
  id: Number(hotelId),
  name: "Iberostar WAVES DOMINICANA", // Can be dynamic if we implement a store
  stars: 5,
  location: "Playa Bavaro, DO",
  coordinates: [18.7035, -68.4215] as [number, number],
  image: hotelImages[0]!, // Agregada la foto principal
  bestPrice: 1118.76,
  rooms: [
    {
      name: "Twin/double room - premium - with lateral sea view",
      regimen: "TI",
      cancellation: "Gastos de cancelación",
      cancellationPolicy: {
        refundable: true,
        penaltyFrom: "2026-04-15",
        penalties: [{ from: "2026-04-15", percentage: 100, amount: 3027.93 }],
      },
      price: 3027.93,
    },
    {
      name: "Twin/double room - premium",
      regimen: "TI",
      cancellation: "Gastos de cancelación",
      cancellationPolicy: {
        refundable: true,
        penaltyFrom: "2026-04-15",
        penalties: [{ from: "2026-04-15", percentage: 100, amount: 3186.43 }],
      },
      price: 3186.43,
    },
    {
      name: "Premium double room (full double bed)",
      regimen: "TI",
      cancellation: "No reembolsable",
      cancellationPolicy: {
        refundable: false,
        penaltyFrom: null,
        penalties: [{ from: "2026-03-16", percentage: 100, amount: 3253.48 }],
      },
      price: 3253.48,
    },
    {
      name: "Premium room with tropical view",
      regimen: "TI",
      cancellation: "Bajo petición",
      cancellationPolicy: {
        refundable: true,
        penaltyFrom: "2026-04-15",
        penalties: [{ from: "2026-04-15", percentage: 100, amount: 3433.94 }],
      },
      price: 3433.94,
      onRequest: true,
    },
    {
      name: "Suite - family",
      regimen: "TI",
      cancellation: "Gastos de cancelación",
      cancellationPolicy: {
        refundable: true,
        penaltyFrom: "2026-04-15",
        penalties: [{ from: "2026-04-15", percentage: 100, amount: 4181.59 }],
      },
      price: 4181.59,
    },
  ],
});

useHead({
  title: `${hotel.value.name} - TravelOTA B2B`,
});
</script>

<template>
  <div class="max-w-[1400px] mx-auto pb-12">
    <SearchSummaryBar :hotel-name="hotel.name" />
    <!-- Breadcrumb / Back button -->
    <div class="mb-4 mt-2">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
        @click="router.back()"
      >
        Volver a resultados
      </UButton>
    </div>

    <div v-if="hotel" class="flex flex-col gap-6 mt-6">
      <!-- 1. Top Summary (Reused from Results) -->
      <ResultHotelSummary :hotel="hotel" @open-map="isMapOpen = true" />

      <!-- 2. Middle Gallery -->
      <HotelGallery :images="hotelImages" />

      <!-- 3. Room List + Price Sidebar -->
      <div class="flex gap-6 items-start">
        <div class="flex-1 min-w-0">
          <ResultRoomList
            :rooms="hotel.rooms"
            :hotel="hotel"
            :is-expanded="true"
            :default-expanded-rooms="true"
            @reserve="handleReserve"
          />
        </div>
        <div class="w-72 shrink-0">
          <HotelPriceBox
            :best-price="hotel.bestPrice"
            @add-to-cart="handleAddToCart"
            @open-map="isMapOpen = true"
          />
        </div>
      </div>

      <!-- Info Section -->
      <HotelInfo />
    </div>

    <!-- Map Modal -->
    <HotelMap
      v-model="isMapOpen"
      :hotels="[hotel]"
      :selected-hotel-id="hotel.id"
    />
  </div>
</template>
