import { useState, useRouter, useRoute } from "#imports";

export interface HotelSearchParams {
  destination: string;
  checkIn: string; // ISO date string: "YYYY-MM-DD"
  checkOut: string; // ISO date string: "YYYY-MM-DD"
  nationality: string;
  distribution: string; // texto descriptivo: "2 Adultos, 1 Niño"
}

const DEFAULT_PARAMS: HotelSearchParams = {
  destination: "",
  checkIn: "",
  checkOut: "",
  nationality: "Estados Unidos",
  distribution: "1 Habitación, 2 Adultos",
};

export const useHotelSearch = () => {
  const searchParams = useState<HotelSearchParams>(
    "hotel-search-params",
    () => ({ ...DEFAULT_PARAMS }),
  );

  /**
   * Actualiza el estado de búsqueda y navega a la página de resultados
   * con los parámetros como query params en la URL.
   * Llamar desde dashboard/index.vue al hacer submit del formulario.
   */
  const navigateToResults = async (params: HotelSearchParams) => {
    const router = useRouter();
    searchParams.value = { ...params };
    await router.push({
      path: "/dashboard/hotels/results",
      query: {
        destination: params.destination,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        nationality: params.nationality,
        distribution: params.distribution,
      },
    });
  };

  /**
   * Lee los query params de la URL actual y los sincroniza con el estado.
   * Llamar en la página de resultados (dashboard/hotels/results.vue) durante el setup.
   */
  const hydrateFromRoute = () => {
    const route = useRoute();
    const q = route.query;
    if (q.destination) {
      searchParams.value = {
        destination: String(q.destination || ""),
        checkIn: String(q.checkIn || ""),
        checkOut: String(q.checkOut || ""),
        nationality: String(q.nationality || "Estados Unidos"),
        distribution: String(q.distribution || "1 Habitación, 2 Adultos"),
      };
    }
  };

  return { searchParams, navigateToResults, hydrateFromRoute };
};
