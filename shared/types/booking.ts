import type { PaymentStatus, PaymentMethod } from './payment';

export type BookingStatus = 'confirmed' | 'cancelled' | 'expired';

export interface ICancellationPolicy {
  deadline: string; // ISO datetime
  penalty_amount: string; // decimal string e.g. "0.00"
  description: string;
}

export interface IPassenger {
  first_name: string;
  last_name: string;
  is_child: boolean;
  age?: number;
}

export interface IHotelSnapshot {
  name: string;
  stars: number; // hotel category (1–5)
  image: string | null; // thumbnail URL
  address: string;
}

export interface IRoomDistribution {
  adults: number;
  children: number;
  children_ages?: number[];
}

/** Booking record — created at confirmation, read-only after that. */
export interface IBooking {
  id: number;
  agency: number;
  hotel_name: string;
  room_description: string;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  pax: number;
  net_rate: string; // decimal string
  sell_rate: string; // decimal string
  markup_pct: string; // decimal string
  order_ref: string;
  pnr: string;
  status: BookingStatus;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  // Extended fields (populated at confirmation from BookingFlow)
  passengers: IPassenger[] | null;
  hotel_snapshot: IHotelSnapshot | null;
  cancellation_policies: ICancellationPolicy[] | null;
  payment_status: PaymentStatus | null;
  payment_method: PaymentMethod | null;
  paid_at: string | null; // ISO datetime
  transfer_deadline: string | null; // YYYY-MM-DD
}

/** Lightweight shape used in booking list tables. */
export interface IBookingListItem {
  id: number;
  pnr: string;
  hotel_name: string;
  titular: string; // <-- Added
  order_ref: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  payment_status: PaymentStatus | null;
  sell_rate: string;
  created_at: string;
}
