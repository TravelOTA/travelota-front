import type { IDepositRequest } from "../../../shared/types/wallet";
import {
  readDepositRequests,
  writeDepositRequests,
  MOCK_SESSION,
} from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    amount: number;
    currency: string;
    concept: string;
    note?: string;
  }>(event);

  const requests = await readDepositRequests();

  const newRequest: IDepositRequest = {
    id: `DEP-${String(requests.length + 1).padStart(3, "0")}`,
    agencyId: MOCK_SESSION.agencyId,
    agencyName: "Viajes El Corte Inglés", // MVP: hardcoded; will come from agency profile
    amount: body.amount,
    currency: body.currency,
    concept: body.concept,
    note: body.note,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  requests.push(newRequest);
  await writeDepositRequests(requests);

  return newRequest;
});
