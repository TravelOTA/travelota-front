import { useState, useRouter, useRoute } from "#imports";

import type { SearchRoomDistribution } from "./useItinerary";

export interface HotelSearchParams {
  destination: string;
  checkIn: string; // ISO date string: "YYYY-MM-DD"
  checkOut: string; // ISO date string: "YYYY-MM-DD"
  nationality: string;
  distribution: string; // texto descriptivo: "2 Adultos, 1 Niño"
  rooms?: SearchRoomDistribution[]; // Rich data for perfect state restoration
}

const DEFAULT_PARAMS: HotelSearchParams = {
  destination: "",
  checkIn: "",
  checkOut: "",
  nationality: "Estados Unidos",
  distribution: "1 Habitación, 2 Adultos",
  rooms: [{ adults: 2, children: [] }],
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

    // Prepare query params, serializing complex objects
    const query: Record<string, string> = {
      destination: params.destination,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      nationality: params.nationality,
      distribution: params.distribution,
    };

    if (params.rooms) {
      query.rooms = JSON.stringify(params.rooms);
    }

    await router.push({
      path: "/dashboard/hotels/results",
      query,
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
      let rooms: SearchRoomDistribution[] | undefined;
      if (q.rooms) {
        try {
          rooms = JSON.parse(String(q.rooms));
        } catch (e) {
          console.error("Error parsing rooms from query", e);
        }
      }

      searchParams.value = {
        destination: String(q.destination || ""),
        checkIn: String(q.checkIn || ""),
        checkOut: String(q.checkOut || ""),
        nationality: String(q.nationality || "Estados Unidos"),
        distribution: String(q.distribution || "1 Habitación, 2 Adultos"),
        rooms,
      };
    }
  };

  return { searchParams, navigateToResults, hydrateFromRoute };
};
