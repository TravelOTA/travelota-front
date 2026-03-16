// app/composables/useWallet.ts
import { useState } from "#imports";
import { computed } from "vue";
import { apiFetch } from "~/composables/useApi";
import type { IWallet } from "#shared/types/wallet";

export function useWallet() {
  const wallet = useState<IWallet | null>("wallet:data", () => null);
  const loading = useState<boolean>("wallet:loading", () => false);
  const error = useState<string | null>("wallet:error", () => null);

  async function fetchWallet() {
    loading.value = true;
    error.value = null;
    try {
      wallet.value = await apiFetch<IWallet>("/api/wallet");
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Error al cargar el wallet";
    } finally {
      loading.value = false;
    }
  }

  function hasSufficientCredit(amount: number): boolean {
    if (!wallet.value) return false;
    return wallet.value.availableCredit >= amount;
  }

  const availableCredit = computed(() => wallet.value?.availableCredit ?? 0);
  const creditLimit = computed(() => wallet.value?.creditLimit ?? 0);
  const currentBalance = computed(() => wallet.value?.currentBalance ?? 0);
  const creditUsagePercentage = computed(() =>
    creditLimit.value > 0
      ? (currentBalance.value / creditLimit.value) * 100
      : 0,
  );

  return {
    wallet,
    loading,
    error,
    availableCredit,
    creditLimit,
    currentBalance,
    creditUsagePercentage,
    fetchWallet,
    hasSufficientCredit,
  };
}
