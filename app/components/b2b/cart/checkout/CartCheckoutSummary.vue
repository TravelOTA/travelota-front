<!-- app/components/b2b/cart/checkout/CartCheckoutSummary.vue -->
<script setup lang="ts">
import type { CartItem } from '~/composables/useCart';

defineProps<{
  items: CartItem[];
  total: number;
}>();

const { t } = useI18n();

function itemName(item: CartItem): string {
  if (item.type === 'hotel') return item.hotel.name;
  return item.type;
}

function itemPrice(item: CartItem): number {
  if (item.type === 'hotel') return item.room.price;
  return 0;
}
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="font-bold text-gray-900 dark:text-white text-sm">
        {{ t('cart.checkout.summaryTitle') }}
      </h3>
    </template>
    <div class="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between py-2.5 gap-2"
      >
        <span class="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">
          {{ itemName(item) }}
        </span>
        <span class="text-xs font-bold text-primary-600 dark:text-primary-400 shrink-0">
          ${{ itemPrice(item).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </span>
      </div>
    </div>
    <template #footer>
      <div class="flex items-center justify-between font-bold text-gray-900 dark:text-white">
        <span>{{ t('cart.total') }}</span>
        <span class="text-primary-600 dark:text-primary-400">
          ${{ total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </span>
      </div>
    </template>
  </UCard>
</template>
