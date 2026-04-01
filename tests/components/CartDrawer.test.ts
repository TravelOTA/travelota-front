// tests/components/CartDrawer.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, computed } from 'vue';

import CartDrawer from '~/components/b2b/cart/CartDrawer.vue';

const mockItems = ref<unknown[]>([]);
const mockIsDrawerOpen = ref(false);
const mockItemCount = computed(() => mockItems.value.length);
const mockTotal = computed(() =>
  (mockItems.value as { room: { price: number } }[]).reduce(
    (sum, i) => sum + i.room.price,
    0,
  ),
);
const mockRemoveItem = vi.fn();
const mockExportToQuoter = vi.fn();

vi.mock('~/composables/useCart', () => ({
  useCart: () => ({
    items: mockItems,
    isDrawerOpen: mockIsDrawerOpen,
    itemCount: mockItemCount,
    total: mockTotal,
    removeItem: mockRemoveItem,
    exportToQuoter: mockExportToQuoter,
  }),
}));

vi.mock('#imports', () => ({
  navigateTo: vi.fn(),
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('~/composables/useNetPrice', () => ({
  useNetPrice: () => ({
    netPriceVisible: ref(false),
    toggle: vi.fn(),
  }),
}));

vi.mock('~/composables/useSalePrice', () => ({
  useSalePrice: () => ({
    salePrice: (net: number) => net * 1.1, // assuming 10% markup for tests
    markup: ref(10),
  }),
}));

vi.mock('~/components/b2b/cart/CartEmpty.vue', () => ({
  default: { template: '<div data-testid="cart-empty" />' },
}));

vi.mock('~/components/b2b/cart/CartItemCard.vue', () => ({
  default: {
    template: '<div data-testid="cart-item-card" />',
    props: ['item'],
  },
}));

describe('CartDrawer', () => {
  beforeEach(() => {
    mockItems.value = [];
    mockIsDrawerOpen.value = false;
    vi.clearAllMocks();
  });

  it('renders CartEmpty when items is empty', () => {
    const wrapper = mount(CartDrawer, {
      global: {
        stubs: { USlideover: { template: '<div><slot name="body" /></div>' } },
      },
    });
    expect(wrapper.find('[data-testid="cart-empty"]').exists()).toBe(true);
  });

  it('renders one CartItemCard per item', () => {
    mockItems.value = [
      {
        id: '1',
        type: 'hotel',
        hotel: { name: 'H1' },
        room: { price: 100 },
        searchParams: {},
        addedAt: Date.now(),
      },
      {
        id: '2',
        type: 'hotel',
        hotel: { name: 'H2' },
        room: { price: 200 },
        searchParams: {},
        addedAt: Date.now(),
      },
    ];
    const wrapper = mount(CartDrawer, {
      global: {
        stubs: {
          USlideover: { template: '<div><slot name="body" /></div>' },
          CartItemCard: {
            template: '<div data-testid="cart-item-card" />',
            props: ['item'],
          },
        },
      },
    });
    expect(wrapper.findAll('[data-testid="cart-item-card"]')).toHaveLength(2);
  });

  it('"Crear cotización" button calls exportToQuoter and navigates', async () => {
    const { navigateTo } = await import('#imports');
    mockItems.value = [
      {
        id: '1',
        type: 'hotel',
        hotel: { name: 'H1' },
        room: { price: 100 },
        searchParams: {},
        addedAt: Date.now(),
      },
    ];
    const wrapper = mount(CartDrawer, {
      global: {
        stubs: {
          USlideover: {
            template: '<div><slot name="body" /><slot name="footer" /></div>',
          },
          CartItemCard: {
            template: '<div data-testid="cart-item-card" />',
            props: ['item'],
          },
          UButton: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
            emits: ['click'],
          },
          UBadge: true,
        },
      },
    });
    const buttons = wrapper.findAll('button');
    // Second button is "Crear cotización"
    await buttons[1].trigger('click');
    expect(mockExportToQuoter).toHaveBeenCalled();
    expect(navigateTo).toHaveBeenCalledWith('/dashboard/quoter/builder');
  });

  it('"Ir al checkout" button navigates to /dashboard/cart/checkout', async () => {
    const { navigateTo } = await import('#imports');
    mockItems.value = [
      {
        id: '1',
        type: 'hotel',
        hotel: { name: 'H1' },
        room: { price: 100 },
        searchParams: {},
        addedAt: Date.now(),
      },
    ];
    const wrapper = mount(CartDrawer, {
      global: {
        stubs: {
          USlideover: {
            template: '<div><slot name="body" /><slot name="footer" /></div>',
          },
          CartItemCard: {
            template: '<div data-testid="cart-item-card" />',
            props: ['item'],
          },
          UButton: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
            emits: ['click'],
          },
          UBadge: true,
        },
      },
    });
    const buttons = wrapper.findAll('button');
    // First button is "Ir al checkout"
    await buttons[0].trigger('click');
    expect(navigateTo).toHaveBeenCalledWith('/dashboard/cart/checkout');
  });
});
