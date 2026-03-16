// shared/types/payment.ts
export type PaymentMethod = "card" | "agency_credit" | "deferred" | "transfer";
export type PaymentStatus =
  | "paid"
  | "pending_payment"
  | "pending_transfer"
  | "deferred";

export interface IPaymentRequest {
  bookingId: string;
  method: PaymentMethod;
  cardData?: {
    number: string;
    expiry: string;
    cvv: string;
  };
}

export interface IPaymentResponse {
  status: PaymentStatus;
  paidAt?: string;
  transferDeadline?: string;
  bankDetails?: {
    bank: string;
    account: string;
    reference: string;
  };
}
