<script setup lang="ts">
import { computed } from 'vue';
import type { CartItem } from '~/composables/useCart';
import CartCheckoutItemRow from '~/components/b2b/cart/checkout/CartCheckoutItemRow.vue';

const props = defineProps<{
  items: CartItem[];
  total: number;
}>();

const { t } = useI18n();

const hotelItems = computed(() =>
  props.items.filter((i): i is import('~/composables/useCart').CartItemHotel => i.type === 'hotel'),
);
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="font-bold text-gray-900 dark:text-white text-sm">
        {{ t('cart.checkout.summaryTitle') }}
      </h3>
    </template>
    <div>
      <CartCheckoutItemRow
        v-for="(item, i) in hotelItems"
        :key="item.id"
        :item="item"
        :index="i"
      />
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
