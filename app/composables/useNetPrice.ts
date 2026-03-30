export function useNetPrice() {
  const netPriceVisible = useState('net-price-visible', () => false);
  const toggle = () => {
    netPriceVisible.value = !netPriceVisible.value;
  };
  return { netPriceVisible, toggle };
}
