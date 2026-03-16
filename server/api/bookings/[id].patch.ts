// server/api/bookings/[id].patch.ts
import { readBookings, writeBookings } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const bookings = await readBookings();
  const idx = bookings.findIndex((b) => b.id === id);

  if (idx === -1) {
    throw createError({ statusCode: 404, message: "Reserva no encontrada" });
  }

  if (body.action === "cancel") {
    if (bookings[idx].status === "cancelled") {
      throw createError({
        statusCode: 409,
        message: "La reserva ya está cancelada",
      });
    }
    bookings[idx].status = "cancelled";
    await writeBookings(bookings);
    return bookings[idx];
  }

  throw createError({ statusCode: 400, message: "Acción no reconocida" });
});
