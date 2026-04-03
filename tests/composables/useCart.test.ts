import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';

import { useCart } from '~/composables/useCart';
import type { CartItemHotel } from '~/composables/useCart';

const stateMap = new Map();
vi.mock('#imports', () => ({
  useState: (key: string, init?: () => unknown) => {
    if (!stateMap.has(key)) {
      stateMap.set(key, ref(init ? init() : undefined));
    }
    return stateMap.get(key);
  },
  useI18n: () => ({ t: (key: string) => key }),
}));

const { mockQuoterAddItem } = vi.hoisted(() => ({
  mockQuoterAddItem: vi.fn(),
}));

vi.mock('~/composables/useQuoter', () => ({
  useQuoter: () => ({
    addItem: mockQuoterAddItem,
  }),
}));

vi.mock('~/composables/useApi', () => ({
  apiFetch: vi.fn(),
}));

const makeHotelData = (
  overrides: Partial<Omit<CartItemHotel, 'id' | 'type' | 'addedAt'>> = {},
): Omit<CartItemHotel, 'id' | 'type' | 'addedAt'> => ({
  hotel: {
    hotel_code: '1',
    hotel_name: 'Hotel Test',
    category: 4,
    destination_name: 'Cancún, MX',
    thumbnail: 'https://example.com/img.jpg',
    latitude: 21.16,
    longitude: -86.85,
    options: [],
    best_price: 500,
  },
  option: {
    rate_key: 'RATE-ABC-123',
    total_net_rate: '500',
    currency: 'USD',
    rooms: [
      {
        room_code: 'rc1',
        room_name: 'Habitación Doble',
        rate_key: 'RATE-ABC-123',
        net_rate: '500',
        currency: 'USD',
        cancellation_policy: 'Reembolsable',
        meal_plan: { code: 'TI', name: 'All Inclusive' },
      },
    ],
  },
  searchParams: {
    destination_code: 'CUN',
    destination_label: 'Cancún',
    check_in: '2026-05-01',
    check_out: '2026-05-05',
    nationality: 'MX',
    distribution: '2 Adultos',
    rooms: [{ adults: 2, children: [] }],
  },
  ...overrides,
});

