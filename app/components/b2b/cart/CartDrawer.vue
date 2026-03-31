<script setup lang="ts">
import { computed } from 'vue';
import { navigateTo } from '#imports';
import { useCart } from '~/composables/useCart';
import CartEmpty from '~/components/b2b/cart/CartEmpty.vue';
import CartItemCard from '~/components/b2b/cart/CartItemCard.vue';
import { useNetPrice } from '~/composables/useNetPrice';
import { useSalePrice } from '~/composables/useSalePrice';

const { t } = useI18n();
const { items, isDrawerOpen, itemCount, total, removeItem, exportToQuoter } = useCart();
const { netPriceVisible } = useNetPrice();
const { salePrice } = useSalePrice();
const totalSalePrice = computed(() => salePrice(total.value));

function handleExportToQuoter() {
  exportToQuoter();
  isDrawerOpen.value = false;
  navigateTo('/dashboard/quoter/builder');
}

function handleGoToCheckout() {
  isDrawerOpen.value = false;
  navigateTo('/dashboard/cart/checkout');
}
</script>

<template>
  <USlideover v-model:open="isDrawerOpen" side="right" :ui="{ width: 'max-w-md' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-base font-bold text-gray-900 dark:text-white">
          {{ t('cart.drawerTitle') }}
          <UBadge
            v-if="itemCount > 0"
            :label="String(itemCount)"
            color="primary"
            variant="solid"
            size="xs"
            class="ml-2"
          />
        </h2>
      </div>
    </template>

    <template #body>
      <CartEmpty v-if="itemCount === 0" />
      <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
        <CartItemCard
          v-for="item in items"
          :key="item.id"
          :item="item as any"
          @remove="removeItem"
        />
      </div>
    </template>

    <template v-if="itemCount > 0" #footer>
      <div class="flex flex-col gap-3 w-full">
        <!-- Total -->
        <div class="flex flex-col gap-0.5 font-semibold text-gray-900 dark:text-white px-1">
          <div class="flex items-center justify-between text-base">
            <span>{{ t('cart.total') }}</span>
            <span class="text-primary-600 dark:text-primary-400">
              ${{ totalSalePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </span>
          </div>
          <div v-if="netPriceVisible" class="flex items-center justify-between text-[11px] text-gray-400 font-normal">
            <span>neto</span>
            <span>${{ total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <UButton
          color="primary"
          block
          icon="i-heroicons-credit-card"
          @click="handleGoToCheckout"
        >
          {{ t('cart.goToCheckout') }}
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          block
          icon="i-heroicons-calculator"
          @click="handleExportToQuoter"
        >
          {{ t('cart.createQuote') }}
        </UButton>
      </div>
    </template>
  </USlideover>
</template>
