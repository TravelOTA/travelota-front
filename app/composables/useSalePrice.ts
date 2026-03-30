import { computed } from 'vue';
import { useAgency } from '~/composables/useAgency';

export function useSalePrice() {
  const { agency } = useAgency();
  const markup = computed(() => agency.value?.markupPercentage ?? 0);
  const salePrice = (net: number) => net * (1 + markup.value / 100);
  return { salePrice, markup };
}
