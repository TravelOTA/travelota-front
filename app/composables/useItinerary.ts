import { computed } from "vue";

export interface ItineraryOption {
  id: string;
  providerId: string; // e.g., Hotel ID or Transfer ID
  name: string;
  image: string;
  description: string;
  netPrice: number;
  isSelected?: boolean; // Client selection indicator
}

export interface ItineraryBlock {
  id: string; // block UUID
  type: "hotel" | "flight" | "transfer" | "activity";
  title: string;
  date: string;
  options: ItineraryOption[]; // Min 1, Max 5
}

export interface ChildAge {
  age: number;
}

export interface Room {
  adults: number;
  children: ChildAge[];
}

export interface Itinerary {
  id?: string;
  title: string;
  clientName: string;
  rooms: Room[];
  origin: string;
  markupPercentage: number;
  blocks: ItineraryBlock[];
}

// Global active builder state mapped to Nuxt useState
export const useItinerary = () => {
  const itinerary = useState<Itinerary>("quoter-itinerary", () => ({
    title: "Nuevo Itinerario",
    clientName: "",
    rooms: [{ adults: 2, children: [] }],
    origin: "",
    markupPercentage: 15, // Default 15% margin
    blocks: [],
  }));

  const totalPax = computed(() => {
    return itinerary.value.rooms.reduce((acc, room) => {
      return acc + room.adults + room.children.length;
    }, 0);
  });

  // Global Modal State for Adding Options
  const isAddOptionModalOpen = useState<boolean>(
    "quoter-modal-open",
    () => false,
  );
  const pendingOption = useState<Omit<ItineraryOption, "id"> | null>(
    "quoter-pending-option",
    () => null,
  );
  const addBlock = (
    type: ItineraryBlock["type"],
    title: string,
    date: string,
  ) => {
    const newBlock: ItineraryBlock = {
      id: `BLK-${Math.random().toString(36).substr(2, 9)}`,
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

  const addOptionToBlock = (
    blockId: string,
    option: Omit<ItineraryOption, "id">,
  ) => {
    const block = itinerary.value.blocks.find((b) => b.id === blockId);
    if (!block) throw new Error("Block not found");
    if (block.options.length >= 5)
      throw new Error("Max 5 options allowed per block");

    block.options.push({
      ...option,
      id: `OPT-${Math.random().toString(36).substr(2, 9)}`,
    });
  };

  const removeOptionFromBlock = (blockId: string, optionId: string) => {
    const block = itinerary.value.blocks.find((b) => b.id === blockId);
    if (block) {
      block.options = block.options.filter((o) => o.id !== optionId);
    }
  };

  const calculateOptionSellPrice = (netPrice: number) => {
    return netPrice * (1 + itinerary.value.markupPercentage / 100);
  };

  // Helper function: get price range of a block based on its options
  const getBlockPriceRange = (blockId: string) => {
    const block = itinerary.value.blocks.find((b) => b.id === blockId);
    if (!block || block.options.length === 0) return { min: 0, max: 0 };
    const prices = block.options.map((o) =>
      calculateOptionSellPrice(o.netPrice),
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
      const minNet = Math.min(...block.options.map((o) => o.netPrice));
      return total + calculateOptionSellPrice(minNet);
    }, 0);
  });

  const calculatePriceBreakdown = (netPrice: number) => {
    const sellPrice = calculateOptionSellPrice(netPrice);

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
      title: "Nuevo Itinerario",
      clientName: "",
      rooms: [{ adults: 2, children: [] }],
      origin: "",
      markupPercentage: 15,
      blocks: [],
    };
  };

  const triggerAddOption = (option: Omit<ItineraryOption, "id">) => {
    pendingOption.value = option;
    isAddOptionModalOpen.value = true;
  };

  const fetchItinerary = async (id: string) => {
    const { data } = await useApi<Itinerary>(`/api/itineraries/${id}`, {
      key: `itinerary-${id}`,
    });
    if (data.value) {
      itinerary.value = data.value;
    }
  };

  const saveItinerary = () => {
    return useApi<Itinerary>("/api/itineraries", {
      method: "POST",
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
