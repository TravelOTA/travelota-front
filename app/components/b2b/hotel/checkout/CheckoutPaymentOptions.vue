<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import PaymentMethodSelector from "~/components/b2b/hotel/checkout/PaymentMethodSelector.vue";

defineProps<{
  totalPrice: number;
  paymentDeadline: string;
  cancellationDeadline: string;
}>();

const selectedMethod = ref("pay_later");

const acceptConditions = ref(false);
const acceptPrivacy = ref(false);

const isBookEnabled = computed(() => {
  return acceptConditions.value && acceptPrivacy.value;
});

const isProcessing = ref(false);

const router = useRouter();

const submitBooking = () => {
  if (!isBookEnabled.value) return;
  isProcessing.value = true;
  // TODO: Emulate booking call
  setTimeout(() => {
    isProcessing.value = false;
    router.push("/dashboard/hotels/booking/TRV-987654321?from=confirmation");
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
      Métodos de Pago
    </h3>

    <!-- Payment Options (shared component with pay-later option) -->
    <div class="mb-6">
      <PaymentMethodSelector
        v-model="selectedMethod"
        show-pay-later
        :total-price="totalPrice"
        :payment-deadline="paymentDeadline"
        :cancellation-deadline="cancellationDeadline"
      />
    </div>

    <!-- Legal Terms & Checks -->
    <div
      class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-6 border border-gray-100 dark:border-gray-700/50"
    >
      <p
        class="text-xs text-gray-500 dark:text-gray-400 text-justify mb-4 leading-relaxed tracking-tight"
      >
        Los datos personales recogidos serán tratados conforme a la legislación
        vigente con las finalidades de gestión de la relación con clientes y
        gestión de reservas, siendo por tanto la legitimación para el
        tratamiento de los datos personales la ejecución del presente contrato
        de reserva hotelera y su consentimiento para la recepción de
        información. Así mismo le informamos que los datos recogidos serán
        comunicados a los hoteles y en su caso terceros responsables encargados
        de prestarle los servicios contratados. Esta comunicación puede implicar
        la transferencia internacional de datos si su reserva o servicio
        contratado se encuentra fuera de Estados Unidos.
      </p>

      <div class="flex flex-col gap-2">
        <UCheckbox
          v-model="acceptConditions"
          label="He leído y acepto las Condiciones Generales y Gastos de Cancelación"
        />
        <UCheckbox
          v-model="acceptPrivacy"
          label="He leído y acepto las Políticas de Privacidad"
        />
      </div>
    </div>

    <!-- Submit Button -->
    <UButton
      block
      size="xl"
      color="primary"
      class="font-black text-lg py-3 shadow-lg hover:shadow-xl transition-shadow uppercase tracking-wider disabled:opacity-50"
      :loading="isProcessing"
      :disabled="!isBookEnabled"
      @click="submitBooking"
    >
      Confirmar Reserva
    </UButton>
  </div>
</template>
