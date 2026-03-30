<!-- app/components/b2b/cart/checkout/CartCheckoutBlockHotel.vue -->
<script setup lang="ts">
import type { CartItemHotel } from '~/composables/useCart';
import { getRegimenLabel } from '~/utils/regimen';
import { computed } from 'vue';
import { differenceInCalendarDays, parseISO, format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNetPrice } from '~/composables/useNetPrice';
import { useSalePrice } from '~/composables/useSalePrice';

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
const { netPriceVisible } = useNetPrice();
const { salePrice } = useSalePrice();

const nights = computed(() =>
  differenceInCalendarDays(
    parseISO(props.item.searchParams.checkOut),
    parseISO(props.item.searchParams.checkIn),
  ),
);

const rooms = computed(() => props.item.searchParams.rooms ?? [{ adults: 2, children: [] }]);

const pricePerRoom = computed(() => {
  const net = props.preCheck.status === 'ready'
    ? props.preCheck.currentPrice
    : props.item.room.price;
  return net / rooms.value.length;
});

const totalNetPrice = computed(() =>
  props.preCheck.status === 'ready' ? props.preCheck.currentPrice : props.item.room.price,
);

const totalSalePrice = computed(() => salePrice(totalNetPrice.value));

function fmtDate(iso: string): string {
  return format(parseISO(iso), 'd MMM yyyy', { locale: es });
}

