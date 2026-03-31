export type TransactionType = "charge" | "deposit" | "refund";
export type DepositRequestStatus = "pending" | "confirmed" | "rejected";

export interface IDepositRequest {
  id: string;
  agencyId: string;
  agencyName: string;
  amount: number;
  currency: string;
  concept: string; // unique reference e.g. TOT-AGC-0042
  note?: string;
  status: DepositRequestStatus;
  createdAt: string; // ISO datetime
  processedAt?: string; // ISO datetime — set on confirm/reject
  processedBy?: string; // email of SUPER_ADMIN who processed it
}

export interface ITransaction {
  id: string;
  type: TransactionType;
  amount: number; // always positive; type determines direction
  description: string;
  bookingId?: string;
  date: string; // ISO datetime
  balanceAfter: number; // resulting balance after this transaction
}

export interface ICreditLine {
  limit: number;
  used: number;
  available: number;
  debt: number;
  status: 'active' | 'blocked';
}

export interface IWallet {
  balance: number; // current available funds
  lowBalanceThreshold: number; // alert threshold (configured per agency group by SUPER_ADMIN)
  currency: string; // e.g. "USD", "EUR"
  totalDeposited: number; // historical sum of all deposits
  totalConsumed: number; // historical sum of all charges
  lastUpdatedAt: string; // ISO datetime — for "updated N min ago" display
  transactions: ITransaction[];
  credit_line?: ICreditLine; // New field for agency credit line
}
