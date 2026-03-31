// tests/components/CartCheckoutItemBlock.test.ts
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import type { CartItemHotel } from '~/composables/useCart';

import CartCheckoutItemBlock from '~/components/b2b/cart/checkout/CartCheckoutItemBlock.vue';

vi.mock('#imports', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('~/components/b2b/cart/checkout/CartCheckoutBlockHotel.vue', () => ({
  default: {
    name: 'CartCheckoutBlockHotel',
    template: '<div data-testid="block-hotel" />',
    props: ['item', 'index', 'total', 'preCheck', 'specialRequest'],
    emits: ['remove', 'update:specialRequest'],
  },
}));

const makeHotelItem = (): CartItemHotel => ({
  id: 'item-1',
  type: 'hotel',
  addedAt: Date.now(),
  hotel: {
    id: 1,
    name: 'Hotel Test',
    stars: 4,
    location: 'Cancún',
    image: '',
    coordinates: [0, 0],
    bestPrice: 500,
    rooms: [],
  },
  room: {
    name: 'Doble',
    regimen: 'TI',
    cancellation: 'Reembolsable',
    cancellationPolicy: { refundable: true, penaltyFrom: null, penalties: [] },
    price: 500,
    rate_key: 'RATE-1',
  },
  searchParams: {
    destination: 'CUN',
    checkIn: '2026-06-01',
    checkOut: '2026-06-04',
    nationality: 'MX',
    distribution: '2 Adultos',
    rooms: [{ adults: 2, children: [] }],
  },
});

const loadingPreCheck = { status: 'loading' as const };

describe('CartCheckoutItemBlock', () => {
  it('renders CartCheckoutBlockHotel for hotel items', () => {
    const wrapper = mount(CartCheckoutItemBlock, {
      props: {
        item: makeHotelItem(),
        index: 0,
        total: 1,
        preCheck: loadingPreCheck,
        specialRequest: '',
      },
    });
    expect(wrapper.find('[data-testid="block-hotel"]').exists()).toBe(true);
  });

  it('renders fallback card for unknown item type', () => {
    const unknownItem = { ...makeHotelItem(), type: 'transfer' as 'hotel' };
    const wrapper = mount(CartCheckoutItemBlock, {
      props: {
        item: unknownItem,
        index: 0,
        total: 1,
        preCheck: loadingPreCheck,
        specialRequest: '',
      },
    });
    expect(wrapper.find('[data-testid="block-hotel"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="block-fallback"]').exists()).toBe(true);
  });

  it('forwards remove emit from inner block', async () => {
    const wrapper = mount(CartCheckoutItemBlock, {
      props: {
        item: makeHotelItem(),
        index: 0,
        total: 1,
        preCheck: loadingPreCheck,
        specialRequest: '',
      },
    });
    const hotelBlock = wrapper.findComponent({
      name: 'CartCheckoutBlockHotel',
    });
    hotelBlock.vm.$emit('remove', 'item-1');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('remove')).toBeTruthy();
  });
});
