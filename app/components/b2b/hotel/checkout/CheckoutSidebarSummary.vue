<script setup lang="ts">
import { computed } from "vue";

const { t } = useI18n();

const props = defineProps<{
  hotel: {
    name: string;
    stars: number;
    address: string;
    image: string;
  };
  reservation: {
    checkIn: string;
    checkOut: string;
    rooms: {
      id: number;
      name: string;
      pax: string;
      price: number;
    }[];
  };
  totalPrice: number;
}>();

const nights = computed(() => {
  // Simple calculation of nights based on strings in format YYYY-MM-DD
  const start = new Date(props.reservation.checkIn);
  const end = new Date(props.reservation.checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm flex flex-col"
  >
    <!-- Image -->
    <div class="w-full h-48 relative shrink-0">
      <img
        :src="hotel.image"
        :alt="hotel.name"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="p-5 flex flex-col gap-4">
      <!-- Hotel Info -->
      <div>
        <div class="flex text-yellow-400 mb-1">
          <UIcon
            v-for="i in hotel.stars"
            :key="i"
            name="i-heroicons-star-16-solid"
            class="w-4 h-4"
          />
        </div>
        <h3
          class="text-lg font-bold text-gray-900 dark:text-white leading-tight"
        >
          {{ hotel.name }}
        </h3>
        <p class="text-xs text-gray-500 mt-1 line-clamp-2">
          <UIcon name="i-heroicons-map-pin" class="w-3 h-3 inline mr-0.5" />
          {{ hotel.address }}
        </p>
      </div>

      <hr class="border-gray-100 dark:border-gray-800" />

      <!-- Dates -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span
            class="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5"
            >{{ t('hotels.detail.checkIn') }}</span
          >
          <span class="font-medium text-gray-900 dark:text-gray-100">{{
            reservation.checkIn
          }}</span>
        </div>
        <div>
          <span
            class="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5"
            >{{ t('hotels.detail.checkOut') }}</span
          >
          <span class="font-medium text-gray-900 dark:text-gray-100">{{
            reservation.checkOut
          }}</span>
        </div>
        <div
          class="col-span-2 bg-gray-50 dark:bg-gray-800/50 rounded p-2 text-center text-xs font-bold text-gray-600 dark:text-gray-400"
        >
          {{ nights }} {{ t('hotels.detail.nights') }}
        </div>
      </div>

      <hr class="border-gray-100 dark:border-gray-800" />

      <!-- Room Breakdown -->
      <div class="flex flex-col gap-3">
        <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {{ t('hotels.detail.selectedRooms') }}
        </h4>
        <div
          v-for="(room, index) in reservation.rooms"
          :key="index"
          class="flex flex-col gap-1 text-sm bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg border border-gray-100 dark:border-gray-800"
        >
          <span
            class="font-medium text-gray-900 dark:text-gray-200 line-clamp-2 leading-snug"
            >{{ room.name }}</span
          >
          <div class="flex justify-between items-end mt-1">
            <span class="text-xs text-gray-500 flex items-center gap-1">
              <UIcon name="i-heroicons-users" class="w-3.5 h-3.5" />
              {{ room.pax }}
            </span>
            <span class="font-bold text-gray-800 dark:text-gray-300">
              ${{
                room.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
          </div>
        </div>
      </div>

      <hr class="border-gray-100 dark:border-gray-800 mt-2" />

      <!-- Total -->
      <div class="flex flex-col items-end gap-1 pt-1">
        <span class="text-sm font-bold text-gray-500 uppercase tracking-wider"
          >{{ t('hotels.detail.totalReservation') }}</span
        >
        <span
          class="text-3xl font-black text-primary-600 dark:text-primary-400"
        >
          ${{
            totalPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </span>
        <span
          class="text-[10px] text-gray-400 font-medium text-right leading-tight mt-1"
        >
          {{ t('hotels.detail.pricesInUsd') }}
        </span>
      </div>
    </div>
  </div>
</template>
