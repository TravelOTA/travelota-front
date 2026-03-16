import type { IBooking } from "../../shared/types/booking";
import type { IWallet } from "../../shared/types/wallet";

export const MOCK_SESSION = {
  agencyId: "AGENCY-001",
  createdBy: "agent@demo.com",
};

const WALLET_SEED: IWallet = {
  creditLimit: 15000,
  currentBalance: 4250,
  availableCredit: 10750,
  transactions: [
    {
      id: "TXN-001",
      type: "charge",
      amount: 2500,
      description: "Reserva TRV-20260301-SEED",
      bookingId: "TRV-20260301-SEED",
      date: "2026-03-01T10:00:00.000Z",
    },
    {
      id: "TXN-002",
      type: "payment",
      amount: 1500, // amounts are always positive; type field conveys direction
      description: "Pago parcial cuenta corriente",
      date: "2026-03-10T14:00:00.000Z",
    },
  ],
};

export async function readBookings(): Promise<IBooking[]> {
  const storage = useStorage("data");
  return (await storage.getItem<IBooking[]>("bookings")) ?? [];
}

export async function writeBookings(bookings: IBooking[]): Promise<void> {
  await useStorage("data").setItem("bookings", bookings);
}

export async function readWallet(): Promise<IWallet> {
  const storage = useStorage("data");
  const stored = await storage.getItem<IWallet>("wallet");
  if (!stored) {
    await storage.setItem("wallet", WALLET_SEED);
    return WALLET_SEED;
  }
  return {
    ...stored,
    availableCredit: stored.creditLimit - stored.currentBalance,
  };
}

export async function writeWallet(wallet: IWallet): Promise<void> {
  await useStorage("data").setItem("wallet", {
    ...wallet,
    availableCredit: wallet.creditLimit - wallet.currentBalance,
  });
}
