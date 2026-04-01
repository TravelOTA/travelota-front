import type { IBooking } from '../../shared/types/booking';
import type { IDepositRequest, IWallet } from '../../shared/types/wallet';

export const MOCK_SESSION = {
  agencyId: 'AGENCY-001',
  createdBy: 'agent@demo.com',
};

const WALLET_SEED: IWallet = {
  balance: 6300,
  lowBalanceThreshold: 500,
  currency: 'USD',
  totalDeposited: 15000,
  totalConsumed: 8700,
  lastUpdatedAt: '2026-03-22T09:00:00.000Z',
  credit_line: {
    limit: 10000,
    used: 3200,
    available: 6800,
    debt: 3200,
    status: 'active',
  },
  transactions: [
    {
      id: 'TXN-004',
      type: 'charge',
      amount: 1200,
      description: 'Reserva Hotel Meliá',
      bookingId: 'BK-0045',
      date: '2026-03-22T09:00:00.000Z',
      balanceAfter: 6300,
    },
    {
      id: 'TXN-003',
      type: 'deposit',
      amount: 5000,
      description: 'Depósito — Transferencia bancaria',
      date: '2026-03-20T14:00:00.000Z',
      balanceAfter: 7500,
    },
    {
      id: 'TXN-002',
      type: 'refund',
      amount: 2000,
      description: 'Reembolso — Cancelación Hotel NH',
      bookingId: 'BK-0038',
      date: '2026-03-18T11:00:00.000Z',
      balanceAfter: 2500,
    },
    {
      id: 'TXN-001',
      type: 'charge',
      amount: 2500,
      description: 'Reserva Hotel NH',
      bookingId: 'BK-0038',
      date: '2026-03-15T10:00:00.000Z',
      balanceAfter: 500,
    },
  ],
};

export async function readBookings(): Promise<IBooking[]> {
  const storage = useStorage('data');
  const stored = await storage.getItem('bookings');
  return Array.isArray(stored) ? (stored as IBooking[]) : [];
}

export async function writeBookings(bookings: IBooking[]): Promise<void> {
  await useStorage('data').setItem('bookings', bookings);
}

export async function readWallet(): Promise<IWallet> {
  const storage = useStorage('data');
  const stored = await storage.getItem<IWallet>('wallet');
  if (!stored) {
    await storage.setItem('wallet', WALLET_SEED);
    return WALLET_SEED;
  }
  // Backfill credit_line if the cached object predates this field
  if (!stored.credit_line && WALLET_SEED.credit_line) {
    const updated = { ...stored, credit_line: WALLET_SEED.credit_line };
    await storage.setItem('wallet', updated);
    return updated;
  }
  return stored;
}

export async function writeWallet(wallet: IWallet): Promise<void> {
  await useStorage('data').setItem('wallet', wallet);
}

const DEPOSIT_REQUESTS_SEED: IDepositRequest[] = [
  {
    id: 'DEP-001',
    agencyId: 'AGENCY-001',
    agencyName: 'Viajes El Corte Inglés',
    amount: 5000,
    currency: 'USD',
    concept: 'TOT-AGC-0042',
    note: 'Transferencia enviada el 20/03 desde Banco Santander',
    status: 'confirmed',
    createdAt: '2026-03-20T10:00:00.000Z',
    processedAt: '2026-03-20T14:00:00.000Z',
    processedBy: 'admin@travelota.com',
  },
  {
    id: 'DEP-002',
    agencyId: 'AGENCY-001',
    agencyName: 'Viajes El Corte Inglés',
    amount: 3000,
    currency: 'USD',
    concept: 'TOT-AGC-0042',
    status: 'pending',
    createdAt: '2026-03-22T08:00:00.000Z',
  },
];

export async function readDepositRequests(): Promise<IDepositRequest[]> {
  const storage = useStorage('data');
  const stored = await storage.getItem<IDepositRequest[]>('depositRequests');
  if (!stored) {
    await storage.setItem('depositRequests', DEPOSIT_REQUESTS_SEED);
    return DEPOSIT_REQUESTS_SEED;
  }
  return stored;
}

export async function writeDepositRequests(
  requests: IDepositRequest[],
): Promise<void> {
  await useStorage('data').setItem('depositRequests', requests);
}
