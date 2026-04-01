import {
  readDepositRequests,
  writeDepositRequests,
  readWallet,
  writeWallet,
} from '../../../../utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const requests = await readDepositRequests();
  const idx = requests.findIndex((r) => r.id === id);

  const req = requests[idx];
  if (!req) {
    throw createError({
      statusCode: 404,
      message: 'Deposit request not found',
    });
  }

  if (req.status !== 'pending') {
    throw createError({
      statusCode: 409,
      message: 'Request already processed',
    });
  }

  // Mark as confirmed
  requests[idx] = {
    ...req,
    status: 'confirmed' as const,
    processedAt: new Date().toISOString(),
    processedBy: 'admin@travelota.com', // MVP: hardcoded; will come from auth session
  };
  await writeDepositRequests(requests);

  // Update wallet balance
  const wallet = await readWallet();
  const confirmedReq = requests[idx]!;
  const newBalance = wallet.balance + confirmedReq.amount;
  const newTransaction = {
    id: `TXN-${Date.now()}`,
    type: 'deposit' as const,
    amount: req.amount,
    description: `Depósito confirmado — ${req.concept}`,
    date: new Date().toISOString(),
    balanceAfter: newBalance,
  };

  await writeWallet({
    ...wallet,
    balance: newBalance,
    totalDeposited: wallet.totalDeposited + req.amount,
    lastUpdatedAt: new Date().toISOString(),
    transactions: [newTransaction, ...wallet.transactions],
  });

  return { ok: true, newBalance };
});
