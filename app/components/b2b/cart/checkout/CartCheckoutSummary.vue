<!-- app/components/b2b/cart/checkout/CartCheckoutSummary.vue -->
<script setup lang="ts">
import type { CartItem } from '~/composables/useCart';
import { useNetPrice } from '~/composables/useNetPrice';
import { useSalePrice } from '~/composables/useSalePrice';

defineProps<{
  items: CartItem[];
  total: number;
}>();

const { t } = useI18n();
const { netPriceVisible } = useNetPrice();
const { salePrice } = useSalePrice();

function itemNetPrice(item: CartItem): number {
  if (item.type === 'hotel') return parseFloat(item.option.total_net_rate);
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
        <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">
          {{ (item as any).hotel?.hotel_name ?? item.type }}
        </span>
        <span class="text-sm font-bold text-primary-600 dark:text-primary-400">
          ${{
            salePrice(
              parseFloat((item as any).option?.total_net_rate ?? '0'),
            ).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </span>
        <p v-if="netPriceVisible" class="text-[10px] text-gray-400">
          ${{
            itemNetPrice(item).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })
          }}
        </p>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-col gap-0.5">
        <div
          class="flex items-center justify-between font-bold text-gray-900 dark:text-white"
        >
          <span>{{ t('cart.total') }}</span>
          <span class="text-primary-600 dark:text-primary-400">
            ${{
              salePrice(total).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </span>
        </div>
        <div
          v-if="netPriceVisible"
          class="flex items-center justify-between text-xs text-gray-400"
        >
          <span>{{ t('cart.checkout.totalNetPrice') }}</span>
          <span
            >${{
              total.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}</span
          >
        </div>
      </div>
    </template>
  </UCard>
</template>
