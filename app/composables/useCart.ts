import { computed } from 'vue';
import { useState, useI18n } from '#imports';
import { apiFetch } from '~/composables/useApi';
import { useQuoter } from '~/composables/useQuoter';
import type { Hotel, RoomOption } from '~/composables/useHotels';
import type { HotelSearchParams } from '~/composables/useHotelSearch';

export type CartItemHotel = {
  type: 'hotel';
  id: string;
  hotel: Hotel;
  option: RoomOption;
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
  email: string;
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
      if (item.type === 'hotel') return sum + parseFloat(item.option.total_net_rate);
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
          hotelId: item.hotel.hotel_code,
          hotelName: item.hotel.hotel_name,
          hotelImage: item.hotel.thumbnail || '',
          location: item.hotel.destination_name,
          roomsDescription: item.option.rooms[0]?.room_name || 'Habitación',
          netPrice: parseFloat(item.option.total_net_rate),
        });
      }
    }
    clearCart();
  }

  async function confirmAll(
    titular: TitularData,
    paymentMethod: string,
    specialRequests: Record<string, string> = {},
    preCheckResults?: Record<
      string,
      { bookingFlowId: number; currentPrice: number }
    >,
    cardData?: { number: string; expiry: string; cvv: string },
    skipIds?: Set<string>,
  ): Promise<BookingResult[]> {
    if (items.value.length === 0) {
      throw new Error(t('cart.empty'));
    }

    const orderRef = generateOrderRef();
    const results: BookingResult[] = [];

    for (const item of items.value) {
      if (item.type !== 'hotel') continue;
      if (skipIds?.has(item.id)) continue;

      if (!item.option.rate_key) {
        results.push({
          cartItemId: item.id,
          orderRef,
          status: 'unavailable',
          hotelName: item.hotel.hotel_name,
          error: t('cart.checkout.noRateKeyWarning'),
        });
        continue;
      }

      try {
        const rooms = (
          item.searchParams.rooms ?? [{ adults: 2, children: [] }]
        ).map((r) => ({
          adults: r.adults,
          children: r.children.length,
          children_ages: r.children.map((c) =>
            typeof c === 'number' ? c : (c as { age: number }).age,
          ),
        }));

        // Reuse pre-check flow ID if available, otherwise run select
        let bookingFlowId: number;
        if (preCheckResults?.[item.id]) {
          bookingFlowId = preCheckResults![item.id]!.bookingFlowId;
        } else {
          const bookingFlow = await apiFetch<{
            id: number;
            current_net_rate: string;
            status: string;
          }>('/api/hotel/booking-flow/select', {
            method: 'POST',
            body: {
              rate_key: item.option.rate_key,
              check_in: item.searchParams.check_in,
              check_out: item.searchParams.check_out,
              rooms,
              // Metadata for backend enrichment is no longer needed in body as the backend
              // already has access to the catalog and the booking flow state.
              // But we can keep it as a reference if needed for other providers.
            },
          });
          bookingFlowId = bookingFlow.id;
        }

        await apiFetch(`/api/hotel/booking-flow/${bookingFlowId}/pre-book`, {
          method: 'POST',
          body: {
            passengers: [
              {
                first_name: titular.nombre,
                last_name: titular.apellido,
                is_child: false,
              },
            ],
            special_requests: specialRequests[item.id] ?? '',
          },
        });

        // Confirm with shared orderRef
        const confirmed = await apiFetch<{
          id: number;
          status: string;
          booking: { id: number; pnr: string; order_ref: string } | null;
        }>(`/api/hotel/booking-flow/${bookingFlowId}/confirm`, {
          method: 'POST',
          body: {
            order_ref: orderRef,
            payment_method: paymentMethod,
          },
        });

        results.push({
          cartItemId: item.id,
          bookingId: confirmed.booking
            ? String(confirmed.booking.id)
            : undefined,
          pnr: confirmed.booking?.pnr,
          orderRef,
          status: 'confirmed',
          hotelName: item.hotel.hotel_name,
        });
      } catch (err) {
        results.push({
          cartItemId: item.id,
          orderRef,
          status: 'failed',
          hotelName: item.hotel.hotel_name,
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

