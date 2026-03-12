<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  bookingId: string;
  hotelName: string;
  reservation: Record<string, unknown>;
  mode?: "voucher" | "invoice";
}>();

const emit = defineEmits(["update:isOpen"]);

// Mock Agency Data
const agency = {
  name: "Viajes El Corte Inglés",
  logo: "https://ui-avatars.com/api/?name=V+C&color=0284c7&background=e0f2fe",
  phone: "+34 91 418 88 00",
  email: "b2b@elcorteingles.es",
};

function printVoucher() {
  window.print();
}
</script>

<template>
  <UModal
    :open="isOpen"
    :ui="{ content: 'sm:max-w-4xl lg:max-w-5xl' }"
    @update:open="emit('update:isOpen', $event)"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3
          class="text-base font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-2 print:hidden"
        >
          <UIcon
            :name="
              mode === 'invoice'
                ? 'i-heroicons-document-currency-dollar'
                : 'i-heroicons-document-text'
            "
            class="w-5 h-5"
          />
          {{ mode === "invoice" ? "Factura de Reserva" : "Voucher de Reserva" }}
          - {{ bookingId }}
        </h3>
        <div class="flex items-center gap-2 print:hidden">
          <UButton
            color="primary"
            variant="solid"
            icon="i-heroicons-printer"
            label="Imprimir PDF"
            @click="printVoucher"
          />
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="emit('update:isOpen', false)"
          />
        </div>
      </div>
    </template>

    <template #body>
      <!-- Voucher Content -->
      <div
        id="voucher-content"
        class="max-w-3xl mx-auto p-12 bg-white text-gray-900 shadow-lg border border-gray-200 mt-2 mb-2 rounded-xl"
      >
        <!-- Header with Agency Branding -->
        <div
          class="flex justify-between items-start border-b border-gray-200 pb-8 mb-8"
        >
          <div class="flex items-center gap-4">
            <img
              :src="agency.logo"
              alt="Logo Agencia"
              class="h-16 w-auto rounded shadow-sm"
            />
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ agency.name }}
              </h2>
              <p class="text-sm text-gray-500">
                Tel: {{ agency.phone }} | {{ agency.email }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <h1
              class="text-3xl font-black text-primary-600 tracking-tighter uppercase"
            >
              {{ mode === "invoice" ? "FACTURA" : "VOUCHER" }}
            </h1>
            <p class="font-medium text-gray-600 mt-1 mb-2">
              Localizador:
              <span class="text-gray-900 font-bold ml-1">{{ bookingId }}</span>
            </p>
            <UBadge color="success" variant="subtle" size="lg"
              >Confirmada</UBadge
            >
          </div>
        </div>

        <!-- Reservation Details -->
        <div class="space-y-8">
          <div class="grid grid-cols-2 gap-8">
            <div>
              <h3
                class="text-sm uppercase tracking-widest font-bold text-gray-400 mb-4 border-b pb-2"
              >
                Datos del Viajero
              </h3>
              <div class="space-y-3">
                <p class="text-gray-800 flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-user"
                    class="w-5 h-5 text-gray-400"
                  />
                  <span class="font-bold">{{ reservation.titular }}</span>
                </p>
              </div>
            </div>

            <div>
              <h3
                class="text-sm uppercase tracking-widest font-bold text-gray-400 mb-4 border-b pb-2"
              >
                Fechas
              </h3>
              <div class="space-y-3">
                <p class="text-gray-800">
                  <span class="font-medium text-gray-500 w-24 inline-block"
                    >Check-In:</span
                  >
                  <span class="font-bold">{{ reservation.checkIn }}</span>
                </p>
                <p class="text-gray-800">
                  <span class="font-medium text-gray-500 w-24 inline-block"
                    >Check-Out:</span
                  >
                  <span class="font-bold">{{ reservation.checkOut }}</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3
              class="text-sm uppercase tracking-widest font-bold text-gray-400 mb-4 border-b pb-2"
            >
              Alojamiento Contratado
            </h3>
            <p class="text-2xl font-black tracking-tight text-gray-900 mb-4">
              {{ hotelName }}
            </p>

            <div class="space-y-3">
              <div
                v-for="(room, index) in reservation.rooms"
                :key="room.id"
                class="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <p
                    class="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1"
                  >
                    Habitación {{ index + 1 }}
                  </p>
                  <p class="font-bold text-gray-900 text-lg">{{ room.name }}</p>
                </div>
                <div class="text-right flex flex-col items-end">
                  <div class="flex items-center gap-2 mb-1">
                    <UIcon
                      name="i-heroicons-users"
                      class="w-5 h-5 text-gray-400"
                    />
                    <p class="text-sm font-bold text-gray-600">
                      {{ room.pax }}
                    </p>
                  </div>
                  <p
                    v-if="mode === 'invoice'"
                    class="text-lg font-black text-gray-900 mt-2"
                  >
                    ${{
                      room.price
                        ? room.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })
                        : "0.00"
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Totals applied only to invoice -->
            <div
              v-if="mode === 'invoice'"
              class="mt-6 border-t border-gray-200 pt-6 flex justify-end"
            >
              <div class="w-64 space-y-3">
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Subtotal:</span>
                  <span class="font-medium"
                    >${{
                      (
                        reservation.rooms.reduce(
                          (a: any, b: any) => a + (b.price || 0),
                          0,
                        ) * 0.9
                      ).toLocaleString("en-US", { minimumFractionDigits: 2 })
                    }}</span
                  >
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Impuestos (10%):</span>
                  <span class="font-medium"
                    >${{
                      (
                        reservation.rooms.reduce(
                          (a: any, b: any) => a + (b.price || 0),
                          0,
                        ) * 0.1
                      ).toLocaleString("en-US", { minimumFractionDigits: 2 })
                    }}</span
                  >
                </div>
                <div
                  class="flex justify-between text-lg font-black text-gray-900 border-t border-gray-200 pt-3"
                >
                  <span>Total:</span>
                  <span class="text-primary-600"
                    >${{
                      reservation.rooms
                        .reduce((a: any, b: any) => a + (b.price || 0), 0)
                        .toLocaleString("en-US", { minimumFractionDigits: 2 })
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div
            class="mt-16 text-center text-xs text-gray-400 uppercase tracking-wider font-bold pt-8 border-t border-gray-100"
          >
            <p>
              Este documento es válido como confirmación formal de su reserva.
            </p>
            <p class="mt-1">
              Impreso por {{ reservation.agent }} el
              {{ new Date().toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style>
@media print {
  /* Hide EVERYTHING body by default */
  body * {
    visibility: hidden;
  }

  .print\:hidden {
    display: none !important;
  }

  /* Make only the voucher content and its children visible */
  #voucher-content,
  #voucher-content * {
    visibility: visible;
  }

  /* Reset the position of the voucher to be flush against the top left */
  #voucher-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
    background: white !important; /* Force white background */
  }

  /* Target Nuxt UI Modal Overlay and forcefully hide or make it transparent */
  div[role="dialog"] > div:first-child,
  .bg-gray-200\/75, /* default backdrop class */
  .dark\:bg-gray-800\/75 {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    background: transparent !important;
  }

  /* Force a white background on the dialog itself */
  div[role="dialog"] {
    background: white !important;
  }

  /* Neutralize dark mode effects strictly when printing */
  html.dark body {
    background-color: white !important;
  }
}
</style>
