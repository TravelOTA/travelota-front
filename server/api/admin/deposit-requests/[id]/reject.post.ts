import {
  readDepositRequests,
  writeDepositRequests,
} from '../../../../utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const requests = await readDepositRequests();
  const idx = requests.findIndex((r) => r.id === id);

  if (idx === -1) {
    throw createError({
      statusCode: 404,
      message: 'Deposit request not found',
    });
  }
  if (requests[idx].status !== 'pending') {
    throw createError({
      statusCode: 409,
      message: 'Request already processed',
    });
  }

  requests[idx] = {
    ...requests[idx],
    status: 'rejected',
    processedAt: new Date().toISOString(),
    processedBy: 'admin@travelota.com',
  };
  await writeDepositRequests(requests);

  return { ok: true };
});
