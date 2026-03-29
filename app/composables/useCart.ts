import { computed } from 'vue';
import { useState, useI18n } from '#imports';
import { apiFetch } from '~/composables/useApi';
import { useQuoter } from '~/composables/useQuoter';
import type { Hotel, HotelRoomOffer } from '~/composables/useHotels';
import type { HotelSearchParams } from '~/composables/useHotelSearch';

export type CartItemHotel = {
  type: 'hotel';
  id: string;
  hotel: Hotel;
  room: HotelRoomOffer;
  searchParams: HotelSearchParams;
  addedAt: number;
};

// Discriminated union — extend here for transfers, flights, etc.
export type CartItem = CartItemHotel;

export type BookingResult = {
  cartItemId: string;
  bookingId?: string;
  pnr?: string;
  orderRef: string;
  status: 'confirmed' | 'failed' | 'unavailable';
  hotelName: string;
  error?: string;
};

export type TitularData = {
  nombre: string;
  apellido: string;
  refAgencia?: string;
  notas?: string;
};

const MAX_CART_ITEMS = 10;

function generateOrderRef(): string {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `ORD-${year}-${rand}`;
}

export function useCart() {
  const { t } = useI18n();
  const items = useState<CartItem[]>('cart:items', () => []);
  const isDrawerOpen = useState<boolean>('cart:drawer', () => false);

  const itemCount = computed(() => items.value.length);
  const total = computed(() =>
    items.value.reduce((sum, item) => {
      if (item.type === 'hotel') return sum + item.room.price;
      return sum;
    }, 0),
  );

  function addItem(
    type: 'hotel',
    data: Omit<CartItemHotel, 'id' | 'type' | 'addedAt'>,
  ): void {
    if (items.value.length >= MAX_CART_ITEMS) {
      throw new Error(t('cart.maxItemsError'));
    }
    const newItem: CartItemHotel = {
      type,
      id: crypto.randomUUID(),
      addedAt: Date.now(),
      ...data,
    };
    items.value = [...items.value, newItem];
    isDrawerOpen.value = true;
  }

  function removeItem(id: string): void {
    items.value = items.value.filter((item) => item.id !== id);
  }

  function clearCart(): void {
    items.value = [];
  }

  function exportToQuoter(): void {
    const { addItem: addQuoterItem } = useQuoter();
    for (const item of items.value) {
      if (item.type === 'hotel') {
        addQuoterItem({
          hotelId: String(item.hotel.id),
          hotelName: item.hotel.name,
          hotelImage: item.hotel.image,
          location: item.hotel.location,
          roomsDescription: item.room.name,
          netPrice: item.room.price,
        });
      }
    }
    clearCart();
  }

  async function confirmAll(
    titular: TitularData,
    paymentMethod: string,
    cardData?: { number: string; expiry: string; cvv: string },
    onPriceChange?: (
      item: CartItemHotel,
      oldPrice: number,
      newPrice: number,
    ) => Promise<boolean>,
  ): Promise<BookingResult[]> {
    if (items.value.length === 0) {
      throw new Error(t('cart.empty'));
    }

    const orderRef = generateOrderRef();
    const results: BookingResult[] = [];

    for (const item of items.value) {
      if (item.type !== 'hotel') continue;

      if (!item.room.rate_key) {
        results.push({
          cartItemId: item.id,
          orderRef,
          status: 'unavailable',
          hotelName: item.hotel.name,
          error: t('cart.checkout.noRateKeyWarning'),
        });
        continue;
      }

      // Mock flow: skip API calls for mock rate keys
      if (item.room.rate_key.startsWith('MOCK-')) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        results.push({
          cartItemId: item.id,
          bookingId: String(Math.floor(Math.random() * 90000) + 10000),
          pnr: `PNR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          orderRef,
          status: 'confirmed',
          hotelName: item.hotel.name,
        });
        continue;
      }

      try {
        // Step 1: select — validates availability and returns current_net_rate
        const rooms = (item.searchParams.rooms ?? [{ adults: 2, children: [] }]).map((r) => ({
          adults: r.adults,
          children: r.children.length,
          children_ages: r.children.map((c) =>
            typeof c === 'number' ? c : (c as { age: number }).age,
          ),
        }));

        const bookingFlow = await apiFetch<{
          id: number;
          current_net_rate: string;
          status: string;
        }>('/api/hotel/booking-flow/select', {
          method: 'POST',
          body: {
            rate_key: item.room.rate_key,
            check_in: item.searchParams.checkIn,
            check_out: item.searchParams.checkOut,
            rooms,
            // DEV-ONLY: metadata for mock backend to persist realistic bookings
            _mockPrice: item.room.price,
            _mockHotel: {
              id: String(item.hotel.id),
              name: item.hotel.name,
              stars: item.hotel.stars,
              image: item.hotel.image,
              address: item.hotel.location ?? item.hotel.address ?? '',
            },
            _mockRoom: {
              id: String(item.room.id ?? item.room.rate_key ?? 'room-1'),
              name: item.room.name,
              regimen: item.room.regimen ?? 'SA',
              cancellation: item.room.cancellation ?? '',
            },
          },
        });

        // Step 2: check for price change
        const currentNetRate = parseFloat(bookingFlow.current_net_rate);
        if (currentNetRate !== item.room.price && onPriceChange) {
          const accepted = await onPriceChange(item, item.room.price, currentNetRate);
          if (!accepted) {
            results.push({
              cartItemId: item.id,
              orderRef,
              status: 'unavailable',
              hotelName: item.hotel.name,
              error: 'Omitido por cambio de precio',
            });
            continue;
          }
        }

        // Step 3: pre-book with titular as lead passenger
        await apiFetch(`/api/hotel/booking-flow/${bookingFlow.id}/pre-book`, {
          method: 'POST',
          body: {
            passengers: [
              {
                first_name: titular.nombre,
                last_name: titular.apellido,
                is_child: false,
              },
            ],
          },
        });

        // Step 4: confirm with shared orderRef
        const confirmed = await apiFetch<{
          id: number;
          status: string;
          booking: { id: number; pnr: string; order_ref: string } | null;
        }>(`/api/hotel/booking-flow/${bookingFlow.id}/confirm`, {
          method: 'POST',
          body: { order_ref: orderRef },
        });

        results.push({
          cartItemId: item.id,
          bookingId: confirmed.booking ? String(confirmed.booking.id) : undefined,
          pnr: confirmed.booking?.pnr,
          orderRef,
          status: 'confirmed',
          hotelName: item.hotel.name,
        });
      } catch (err) {
        results.push({
          cartItemId: item.id,
          orderRef,
          status: 'failed',
          hotelName: item.hotel.name,
          error: err instanceof Error ? err.message : 'Error desconocido',
        });
      }
    }

    return results;
  }

  return {
    items,
    isDrawerOpen,
    itemCount,
    total,
    addItem,
    removeItem,
    clearCart,
    exportToQuoter,
    confirmAll,
  };
}
