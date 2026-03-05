<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import CheckoutSidebarSummary from "~/components/b2b/hotel/checkout/CheckoutSidebarSummary.vue";
import BookingStatusHero from "~/components/b2b/hotel/checkout/BookingStatusHero.vue";
import BookingCancellation from "~/components/b2b/hotel/checkout/BookingCancellation.vue";
import BookingPayment from "~/components/b2b/hotel/checkout/BookingPayment.vue";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();

// Determine origin: 'confirmation' (from checkout) vs 'detail' (from bookings list)
const origin = computed(() =>
  route.query.from === "confirmation" ? "confirmation" : "detail",
);

// Mock Data — In a real app this would come from an API based on route.params.id
const bookingId = (route.params.id as string) || "TRV-987654321";

interface BookingMeta {
  status: string;
  paymentStatus: string;
  paidDate: string | null;
  paymentDeadline: string | null;
  cancelledDate: string | null;
}

// Mock: Different data depending on the booking ID for demo purposes
const bookingDataMap: Record<string, BookingMeta> = {
  "TRV-987654321": {
    status: "Confirmada",
    paymentStatus: "Pagada",
    paidDate: "02/03/2026 16:00",
    paymentDeadline: "01/03/2026",
    cancelledDate: null,
  },
  "TRV-123456789": {
    status: "Confirmada",
    paymentStatus: "Pendiente Pago",
    paidDate: null,
    paymentDeadline: "10/05/2026",
    cancelledDate: null,
  },
  "TRV-456789123": {
    status: "Vencida",
    paymentStatus: "Pendiente Pago",
    paidDate: null,
    paymentDeadline: "15/02/2026",
    cancelledDate: null,
  },
  "TRV-789123456": {
    status: "Cancelada",
    paymentStatus: "Pagada",
    paidDate: "05/12/2025 17:00",
    paymentDeadline: null,
    cancelledDate: "10/12/2025",
  },
};

const bookingMeta = computed(() => {
  return (
    bookingDataMap[bookingId] || {
      status: "Confirmada",
      paymentStatus: "Pagada",
      paidDate: "02/03/2026 16:00",
      paymentDeadline: "01/03/2026",
      cancelledDate: null,
    }
  );
});

const hotel = ref({
  name: "Iberostar WAVES DOMINICANA",
  stars: 5,
  address: "Carretera Arena Gorda Playa Bavaro Punta Cana, Dominican Republic",
  image:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
});

const reservation = ref({
  checkIn: "2026-03-03",
  checkOut: "2026-03-10",
  titular: "Juan Pérez",
  agencyReference: "Ref-12345",
  agent: "María Gómez",
  createdDate: "02/03/2026 15:30",
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
  ],
});

const totalPrice = computed(() => {
  return reservation.value.rooms.reduce((acc, room) => acc + room.price, 0);
});

// Mock cancellation policies
const cancellationPolicies = [
  {
    status: "Sin gastos",
    fromDate: "20/02/2026",
    toDate: "25/02/2026",
    time: "23:59 CET",
    price: 0,
  },
  {
    status: "50% del total",
    fromDate: "26/02/2026",
    toDate: "28/02/2026",
    time: "23:59 CET",
    price: 3140.71,
  },
  {
    status: "100% del total",
    fromDate: "01/03/2026",
    toDate: "03/03/2026",
    time: "23:59 CET",
    price: 6281.41,
  },
];

// Computed flags for conditional rendering
const showCancellation = computed(() => {
  return (
    bookingMeta.value.status !== "Cancelada" &&
    bookingMeta.value.status !== "Vencida"
  );
});

useHead({
  title: `Reserva ${bookingId} - TravelOTA B2B`,
});
</script>

