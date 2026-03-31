import { computed } from "vue";
import { useState } from "#imports";

export interface QuoteItem {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  location: string;
  roomsDescription: string;
  netPrice: number;
  markupPercentage: number;
  markupFixed: number;
}

export const useQuoter = () => {
  const items = useState<QuoteItem[]>("quoter-items", () => []);
  const globalMarkupPercentage = useState<number>(
    "quoter-global-markup",
    () => 15,
  );

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

  const removeItem = (id: string) => {
    items.value = items.value.filter((i) => i.id !== id);
  };

  const clearQuote = () => {
    items.value = [];
  };

  const calculateItemSellPrice = (item: QuoteItem) => {
    const percentageMarkup = item.netPrice * (item.markupPercentage / 100);
    return item.netPrice + percentageMarkup + item.markupFixed;
  };

  const totalNetPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.netPrice, 0),
  );

  const totalSellPrice = computed(() =>
    items.value.reduce((sum, item) => sum + calculateItemSellPrice(item), 0),
  );

  const totalProfit = computed(
    () => totalSellPrice.value - totalNetPrice.value,
  );

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
