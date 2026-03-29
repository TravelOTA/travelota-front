<script setup lang="ts">
import type { CartItemHotel } from '~/composables/useCart';

defineProps<{
  item: CartItemHotel;
  index: number;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <span class="text-xs font-bold text-gray-400 dark:text-gray-500 w-5 shrink-0 mt-1">
      {{ index + 1 }}.
    </span>
    <img
      :src="item.hotel.image"
      :alt="item.hotel.name"
      class="w-12 h-12 object-cover rounded shrink-0"
    />
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
        {{ item.hotel.name }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ item.room.name }}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ t('cart.checkIn') }}: {{ item.searchParams.checkIn }} · {{ t('cart.checkOut') }}: {{ item.searchParams.checkOut }}
      </p>
    </div>
    <span class="text-sm font-bold text-primary-600 dark:text-primary-400 shrink-0">
      ${{ item.room.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
    </span>
  </div>
</template>
