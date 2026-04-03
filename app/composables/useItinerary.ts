import { computed } from 'vue';
import type { ItineraryOptionMetadata } from '#shared/schemas/itinerary';

import type { SearchRoomDistribution } from '#shared/types/search';

export interface ItineraryOption {
  id: string;
  provider_id: string; // Provider ID, or "MANUAL" for manual entries
  name: string;
  image: string;
  description: string;
  net_price: number;
  is_manual: boolean; // true = manual entry; false = provider-sourced
  metadata?: ItineraryOptionMetadata;
  notes?: string;
  is_selected?: boolean; // Client selection indicator
}

export interface ItineraryBlock {
  id: string; // block UUID
  type: 'hotel' | 'flight' | 'transfer' | 'excursion' | 'extra';
  title: string;
  date: string;
  options: ItineraryOption[]; // Min 1, Max 5
}

export interface Itinerary {
  id?: string;
  title: string;
  client_name: string;
  rooms: SearchRoomDistribution[];
  origin: string;
  markup_percentage: number;
  blocks: ItineraryBlock[];
}

// Global active builder state mapped to Nuxt useState
export const useItinerary = () => {
  const { t } = useI18n();
  const itinerary = useState<Itinerary>('quoter-itinerary', () => ({
    title: t('itinerary.newTitle'),
    client_name: '',
    rooms: [{ adults: 2, children: [] }],
    origin: '',
    markup_percentage: 15, // Default 15% margin
    blocks: [],
  }));

  const totalPax = computed(() => {
    return itinerary.value.rooms.reduce((acc, room) => {
      return acc + room.adults + room.children.length;
    }, 0);
  });

  // Global Modal State for Adding Options
  const isAddOptionModalOpen = useState<boolean>(
    'quoter-modal-open',
    () => false,
  );
  const pendingOption = useState<Omit<ItineraryOption, 'id'> | null>(
    'quoter-pending-option',
    () => null,
  );
  const addBlock = (
    type: ItineraryBlock['type'],
    title: string,
    date: string,
  ) => {
    const newBlock: ItineraryBlock = {
      id: crypto.randomUUID(),
      type,
      title,
      date,
      options: [],
    };
    itinerary.value.blocks.push(newBlock);
    return newBlock.id;
  };

  const removeBlock = (blockId: string) => {
    itinerary.value.blocks = itinerary.value.blocks.filter(
      (b) => b.id !== blockId,
    );
  };

  const updateBlock = (blockId: string, title: string, date: string) => {
    const block = itinerary.value.blocks.find((b) => b.id === blockId);
    if (!block) return;
    block.title = title;
    block.date = date;
  };

  const addOptionToBlock = (
    blockId: string,
    option: Omit<ItineraryOption, 'id'>,
  ) => {
    const block = itinerary.value.blocks.find((b) => b.id === blockId);
    if (!block) throw new Error('Block not found');
    if (block.options.length >= 5)
      throw new Error('Max 5 options allowed per block');

    block.options.push({
      ...option,
      id: crypto.randomUUID(),
    });
  };

  const removeOptionFromBlock = (blockId: string, optionId: string) => {
    const block = itinerary.value.blocks.find((b) => b.id === blockId);
    if (block) {
      block.options = block.options.filter((o) => o.id !== optionId);
    }
  };

  const calculateOptionSellPrice = (net_price: number) => {
    return net_price * (1 + itinerary.value.markup_percentage / 100);
  };

  // Helper function: get price range of a block based on its options
  const getBlockPriceRange = (blockId: string) => {
    const block = itinerary.value.blocks.find((b) => b.id === blockId);
    if (!block || block.options.length === 0) return { min: 0, max: 0 };
    const prices = block.options.map((o) =>
      calculateOptionSellPrice(o.net_price),
    );
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  // Gets the cheapest possible itinerary combination
  const minItineraryPrice = computed(() => {
    return itinerary.value.blocks.reduce((total, block) => {
      if (block.options.length === 0) return total;
      const minNet = Math.min(...block.options.map((o) => o.net_price));
      return total + calculateOptionSellPrice(minNet);
    }, 0);
  });

  const calculatePriceBreakdown = (net_price: number) => {
    const sellPrice = calculateOptionSellPrice(net_price);

    let totalAdults = 0;
    let totalChildren = 0;

    itinerary.value.rooms.forEach((room) => {
      totalAdults += room.adults;
      totalChildren += room.children.length;
    });

    if (totalAdults === 0 && totalChildren === 0) {
      return { total: sellPrice, perAdult: 0, perChild: 0 };
    }

    // Heurística B2B: Niño paga 50% de la tarifa de un adulto (Peso 0.5)
    // Precio Total = (Adultos * TarifaAdulto) + (Niños * TarifaAdulto * 0.5)
    // TarifaAdulto = Precio Total / (Adultos + (Niños * 0.5))
    const totalWeights = totalAdults + totalChildren * 0.5;
    const adultRate = sellPrice / totalWeights;
    const childRate = adultRate * 0.5;

    return {
      total: sellPrice,
      perAdult: adultRate,
      perChild: childRate,
    };
  };

  const clearItinerary = () => {
    itinerary.value = {
      title: t('itinerary.newTitle'),
      client_name: '',
      rooms: [{ adults: 2, children: [] }],
      origin: '',
      markup_percentage: 15,
      blocks: [],
    };
  };

  const triggerAddOption = (option: Omit<ItineraryOption, 'id'>) => {
    pendingOption.value = option;
    isAddOptionModalOpen.value = true;
  };

  const fetchItinerary = async (id: string) => {
    try {
      const data = await apiFetch<Itinerary>(`/api/itineraries/${id}`);
      if (data) {
        itinerary.value = data;
      }
    } catch (err) {
      console.error('Error fetching itinerary:', err);
    }
  };

  const saveItinerary = () => {
    return useApi<Itinerary>('/api/itineraries', {
      method: 'POST',
      body: itinerary.value,
    });
  };

  return {
    itinerary,
    totalPax,
    isAddOptionModalOpen,
    pendingOption,
    addBlock,
    removeBlock,
    updateBlock,
    addOptionToBlock,
    removeOptionFromBlock,
    calculateOptionSellPrice,
    calculatePriceBreakdown,
    getBlockPriceRange,
    minItineraryPrice,
    clearItinerary,
    triggerAddOption,
    fetchItinerary,
    saveItinerary,
  };
};
