<script setup lang="ts">
import { useRouter } from "vue-router";
import CheckoutSidebarSummary from "~/components/b2b/hotel/checkout/CheckoutSidebarSummary.vue";
import CheckoutImportantInfo from "~/components/b2b/hotel/checkout/CheckoutImportantInfo.vue";
import CheckoutCancellationPolicy from "~/components/b2b/hotel/checkout/CheckoutCancellationPolicy.vue";
import CheckoutTitularForm from "~/components/b2b/hotel/checkout/CheckoutTitularForm.vue";
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
    {
      id: 2,
      name: "Premium double room (full double bed) - Todo Incluido",
      pax: "2 Adultos",
      price: 3253.48,
    },
    {
      id: 3,
      name: "Suite - family - Todo Incluido",
      pax: "2 Adultos, 1 Niño",
      price: 4181.59,
    },
  ],
  infoText:
    "Las tarifas no reembolsables no permiten cambios ni cancelaciones. Cualquier modificación o cancelación incurrirá en una penalización del 100% sobre el valor total. Se requiere presentar pasaporte o documento de identidad oficial al realizar el check-in. Es posible que el hotel cobre tasas locales directamente al cliente en destino.",
  policies: [
    {
      status: "Sin gastos",
      fromDate: "03/03/26",
      toDate: "06/04/26",
      time: "23:59",
      price: 0,
    },
    {
      status: "Con gastos",
      fromDate: "07/04/26",
      toDate: "09/04/26",
      time: "00:00:00",
      price: 161.79,
    },
    {
      status: "Con gastos",
      fromDate: "10/04/26",
      toDate: "15/04/26",
      time: "00:00:00",
      price: 809.0,
    },
  ],
  paymentDeadline: "06/04/26",
  cancellationDeadline: "06/04/26",
});

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
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Summary Reservation Data -->
      <div class="lg:col-span-1">
        <div class="sticky top-24">
          <CheckoutSidebarSummary
            :hotel="hotel"
            :reservation="reservation"
            :total-price="totalPrice"
          />
        </div>
      </div>

      <!-- Right Column: Passenger & Payment -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- 1. Important Info -->
        <CheckoutImportantInfo :info-text="reservation.infoText" />

        <!-- 2. Cancellation Policy -->
        <CheckoutCancellationPolicy
          :total="totalPrice"
          :policies="reservation.policies"
        />

        <!-- 3. Titular Form & Observations -->
        <CheckoutTitularForm />

        <!-- 4. Payment Options & Checks -->
        <CheckoutPaymentOptions
          :total-price="totalPrice"
          :payment-deadline="reservation.paymentDeadline"
          :cancellation-deadline="reservation.cancellationDeadline"
        />
      </div>
    </div>
  </div>
</template>
