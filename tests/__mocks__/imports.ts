/**
 * Mock de #imports de Nuxt para tests unitarios con Vitest.
 * Reemplaza useState con ref normal, y provee stubs de composables de router/cookie.
 */
import { ref, computed, watch, reactive, onMounted, onUnmounted } from 'vue';
import { vi } from 'vitest';

export { ref, computed, watch, reactive, onMounted, onUnmounted };

// useState: ignora la key y devuelve un ref inicializado
export const useState = <T>(key: string, init?: () => T) => {
  return ref<T>(init ? init() : (undefined as T));
};

// Router stub
export const useRouter = () => ({
  push: vi.fn().mockResolvedValue(undefined),
  replace: vi.fn().mockResolvedValue(undefined),
  back: vi.fn(),
  forward: vi.fn(),
});

// Route stub (override en tests individuales si necesitas query params)
export const useRoute = () => ({
  query: {} as Record<string, string>,
  params: {} as Record<string, string>,
  path: '/',
  name: undefined,
});

export const useCookie = <T>(_key: string, _opts?: unknown) =>
  ref<T | null>(null);

export const useFetch = vi
  .fn()
  .mockResolvedValue({ data: ref(null), error: ref(null) });

export const useAsyncData = vi
  .fn()
  .mockResolvedValue({ data: ref(null), error: ref(null) });

export const navigateTo = vi.fn().mockResolvedValue(undefined);

export const useRuntimeConfig = () => ({
  public: {
    apiBaseUrl: 'http://localhost:3000',
  },
});

export const useNuxtApp = () => ({
  $router: useRouter(),
});
