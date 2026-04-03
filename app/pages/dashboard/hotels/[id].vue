<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { navigateTo } from '#imports';
import { useHotels, type RoomOption } from '~/composables/useHotels';
import { useCart } from '~/composables/useCart';
import { useHotelSearch } from '~/composables/useHotelSearch';
import SearchSummaryBar from '~/components/b2b/hotel/SearchSummaryBar.vue';
import ResultHotelSummary from '~/components/b2b/hotel/ResultHotelSummary.vue';
import HotelGallery from '~/components/b2b/hotel/detail/HotelGallery.vue';
import ResultRoomList from '~/components/b2b/hotel/ResultRoomList.vue';
import HotelInfo from '~/components/b2b/hotel/detail/HotelInfo.vue';
import HotelPriceBox from '~/components/b2b/hotel/detail/HotelPriceBox.vue';
import HotelMap from '~/components/b2b/hotel/HotelMap.vue';

definePageMeta({
  layout: 'dashboard',
});

const route = useRoute();
const router = useRouter();
const isMapOpen = ref(false);
const hotelId = route.params.id as string;

const { getHotelByCode } = useHotels();
const { addItem: addToCart } = useCart();
const { searchParams } = useHotelSearch();

const hotel = computed(() => getHotelByCode(hotelId));

// Images from components or fallback
const hotelImages = computed(() => {
  if (hotel.value?.thumbnail) {
    return [hotel.value.thumbnail];
  }
  return [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  ];
});

function handleReserve(option: RoomOption) {
  if (!hotel.value) return;
  addToCart('hotel', {
    hotel: hotel.value,
    option,
    searchParams: searchParams.value,
  });
  navigateTo('/dashboard/cart/checkout');
}

function handleAddToCart() {
  if (!hotel.value || !hotel.value.options.length) return;
  const cheapestOption = hotel.value.options.reduce(
    (min, o) =>
      min && parseFloat(o.total_net_rate) < parseFloat(min.total_net_rate)
        ? o
        : min,
    hotel.value.options[0] as RoomOption,
  );
  if (cheapestOption) {
    addToCart('hotel', {
      hotel: hotel.value,
      option: cheapestOption,
      searchParams: searchParams.value,
    });
  }
}

useHead({
  title: hotel.value
    ? `${hotel.value.hotel_name} - TravelOTA B2B`
    : 'Hotel - TravelOTA B2B',
});
</script>

<template>
  <div class="max-w-[1400px] mx-auto pb-12">
    <SearchSummaryBar :hotel-name="hotel?.hotel_name" />
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
            :options="hotel.options"
            :hotel="hotel"
            :is-expanded="true"
            :default-expanded-rooms="true"
            @reserve="handleReserve"
          />
        </div>
        <div class="w-72 shrink-0">
          <HotelPriceBox
            :best-price="hotel.best_price"
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
      v-if="hotel"
      v-model="isMapOpen"
      :hotels="[hotel] as any"
      :selected-hotel-id="hotel.hotel_code"
    />
  </div>
</template>
