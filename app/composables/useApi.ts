/**
 * Centralized API wrapper around Nuxt's useFetch.
 * Injects the base URL from runtimeConfig and the auth token from cookie.
 * Usage: const { data, error, pending } = useApi<MyType>('/endpoint')
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useApi = <T>(path: string, options?: any) => {
  const config = useRuntimeConfig();
  const token = useCookie("travelota-token");

  return useFetch<T>(`${config.public.apiBaseUrl}${path}`, {
    headers: {
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
};