describe('useCart', () => {
  beforeEach(() => {
    stateMap.clear();
  });

  describe('addItem()', () => {
    it('adds item with generated id and addedAt timestamp', () => {
      const { items, addItem } = useCart();
      addItem('hotel', makeHotelData());

      expect(items.value).toHaveLength(1);
      expect(items.value[0].id).toBeTruthy();
      expect(typeof items.value[0].addedAt).toBe('number');
    });

    it('sets isDrawerOpen to true', () => {
      const { isDrawerOpen, addItem } = useCart();
      // Initialize state for this test if needed
      isDrawerOpen.value = false;

      expect(isDrawerOpen.value).toBe(false);
      addItem('hotel', makeHotelData());
      expect(isDrawerOpen.value).toBe(true);
    });

    it('rejects when itemCount reaches 10', () => {
      const { items, addItem } = useCart();
      items.value = []; // reset for this specific test
      for (let i = 0; i < 10; i++) {
        addItem(
          'hotel',
          makeHotelData({
            option: {
              ...makeHotelData().option,
              total_net_rate: String(i * 100),
            },
          }),
        );
      }
      expect(() => addItem('hotel', makeHotelData())).toThrow();
    });
  });

  describe('removeItem()', () => {
    it('removes item by id', () => {
      const { items, addItem, removeItem } = useCart();
      items.value = [];
      addItem('hotel', makeHotelData());
      const id = items.value[0].id;
      removeItem(id);
      expect(items.value).toHaveLength(0);
    });

    it('does nothing for unknown id', () => {
      const { items, addItem, removeItem } = useCart();
      items.value = [];
      addItem('hotel', makeHotelData());
      removeItem('non-existent-id');
      expect(items.value).toHaveLength(1);
    });
  });

  describe('clearCart()', () => {
    it('empties all items', () => {
      const { items, addItem, clearCart } = useCart();
      items.value = [];
      addItem('hotel', makeHotelData());
      addItem('hotel', makeHotelData());
      clearCart();
      expect(items.value).toHaveLength(0);
    });
  });

  describe('itemCount and total computed', () => {
    it('itemCount reflects array length reactively', () => {
      const { items, itemCount, addItem } = useCart();
      items.value = [];
      expect(itemCount.value).toBe(0);
      addItem(
        'hotel',
        makeHotelData({
          option: {
            ...makeHotelData().option,
            total_net_rate: '500',
          },
        }),
      );
      expect(itemCount.value).toBe(1);
    });

    it('total sums room prices', () => {
      const { items, total, addItem } = useCart();
      items.value = [];
      addItem(
        'hotel',
        makeHotelData({
          option: {
            ...makeHotelData().option,
            total_net_rate: '500',
          },
        }),
      );
      addItem(
        'hotel',
        makeHotelData({
          option: {
            ...makeHotelData().option,
            total_net_rate: '300',
          },
        }),
      );
      expect(total.value).toBe(800);
    });
  });

  describe('exportToQuoter()', () => {
    it('calls useQuoter.addItem() for each hotel item', async () => {
      mockQuoterAddItem.mockClear();

      const { addItem, exportToQuoter } = useCart();
      addItem('hotel', makeHotelData());
      addItem('hotel', makeHotelData());
      exportToQuoter();
      expect(mockQuoterAddItem).toHaveBeenCalledTimes(2);
    });

    it('calls clearCart() after export', () => {
      const { items, addItem, exportToQuoter } = useCart();
      addItem('hotel', makeHotelData());
      exportToQuoter();
      expect(items.value).toHaveLength(0);
    });
  });

  describe('confirmAll()', () => {
    it('throws if cart is empty', async () => {
      const { confirmAll } = useCart();
      await expect(
        confirmAll({ nombre: 'Juan', apellido: 'García' }, 'WALLET', {}),
      ).rejects.toThrow();
    });

    it('generates one shared orderRef for all items', async () => {
      const { apiFetch } = await import('~/composables/useApi');
      vi.mocked(apiFetch)
        // select is SKIPPED when preCheckResults has the item — mock only pre-book + confirm:
        .mockResolvedValueOnce({ id: 1, status: 'pre_booked' }) // pre-book
        .mockResolvedValueOnce({
          id: 1,
          status: 'confirmed',
          booking: { id: 10, pnr: 'ABC12345', order_ref: 'ORD-2026-0001' },
        }); // confirm

      const { items, addItem, confirmAll } = useCart();
      addItem('hotel', makeHotelData());
      const itemId = items.value[0]!.id;
      const results = await confirmAll(
        { nombre: 'Juan', apellido: 'García' },
        'WALLET',
        {}, // specialRequests
        { [itemId]: { bookingFlowId: 1, currentPrice: 500 } }, // preCheckResults — skips select
      );

      expect(results).toHaveLength(1);
      expect(results[0].orderRef).toMatch(/^ORD-\d{4}-\d{4}$/);
    });

    it('continues processing remaining items if one fails', async () => {
      const { apiFetch } = await import('~/composables/useApi');
      vi.mocked(apiFetch)
        // Item 1 pre-check provided → goes straight to pre-book (fails)
        .mockRejectedValueOnce(new Error('Unavailable')) // pre-book item 1 fails
        // Item 2 pre-check provided → goes straight to pre-book (succeeds)
        .mockResolvedValueOnce({ id: 2, status: 'pre_booked' }) // pre-book item 2
        .mockResolvedValueOnce({
          id: 2,
          status: 'confirmed',
          booking: { id: 20, pnr: 'XYZ98765', order_ref: 'ORD-2026-0001' },
        });

      const { items, addItem, confirmAll } = useCart();
      addItem('hotel', makeHotelData());
      addItem('hotel', makeHotelData());
      const ids = items.value.map((i: { id: string }) => i.id);
      const results = await confirmAll(
        { nombre: 'Juan', apellido: 'García' },
        'WALLET',
        {},
        {
          [ids[0]!]: { bookingFlowId: 1, currentPrice: 500 },
          [ids[1]!]: { bookingFlowId: 2, currentPrice: 500 },
        },
      );

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('failed');
      expect(results[1].status).toBe('confirmed');
    });

    it('passes special_requests to pre-book API call', async () => {
      const { apiFetch } = await import('~/composables/useApi');
      vi.mocked(apiFetch)
        .mockResolvedValueOnce({ id: 1, status: 'pre_booked' })
        .mockResolvedValueOnce({
          id: 1,
          status: 'confirmed',
          booking: { id: 10, pnr: 'ABC', order_ref: 'ORD-2026-0001' },
        });

      const { items, addItem, confirmAll } = useCart();
      addItem('hotel', makeHotelData());
      const itemId = items.value[0]!.id;

      await confirmAll(
        { nombre: 'Juan', apellido: 'García' },
        'WALLET',
        { [itemId]: 'Planta alta por favor' },
        { [itemId]: { bookingFlowId: 1, currentPrice: 500 } },
      );

      const preBookCall = vi.mocked(apiFetch).mock.calls[0]!;
      expect(preBookCall[1]?.body).toMatchObject({
        special_requests: 'Planta alta por favor',
      });
    });
  });
});
