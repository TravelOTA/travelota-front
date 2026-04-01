<script setup lang="ts">
import { ref, computed } from 'vue';
import type { HotelRoomOffer } from '~/composables/useHotels';
import { useNetPrice } from '~/composables/useNetPrice';
import { useSalePrice } from '~/composables/useSalePrice';

const { t } = useI18n();

const props = defineProps<{
  rooms: HotelRoomOffer[];
}>();

const showAllRooms = ref(true);

const sortedRooms = computed(() => {
  return [...props.rooms].sort((a, b) => a.price - b.price);
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

const addToQuote = (room: HotelRoomOffer) => {
  addQuoteItem({
    hotelId: '0', // Mock ID since hotel detail is not passed down here
    hotelName: 'Hotel Seleccionado', // Mock Name
    hotelImage:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    location: 'Ubicación del Hotel',
    roomsDescription: `${room.name} (${room.regimen})`,
    netPrice: room.price,
  });

  toast.add({
    title: t('hotels.rooms.roomAddedTitle'),
    description: t('hotels.rooms.roomAddedDescription', {
      roomName: room.name,
    }),
    icon: 'i-heroicons-check-circle',
    color: 'primary',
  });
};

const addToCart = (room: HotelRoomOffer) => {
  addCartItem('hotel', {
    hotel: {
      id: 0,
      name: 'Hotel Seleccionado',
      stars: 4,
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
      location: 'Destino',
      coordinates: [0, 0],
      bestPrice: 0,
      rooms: [],
    },
    room,
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
            room.name
          }}</span>
        </div>

        <!-- Régimen -->
        <div class="w-16 font-bold text-gray-800 dark:text-gray-300">
          {{ room.regimen }}
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
                  {{ room.cancellation || 'Gastos de cancelación' }}. (Texto de
                  ejemplo, será devuelto por el backend próximamente).
                </p>
              </div>
            </template>
          </UPopover>
          <UBadge
            v-if="
              String(room.cancellation)
                .toLowerCase()
                .includes('no reembolsable')
            "
            color="error"
            variant="soft"
            size="xs"
            class="ml-1 px-1 py-0 text-[9px] font-bold leading-tight"
          >
            NR
          </UBadge>
          <UBadge
            v-if="room.onRequest"
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
          <span
            >${{
              salePrice(room.price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}</span
          >
          <span
            v-if="netPriceVisible"
            class="block text-[10px] text-gray-400 font-normal"
          >
            neto ${{
              room.price.toLocaleString('en-US', {
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
