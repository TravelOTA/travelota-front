<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import SearchSummaryBar from "~/components/b2b/hotel/SearchSummaryBar.vue";
import HotelHeader from "~/components/b2b/hotel/detail/HotelHeader.vue";
import HotelGallery from "~/components/b2b/hotel/detail/HotelGallery.vue";
import HotelPriceBox from "~/components/b2b/hotel/detail/HotelPriceBox.vue";
import HotelRooms from "~/components/b2b/hotel/detail/HotelRooms.vue";
import HotelInfo from "~/components/b2b/hotel/detail/HotelInfo.vue";
import HotelMap from "~/components/b2b/hotel/HotelMap.vue";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();
const isMapOpen = ref(false);
const hotelId = route.params.id as string;

// Mock images
const hotelImages = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

// Mock Data
const hotel = ref({
  id: Number(hotelId),
  name: "Iberostar WAVES DOMINICANA", // Can be dynamic if we implement a store
  stars: 5,
  location: "Playa Bavaro, DO",
  address:
    "Carretera Arena Gorda Playa Bavaro Punta Cana, Dominican Republic, Playa Bavaro 23000",
  coordinates: [18.7035, -68.4215] as [number, number],
  images: hotelImages,
  bestPrice: 1118.76,
  rooms: [
    {
      name: "Twin/double room - premium - with lateral sea view",
      regimen: "TI",
      cancellation: "Gastos de cancelación",
      price: 3027.93,
    },
    {
      name: "Twin/double room - premium",
      regimen: "TI",
      cancellation: "Gastos de cancelación",
      price: 3186.43,
    },
    {
      name: "Premium double room (full double bed)",
      regimen: "TI",
      cancellation: "No reembolsable",
      price: 3253.48,
    },
    {
      name: "Premium room with tropical view",
      regimen: "TI",
      cancellation: "Bajo petición",
      price: 3433.94,
      onRequest: true,
    },
    {
      name: "Suite - family",
      regimen: "TI",
      cancellation: "Gastos de cancelación",
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

    <div v-if="hotel">
      <!-- Header -->
      <HotelHeader
        :name="hotel.name"
        :stars="hotel.stars"
        :address="hotel.address"
      />

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <!-- Left Column: Gallery -->
        <div class="lg:col-span-2">
          <HotelGallery :images="hotel.images" />
        </div>

        <!-- Right Column: Price & Map -->
        <div class="lg:col-span-1">
          <HotelPriceBox
            :best-price="hotel.bestPrice"
            @open-map="isMapOpen = true"
          />
        </div>
      </div>

      <!-- Rooms Section -->
      <HotelRooms :rooms="hotel.rooms" />

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
