// server/api/bookings/index.post.ts
import { z } from "zod";
import { readBookings, writeBookings, MOCK_SESSION } from "../../utils/db";
import { generatePNR } from "../../utils/pnr";
import type { IBooking } from "../../../shared/types/booking";

const TitularSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  apellido: z.string().min(2, "Mínimo 2 caracteres"),
  refAgencia: z.string().optional(),
  notas: z.string().max(500).optional(),
});

const CancellationPolicySchema = z.object({
  refundable: z.boolean(),
  penaltyFrom: z.string().nullable(),
  penalties: z.array(
    z.object({
      from: z.string(),
      percentage: z.number(),
      amount: z.number(),
    }),
  ),
});

const BodySchema = z.object({
  titular: TitularSchema,
  hotel: z.object({
    id: z.string(),
    name: z.string(),
    stars: z.number(),
    image: z.string(),
    address: z.string(),
  }),
  room: z.object({
    id: z.string(),
    name: z.string(),
    regime: z.string(),
    cancellationPolicy: CancellationPolicySchema,
  }),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.array(
    z.object({ adults: z.number(), children: z.array(z.number()) }),
  ),
  totalPrice: z.number().positive(),
  currency: z.string().default("USD"),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = BodySchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: parsed.error.errors.map((e) => e.message).join(", "),
    });
  }

  const newBooking: IBooking = {
    id: generatePNR(),
    status: "confirmed",
    paymentStatus: "pending_payment",
    titular: parsed.data.titular,
    hotel: parsed.data.hotel,
    room: parsed.data.room,
    checkIn: parsed.data.checkIn,
    checkOut: parsed.data.checkOut,
    guests: parsed.data.guests,
    totalPrice: parsed.data.totalPrice,
    currency: parsed.data.currency,
    agencyId: MOCK_SESSION.agencyId,
    createdBy: MOCK_SESSION.createdBy,
    createdAt: new Date().toISOString(),
  };

  const bookings = await readBookings();
  bookings.push(newBooking);
  await writeBookings(bookings);

  setResponseStatus(event, 201);
  return newBooking;
});
