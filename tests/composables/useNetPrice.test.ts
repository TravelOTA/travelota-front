// tests/composables/useNetPrice.test.ts
import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';

vi.stubGlobal('useState', (_key: string, init?: () => unknown) => ref(init ? init() : undefined));


import { useNetPrice } from '~/composables/useNetPrice';

describe('useNetPrice', () => {
  it('starts hidden', () => {
    const { netPriceVisible } = useNetPrice();
    expect(netPriceVisible.value).toBe(false);
  });

  it('toggle flips the flag', () => {
    const { netPriceVisible, toggle } = useNetPrice();
    toggle();
    expect(netPriceVisible.value).toBe(true);
    toggle();
    expect(netPriceVisible.value).toBe(false);
  });
});
