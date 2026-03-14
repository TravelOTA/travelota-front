import { computed } from "vue";
import { useState } from "#imports";

export interface WalletTransaction {
  id: string;
  date: string;
  type: "charge" | "payment" | "refund";
  amount: number;
  description: string;
  reference?: string;
}

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "TXN-001",
    date: "2026-03-01T10:30:00Z",
    type: "payment",
    amount: 5000,
    description: "Pago de liquidación mes anterior",
    reference: "TRF-987654321",
  },
  {
    id: "TXN-002",
    date: "2026-03-02T14:15:00Z",
    type: "charge",
    amount: 1250,
    description: "Reserva de Hotel - Hilton Madrid",
    reference: "BKG-102938",
  },
  {
    id: "TXN-003",
    date: "2026-03-03T09:45:00Z",
    type: "charge",
    amount: 800,
    description: "Reserva de Hotel - Meliá Barcelona",
    reference: "BKG-102939",
  },
  {
    id: "TXN-004",
    date: "2026-03-05T16:20:00Z",
    type: "charge",
    amount: 2200,
    description: "Reserva de Hotel - W Paris",
    reference: "BKG-102940",
  },
];

export const useWallet = () => {
  const creditLimit = useState<number>("wallet-credit-limit", () => 15000);
  const currentBalance = useState<number>("wallet-current-balance", () => 4250);
  const transactions = useState<WalletTransaction[]>(
    "wallet-transactions",
    () => MOCK_TRANSACTIONS,
  );

  const availableCredit = computed(
    () => creditLimit.value - currentBalance.value,
  );
  const creditUsagePercentage = computed(() => {
    if (creditLimit.value === 0) return 0;
    return Math.round((currentBalance.value / creditLimit.value) * 100);
  });

  const addTransaction = (txn: Omit<WalletTransaction, "id" | "date">) => {
    const newTxn: WalletTransaction = {
      ...txn,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    transactions.value.unshift(newTxn);

    if (txn.type === "charge") {
      currentBalance.value += txn.amount;
    } else if (txn.type === "payment" || txn.type === "refund") {
      currentBalance.value = Math.max(0, currentBalance.value - txn.amount);
    }
  };

  const hasSufficientCredit = (amount: number) =>
    availableCredit.value >= amount;

  return {
    creditLimit,
    currentBalance,
    availableCredit,
    creditUsagePercentage,
    transactions,
    addTransaction,
    hasSufficientCredit,
  };
};
