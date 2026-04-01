<!-- app/components/b2b/cart/CartItemCard.vue -->
<script setup lang="ts">
import type { CartItemHotel } from '~/composables/useCart';
import { useNetPrice } from '~/composables/useNetPrice';
import { useSalePrice } from '~/composables/useSalePrice';

defineProps<{
  item: CartItemHotel;
}>();

const emit = defineEmits<{
  (e: 'remove', id: string): void;
}>();

const { t } = useI18n();
const { netPriceVisible } = useNetPrice();
const { salePrice } = useSalePrice();
</script>

<template>
  <div
    class="flex gap-3 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 items-start"
  >
    <img
      :src="item.hotel.thumbnail || ''"
      :alt="item.hotel.hotel_name"
      class="w-16 h-16 object-cover rounded-md shrink-0"
    />
    <div class="flex-1 min-w-0">
      <p class="font-semibold text-sm text-gray-900 dark:text-white truncate">
        {{ item.hotel.hotel_name }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
        {{ item.option.rooms[0]?.room_name || 'Habitación' }}
      </p>
      <div
        class="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400"
      >
        <span>{{ t('cart.checkIn') }}: {{ item.searchParams.check_in }}</span>
        <span>·</span>
        <span>{{ t('cart.checkOut') }}: {{ item.searchParams.check_out }}</span>
      </div>
    </div>

    <!-- Price + remove button column -->
    <div class="flex flex-col items-end gap-1 shrink-0">
      <span class="font-bold text-primary-600 dark:text-primary-400 text-sm">
        ${{
          salePrice(parseFloat(item.option.total_net_rate)).toLocaleString(
            'en-US',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
          )
        }}
      </span>
      <span v-if="netPriceVisible" class="text-[10px] text-gray-400">
        neto ${{
          parseFloat(item.option.total_net_rate).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}
      </span>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-heroicons-trash"
        :aria-label="t('cart.removeItem')"
        @click="emit('remove', item.id)"
      />
    </div>
  </div>
</template>
