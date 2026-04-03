<!-- app/components/b2b/cart/checkout/CartCheckoutBlockHotel.vue -->
<script setup lang="ts">
import type { CartItemHotel } from '~/composables/useCart';
import { computed } from 'vue';
import { differenceInCalendarDays, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNetPrice } from '~/composables/useNetPrice';
import { useSalePrice } from '~/composables/useSalePrice';

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
    parseISO(props.item.searchParams.check_out),
    parseISO(props.item.searchParams.check_in),
  ),
);

const rooms = computed(
  () => props.item.searchParams.rooms ?? [{ adults: 2, children: [] }],
);

const totalNetPrice = computed(() =>
  props.preCheck.status === 'ready'
    ? props.preCheck.currentPrice
    : parseFloat(props.item.option.total_net_rate),
);

const pricePerRoom = computed(() => {
  return totalNetPrice.value / rooms.value.length;
});

const totalSalePrice = computed(() => salePrice(totalNetPrice.value));

function fmtDate(iso: string): string {
  if (!iso) return '—';
  return format(parseISO(iso), 'd MMM yyyy', { locale: es });
}

function fmtChildren(children: Array<number | { age: number }>): string {
  if (!children?.length) return '';
  const ages = children.map((c) => (typeof c === 'number' ? c : c.age));
  return ` · ${ages.length} ${ages.length === 1 ? t('hotels.search.child') : t('hotels.search.children')} (${ages.join(', ')})`;
}

const cancellationBadge = computed(() => {
  const p = props.item.option.rooms[0]?.cancellation_policy || '';
  if (
    p.toLowerCase().includes('no reembolsable') ||
    p.toLowerCase().includes('non-refundable')
  ) {
    return { color: 'error' as const, text: t('hotels.nonRefundable') };
  }
  if (p.toLowerCase().includes('on request')) {
    return { color: 'warning' as const, text: 'Bajo petición' };
  }
  return { color: 'success' as const, text: p || t('hotels.freeCancellation') };
});
</script>

<template>
  <UCard>
    <!-- Header band — full width via UCard native header -->
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-building-office-2"
          class="w-4 h-4 text-green-600 dark:text-green-400"
        />
        <span
          class="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide"
        >
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
          :src="
            item.hotel.thumbnail ||
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400'
          "
          :alt="item.hotel.hotel_name"
          class="w-20 h-20 object-cover rounded-lg shrink-0"
        />
        <div class="flex-1 min-w-0">
          <div class="flex gap-0.5 mb-1">
            <UIcon
              v-for="n in item.hotel.category"
              :key="n"
              name="i-heroicons-star-solid"
              class="w-3.5 h-3.5 text-amber-400"
            />
          </div>
          <p
            class="text-sm font-bold text-gray-900 dark:text-white leading-tight"
          >
            {{ item.hotel.hotel_name }}
          </p>
          <p
            v-if="item.hotel.destination_name"
            class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1"
          >
            <UIcon name="i-heroicons-map-pin" class="w-3 h-3 shrink-0" />
            {{ item.hotel.destination_name }}
          </p>
        </div>
      </div>

      <!-- Dates grid -->
      <div
        class="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900/40"
      >
        <div class="px-3 py-2">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
            {{ t('cart.checkout.blocks.checkIn') }}
          </p>
          <p class="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
            {{ fmtDate(item.searchParams.check_in) }}
          </p>
        </div>
        <div class="px-3 py-2">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
            {{ t('cart.checkout.blocks.checkOut') }}
          </p>
          <p class="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
            {{ fmtDate(item.searchParams.check_out) }}
          </p>
        </div>
        <div class="px-3 py-2">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
            {{ t('cart.checkout.blocks.nights') }}
          </p>
          <p class="text-base font-black text-gray-900 dark:text-white">
            {{ nights }}
          </p>
        </div>
        <div class="px-3 py-2">
          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
            {{ t('cart.checkout.blocks.regimen') }}
          </p>
          <p class="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
            {{
              (() => {
                const code = item.option.rooms[0]?.meal_plan.code ?? '';
                const i18nKey = {
                  RO: 'hotels.results.soleLodging',
                  BB: 'hotels.results.lodgingAndBreakfast',
                  HB: 'hotels.results.halfBoard',
                  FB: 'hotels.results.fullBoard',
                  AI: 'hotels.results.allInclusive',
                }[code];
                return i18nKey
                  ? t(i18nKey)
                  : (item.option.rooms[0]?.meal_plan.name ?? '');
              })()
            }}
          </p>
        </div>
      </div>

      <!-- Room rows: one per pax entry -->
      <div class="flex flex-col gap-2">
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
          {{ t('cart.checkout.blocks.rooms') }}
        </p>
        <div
          v-for="(room, i) in rooms"
          :key="i"
          class="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2"
        >
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-gray-900 dark:text-white">
              {{ item.option.rooms[0]?.room_name || 'Habitación' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ room.adults }}
              {{
                room.adults !== 1
                  ? t('hotels.search.adults')
                  : t('hotels.search.adult')
              }}{{ fmtChildren(room.children) }}
            </p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-xs text-gray-400">
              {{ t('cart.checkout.blocks.price') }}
            </p>
            <p class="text-sm font-bold text-gray-900 dark:text-white">
              ${{
                salePrice(pricePerRoom).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </p>
            <p v-if="netPriceVisible" class="text-[10px] text-gray-400">
              {{ t('cart.checkout.blocks.netPrice') }}: ${{
                pricePerRoom.toFixed(2)
              }}
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
        <p
          v-if="item.option.rooms[0]?.cancellation_policy"
          class="text-xs text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/40"
        >
          {{ item.option.rooms[0].cancellation_policy }}
        </p>
      </div>

      <!-- Price changed alert -->
      <UAlert
        v-if="preCheck.status === 'ready' && preCheck.priceChanged"
        color="warning"
        variant="soft"
        :description="
          t('cart.checkout.blocks.priceChanged', {
            old: salePrice(parseFloat(item.option.total_net_rate)).toFixed(2),
            new: salePrice(preCheck.currentPrice).toFixed(2),
          })
        "
        icon="i-heroicons-exclamation-triangle"
        :ui="{ description: 'text-xs' }"
      />

      <!-- Provider remarks: collapsible, only when ready + has content -->
      <details
        v-if="preCheck.status === 'ready' && preCheck.remarks.length > 0"
        class="border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden"
      >
        <summary
          class="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-2.5 cursor-pointer list-none"
        >
          <UIcon
            name="i-heroicons-information-circle"
            class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0"
          />
          <span class="text-xs font-semibold text-blue-700 dark:text-blue-300">
            {{ t('cart.checkout.blocks.importantInfo') }}
          </span>
          <UIcon
            name="i-heroicons-chevron-down"
            class="w-3.5 h-3.5 text-blue-500 ml-auto"
          />
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

    <template #footer>
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('cart.checkout.blocks.price') }}
        </span>
        <div class="text-right">
          <p class="text-lg font-black text-primary-600 dark:text-primary-400">
            ${{
              totalSalePrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </p>
          <p v-if="netPriceVisible" class="text-xs text-gray-400">
            {{ t('cart.checkout.blocks.netPrice') }}: ${{
              totalNetPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </p>
        </div>
      </div>
    </template>
  </UCard>
</template>
