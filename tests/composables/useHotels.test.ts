import { describe, expect, it } from 'vitest';
import { useHotels, type HotelFilterState } from '~/composables/useHotels';

const DEFAULT_FILTERS: HotelFilterState = {
  hotelName: '',
  priceMin: 0,
  priceMax: Infinity,
  categories: [],
  regimes: [],
  hideNR: false,
  hideOR: false,
};

describe('useHotels', () => {
  describe('getHotelById', () => {
    it('devuelve el hotel por id numérico', () => {
      const { getHotelById } = useHotels();
      const hotel = getHotelById(1);

      expect(hotel).toBeDefined();
      expect(hotel!.id).toBe(1);
      expect(hotel!.name).toBe('Serenade Punta Cana Beach & Spa Resort');
    });

    it('devuelve el hotel por id como string', () => {
      const { getHotelById } = useHotels();
      const hotel = getHotelById('2');

      expect(hotel).toBeDefined();
      expect(hotel!.id).toBe(2);
    });

    it('devuelve undefined para un id inexistente', () => {
      const { getHotelById } = useHotels();
      expect(getHotelById(9999)).toBeUndefined();
    });
  });

  describe('filterHotels', () => {
    it('sin filtros devuelve todos los hoteles', () => {
      const { hotels, filterHotels } = useHotels();
      const result = filterHotels(DEFAULT_FILTERS);

      expect(result.length).toBe(hotels.value.length);
    });

    it('filtra por nombre parcial (case-insensitive)', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({
        ...DEFAULT_FILTERS,
        hotelName: 'punta cana',
      });

      expect(result.length).toBeGreaterThan(0);
      result.forEach((h) => {
        expect(h.name.toLowerCase()).toContain('punta cana');
      });
    });

    it('filtra por rango de precio', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({
        ...DEFAULT_FILTERS,
        priceMin: 800,
        priceMax: 1200,
      });

      expect(result.length).toBeGreaterThan(0);
      result.forEach((h) => {
        expect(h.bestPrice).toBeGreaterThanOrEqual(800);
        expect(h.bestPrice).toBeLessThanOrEqual(1200);
      });
    });

    it('filtra por categoría (estrellas)', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({ ...DEFAULT_FILTERS, categories: ['3'] });

      expect(result.length).toBeGreaterThan(0);
      result.forEach((h) => {
        expect(String(h.stars)).toBe('3');
      });
    });

    it('filtra por régimen', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({ ...DEFAULT_FILTERS, regimes: ['TI'] });

      result.forEach((h) => {
        const regimes = h.rooms.map((r) => r.regimen);
        expect(regimes).toContain('TI');
      });
    });

    it('hideNR elimina hoteles sin habitaciones reembolsables', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({ ...DEFAULT_FILTERS, hideNR: true });

      result.forEach((h) => {
        const hasRefundable = h.rooms.some(
          (r) => !r.cancellation.toLowerCase().includes('no reembolsable'),
        );
        expect(hasRefundable).toBe(true);
      });
    });

    it('hideNR elimina habitaciones no reembolsables de los resultados', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({ ...DEFAULT_FILTERS, hideNR: true });

      result.forEach((h) => {
        h.rooms.forEach((r) => {
          expect(r.cancellation.toLowerCase()).not.toContain('no reembolsable');
        });
      });
    });

    it('hideOR elimina hoteles sin habitaciones de confirmación inmediata', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({ ...DEFAULT_FILTERS, hideOR: true });

      result.forEach((h) => {
        const hasInstant = h.rooms.some((r) => !r.onRequest);
        expect(hasInstant).toBe(true);
      });
    });

    it('hideOR elimina habitaciones on-request de los resultados', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({ ...DEFAULT_FILTERS, hideOR: true });

      result.forEach((h) => {
        h.rooms.forEach((r) => {
          expect(r.onRequest).toBeFalsy();
        });
      });
    });

    it('combina múltiples filtros', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({
        ...DEFAULT_FILTERS,
        categories: ['5'],
        priceMin: 1000,
        priceMax: 2000,
        hideNR: true,
      });

      result.forEach((h) => {
        expect(h.stars).toBe(5);
        expect(h.bestPrice).toBeGreaterThanOrEqual(1000);
        expect(h.bestPrice).toBeLessThanOrEqual(2000);
        h.rooms.forEach((r) => {
          expect(r.cancellation.toLowerCase()).not.toContain('no reembolsable');
        });
      });
    });

    it('devuelve array vacío si ningún hotel cumple los filtros', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({
        ...DEFAULT_FILTERS,
        priceMin: 99999,
        priceMax: 999999,
      });

      expect(result).toHaveLength(0);
    });
  });
});
