// app/composables/useCheckout.ts
import { useState } from "#imports";
import { computed } from "vue";
import { apiFetch } from "~/composables/useApi";
import type { IBooking } from "#shared/types/booking";
import type { PaymentMethod, IPaymentResponse } from "#shared/types/payment";
import type { HotelRoomOffer } from "~/composables/useHotels";
import type { HotelSearchParams } from "~/composables/useHotelSearch";

type HotelSummary = {
  id: string | number;
  name: string;
  stars: number;
  image: string;
  address: string;
};

export function useCheckout() {
  const selectedHotel = useState<HotelSummary | null>(
    "checkout:hotel",
    () => null,
  );
  const selectedRoom = useState<HotelRoomOffer | null>(
    "checkout:room",
    () => null,
  );
  const searchParams = useState<HotelSearchParams | null>(
    "checkout:search",
    () => null,
  );
  const isSubmitting = useState<boolean>("checkout:submitting", () => false);
  const submitError = useState<string | null>("checkout:error", () => null);

  const isReady = computed(
    () =>
      selectedHotel.value !== null &&
      selectedRoom.value !== null &&
      searchParams.value !== null,
  );

  function selectRoom(
    hotel: HotelSummary,
    room: HotelRoomOffer,
    params: HotelSearchParams,
  ) {
    selectedHotel.value = hotel;
    selectedRoom.value = room;
    searchParams.value = params;
    submitError.value = null;
  }

  function clearCheckout() {
    selectedHotel.value = null;
    selectedRoom.value = null;
    searchParams.value = null;
    isSubmitting.value = false;
    submitError.value = null;
  }

  async function confirmBooking(
    titular: {
      nombre: string;
      apellido: string;
      refAgencia?: string;
      notas?: string;
    },
    paymentMethod: PaymentMethod,
    cardData?: { number: string; expiry: string; cvv: string },
  ): Promise<string> {
    if (!selectedHotel.value || !selectedRoom.value || !searchParams.value) {
      throw new Error("No hay habitación seleccionada");
    }

    isSubmitting.value = true;
    submitError.value = null;

    try {
      const hotel = selectedHotel.value;
      const room = selectedRoom.value;
      const params = searchParams.value;

      // 1. Create booking
      const booking = await apiFetch<IBooking>("/api/bookings", {
        method: "POST",
        body: {
          titular,
          hotel: {
            id: String(hotel.id),
            name: hotel.name,
            stars: hotel.stars,
            image: hotel.image,
            address: hotel.address ?? "",
          },
          room: {
            id: String(room.name), // use name as id for mock data
            name: room.name,
            regime: room.regimen,
            cancellationPolicy: room.cancellationPolicy,
          },
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          guests: (params.rooms ?? [{ adults: 2, children: [] }]).map((r) => ({
            adults: r.adults,
            children: r.children.map((c) =>
              typeof c === "number" ? c : (c as { age: number }).age,
            ),
          })),
          totalPrice: room.price,
          currency: "USD",
        },
      });

      // 2. Process payment
      await apiFetch<IPaymentResponse>("/api/payments", {
        method: "POST",
        body: {
          bookingId: booking.id,
          method: paymentMethod,
          ...(cardData ? { cardData } : {}),
        },
      });

      clearCheckout();
      return booking.id;
    } catch (err) {
      submitError.value =
        err instanceof Error ? err.message : "Error al confirmar la reserva";
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    selectedHotel,
    selectedRoom,
    searchParams,
    isSubmitting,
    submitError,
    isReady,
    selectRoom,
    clearCheckout,
    confirmBooking,
  };
}
