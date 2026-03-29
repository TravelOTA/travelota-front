import { getMockBookingSession, deleteMockBookingSession } from "../../../../utils/mock-booking-flow";
import { readBookings, writeBookings, MOCK_SESSION } from "../../../../utils/db";
import { generatePNR } from "../../../../utils/pnr";
import type { IBooking } from "../../../../../shared/types/booking";

export default defineEventHandler(async (event) => {
  const flowId = getRouterParam(event, "id");
  if (!flowId) {
    throw createError({ statusCode: 400, message: "Missing id" });
  }

  const session = await getMockBookingSession(Number(flowId));
  if (!session) {
    throw createError({ statusCode: 404, message: "Session not found" });
  }

  const body = await readBody(event);
  if (!body.order_ref) {
    throw createError({ statusCode: 400, message: "order_ref required" });
  }

  const pnr = generatePNR();

  // Create full persistent mocked booking 
  const newBooking = {
    id: pnr,
    status: "confirmed",
    paymentStatus: "paid", // Simulando que el carrito lo pagó
    titular: {
      nombre: session.passengers?.[0]?.first_name || "Pasajero",
      apellido: session.passengers?.[0]?.last_name || "Mock",
    },
    hotel: session.mockHotel || {
      id: "mock-hotel-001",
      name: "Hotel Genérico Simulado",
      stars: 4,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      address: "Destino Simulado",
    },
    room: session.mockRoom || {
      id: "mock-room-001",
      name: "Habitación Genérica (Mock)",
      regime: "SA",
      cancellationPolicy: {
        refundable: false,
        penaltyFrom: null,
        penalties: [],
      },
    },
    checkIn: session.check_in || "2026-06-01",
    checkOut: session.check_out || "2026-06-05",
    guests: [{ adults: 2, children: [] }],
    totalPrice: session.current_net_rate,
    currency: "USD",
    agencyId: MOCK_SESSION.agencyId,
    createdBy: MOCK_SESSION.createdBy,
    createdAt: new Date().toISOString(),
    order_ref: body.order_ref,
  };

  const bookings = await readBookings();
  bookings.push(newBooking as unknown as IBooking);
  await writeBookings(bookings);

  // Clean the session
  await deleteMockBookingSession(session.id);

  // Latencia transaccional
  await new Promise((resolve) => setTimeout(resolve, 1500));

  setResponseStatus(event, 201);
  return {
    id: session.id,
    status: "confirmed",
    booking: {
      id: Math.floor(Math.random() * 9000), // Este ID interno de B2B provider
      pnr: pnr,
      order_ref: body.order_ref,
    },
  };
});
