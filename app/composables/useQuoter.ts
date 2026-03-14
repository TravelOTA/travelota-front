import { ref, computed } from "vue";

export interface QuoteItem {
  id: string; // Unique ID for the quote line
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  location: string;
  roomsDescription: string;
  netPrice: number;
  markupPercentage: number;
  markupFixed: number;
}

// Global state for the Quoter Cart
const items = ref<QuoteItem[]>([]);
const globalMarkupPercentage = ref<number>(15); // Default 15% markup

export const useQuoter = () => {
  // Add a new item to the quote
  const addItem = (
    item: Omit<QuoteItem, "id" | "markupPercentage" | "markupFixed">,
  ) => {
    const newItem: QuoteItem = {
      ...item,
      id: crypto.randomUUID(),
      markupPercentage: globalMarkupPercentage.value,
      markupFixed: 0,
    };
    items.value.push(newItem);
  };

  // Remove an item by its unique quote line ID
  const removeItem = (id: string) => {
    items.value = items.value.filter((i) => i.id !== id);
  };

  // Clear the whole quote cart
  const clearQuote = () => {
    items.value = [];
  };

  // Calculate the individual sell price of an item based on its markup
  const calculateItemSellPrice = (item: QuoteItem) => {
    const percentageMarkup = item.netPrice * (item.markupPercentage / 100);
    return item.netPrice + percentageMarkup + item.markupFixed;
  };

  // Totals
  const totalNetPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.netPrice, 0);
  });

  const totalSellPrice = computed(() => {
    return items.value.reduce(
      (sum, item) => sum + calculateItemSellPrice(item),
      0,
    );
  });

  const totalProfit = computed(() => {
    return totalSellPrice.value - totalNetPrice.value;
  });

  return {
    items,
    globalMarkupPercentage,
    addItem,
    removeItem,
    clearQuote,
    calculateItemSellPrice,
    totalNetPrice,
    totalSellPrice,
    totalProfit,
  };
};