<template>
  <div class="max-w-[1000px] mx-auto pb-12 pt-6">
    <!-- Dynamic Status Hero -->
    <BookingStatusHero
      :origin="origin"
      :booking-status="bookingMeta.status"
      :payment-status="bookingMeta.paymentStatus"
      :booking-id="bookingId"
      :payment-deadline="bookingMeta.paymentDeadline"
      :cancelled-date="bookingMeta.cancelledDate"
    />

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: PNR Data, Payment, Cancellation & Action Buttons -->
      <div class="lg:col-span-2 flex flex-col gap-6 order-last lg:order-none">
        <!-- PNR Card -->
        <div
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm"
        >
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
          >
            <div>
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
              >
                Localizador de Reserva (PNR)
              </p>
              <h2
                class="text-3xl font-black text-primary-600 dark:text-primary-400 tracking-tight flex items-center gap-2"
              >
                {{ bookingId }}
                <UBadge
                  :color="
                    bookingMeta.status === 'Confirmada'
                      ? 'success'
                      : bookingMeta.status === 'Cancelada'
                        ? 'error'
                        : 'warning'
                  "
                  variant="soft"
                  class="ml-2 px-2 py-1 text-xs uppercase tracking-wider font-bold"
                >
                  {{ bookingMeta.status }}
                </UBadge>
                <UBadge
                  v-if="bookingMeta.status !== 'Cancelada'"
                  :color="
                    bookingMeta.paymentStatus === 'Pagada'
                      ? 'success'
                      : 'warning'
                  "
                  variant="subtle"
                  class="px-2 py-1 text-xs uppercase tracking-wider font-bold"
                >
                  {{ bookingMeta.paymentStatus }}
                </UBadge>
              </h2>
            </div>
          </div>

          <hr class="border-gray-100 dark:border-gray-800 mb-6" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
              >
                Titular de la Reserva
              </p>
              <p
                class="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2"
              >
                <UIcon name="i-heroicons-user" class="w-4 h-4 text-gray-400" />
                {{ reservation.titular }}
              </p>
            </div>
            <div>
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
              >
                Referencia Agencia
              </p>
              <p class="font-bold text-gray-900 dark:text-white text-lg">
                {{ reservation.agencyReference || "N/A" }}
              </p>
            </div>
            <div>
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
              >
                Email Confirmación
              </p>
              <p
                class="text-gray-900 dark:text-gray-300 flex items-center gap-2"
              >
                <UIcon
                  name="i-heroicons-envelope"
                  class="w-4 h-4 text-gray-400"
                />
                info@agencia-viajes.com
              </p>
            </div>
            <div>
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
              >
                Agente Responsable
              </p>
              <p class="text-gray-900 dark:text-gray-300">
                {{ reservation.agent }}
              </p>
            </div>
            <div class="md:col-span-2">
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1"
              >
                Fecha de Creación
              </p>
              <p
                class="text-gray-900 dark:text-gray-300 flex items-center gap-2"
              >
                <UIcon
                  name="i-heroicons-calendar-days"
                  class="w-4 h-4 text-gray-400"
                />
                {{ reservation.createdDate }}
              </p>
            </div>
          </div>
        </div>

        <!-- Payment Status Component (always visible, adapts to paid or pending) -->
        <BookingPayment
          v-if="bookingMeta.status !== 'Vencida'"
          :payment-status="bookingMeta.paymentStatus"
          :total-price="totalPrice"
          :payment-deadline="bookingMeta.paymentDeadline"
          :paid-date="bookingMeta.paidDate"
        />

        <!-- Cancellation Component (hidden for already cancelled or expired) -->
        <BookingCancellation
          v-if="showCancellation"
          :booking-status="bookingMeta.status"
          :total-price="totalPrice"
          :policies="cancellationPolicies"
        />

        <!-- Already cancelled info -->
        <BookingCancellation
          v-if="bookingMeta.status === 'Cancelada'"
          :booking-status="bookingMeta.status"
          :total-price="totalPrice"
          :policies="cancellationPolicies"
        />

        <!-- B2B Actions Card -->
        <div
          class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
        >
          <h3 class="font-bold text-gray-900 dark:text-white mb-4">
            Documentos y Acciones
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UButton
              block
              color="primary"
              variant="outline"
              icon="i-heroicons-document-arrow-down"
              class="font-bold justify-start py-3"
            >
              <div class="text-left">
                <span class="block">Descargar Voucher</span>
                <span class="block text-[10px] font-normal opacity-80 mt-0.5"
                  >PDF Cliente Final (Sin Precio)</span
                >
              </div>
            </UButton>

            <UButton
              block
              color="primary"
              variant="solid"
              icon="i-heroicons-document-currency-dollar-solid"
              class="font-bold justify-start py-3"
            >
              <div class="text-left">
                <span class="block">Descargar Factura</span>
                <span class="block text-[10px] font-normal opacity-90 mt-0.5"
                  >PDF Interno Agencia (Con Precio)</span
                >
              </div>
            </UButton>
          </div>

          <div class="mt-6 flex justify-center gap-4">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-arrow-left"
              class="text-gray-500 font-bold uppercase tracking-wider text-xs"
              @click="router.push('/dashboard/bookings')"
            >
              Volver a Mis Reservas
            </UButton>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-magnifying-glass"
              class="text-gray-500 font-bold uppercase tracking-wider text-xs"
              @click="router.push('/dashboard')"
            >
              Nueva Búsqueda
            </UButton>
          </div>
        </div>
      </div>

      <!-- Right Column: Hotel Summary (Reusing Sidebar) -->
      <div
        class="lg:col-span-1 border-gray-200 lg:border-l pl-0 lg:pl-8 mt-8 lg:mt-0"
      >
        <h3
          class="font-black tracking-tight text-gray-900 dark:text-white text-xl mb-4"
        >
          Detalle Solicitado
        </h3>
        <CheckoutSidebarSummary
          :hotel="hotel"
          :reservation="reservation"
          :total-price="totalPrice"
        />
      </div>
    </div>
  </div>
</template>
