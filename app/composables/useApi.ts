import { useRuntimeConfig, useCookie, useFetch } from '#imports';
import type { UseFetchOptions } from 'nuxt/app';

/** Reactive wrapper — use in component setup for GET requests */
export const useApi = <T>(path: string, options?: UseFetchOptions<T>) => {
  const config = useRuntimeConfig();
  const token = useCookie('travelota-token');

  return useFetch(`${config.public.apiBaseUrl}${path}`, {
    headers: {
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
    ...options,
  } as Parameters<typeof useFetch>[1]);
};

/** Imperative wrapper — use in event handlers and composable methods */
export const apiFetch = <T>(
  path: string,
  options?: Parameters<typeof $fetch>[1],
): Promise<T> => {
  const config = useRuntimeConfig();
  const token = useCookie('travelota-token');

  return $fetch<T>(`${config.public.apiBaseUrl}${path}`, {
    headers: {
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
    ...options,
  }) as Promise<T>;
};
