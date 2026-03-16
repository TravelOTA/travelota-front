// server/api/bookings/[id].get.ts
import { readBookings } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const bookings = await readBookings();
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    throw createError({ statusCode: 404, message: "Reserva no encontrada" });
  }

  return booking;
});
