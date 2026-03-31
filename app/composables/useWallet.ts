import { useState } from "#imports";
import { computed } from "vue";
import type { IWallet } from "#shared/types/wallet";

export function useWallet() {
  const wallet = useState<IWallet | null>("wallet:data", () => null);
  const loading = useState<boolean>("wallet:loading", () => false);
  const error = useState<string | null>("wallet:error", () => null);

  async function fetchWallet() {
    loading.value = true;
    error.value = null;
    try {
      wallet.value = await $fetch<IWallet>("/api/wallet");
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Error al cargar el wallet";
    } finally {
      loading.value = false;
    }
  }

  function hasSufficientFunds(amount: number): boolean {
    if (!wallet.value) return false;
    return wallet.value.balance >= amount;
  }

  const balance = computed(() => wallet.value?.balance ?? 0);
  const creditLine = computed(() => wallet.value?.credit_line ?? null);
  const totalCapacity = computed(
    () => balance.value + (creditLine.value?.available ?? 0),
  );
  const usageLevel = computed(() => {
    if (!creditLine.value || creditLine.value.limit === 0) return 0;
    return (creditLine.value.used / creditLine.value.limit) * 100;
  });
  const isCreditBlocked = computed(
    () => creditLine.value?.status === "blocked",
  );

  function hasSufficientCredit(amount: number): boolean {
    return totalCapacity.value >= amount;
  }

  const lowBalanceThreshold = computed(
    () => wallet.value?.lowBalanceThreshold ?? 0,
  );
  const isLowBalance = computed(
    () => balance.value > 0 && balance.value < lowBalanceThreshold.value,
  );
  const isZeroBalance = computed(() => balance.value === 0);
  const currency = computed(() => wallet.value?.currency ?? "USD");
  const totalDeposited = computed(() => wallet.value?.totalDeposited ?? 0);
  const totalConsumed = computed(() => wallet.value?.totalConsumed ?? 0);
  const lastUpdatedAt = computed(() => wallet.value?.lastUpdatedAt ?? null);
  const transactions = computed(() => wallet.value?.transactions ?? []);

  return {
    wallet,
    loading,
    error,
    balance,
    creditLine,
    totalCapacity,
    usageLevel,
    isCreditBlocked,
    lowBalanceThreshold,
    isLowBalance,
    isZeroBalance,
    currency,
    totalDeposited,
    totalConsumed,
    lastUpdatedAt,
    transactions,
    fetchWallet,
    hasSufficientFunds,
    hasSufficientCredit,
  };
}
