import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';

vi.mock('#imports', () => ({
  useState: (_key: string, init?: () => unknown) => ref(init ? init() : undefined),
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

import { useCart } from '~/composables/useCart';
import type { CartItemHotel } from '~/composables/useCart';
import { useQuoter } from '~/composables/useQuoter';

const makeHotelData = (overrides: Partial<Omit<CartItemHotel, 'id' | 'type' | 'addedAt'>> = {}): Omit<CartItemHotel, 'id' | 'type' | 'addedAt'> => ({
  hotel: {
    id: 1,
    name: 'Hotel Test',
    stars: 4,
    location: 'Cancún, MX',
    image: 'https://example.com/img.jpg',
    coordinates: [21.16, -86.85],
    bestPrice: 500,
    rooms: [],
  },
  room: {
    name: 'Habitación Doble',
    regimen: 'TI',
    cancellation: 'Reembolsable',
    cancellationPolicy: { refundable: true, penaltyFrom: null, penalties: [] },
    price: 500,
    rate_key: 'RATE-ABC-123',
  },
  searchParams: {
    destination: 'CUN',
    checkIn: '2026-05-01',
    checkOut: '2026-05-05',
    nationality: 'MX',
    distribution: '2 Adultos',
    rooms: [{ adults: 2, children: [] }],
  },
  ...overrides,
});

describe('useCart', () => {
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
      expect(isDrawerOpen.value).toBe(false);
      addItem('hotel', makeHotelData());
      expect(isDrawerOpen.value).toBe(true);
    });

    it('rejects when itemCount reaches 10', () => {
      const { addItem } = useCart();
      for (let i = 0; i < 10; i++) {
        addItem('hotel', makeHotelData({ room: { ...makeHotelData().room, price: i * 100 } }));
      }
      expect(() => addItem('hotel', makeHotelData())).toThrow();
    });
  });

  describe('removeItem()', () => {
    it('removes item by id', () => {
      const { items, addItem, removeItem } = useCart();
      addItem('hotel', makeHotelData());
      const id = items.value[0].id;
      removeItem(id);
      expect(items.value).toHaveLength(0);
    });

    it('does nothing for unknown id', () => {
      const { items, addItem, removeItem } = useCart();
      addItem('hotel', makeHotelData());
      removeItem('non-existent-id');
      expect(items.value).toHaveLength(1);
    });
  });

  describe('clearCart()', () => {
    it('empties all items', () => {
      const { items, addItem, clearCart } = useCart();
      addItem('hotel', makeHotelData());
      addItem('hotel', makeHotelData());
      clearCart();
      expect(items.value).toHaveLength(0);
    });
  });

  describe('itemCount and total computed', () => {
    it('itemCount reflects array length reactively', () => {
      const { itemCount, addItem } = useCart();
      expect(itemCount.value).toBe(0);
      addItem('hotel', makeHotelData({ room: { ...makeHotelData().room, price: 500 } }));
      expect(itemCount.value).toBe(1);
    });

    it('total sums room prices', () => {
      const { total, addItem } = useCart();
      addItem('hotel', makeHotelData({ room: { ...makeHotelData().room, price: 500 } }));
      addItem('hotel', makeHotelData({ room: { ...makeHotelData().room, price: 300 } }));
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
        confirmAll({ nombre: 'Juan', apellido: 'García' }, 'WALLET')
      ).rejects.toThrow();
    });

    it('generates one shared orderRef for all items', async () => {
      const { apiFetch } = await import('~/composables/useApi');
      vi.mocked(apiFetch)
        .mockResolvedValueOnce({ id: 1, current_net_rate: '500.00', status: 'selected' })
        .mockResolvedValueOnce({ id: 1, status: 'pre_booked' })
        .mockResolvedValueOnce({ id: 1, status: 'confirmed', booking: { id: 10, pnr: 'ABC12345', order_ref: 'ORD-2026-0001' } });

      const { addItem, confirmAll } = useCart();
      addItem('hotel', makeHotelData());
      const results = await confirmAll({ nombre: 'Juan', apellido: 'García' }, 'WALLET');

      expect(results).toHaveLength(1);
      expect(results[0].orderRef).toMatch(/^ORD-\d{4}-\d{4}$/);
    });

    it('continues processing remaining items if one fails', async () => {
      const { apiFetch } = await import('~/composables/useApi');
      vi.mocked(apiFetch)
        // Item 1: select fails
        .mockRejectedValueOnce(new Error('Unavailable'))
        // Item 2: full success
        .mockResolvedValueOnce({ id: 2, current_net_rate: '300.00', status: 'selected' })
        .mockResolvedValueOnce({ id: 2, status: 'pre_booked' })
        .mockResolvedValueOnce({ id: 2, status: 'confirmed', booking: { id: 20, pnr: 'XYZ98765', order_ref: 'ORD-2026-0001' } });

      const { addItem, confirmAll } = useCart();
      addItem('hotel', makeHotelData());
      addItem('hotel', makeHotelData());
      const results = await confirmAll({ nombre: 'Juan', apellido: 'García' }, 'WALLET');

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('failed');
      expect(results[1].status).toBe('confirmed');
    });
  });
});
