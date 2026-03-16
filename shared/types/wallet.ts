// shared/types/wallet.ts
export interface ITransaction {
  id: string;
  type: "charge" | "payment" | "refund";
  amount: number;
  description: string;
  bookingId?: string;
  date: string; // ISO datetime
}

export interface IWallet {
  creditLimit: number;
  currentBalance: number; // accumulated debt
  availableCredit: number; // creditLimit - currentBalance
  transactions: ITransaction[];
}
