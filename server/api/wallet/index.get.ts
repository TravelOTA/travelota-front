// server/api/wallet/index.get.ts
import { readWallet } from "../../utils/db";

export default defineEventHandler(async () => {
  return readWallet();
});
