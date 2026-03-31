<script setup lang="ts">
import { ref, computed } from "vue";
import PaymentMethodSelector from "~/components/b2b/hotel/checkout/PaymentMethodSelector.vue";

const props = defineProps<{
  selectedBookings: {
    id: string;
    titular: string;
    total: number;
  }[];
  pendingCount: number;
}>();

const emit = defineEmits<{
  (e: "selectAll" | "deselectAll" | "pay"): void;
}>();

const showConfirmModal = ref(false);
const isProcessing = ref(false);
const selectedMethod = ref("credit_card");

const totalAmount = computed(() => {
  return props.selectedBookings.reduce((acc, b) => acc + b.total, 0);
});

const handlePay = () => {
  isProcessing.value = true;
  // TODO: Emulate mass payment API call with selectedMethod
  setTimeout(() => {
    isProcessing.value = false;
    showConfirmModal.value = false;
    emit("pay");
  }, 2000);
};
</script>

<template>
  <!-- Sticky bottom bar - only visible when there are selections -->
  <div
    v-if="selectedBookings.length > 0"
    class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t-2 border-primary-500 shadow-2xl shadow-primary/10"
  >
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Left: Selection info -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div
              class="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-credit-card"
                class="w-5 h-5 text-primary-500"
              />
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900 dark:text-white">
                {{ selectedBookings.length }}
                {{
                  selectedBookings.length === 1
                    ? "reserva seleccionada"
                    : "reservas seleccionadas"
                }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                de {{ pendingCount }} pendientes de pago
              </p>
            </div>
          </div>

          <!-- Select/Deselect all -->
          <div
            class="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700"
          >
            <UButton
              v-if="selectedBookings.length < pendingCount"
              size="xs"
              variant="ghost"
              color="primary"
              @click="emit('selectAll')"
            >
              Seleccionar todas
            </UButton>
            <UButton
              v-else
              size="xs"
              variant="ghost"
              color="neutral"
              @click="emit('deselectAll')"
            >
              Deseleccionar todas
            </UButton>
          </div>
        </div>

        <!-- Right: Total + Pay button -->
        <div class="flex items-center gap-6">
          <div class="text-right">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total a pagar
            </p>
            <p
              class="text-2xl font-black text-primary-600 dark:text-primary-400"
            >
              ${{
                totalAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </p>
          </div>
          <UButton
            color="primary"
            size="xl"
            class="font-black uppercase tracking-wider px-8 shadow-lg shadow-primary/30"
            icon="i-heroicons-credit-card"
            @click="showConfirmModal = true"
          >
            Pagar Selección
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <!-- Payment Modal -->
  <UModal v-model:open="showConfirmModal">
    <template #content>
      <div class="p-6">
        <!-- Header -->
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <UIcon
              name="i-heroicons-credit-card"
              class="w-8 h-8 text-primary-600 dark:text-primary-400"
            />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Pago Masivo de Reservas
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <strong>{{ selectedBookings.length }} reservas</strong> · Importe
            total:
          </p>
          <p
            class="text-3xl font-black text-primary-600 dark:text-primary-400 mt-2"
          >
            ${{
              totalAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </p>
        </div>

        <!-- Booking list summary (collapsible) -->
        <div
          class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 max-h-36 overflow-y-auto"
        >
          <p
            class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
          >
            Reservas incluidas
          </p>
          <div
            v-for="booking in selectedBookings"
            :key="booking.id"
            class="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div>
              <span
                class="font-bold text-xs text-primary-600 dark:text-primary-400"
                >{{ booking.id }}</span
              >
              <span class="text-xs text-gray-500 ml-2">{{
                booking.titular
              }}</span>
            </div>
            <span class="font-bold text-xs text-gray-900 dark:text-white"
              >${{
                booking.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}</span
            >
          </div>
        </div>

        <!-- Payment Method Selection -->
        <div class="mb-6">
          <p
            class="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"
          >
            <UIcon name="i-heroicons-wallet" class="w-4 h-4 text-primary-500" />
            Selecciona el método de pago
          </p>
          <PaymentMethodSelector v-model="selectedMethod" />
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <UButton
            block
            variant="outline"
            color="neutral"
            class="font-bold"
            @click="showConfirmModal = false"
          >
            Cancelar
          </UButton>
          <UButton
            block
            color="primary"
            class="font-bold"
            :loading="isProcessing"
            @click="handlePay"
          >
            Confirmar Pago
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
