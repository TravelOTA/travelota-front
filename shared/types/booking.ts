// shared/types/booking.ts
import type { PaymentMethod, PaymentStatus } from './payment';

export type BookingStatus = 'confirmed' | 'cancelled' | 'expired';

export interface ICancellationPolicy {
  refundable: boolean;
  /** YYYY-MM-DD — date when penalty costs begin; null = costs start immediately (non-refundable) */
  penaltyFrom: string | null;
  penalties: Array<{
    from: string; // YYYY-MM-DD
    percentage: number;
    amount: number;
  }>;
}

export interface IBooking {
  id: string; // PNR: TRV-YYYYMMDD-XXXX
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transferDeadline?: string; // YYYY-MM-DD
  paidAt?: string; // ISO datetime
  titular: {
    nombre: string;
    apellido: string;
    refAgencia?: string;
    notas?: string;
  };
  hotel: {
    id: string;
    name: string;
    stars: number;
    image: string;
    address: string;
  };
  room: {
    id: string;
    name: string;
    regime: string;
    cancellationPolicy: ICancellationPolicy;
  };
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: { adults: number; children: number[] }[];
  totalPrice: number;
  currency: string;
  agencyId: string; // set by server, never by client
  createdBy: string; // set by server, never by client
  createdAt: string; // ISO datetime
  order_ref?: string; // used to group multiple bookings in the same transaction
}
