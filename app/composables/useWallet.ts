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
  };
}