function fmtChildren(children: Array<number | { age: number }>): string {
  if (!children.length) return '';
  const ages = children.map((c) => (typeof c === 'number' ? c : c.age));
  return ` · ${ages.length} ${ages.length === 1 ? t('hotels.search.child') : t('hotels.search.children')} (${ages.join(', ')})`;
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

type PolicyRow = {
  label: string;
  color: 'success' | 'warning' | 'error';
  from: string;
  to: string;
  amount: string;
};

const policyRows = computed((): PolicyRow[] => {
  const p = props.item.room.cancellationPolicy;
  if (!p.refundable) {
    return [{
      label: t('hotels.nonRefundable'),
      color: 'error',
      from: '—',
      to: '—',
      amount: `$${totalNetPrice.value.toFixed(2)}`,
    }];
  }
  if (!p.penaltyFrom) {
    return [{
      label: t('hotels.freeCancellation'),
      color: 'success',
      from: t('cart.checkout.blocks.cancellationNow'),
      to: fmtDate(props.item.searchParams.checkIn),
      amount: '$0.00',
    }];
  }
  const freeTo = fmtDate(format(subDays(parseISO(p.penaltyFrom), 1), 'yyyy-MM-dd'));
  const rows: PolicyRow[] = [
    {
      label: t('hotels.freeCancellation'),
      color: 'success',
      from: t('cart.checkout.blocks.cancellationNow'),
      to: freeTo,
      amount: '$0.00',
    },
  ];
  p.penalties.forEach((pen) => {
    rows.push({
      label: t('cart.checkout.blocks.cancellationFees'),
      color: 'warning',
      from: fmtDate(pen.from),
      to: fmtDate(props.item.searchParams.checkIn),
      amount: `$${pen.amount.toFixed(2)} (${pen.percentage}%)`,
    });
  });
  return rows;
});
</script>

<template>
  <UCard>
    <!-- Header band — full width via UCard native header -->
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-building-office-2" class="w-4 h-4 text-green-600 dark:text-green-400" />
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

    <div class="flex flex-col gap-4">

      <!-- Hotel identity: photo + stars + name + address -->
      <div class="flex gap-3">
        <img
          :src="item.hotel.image"
          :alt="item.hotel.name"
          class="w-20 h-20 object-cover rounded-lg shrink-0"
        />
        <div class="flex-1 min-w-0">
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

      <!-- Room rows: one per pax entry -->
      <div class="flex flex-col gap-2">
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{{ t('cart.checkout.blocks.rooms') }}</p>
        <div
          v-for="(room, i) in rooms"
          :key="i"
          class="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2"
        >
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-gray-900 dark:text-white">{{ item.room.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ room.adults }} {{ room.adults !== 1 ? t('hotels.search.adults') : t('hotels.search.adult') }}{{ fmtChildren(room.children) }}
            </p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-xs text-gray-400">{{ t('cart.checkout.blocks.netPrice', { n: nights }) }}</p>
            <p class="text-sm font-bold text-gray-900 dark:text-white">
              ${{ salePrice(pricePerRoom).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </p>
            <p v-if="netPriceVisible" class="text-[10px] text-gray-400">
              neto ${{ pricePerRoom.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Cancellation summary badge -->
      <UAlert
        :color="cancellationBadge.color"
        variant="soft"
        :description="cancellationBadge.text"
        icon="i-heroicons-information-circle"
        :ui="{ description: 'text-xs' }"
      />

      <!-- Full cancellation policy table -->
      <div>
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-2">{{ t('cart.checkout.blocks.cancellationPolicy') }}</p>
        <table class="w-full text-xs border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-900/40">
              <th class="text-left px-3 py-1.5 font-semibold text-gray-500">{{ t('cart.checkout.blocks.cancellationStatus') }}</th>
              <th class="text-left px-3 py-1.5 font-semibold text-gray-500">{{ t('cart.checkout.blocks.cancellationFrom') }}</th>
              <th class="text-left px-3 py-1.5 font-semibold text-gray-500">{{ t('cart.checkout.blocks.cancellationTo') }}</th>
              <th class="text-right px-3 py-1.5 font-semibold text-gray-500">{{ t('cart.checkout.blocks.cancellationAmount') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, i) in policyRows"
              :key="i"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-3 py-1.5">
                <UBadge :color="row.color" variant="soft" size="xs">{{ row.label }}</UBadge>
              </td>
              <td class="px-3 py-1.5 text-gray-600 dark:text-gray-400">{{ row.from }}</td>
              <td class="px-3 py-1.5 text-gray-600 dark:text-gray-400">{{ row.to }}</td>
              <td class="px-3 py-1.5 text-right text-gray-700 dark:text-gray-300">{{ row.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Price changed alert -->
      <UAlert
        v-if="preCheck.status === 'ready' && preCheck.priceChanged"
        color="warning"
        variant="soft"
        :description="t('cart.checkout.blocks.priceChanged', { old: item.room.price.toFixed(2), new: preCheck.currentPrice.toFixed(2) })"
        icon="i-heroicons-exclamation-triangle"
        :ui="{ description: 'text-xs' }"
      />

      <!-- Provider remarks: collapsible, only when ready + has content -->
      <details
        v-if="preCheck.status === 'ready' && preCheck.remarks.length > 0"
        class="border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden"
      >
        <summary class="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-2.5 cursor-pointer list-none">
          <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span class="text-xs font-semibold text-blue-700 dark:text-blue-300">
            {{ t('cart.checkout.blocks.importantInfo') }}
          </span>
          <UIcon name="i-heroicons-chevron-down" class="w-3.5 h-3.5 text-blue-500 ml-auto" />
        </summary>
        <div class="px-3 py-2.5 bg-white dark:bg-gray-900">
          <ul class="list-disc list-inside space-y-1">
            <li
              v-for="(remark, i) in preCheck.remarks"
              :key="i"
              class="text-xs text-blue-800 dark:text-blue-200"
            >
              {{ remark }}
            </li>
          </ul>
        </div>
      </details>

      <!-- Special requests — full width -->
      <UFormField
        :label="t('cart.checkout.blocks.specialRequests')"
        :hint="t('cart.checkout.blocks.specialRequestsHint')"
        class="w-full"
      >
        <UTextarea
          :model-value="specialRequest"
          :placeholder="t('cart.checkout.blocks.specialRequestsPlaceholder')"
          :rows="2"
          class="w-full"
          @update:model-value="emit('update:specialRequest', item.id, $event)"
        />
      </UFormField>

    </div>

    <!-- Footer: sale price total -->
    <template #footer>
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('cart.checkout.blocks.salePrice', { n: nights }) }}
        </span>
        <div class="text-right">
          <p class="text-lg font-black text-primary-600 dark:text-primary-400">
            ${{ totalSalePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </p>
          <p v-if="netPriceVisible" class="text-xs text-gray-400">
            {{ t('cart.checkout.blocks.netPrice', { n: nights }) }}: ${{ totalNetPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </p>
        </div>
      </div>
    </template>
  </UCard>
</template>
