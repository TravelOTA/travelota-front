<!-- app/components/b2b/cart/checkout/CartCheckoutBlockHotel.vue -->
<script setup lang="ts">
import type { CartItemHotel } from '~/composables/useCart';
import { getRegimenLabel } from '~/utils/regimen';
import { computed } from 'vue';
import { differenceInCalendarDays, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';

type PreCheckState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; bookingFlowId: number; remarks: string[]; currentPrice: number; priceChanged: boolean };

const props = defineProps<{
  item: CartItemHotel;
  index: number;
  total: number;
  preCheck: PreCheckState;
  specialRequest: string;
}>();

const emit = defineEmits<{
  remove: [id: string];
  'update:specialRequest': [id: string, value: string];
}>();

const { t } = useI18n();

const nights = computed(() =>
  differenceInCalendarDays(
    parseISO(props.item.searchParams.checkOut),
    parseISO(props.item.searchParams.checkIn),
  ),
);

function fmtDate(iso: string): string {
  return format(parseISO(iso), 'd MMM yyyy', { locale: es });
}

const cancellationBadge = computed(() => {
  const p = props.item.room.cancellationPolicy;
  if (!p.refundable) {
    return { color: 'error' as const, text: t('hotels.nonRefundable') };
  }
  if (p.penaltyFrom) {
    const pct = p.penalties[0]?.percentage ?? 0;
    return {
      color: 'warning' as const,
      text: `${t('hotels.cancellationFees')} ${fmtDate(p.penaltyFrom)} (${pct}%)`,
    };
  }
  return { color: 'success' as const, text: t('hotels.freeCancellation') };
});

const displayPrice = computed(() =>
  props.preCheck.status === 'ready' ? props.preCheck.currentPrice : props.item.room.price,
);
</script>

<template>
  <UCard :ui="{ body: 'p-0' }">
    <!-- Header band -->
    <template #header>
      <div class="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 -mx-4 -mt-4 px-4 py-2.5 rounded-t-lg border-b border-green-200 dark:border-green-800">
        <UIcon name="i-heroicons-building-office-2" class="w-4 h-4 text-green-700 dark:text-green-400" />
        <span class="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">
          {{ t('cart.checkout.blocks.hotel') }}
        </span>
        <span class="text-xs text-gray-400 dark:text-gray-500 ml-auto">
          {{ t('cart.checkout.blocks.itemCounter', { n: index + 1, total }) }}
        </span>
        <UButton
          color="error"
          variant="ghost"
          size="xs"
          icon="i-heroicons-x-mark"
          :label="t('cart.checkout.blocks.remove')"
          @click="emit('remove', item.id)"
        />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 flex flex-col gap-3">
      <!-- Photo + name + address + room -->
      <div class="flex gap-3">
        <img
          :src="item.hotel.image"
          :alt="item.hotel.name"
          class="w-18 h-18 object-cover rounded-lg shrink-0"
        />
        <div class="flex-1 min-w-0">
          <!-- Stars above name -->
          <div class="flex gap-0.5 mb-1">
            <UIcon
              v-for="n in item.hotel.stars"
              :key="n"
              name="i-heroicons-star-solid"
              class="w-3.5 h-3.5 text-amber-400"
            />
          </div>
          <p class="text-sm font-bold text-gray-900 dark:text-white leading-tight">
            {{ item.hotel.name }}
          </p>
          <p v-if="item.hotel.address" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
            <UIcon name="i-heroicons-map-pin" class="w-3 h-3 shrink-0" />
            {{ item.hotel.address }}
          </p>
          <p class="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-1.5">
            {{ item.room.name }}
          </p>
        </div>
      </div>

      <!-- Dates grid -->
      <div class="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900/40">
        <div class="px-3 py-2">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{{ t('cart.checkout.blocks.checkIn') }}</p>
          <p class="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{{ fmtDate(item.searchParams.checkIn) }}</p>
        </div>
        <div class="px-3 py-2">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{{ t('cart.checkout.blocks.checkOut') }}</p>
          <p class="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{{ fmtDate(item.searchParams.checkOut) }}</p>
        </div>
        <div class="px-3 py-2">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{{ t('cart.checkout.blocks.nights') }}</p>
          <p class="text-base font-black text-gray-900 dark:text-white">{{ nights }}</p>
        </div>
        <div class="px-3 py-2">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{{ t('cart.checkout.blocks.regimen') }}</p>
          <p class="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{{ getRegimenLabel(item.room.regimen) }}</p>
        </div>
      </div>

      <!-- Cancellation badge -->
      <UAlert
        :color="cancellationBadge.color"
        variant="soft"
        :description="cancellationBadge.text"
        icon="i-heroicons-information-circle"
        :ui="{ description: 'text-xs' }"
      />

      <!-- Important info (remarks) -->
      <template v-if="preCheck.status === 'loading'">
        <div class="text-xs text-gray-400 dark:text-gray-500 italic animate-pulse">
          {{ t('cart.checkout.blocks.verifying') }}
        </div>
      </template>
      <template v-else-if="preCheck.status === 'error'">
        <p class="text-xs text-gray-400 dark:text-gray-500 italic">
          {{ t('cart.checkout.blocks.verifyError') }}
        </p>
      </template>
      <template v-else-if="preCheck.status === 'ready' && preCheck.remarks.length > 0">
        <div class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p class="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1.5">
            {{ t('cart.checkout.blocks.importantInfo') }}
          </p>
          <ul class="list-disc list-inside space-y-0.5">
            <li v-for="(remark, i) in preCheck.remarks" :key="i" class="text-xs text-blue-800 dark:text-blue-200">
              {{ remark }}
            </li>
          </ul>
        </div>
      </template>

      <!-- Price changed inline badge -->
      <UAlert
        v-if="preCheck.status === 'ready' && preCheck.priceChanged"
        color="warning"
        variant="soft"
        :description="t('cart.checkout.blocks.priceChanged', { old: item.room.price.toFixed(2), new: preCheck.currentPrice.toFixed(2) })"
        icon="i-heroicons-exclamation-triangle"
        :ui="{ description: 'text-xs' }"
      />

      <!-- Special requests -->
      <UFormField
        :label="t('cart.checkout.blocks.specialRequests')"
        :hint="t('cart.checkout.blocks.specialRequestsHint')"
      >
        <UTextarea
          :model-value="specialRequest"
          :placeholder="t('cart.checkout.blocks.specialRequestsPlaceholder')"
          :rows="2"
          @update:model-value="emit('update:specialRequest', item.id, $event)"
        />
      </UFormField>
    </div>

    <!-- Footer: price -->
    <template #footer>
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('cart.checkout.blocks.netPrice', { n: nights, nights: nights === 1 ? 'noche' : 'noches' }) }}
        </span>
        <span class="text-lg font-black text-primary-600 dark:text-primary-400">
          ${{ displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </span>
      </div>
    </template>
  </UCard>
</template>
