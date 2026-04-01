import { config } from '@vue/test-utils';
import { vi, beforeEach } from 'vitest';
import { clearState } from './__mocks__/imports';

// Suprime warnings de Vue en tests
config.global.config.warnHandler = () => {};

// Mock global de useI18n para componentes que lo usan (Nuxt auto-import)
vi.stubGlobal('useI18n', () => ({
  t: (key: string) => key,
  locale: { value: 'es' },
}));

beforeEach(() => {
  clearState();
  vi.clearAllMocks();
});
