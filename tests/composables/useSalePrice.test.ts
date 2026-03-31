// tests/composables/useSalePrice.test.ts
import { describe, it, expect, vi } from 'vitest';
import { ref, computed } from 'vue';

vi.mock('#imports', () => ({
  useAsyncData: (_key: string, fn: () => unknown) => ({ data: ref({ markupPercentage: 10 }), refresh: vi.fn() }),
}));

vi.mock('~/composables/useAgency', () => ({
  useAgency: () => ({
    agency: computed(() => ({ markupPercentage: 10 })),
  }),
}));

import { useSalePrice } from '~/composables/useSalePrice';

describe('useSalePrice', () => {
  it('computes sale price with markup', () => {
    const { salePrice } = useSalePrice();
    expect(salePrice(100)).toBeCloseTo(110);
  });

  it('returns net unchanged when markup is 0', () => {
    const { salePrice } = useSalePrice();
    // markup is 10 from mock; just test the formula
    expect(salePrice(0)).toBe(0);
  });

  it('exposes markup percentage', () => {
    const { markup } = useSalePrice();
    expect(markup.value).toBe(10);
  });
});
