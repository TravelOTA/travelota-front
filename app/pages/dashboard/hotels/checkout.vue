<script setup lang="ts">
import { useRouter } from "vue-router";
import CheckoutHotelSummary from "~/components/b2b/hotel/checkout/CheckoutHotelSummary.vue";
import CheckoutReservationDetails from "~/components/b2b/hotel/checkout/CheckoutReservationDetails.vue";
import CheckoutCancellationPolicy from "~/components/b2b/hotel/checkout/CheckoutCancellationPolicy.vue";
import CheckoutComments from "~/components/b2b/hotel/checkout/CheckoutComments.vue";
import CheckoutPassengers from "~/components/b2b/hotel/checkout/CheckoutPassengers.vue";
import CheckoutAgencyInfo from "~/components/b2b/hotel/checkout/CheckoutAgencyInfo.vue";
import CheckoutPaymentOptions from "~/components/b2b/hotel/checkout/CheckoutPaymentOptions.vue";
import { computed } from "vue";

definePageMeta({
  layout: "dashboard",
});

const router = useRouter();

// Mock Data
const hotel = ref({
  name: "Iberostar WAVES DOMINICANA",
  stars: 5,
  address:
    "Carretera Arena Gorda Playa Bavaro Punta Cana, Dominican Republic, Playa Bavaro 23000",
  image:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
});

const reservation = ref({
  checkIn: "2026-03-03",
  checkOut: "2026-03-10",
  rooms: [
    {
      id: 1,
      name: "Twin/double room - premium - with lateral sea view - Todo Incluido",
      pax: "2 Adultos",
      price: 3027.93,
    },
  ],
  policyText:
    "En caso de anulación de la reserva se pueden aplicar gastos mínimos en caso de no presentarse se facturará el 100% de la reserva.",
});

const totalPax = ref(2); // Since it's 2 adults

const totalPrice = computed(() => {
  return reservation.value.rooms.reduce((acc, room) => acc + room.price, 0);
});

useHead({
  title: `Checkout - ${hotel.value.name} - TravelOTA B2B`,
});
</script>

<template>
  <div class="max-w-[1000px] mx-auto pb-12 pt-6">
    <!-- Breadcrumb / Back button -->
    <div class="mb-6 flex items-center justify-between">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
        @click="router.back()"
      >
        Volver a Detalles del Hotel
      </UButton>
      <h1
        class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight"
      >
        Confirmar Reserva
      </h1>
    </div>

    <!-- Layout Grid -->
    <div class="flex flex-col gap-6">
      <!-- 1. Hotel Summary -->
      <CheckoutHotelSummary
        :name="hotel.name"
        :stars="hotel.stars"
        :address="hotel.address"
        :image="hotel.image"
      />

      <!-- 2. Reservation Details -->
      <CheckoutReservationDetails
        :check-in="reservation.checkIn"
        :check-out="reservation.checkOut"
        :rooms="reservation.rooms"
      />

      <!-- 3. Cancellation Policy -->
      <CheckoutCancellationPolicy :policy-text="reservation.policyText" />

      <!-- 4. Comments -->
      <CheckoutComments />

      <!-- 5. Passenger Details -->
      <CheckoutPassengers :total-pax="totalPax" />

      <!-- 6. Agency Info -->
      <CheckoutAgencyInfo />

      <!-- 7. Payment Options -->
      <CheckoutPaymentOptions
        :total-price="totalPrice"
        :cancellation-policy="reservation.policyText"
      />
    </div>
  </div>
</template>
