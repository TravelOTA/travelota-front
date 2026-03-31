import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";

import { useWallet } from "~/composables/useWallet";
import type { IWallet } from "#shared/types/wallet";

vi.mock("#imports", async (importOriginal) => {
  const actual = await importOriginal<typeof import("#imports")>();
  return {
    ...actual,
    useState: vi.fn((key: string, init: () => unknown) => ref(init())),
  };
});

const mockFetch = vi.fn();
vi.stubGlobal("$fetch", mockFetch);

const BASE_WALLET: IWallet = {
  balance: 6300,
  lowBalanceThreshold: 500,
  currency: "USD",
  totalDeposited: 15000,
  totalConsumed: 8700,
  lastUpdatedAt: "2026-03-22T09:00:00.000Z",
  transactions: [],
};

describe("useWallet", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("starts with null wallet and zero balance", () => {
    const { wallet, balance } = useWallet();
    expect(wallet.value).toBeNull();
    expect(balance.value).toBe(0);
  });

  it("isLowBalance is false when balance > threshold", async () => {
    mockFetch.mockResolvedValueOnce({ ...BASE_WALLET, balance: 6300, lowBalanceThreshold: 500 });
    const { fetchWallet, isLowBalance } = useWallet();
    await fetchWallet();
    expect(isLowBalance.value).toBe(false);
  });

  it("isLowBalance is true when 0 < balance < threshold", async () => {
    mockFetch.mockResolvedValueOnce({ ...BASE_WALLET, balance: 300, lowBalanceThreshold: 500 });
    const { fetchWallet, isLowBalance } = useWallet();
    await fetchWallet();
    expect(isLowBalance.value).toBe(true);
  });

  it("isLowBalance is false when balance equals zero (handled by isZeroBalance)", async () => {
    mockFetch.mockResolvedValueOnce({ ...BASE_WALLET, balance: 0 });
    const { fetchWallet, isLowBalance, isZeroBalance } = useWallet();
    await fetchWallet();
    expect(isLowBalance.value).toBe(false);
    expect(isZeroBalance.value).toBe(true);
  });

  it("hasSufficientFunds returns true when balance >= amount", async () => {
    mockFetch.mockResolvedValueOnce({ ...BASE_WALLET, balance: 1000 });
    const { fetchWallet, hasSufficientFunds } = useWallet();
    await fetchWallet();
    expect(hasSufficientFunds(1000)).toBe(true);
    expect(hasSufficientFunds(1001)).toBe(false);
  });

  it("hasSufficientFunds returns false when wallet is null", () => {
    const { hasSufficientFunds } = useWallet();
    expect(hasSufficientFunds(100)).toBe(false);
  });

  it("fetchWallet sets error on failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const { fetchWallet, error } = useWallet();
    await fetchWallet();
    expect(error.value).toBe("Network error");
  });

  it("totalDeposited and totalConsumed are exposed correctly", async () => {
    mockFetch.mockResolvedValueOnce(BASE_WALLET);
    const { fetchWallet, totalDeposited, totalConsumed } = useWallet();
    await fetchWallet();
    expect(totalDeposited.value).toBe(15000);
    expect(totalConsumed.value).toBe(8700);
  });
});
