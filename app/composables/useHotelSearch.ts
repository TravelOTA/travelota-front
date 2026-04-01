import type { SearchRoomDistribution } from '#shared/types/search';
import { useState, useRouter, useRoute } from '#imports';

export interface HotelSearchParams {
  destination_code: string;
  destination_label: string;
  check_in: string;
  check_out: string;
  nationality: string;
  distribution: string;
  rooms?: SearchRoomDistribution[];
}

const DEFAULT_PARAMS: HotelSearchParams = {
  destination_code: '',
  destination_label: '',
  check_in: '',
  check_out: '',
  nationality: 'Estados Unidos',
  distribution: '1 Habitación, 2 Adultos',
  rooms: [{ adults: 2, children: [] }],
};

export const useHotelSearch = () => {
  const searchParams = useState<HotelSearchParams>(
    'hotel-search-params',
    () => ({ ...DEFAULT_PARAMS }),
  );

  const navigateToResults = async (params: HotelSearchParams) => {
    const router = useRouter();
    searchParams.value = { ...params };

    const query: Record<string, string> = {
      destination_code: params.destination_code,
      destination_label: params.destination_label,
      check_in: params.check_in,
      check_out: params.check_out,
      nationality: params.nationality,
      distribution: params.distribution,
    };

    if (params.rooms) {
      query.rooms = JSON.stringify(params.rooms);
    }

    await router.push({ path: '/dashboard/hotels/results', query });
  };

  const hydrateFromRoute = () => {
    const route = useRoute();
    const q = route.query;

    if (q.destination_code) {
      let rooms: SearchRoomDistribution[] | undefined;
      if (q.rooms) {
        try {
          rooms = JSON.parse(String(q.rooms));
        } catch {
          // ignore malformed rooms param
        }
      }
      searchParams.value = {
        destination_code: String(q.destination_code || ''),
        destination_label: String(q.destination_label || ''),
        check_in: String(q.check_in || ''),
        check_out: String(q.check_out || ''),
        nationality: String(q.nationality || 'Estados Unidos'),
        distribution: String(q.distribution || '1 Habitación, 2 Adultos'),
        rooms,
      };
    }
  };

  return { searchParams, navigateToResults, hydrateFromRoute };
};
