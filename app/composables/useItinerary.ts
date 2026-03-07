import { ref, computed } from "vue";

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

export interface Itinerary {
  id?: string;
  title: string;
  clientName: string;
  pax: number;
  markupPercentage: number;
  blocks: ItineraryBlock[];
}

// Global active builder state
const itinerary = ref<Itinerary>({
  title: "Nuevo Itinerario",
  clientName: "",
  pax: 2,
  markupPercentage: 15, // Default 15% margin
  blocks: [],
});

// Global Modal State for Adding Options
const isAddOptionModalOpen = ref(false);
const pendingOption = ref<Omit<ItineraryOption, "id"> | null>(null);

export const useItinerary = () => {
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

  const clearItinerary = () => {
    itinerary.value = {
      title: "Nuevo Itinerario",
      clientName: "",
      pax: 2,
      markupPercentage: 15,
      blocks: [],
    };
  };

  const triggerAddOption = (option: Omit<ItineraryOption, "id">) => {
    pendingOption.value = option;
    isAddOptionModalOpen.value = true;
  };

  return {
    itinerary,
    isAddOptionModalOpen,
    pendingOption,
    addBlock,
    removeBlock,
    addOptionToBlock,
    removeOptionFromBlock,
    calculateOptionSellPrice,
    getBlockPriceRange,
    minItineraryPrice,
    clearItinerary,
    triggerAddOption,
  };
};
