<script setup lang="ts">
import { ref, computed } from "vue";
import { useNetPrice } from '~/composables/useNetPrice';
import { useSalePrice } from '~/composables/useSalePrice';

const { t } = useI18n();
import PaymentMethodSelector from "~/components/b2b/hotel/checkout/PaymentMethodSelector.vue";

const props = defineProps<{
  paymentStatus: string; // 'Pagada' | 'Pendiente Pago'
  totalPrice: number;
  paymentDeadline?: string;
  paidDate?: string;
}>();

const emit = defineEmits<{
  (e: "pay"): void;
}>();

const { netPriceVisible } = useNetPrice();
const { salePrice } = useSalePrice();

const isPaid = computed(() => props.paymentStatus === "Pagada");

const selectedMethod = ref("credit_card");
const isProcessing = ref(false);

const handlePay = () => {
  isProcessing.value = true;
  // TODO: Emulate payment call
  setTimeout(() => {
    isProcessing.value = false;
    emit("pay");
  }, 1500);
};
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5"
  >
    <h3
      class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
    >
      <UIcon name="i-heroicons-credit-card" class="w-5 h-5 text-primary-500" />
      {{ t('hotels.payment.title') }}
    </h3>

    <!-- Reserva ya pagada: Mensaje informativo -->
    <div
      v-if="isPaid"
      class="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-5 text-center"
    >
      <div
        class="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-3"
      >
        <UIcon
          name="i-heroicons-check-circle-solid"
          class="w-7 h-7 text-green-600 dark:text-green-400"
        />
      </div>
      <p class="text-base font-bold text-green-800 dark:text-green-400 mb-1">
        {{ t('hotels.payment.paid') }}
      </p>
      <p class="text-sm text-green-700 dark:text-green-300">
        {{ t('hotels.payment.paidDescription') }}
      </p>
      <p
        v-if="paidDate"
        class="text-xs text-green-600 dark:text-green-400 mt-2"
      >
        {{ t('hotels.payment.paidDate', { date: paidDate }) }}
      </p>
      <div
        class="mt-4 pt-3 border-t border-green-200 dark:border-green-800 flex flex-col items-center justify-center gap-1"
      >
        <div class="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
          <span class="font-medium">{{ t('hotels.payment.paidAmount') }}</span>
          <span class="font-black text-lg text-green-800 dark:text-green-400">
            ${{
              salePrice(totalPrice).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </span>
        </div>
        <span v-if="netPriceVisible" class="text-[10px] text-green-600/70 dark:text-green-400/50 font-medium">
          neto ${{ totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </span>
      </div>
    </div>

    <!-- Reserva pendiente de pago -->
    <template v-else>
      <!-- Fecha límite -->
      <div
        v-if="paymentDeadline"
        class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4 flex items-center gap-3"
      >
        <UIcon
          name="i-heroicons-clock"
          class="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0"
        />
        <div class="text-sm">
          <span class="text-amber-700 dark:text-amber-300"
            >{{ t('hotels.checkout.paymentDeadline') }}
          </span>
          <span class="font-bold text-amber-800 dark:text-amber-200">{{
            paymentDeadline
          }}</span>
        </div>
      </div>

      <!-- Importe a pagar -->
      <div
        class="flex items-center justify-between mb-5 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
      >
        <span class="text-sm font-bold text-gray-500 uppercase tracking-wider"
          >{{ t('hotels.payment.pendingAmount') }}</span
        >
        <div class="text-right">
          <p class="text-2xl font-black text-primary-600 dark:text-primary-400">
            ${{
              salePrice(totalPrice).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </p>
          <p v-if="netPriceVisible" class="text-xs text-gray-400 font-medium mt-0.5">
            neto ${{ totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </p>
        </div>
      </div>

      <!-- Método de pago (shared component) -->
      <div class="mb-5">
        <PaymentMethodSelector v-model="selectedMethod" />
      </div>

      <!-- Botón Pagar -->
      <UButton
        block
        size="xl"
        color="primary"
        class="font-black text-lg py-3 shadow-lg hover:shadow-xl transition-shadow uppercase tracking-wider"
        :loading="isProcessing"
        @click="handlePay"
      >
        {{ t('hotels.payment.payNow') }}
      </UButton>
    </template>
  </div>
</template>
