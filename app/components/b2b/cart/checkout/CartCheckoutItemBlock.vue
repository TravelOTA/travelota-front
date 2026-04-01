<!-- app/components/b2b/cart/checkout/CartCheckoutItemBlock.vue -->
<script setup lang="ts">
import { computed, type Component } from 'vue';
import type { CartItem } from '~/composables/useCart';
import CartCheckoutBlockHotel from '~/components/b2b/cart/checkout/CartCheckoutBlockHotel.vue';

type PreCheckState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready';
      bookingFlowId: number;
      remarks: string[];
      currentPrice: number;
      priceChanged: boolean;
    };

const props = defineProps<{
  item: CartItem;
  index: number;
  total: number;
  preCheck: PreCheckState;
  specialRequest: string;
}>();

const emit = defineEmits<{
  remove: [id: string];
  'update:specialRequest': [id: string, value: string];
}>();

const registry: Record<string, Component> = {
  hotel: CartCheckoutBlockHotel,
};

const resolvedComponent = computed(() => registry[props.item.type] ?? null);
</script>

<template>
  <component
    :is="resolvedComponent"
    v-if="resolvedComponent"
    :item="item"
    :index="index"
    :total="total"
    :pre-check="preCheck"
    :special-request="specialRequest"
    @remove="emit('remove', $event)"
    @update:special-request="
      (id: string, val: string) => emit('update:specialRequest', id, val)
    "
  />
  <UCard v-else data-testid="block-fallback">
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">
        {{ (item as any).hotel?.hotel_name ?? item.type }}
      </span>
      <span class="text-sm font-bold text-primary-600 dark:text-primary-400">
        ${{
          parseFloat(
            (item as any).option?.total_net_rate ?? '0',
          ).toLocaleString('en-US', {
            minimumFractionDigits: 2,
          })
        }}
      </span>
    </div>
  </UCard>
</template>
