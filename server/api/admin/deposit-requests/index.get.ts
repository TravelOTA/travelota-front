import { readDepositRequests } from '../../../utils/db';

export default defineEventHandler(async () => {
  const requests = await readDepositRequests();
  // Most recent first
  return [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
});
