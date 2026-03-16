import { useRuntimeConfig, useCookie, useFetch } from "#imports";
import type { FetchError } from "ofetch";
import type { UseFetchOptions } from "nuxt/app";

const ERROR_MESSAGES: Record<number, string> = {
  400: "Datos de reserva incorrectos",
  402: "Crédito insuficiente para completar el pago",
  404: "Reserva no encontrada",
  409: "Esta habitación ya no está disponible",
  500: "Error del servidor, intenta de nuevo",
};

function resolveError(error: FetchError): string {
  if (error.status === 422 && error.data?.message) return error.data.message;
  return (
    ERROR_MESSAGES[error.status ?? 500] ??
    "Error del servidor, intenta de nuevo"
  );
}

/** Reactive wrapper — use in component setup for GET requests */
export const useApi = <T>(path: string, options?: UseFetchOptions<T>) => {
  const config = useRuntimeConfig();
  const token = useCookie("travelota-token");

  return useFetch<T>(`${config.public.apiBaseUrl}${path}`, {
    headers: {
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
    onResponseError({ response }) {
      const msg = resolveError({
        status: response.status,
        data: response._data,
      } as FetchError);
      console.error(`[useApi] ${response.status}: ${msg}`);
    },
    ...options,
  });
};

/** Imperative wrapper — use in event handlers and composable methods */
export const apiFetch = <T>(
  path: string,
  options?: Parameters<typeof $fetch>[1],
): Promise<T> => {
  const config = useRuntimeConfig();
  const token = useCookie("travelota-token");

  return $fetch<T>(`${config.public.apiBaseUrl}${path}`, {
    headers: {
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
    ...options,
  }).catch((err: FetchError) => {
    throw new Error(resolveError(err));
  });
};
