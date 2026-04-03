<script setup lang="ts">
import { ref, computed } from 'vue';
import type { RoomOption } from '~/composables/useHotels';
import { useNetPrice } from '~/composables/useNetPrice';
import { useSalePrice } from '~/composables/useSalePrice';

const { t } = useI18n();

const props = defineProps<{
  rooms: RoomOption[];
}>();

const showAllRooms = ref(true);

const sortedRooms = computed(() => {
  return [...props.rooms].sort(
    (a, b) => parseFloat(a.total_net_rate) - parseFloat(b.total_net_rate),
  );
});

const visibleRooms = computed(() => {
  return showAllRooms.value ? sortedRooms.value : sortedRooms.value.slice(0, 3);
});

const { addItem: addQuoteItem } = useQuoter();
const { addItem: addCartItem } = useCart();
const { searchParams } = useHotelSearch();
const toast = useToast();
const { netPriceVisible } = useNetPrice();
const { salePrice } = useSalePrice();

const addToQuote = (room: RoomOption) => {
  addQuoteItem({
    hotelId: '0', // Mock ID since hotel detail is not passed down here
    hotelName: 'Hotel Seleccionado', // Mock Name
    hotelImage:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    location: 'Ubicación del Hotel',
    roomsDescription: `${room.rooms[0]?.room_name} (${room.rooms[0]?.meal_plan?.code})`,
    netPrice: parseFloat(room.total_net_rate),
  });

  toast.add({
    title: t('hotels.rooms.roomAddedTitle'),
    description: t('hotels.rooms.roomAddedDescription', {
      roomName: room.rooms[0]?.room_name,
    }),
    icon: 'i-heroicons-check-circle',
    color: 'primary',
  });
};

const addToCart = (room: RoomOption) => {
  addCartItem('hotel', {
    hotel: {
      hotel_code: '0',
      hotel_name: 'Hotel Seleccionado',
      category: 4,
      thumbnail:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
      destination_name: 'Destino',
      latitude: null,
      longitude: null,
      best_price: 0,
      options: [],
    },
    option: room,
    searchParams: searchParams.value,
  });
};
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex flex-col mt-6 shadow-sm"
  >
    <!-- Search Query Summary Header -->
    <div
      class="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-800"
    >
      <h4 class="font-bold text-gray-900 dark:text-white text-md">
        3 de marzo de 2026 - 10 de marzo de 2026
      </h4>
      <p class="text-gray-600 dark:text-gray-300 text-sm">
        7 Noches, 1 Habitaciones 2 Adultos.
      </p>
    </div>

    <!-- Rooms List -->
    <div class="bg-gray-50 dark:bg-gray-800/20 px-4 py-2">
      <div
        v-for="(room, idx) in visibleRooms"
        :key="idx"
        class="flex flex-col sm:flex-row items-center py-1 border-b border-gray-200 dark:border-gray-700 last:border-0 gap-1"
      >
        <!-- Icono (Medalla) -->
        <div class="w-8 flex justify-center text-primary-500">
          <UIcon name="i-heroicons-check-badge" class="w-6 h-6" />
        </div>

        <!-- Tipo Habitación -->
        <div class="flex-1 min-w-[150px]">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{
            room.rooms[0]?.room_name
          }}</span>
        </div>

        <!-- Régimen -->
        <div class="w-16 font-bold text-gray-800 dark:text-gray-300">
          {{ room.rooms[0]?.meal_plan?.code }}
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
                  {{
                    room.rooms[0]?.cancellation_policy ||
                    'Gastos de cancelación'
                  }}. (Texto de ejemplo, será devuelto por el backend
                  próximamente).
                </p>
              </div>
            </template>
          </UPopover>
          <UBadge
            v-if="
              String(room.rooms[0]?.cancellation_policy)
                .toLowerCase()
                .includes('no reembolsable')
            "
            color="error"
            variant="soft"
            size="xs"
            class="ml-1 px-1 py-0 text-[10px] font-bold leading-tight"
          >
            NR
          </UBadge>
          <UBadge
            v-if="
              String(room.rooms[0]?.cancellation_policy)
                .toLowerCase()
                .includes('on request')
            "
            color="warning"
            variant="soft"
            size="xs"
            class="ml-1 px-1 py-0 text-[10px] font-bold leading-tight"
          >
            OR
          </UBadge>
        </div>

        <div
          class="w-32 text-right font-bold text-gray-900 dark:text-white flex flex-col items-end"
        >
          <span
            >${{
              salePrice(parseFloat(room.total_net_rate)).toLocaleString(
                'en-US',
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )
            }}</span
          >
          <span
            v-if="netPriceVisible"
            class="block text-[10px] text-gray-400 font-normal"
          >
            neto ${{
              parseFloat(room.total_net_rate).toLocaleString('en-US', {
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
            @click="addToQuote(room)"
          />
          <UButton
            color="primary"
            variant="outline"
            size="sm"
            icon="i-heroicons-shopping-cart"
            class="font-bold w-36 justify-center"
            @click="addToCart(room)"
          >
            {{ t('cart.addToCart') }}
          </UButton>
        </div>
      </div>

      <!-- Toggle Actions -->
      <div
        v-if="sortedRooms.length > 3"
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
  </div>
</template>
