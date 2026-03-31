import { describe, expect, it } from 'vitest';
import { useQuoter, type QuoteItem } from '~/composables/useQuoter';

const makeItem = (
  overrides: Partial<
    Omit<QuoteItem, 'id' | 'markupPercentage' | 'markupFixed'>
  > = {},
) => ({
  hotelId: '1',
  hotelName: 'Hotel Test',
  hotelImage: 'https://example.com/img.jpg',
  location: 'Punta Cana',
  roomsDescription: '1 Habitación, 2 Adultos',
  netPrice: 1000,
  ...overrides,
});

describe('useQuoter', () => {
  describe('addItem', () => {
    it('agrega un item con id generado y markup del estado global', () => {
      const { items, addItem, globalMarkupPercentage } = useQuoter();
      globalMarkupPercentage.value = 15;

      addItem(makeItem({ netPrice: 1000 }));

      expect(items.value).toHaveLength(1);
      expect(items.value[0].id).toBeTruthy();
      expect(items.value[0].netPrice).toBe(1000);
      expect(items.value[0].markupPercentage).toBe(15);
      expect(items.value[0].markupFixed).toBe(0);
    });

    it('puede agregar múltiples items', () => {
      const { items, addItem } = useQuoter();

      addItem(makeItem({ hotelName: 'Hotel A', netPrice: 500 }));
      addItem(makeItem({ hotelName: 'Hotel B', netPrice: 800 }));

      expect(items.value).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('elimina el item por id', () => {
      const { items, addItem, removeItem } = useQuoter();
      addItem(makeItem({ hotelName: 'Hotel A' }));
      addItem(makeItem({ hotelName: 'Hotel B' }));

      const idToRemove = items.value[0].id;
      removeItem(idToRemove);

      expect(items.value).toHaveLength(1);
      expect(items.value.find((i) => i.id === idToRemove)).toBeUndefined();
    });

    it('no hace nada con un id inexistente', () => {
      const { items, addItem, removeItem } = useQuoter();
      addItem(makeItem());
      const originalLength = items.value.length;

      removeItem('id-que-no-existe');

      expect(items.value).toHaveLength(originalLength);
    });
  });

  describe('clearQuote', () => {
    it('vacía todos los items', () => {
      const { items, addItem, clearQuote } = useQuoter();
      addItem(makeItem());
      addItem(makeItem());

      clearQuote();

      expect(items.value).toHaveLength(0);
    });
  });

  describe('calculateItemSellPrice', () => {
    it('aplica markup porcentual correctamente: netPrice * (1 + markup/100)', () => {
      const { calculateItemSellPrice } = useQuoter();

      const item: QuoteItem = {
        id: 'test',
        hotelId: '1',
        hotelName: 'Test',
        hotelImage: '',
        location: '',
        roomsDescription: '',
        netPrice: 1000,
        markupPercentage: 15,
        markupFixed: 0,
      };

      // 1000 * (1 + 15/100) = 1150
      expect(calculateItemSellPrice(item)).toBe(1150);
    });

    it('aplica markup fijo sumado al precio', () => {
      const { calculateItemSellPrice } = useQuoter();

      const item: QuoteItem = {
        id: 'test',
        hotelId: '1',
        hotelName: 'Test',
        hotelImage: '',
        location: '',
        roomsDescription: '',
        netPrice: 1000,
        markupPercentage: 0,
        markupFixed: 200,
      };

      expect(calculateItemSellPrice(item)).toBe(1200);
    });

    it('combina markup porcentual y fijo', () => {
      const { calculateItemSellPrice } = useQuoter();

      const item: QuoteItem = {
        id: 'test',
        hotelId: '1',
        hotelName: 'Test',
        hotelImage: '',
        location: '',
        roomsDescription: '',
        netPrice: 1000,
        markupPercentage: 10,
        markupFixed: 50,
      };

      // 1000 + 100 (10%) + 50 = 1150
      expect(calculateItemSellPrice(item)).toBe(1150);
    });

    it('devuelve netPrice cuando ambos markups son 0', () => {
      const { calculateItemSellPrice } = useQuoter();

      const item: QuoteItem = {
        id: 'test',
        hotelId: '1',
        hotelName: 'Test',
        hotelImage: '',
        location: '',
        roomsDescription: '',
        netPrice: 1000,
        markupPercentage: 0,
        markupFixed: 0,
      };

      expect(calculateItemSellPrice(item)).toBe(1000);
    });
  });

  describe('totales computados', () => {
    it('totalNetPrice suma los precios netos de todos los items', () => {
      const { addItem, totalNetPrice } = useQuoter();

      addItem(makeItem({ netPrice: 500 }));
      addItem(makeItem({ netPrice: 800 }));
      addItem(makeItem({ netPrice: 200 }));

      expect(totalNetPrice.value).toBe(1500);
    });

    it('totalSellPrice suma los precios de venta con markup', () => {
      const { addItem, totalSellPrice, globalMarkupPercentage } = useQuoter();
      globalMarkupPercentage.value = 10;

      addItem(makeItem({ netPrice: 1000 })); // sellPrice = 1100
      addItem(makeItem({ netPrice: 500 })); // sellPrice = 550

      expect(totalSellPrice.value).toBe(1650);
    });

    it('totalProfit = totalSellPrice - totalNetPrice', () => {
      const {
        addItem,
        totalProfit,
        totalSellPrice,
        totalNetPrice,
        globalMarkupPercentage,
      } = useQuoter();
      globalMarkupPercentage.value = 20;

      addItem(makeItem({ netPrice: 1000 })); // sell = 1200, profit = 200

      expect(totalProfit.value).toBe(
        totalSellPrice.value - totalNetPrice.value,
      );
      expect(totalProfit.value).toBe(200);
    });

    it('todos los totales son 0 con la cotización vacía', () => {
      const { clearQuote, totalNetPrice, totalSellPrice, totalProfit } =
        useQuoter();
      clearQuote();

      expect(totalNetPrice.value).toBe(0);
      expect(totalSellPrice.value).toBe(0);
      expect(totalProfit.value).toBe(0);
    });
  });
});
