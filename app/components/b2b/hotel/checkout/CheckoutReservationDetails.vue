<script setup lang="ts">
const { t } = useI18n();

// Mock data structure expected from parent
defineProps<{
  checkIn: string;
  checkOut: string;
  rooms: {
    id: number;
    name: string;
    pax: string; // e.g., "2 Adultos"
    price: number;
  }[];
}>();
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden"
  >
    <!-- Header with dates -->
    <div
      class="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h3 class="font-bold text-gray-900 dark:text-white text-lg">
          {{ t('hotels.checkout.reservationDetails') }}
        </h3>
      </div>
      <div class="flex gap-6 text-sm">
        <div>
          <span
            class="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold"
            >{{ t('hotels.checkout.entry') }}</span
          >
          <span class="font-medium text-gray-900 dark:text-white">{{
            checkIn
          }}</span>
        </div>
        <div>
          <span
            class="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold"
            >{{ t('hotels.checkout.exit') }}</span
          >
          <span class="font-medium text-gray-900 dark:text-white">{{
            checkOut
          }}</span>
        </div>
      </div>
    </div>

    <!-- Rooms List -->
    <div class="p-4 flex flex-col gap-4">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0 gap-2"
      >
        <div class="flex-1">
          <h4 class="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">
            {{ room.name }}
          </h4>
          <div
            class="flex items-center text-xs text-gray-500 dark:text-gray-400"
          >
            <UIcon name="i-heroicons-users" class="w-4 h-4 mr-1" />
            <span>{{ room.pax }}</span>
          </div>
        </div>

        <div class="w-full sm:w-auto text-right mt-2 sm:mt-0">
          <span class="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">{{
            t('hotels.checkout.pricePerRoom')
          }}</span>
          <span
            class="font-bold text-lg text-primary-600 dark:text-primary-400"
          >
            ${{
              room.price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
