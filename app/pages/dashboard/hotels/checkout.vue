<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { navigateTo } from "#imports";
import { useRouter } from "vue-router";
import { useCheckout } from "~/composables/useCheckout";
import CheckoutSidebarSummary from "~/components/b2b/hotel/checkout/CheckoutSidebarSummary.vue";
import CheckoutImportantInfo from "~/components/b2b/hotel/checkout/CheckoutImportantInfo.vue";
import CheckoutCancellationPolicy from "~/components/b2b/hotel/checkout/CheckoutCancellationPolicy.vue";
import CheckoutTitularForm from "~/components/b2b/hotel/checkout/CheckoutTitularForm.vue";
import CheckoutPaymentOptions from "~/components/b2b/hotel/checkout/CheckoutPaymentOptions.vue";

definePageMeta({
  layout: "dashboard",
});

const router = useRouter();

const { selectedHotel, selectedRoom, searchParams, isReady } = useCheckout();

// Redirect to search if no room selected
onMounted(() => {
  if (!isReady.value) {
    navigateTo("/dashboard/hotels");
  }
});

// Template ref to access titular form data
const titularFormRef = ref();

// Map form fields (CheckoutTitularForm uses name/lastName/reference/observations)
// to the titular shape expected by the API
const titular = computed(() => ({
  nombre: titularFormRef.value?.form?.name ?? "",
  apellido: titularFormRef.value?.form?.lastName ?? "",
  refAgencia: titularFormRef.value?.form?.reference ?? undefined,
  notas: titularFormRef.value?.form?.observations ?? undefined,
}));

// Build the hotel shape expected by CheckoutSidebarSummary
const hotel = computed(() => selectedHotel.value);

// Build a pax string from guest data
function buildPax(guests: { adults: number; children: number[] }[]): string {
  if (!guests || guests.length === 0) return "2 Adultos";
  const totalAdults = guests.reduce((acc, g) => acc + g.adults, 0);
  const totalChildren = guests.reduce((acc, g) => acc + g.children.length, 0);
  const parts: string[] = [];
  if (totalAdults > 0)
    parts.push(`${totalAdults} Adulto${totalAdults !== 1 ? "s" : ""}`);
  if (totalChildren > 0)
    parts.push(`${totalChildren} Niño${totalChildren !== 1 ? "s" : ""}`);
  return parts.join(", ") || "2 Adultos";
}

// Build the reservation shape expected by CheckoutSidebarSummary
const reservation = computed(() => {
  if (!selectedRoom.value || !searchParams.value) return null;
  return {
    checkIn: searchParams.value.checkIn,
    checkOut: searchParams.value.checkOut,
    rooms: [
      {
        id: 1,
        name: selectedRoom.value.name,
        pax: buildPax(
          (searchParams.value.rooms ?? [{ adults: 2, children: [] }]).map(
            (r) => ({
              adults: r.adults,
              children: r.children.map((c) =>
                typeof c === "number" ? c : c.age,
              ),
            }),
          ),
        ),
        price: selectedRoom.value.price,
      },
    ],
  };
});

const totalPrice = computed(() => selectedRoom.value?.price ?? 0);

// Derive cancellation policies in the flat format expected by CheckoutCancellationPolicy
const cancellationPolicies = computed(() => {
  const policy = selectedRoom.value?.cancellationPolicy;
  if (!policy) return [];
  if (!policy.refundable) {
    return [
      {
        status: "Sin reembolso",
        fromDate: "-",
        toDate: "-",
        time: "-",
        price: totalPrice.value,
      },
    ];
  }
  return policy.penalties.map((p) => ({
    status: "Con gastos",
    fromDate: p.from,
    toDate: policy.penaltyFrom ?? p.from,
    time: "00:00:00",
    price: p.amount,
  }));
});

useHead({
  title: computed(
    () => `Checkout - ${selectedHotel.value?.name ?? "Hotel"} - TravelOTA B2B`,
  ),
});

// Handle booking confirmed
function onConfirmed(pnr: string) {
  navigateTo(`/dashboard/hotels/booking/${pnr}?from=confirmation`);
}
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
    <div
      v-if="reservation && hotel"
      class="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
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
        <CheckoutImportantInfo :info-text="selectedRoom?.cancellation ?? ''" />

        <!-- 2. Cancellation Policy -->
        <CheckoutCancellationPolicy
          :total="totalPrice"
          :policies="cancellationPolicies"
        />

        <!-- 3. Titular Form & Observations -->
        <CheckoutTitularForm ref="titularFormRef" />

        <!-- 4. Payment Options & Checks -->
        <CheckoutPaymentOptions
          :total-price="totalPrice"
          :titular="titular"
          :cancellation-policy="selectedRoom?.cancellationPolicy"
          @confirmed="onConfirmed"
          @error="(msg) => console.error('[checkout]', msg)"
        />
      </div>
    </div>

    <!-- Loading / redirect state -->
    <div v-else class="flex items-center justify-center py-24">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-primary-500"
      />
    </div>
  </div>
</template>
