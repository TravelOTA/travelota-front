// server/api/payments/index.post.ts
import { z } from "zod";
import {
  readBookings,
  writeBookings,
  readWallet,
  writeWallet,
} from "../../utils/db";
import type { IPaymentResponse } from "../../../shared/types/payment";

// ── Date helpers ──────────────────────────────────────────────────────────────
function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addCalendarDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── Schema ────────────────────────────────────────────────────────────────────
const BodySchema = z.object({
  bookingId: z.string(),
  method: z.enum(["card", "agency_credit", "deferred", "transfer"]),
  cardData: z
    .object({
      number: z.string().regex(/^\d{16}$/, "Número de tarjeta inválido"),
      expiry: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Fecha de expiración inválida"),
      cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido"),
    })
    .optional(),
});

// ── Handler ───────────────────────────────────────────────────────────────────
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = BodySchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: parsed.error.errors.map((e) => e.message).join(", "),
    });
  }

  const { bookingId, method, cardData } = parsed.data;
  const bookings = await readBookings();
  const idx = bookings.findIndex((b) => b.id === bookingId);

  if (idx === -1) {
    throw createError({ statusCode: 404, message: "Reserva no encontrada" });
  }

  const booking = bookings[idx];

  if (booking.status === "cancelled") {
    throw createError({
      statusCode: 409,
      message: "No se puede pagar una reserva cancelada",
    });
  }
  if (booking.paymentStatus === "paid") {
    throw createError({
      statusCode: 409,
      message: "Esta reserva ya fue pagada",
    });
  }

  const policy = booking.room.cancellationPolicy;
  const today = todayLocal();
  const transferDeadline = addCalendarDays(3);

  // ── Validate payment method is allowed ────────────────────────────────────
  const hasImmediateCosts =
    !policy.refundable ||
    policy.penaltyFrom === null ||
    policy.penaltyFrom <= today;
  const hasImmediateCostsByTransfer =
    !policy.refundable ||
    policy.penaltyFrom === null ||
    policy.penaltyFrom <= transferDeadline;

  if (method === "deferred" && hasImmediateCosts) {
    throw createError({
      statusCode: 422,
      message:
        "No se puede aplazar el pago: la reserva tiene gastos de cancelación inmediatos",
    });
  }
  if (method === "transfer" && hasImmediateCostsByTransfer) {
    throw createError({
      statusCode: 422,
      message:
        "No se puede pagar por transferencia: la fecha de gastos cae antes del plazo de transferencia",
    });
  }

  // ── Process by method ─────────────────────────────────────────────────────
  let response: IPaymentResponse;

  if (method === "card") {
    if (!cardData)
      throw createError({
        statusCode: 400,
        message: "Datos de tarjeta requeridos",
      });
    const [mm, yy] = cardData.expiry.split("/").map(Number);
    const expDate = new Date(2000 + yy, mm, 1);
    if (expDate < new Date()) {
      throw createError({
        statusCode: 422,
        message: "La tarjeta está vencida",
      });
    }
    bookings[idx].paymentStatus = "paid";
    bookings[idx].paymentMethod = "card";
    bookings[idx].paidAt = new Date().toISOString();
    response = { status: "paid", paidAt: bookings[idx].paidAt };
  } else if (method === "agency_credit") {
    const wallet = await readWallet();
    if (wallet.availableCredit < booking.totalPrice) {
      throw createError({ statusCode: 422, message: "Crédito insuficiente" });
    }
    wallet.currentBalance += booking.totalPrice;
    wallet.transactions.push({
      id: `TXN-${Date.now()}`,
      type: "charge",
      amount: booking.totalPrice,
      description: `Reserva ${booking.id}`,
      bookingId: booking.id,
      date: new Date().toISOString(),
    });
    await writeWallet(wallet);
    bookings[idx].paymentStatus = "paid";
    bookings[idx].paymentMethod = "agency_credit";
    bookings[idx].paidAt = new Date().toISOString();
    response = { status: "paid", paidAt: bookings[idx].paidAt };
  } else if (method === "deferred") {
    bookings[idx].paymentStatus = "deferred";
    bookings[idx].paymentMethod = "deferred";
    response = { status: "deferred" };
  } else {
    // transfer
    bookings[idx].paymentStatus = "pending_transfer";
    bookings[idx].paymentMethod = "transfer";
    bookings[idx].transferDeadline = transferDeadline;
    response = {
      status: "pending_transfer",
      transferDeadline,
      bankDetails: {
        bank: "Banco Popular Dominicano",
        account: "012-345678-9",
        reference: booking.id,
      },
    };
  }

  await writeBookings(bookings);
  return response;
});
