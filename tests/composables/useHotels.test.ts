import { describe, expect, it, beforeEach } from 'vitest';
import { useHotels, type HotelFilterState, type Hotel } from '~/composables/useHotels';

const MOCK_HOTELS: Hotel[] = [
  {
    hotel_code: '1',
    hotel_name: 'Serenade Punta Cana Beach & Spa Resort',
    category: 5,
    destination_name: 'Punta Cana',
    latitude: 18.1,
    longitude: -68.1,
    thumbnail: 'h1.jpg',
    best_price: 1000,
    options: [
      {
        rate_key: 'rk1',
        total_net_rate: '1000',
        currency: 'USD',
        rooms: [
          {
            room_code: 'rc1',
            room_name: 'Luxury Room',
            rate_key: 'rk1',
            net_rate: '1000',
            currency: 'USD',
            cancellation_policy: 'Cancelación gratuita',
            meal_plan: { code: 'TI', name: 'All Inclusive' },
          },
        ],
      },
    ],
  },
  {
    hotel_code: '2',
    hotel_name: 'Iberostar Grand Bavaro',
    category: 5,
    destination_name: 'Punta Cana',
    latitude: 18.2,
    longitude: -68.2,
    thumbnail: 'h2.jpg',
    best_price: 1500,
    options: [
      {
        rate_key: 'rk2',
        total_net_rate: '1500',
        currency: 'USD',
        rooms: [
          {
            room_code: 'rc2',
            room_name: 'Suite',
            rate_key: 'rk2',
            net_rate: '1500',
            currency: 'USD',
            cancellation_policy: 'No reembolsable',
            meal_plan: { code: 'TI', name: 'All Inclusive' },
          },
        ],
      },
    ],
  },
  {
    hotel_code: '3',
    hotel_name: 'Hotel Económico',
    category: 3,
    destination_name: 'Madrid',
    latitude: 40.4,
    longitude: -3.7,
    thumbnail: 'h3.jpg',
    best_price: 300,
    options: [
      {
        rate_key: 'rk3',
        total_net_rate: '300',
        currency: 'EUR',
        rooms: [
          {
            room_code: 'rc3',
            room_name: 'Standard',
            rate_key: 'rk3',
            net_rate: '300',
            currency: 'EUR',
            cancellation_policy: 'On Request',
            meal_plan: { code: 'SA', name: 'Sole Lodging' },
          },
        ],
      },
    ],
  },
];

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
  beforeEach(() => {
    const { hotels } = useHotels();
    hotels.value = [...MOCK_HOTELS];
  });

  describe('getHotelByCode', () => {
    it('devuelve el hotel por id numérico (como string)', () => {
      const { getHotelByCode } = useHotels();
      const hotel = getHotelByCode('1');

      expect(hotel).toBeDefined();
      expect(hotel!.hotel_code).toBe('1');
      expect(hotel!.hotel_name).toBe('Serenade Punta Cana Beach & Spa Resort');
    });

    it('devuelve undefined para un id inexistente', () => {
      const { getHotelByCode } = useHotels();
      expect(getHotelByCode('9999')).toBeUndefined();
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
      result.forEach((h: Hotel) => {
        expect(h.hotel_name.toLowerCase()).toContain('punta cana');
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
      result.forEach((h: Hotel) => {
        expect(h.best_price).toBeGreaterThanOrEqual(800);
        expect(h.best_price).toBeLessThanOrEqual(1200);
      });
    });

    it('filtra por categoría (estrellas)', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({ ...DEFAULT_FILTERS, categories: ['3'] });

      expect(result.length).toBeGreaterThan(0);
      result.forEach((h: Hotel) => {
        expect(String(h.category)).toBe('3');
      });
    });

    it('filtra por régimen', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({ ...DEFAULT_FILTERS, regimes: ['TI'] });

      result.forEach((h: Hotel) => {
        const regimes = h.options.flatMap((o: any) => o.rooms.map((r: any) => r.meal_plan.code));
        expect(regimes).toContain('TI');
      });
    });

    it('hideNR elimina hoteles sin habitaciones reembolsables', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({ ...DEFAULT_FILTERS, hideNR: true });

      result.forEach((h: Hotel) => {
        const hasRefundable = h.options.some((o: any) =>
          o.rooms.some(
            (r: any) =>
              !r.cancellation_policy.toLowerCase().includes('no reembolsable') &&
              !r.cancellation_policy.toLowerCase().includes('non-refundable'),
          ),
        );
        expect(hasRefundable).toBe(true);
      });
    });

    it('hideOR elimina hoteles sin habitaciones de confirmación inmediata', () => {
      const { filterHotels } = useHotels();
      const result = filterHotels({ ...DEFAULT_FILTERS, hideOR: true });

      result.forEach((h: Hotel) => {
        const hasInstant = h.options.some((o: any) =>
          o.rooms.some(
            (r: any) => !r.cancellation_policy.toLowerCase().includes('on request'),
          ),
        );
        expect(hasInstant).toBe(true);
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

      result.forEach((h: Hotel) => {
        expect(h.category).toBe(5);
        expect(h.best_price).toBeGreaterThanOrEqual(1000);
        expect(h.best_price).toBeLessThanOrEqual(2000);
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
