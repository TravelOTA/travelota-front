<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PropType } from 'vue';
import { useItinerary } from '~/composables/useItinerary';
import type { Hotel, RoomOption } from '~/composables/useHotels';
import { useCart } from '~/composables/useCart';
import { useHotelSearch } from '~/composables/useHotelSearch';
import { useNetPrice } from '~/composables/useNetPrice';
import { useSalePrice } from '~/composables/useSalePrice';

const { t } = useI18n();

const props = defineProps({
  options: {
    type: Array as PropType<RoomOption[]>,
    required: true,
  },
  hotel: {
    type: Object as PropType<Hotel>,
    required: true,
  },
  isExpanded: {
    type: Boolean,
    default: true,
  },
  defaultExpandedRooms: {
    type: Boolean,
    default: false,
  },
});

const showAllRooms = ref(props.defaultExpandedRooms);

const sortedRooms = computed(() => {
  if (!Array.isArray(props.options)) return [];
  return [...props.options].sort(
    (a: RoomOption, b: RoomOption) =>
      parseFloat(a.total_net_rate) - parseFloat(b.total_net_rate),
  );
});

const visibleRooms = computed(() => {
  return showAllRooms.value ? sortedRooms.value : sortedRooms.value.slice(0, 1);
});
const { triggerAddOption } = useItinerary();
const { addItem: addToCart } = useCart();
const { searchParams } = useHotelSearch();
const { netPriceVisible } = useNetPrice();
const { salePrice } = useSalePrice();

const addToItinerary = (option: RoomOption) => {
  const room = option.rooms[0];
  if (!room) return;
  triggerAddOption({
    providerId: String(props.hotel.hotel_code),
    name: props.hotel.hotel_name,
    image:
      props.hotel.thumbnail ||
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    description: `${room.room_name} (${room.meal_plan.name})`,
    netPrice: parseFloat(option.total_net_rate),
    isManual: false,
  });
};

function handleAddToCart(option: RoomOption) {
  addToCart('hotel', {
    hotel: props.hotel,
    option,
    searchParams: searchParams.value,
  });
}
</script>

<template>
  <div
    v-if="isExpanded"
    class="bg-gray-50 dark:bg-gray-800/20 px-4 py-2 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg"
  >
    <!-- Separador Estético si está colapsado simulado -->
    <div class="w-full h-1 bg-primary-500/20 mb-2 rounded-full"></div>

    <div
      v-for="(option, idx) in visibleRooms"
      :key="idx"
      class="flex flex-col sm:flex-row items-center py-1 border-b border-gray-200 dark:border-gray-700 last:border-0 gap-1"
    >
      <!-- Icono (Medalla) -->
      <div class="w-8 flex justify-center text-primary-500">
        <UIcon name="i-heroicons-check-badge" class="w-6 h-6" />
      </div>

      <!-- Tipo Habitación -->
      <div class="flex-1 min-w-[150px]">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ option.rooms[0]?.room_name || 'Habitación' }}
        </span>
      </div>

      <!-- Régimen -->
      <div class="w-16 font-bold text-gray-800 dark:text-gray-300">
        <UTooltip :text="option.rooms[0]?.meal_plan.name">
          <span class="cursor-help border-b border-dotted border-gray-400">
            {{ option.rooms[0]?.meal_plan.code }}
          </span>
        </UTooltip>
      </div>

      <!-- Cancelación -->
      <div class="w-auto sm:w-48 flex items-center gap-1">
        <UPopover>
          <span
            class="text-xs text-gray-500 underline underline-offset-2 cursor-pointer hover:text-gray-700 block"
          >
            {{ t('hotels.rooms.cancellationCosts') }}
          </span>
          <template #content>
            <div class="p-3 w-64 text-sm z-50">
              <p class="font-bold text-gray-900 dark:text-white mb-1">
                {{ t('hotels.rooms.cancellationPolicy') }}
              </p>
              <p class="text-gray-600 dark:text-gray-300 text-xs">
                {{ option.rooms[0]?.cancellation_policy }}
              </p>
            </div>
          </template>
        </UPopover>
        <UBadge
          v-if="
            option.rooms[0]?.cancellation_policy
              ?.toLowerCase()
              .includes('no reembolsable') ||
            option.rooms[0]?.cancellation_policy
              ?.toLowerCase()
              .includes('non-refundable')
          "
          color="error"
          variant="soft"
          size="xs"
          class="ml-1 px-1 py-0 text-[9px] font-bold leading-tight"
        >
          NR
        </UBadge>
        <UBadge
          v-if="
            option.rooms[0]?.cancellation_policy
              ?.toLowerCase()
              .includes('on request')
          "
          color="warning"
          variant="soft"
          size="xs"
          class="ml-1 px-1 py-0 text-[9px] font-bold leading-tight"
        >
          OR
        </UBadge>
      </div>

      <div
        class="w-32 text-right font-bold text-gray-900 dark:text-white flex flex-col items-end"
      >
        <span>
          ${{
            salePrice(parseFloat(option.total_net_rate)).toLocaleString(
              'en-US',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )
          }}
        </span>
        <span
          v-if="netPriceVisible"
          class="block text-[10px] text-gray-400 font-normal"
        >
          neto ${{
            parseFloat(option.total_net_rate).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </span>
      </div>

      <!-- Acciones: Cotizar y Reservar -->
      <div class="w-auto flex items-center justify-end gap-2 ml-4">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-document-plus"
          @click="addToItinerary(option)"
        />
        <UButton
          color="primary"
          variant="outline"
          size="sm"
          icon="i-heroicons-shopping-cart"
          class="font-bold w-36 justify-center"
          @click="handleAddToCart(option)"
        >
          {{ t('cart.addToCart') }}
        </UButton>
      </div>
    </div>

    <!-- Toggle "Ver Más opciones" -->
    <div
      v-if="sortedRooms.length > 1"
      class="py-3 text-center border-t border-gray-200 dark:border-gray-700 mt-2"
    >
      <button
        class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
        @click="showAllRooms = !showAllRooms"
      >
        <UIcon
          :name="
            showAllRooms
              ? 'i-heroicons-minus-circle'
              : 'i-heroicons-plus-circle'
          "
          class="w-5 h-5 mr-2"
        />
        {{
          showAllRooms
            ? t('hotels.rooms.seeLessOptions')
            : t('hotels.rooms.seeMoreOptions')
        }}
      </button>
    </div>
  </div>
</template>
