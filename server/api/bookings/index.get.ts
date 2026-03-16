// server/api/bookings/index.get.ts
import { readBookings } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let bookings = await readBookings();

  if (query.status) {
    bookings = bookings.filter((b) => b.status === query.status);
  }
  if (query.paymentStatus) {
    bookings = bookings.filter((b) => b.paymentStatus === query.paymentStatus);
  }

  return bookings;
});
