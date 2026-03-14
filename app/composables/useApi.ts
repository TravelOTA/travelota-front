import type { UseFetchOptions } from "nuxt/app";

export const useApi = <T>(path: string, options?: UseFetchOptions<T>) => {
  const config = useRuntimeConfig();
  const token = useCookie("travelota-token");

  return useFetch<T>(`${config.public.apiBaseUrl}${path}`, {
    headers: {
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
    ...options,
  });
};
