<script setup lang="ts">
import { ref, computed } from "vue";

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

const submitBooking = () => {
  if (!isBookEnabled.value) return;
  isProcessing.value = true;
  // TODO: Emulate booking call
  setTimeout(() => {
    isProcessing.value = false;
    alert("¡Reserva procesada con éxito!");
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

    <!-- Payment Options -->
    <div class="space-y-3 mb-6">
      <!-- Option 1: Reserve & Pay Later -->
      <div
        class="border rounded-lg p-4 cursor-pointer transition-colors"
        :class="
          selectedMethod === 'pay_later'
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-gray-600'
        "
        @click="selectedMethod = 'pay_later'"
      >
        <div class="flex items-center justify-between mb-2">
          <div
            class="flex items-center gap-2 font-bold text-gray-900 dark:text-white"
          >
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-500" />
            Reservar y no Pagar Ahora
          </div>
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            :class="
              selectedMethod === 'pay_later'
                ? 'border-primary-500'
                : 'border-gray-300 dark:border-gray-600'
            "
          >
            <div
              v-show="selectedMethod === 'pay_later'"
              class="w-2.5 h-2.5 bg-primary-500 rounded-full"
            ></div>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Importe total:
          <strong class="text-gray-900 dark:text-white"
            >${{
              totalPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}</strong
          >. Fecha límite para el pago:
          <strong class="text-gray-900 dark:text-white">{{
            paymentDeadline
          }}</strong
          >. Fecha límite para cancelar sin gastos:
          <strong class="text-gray-900 dark:text-white">{{
            cancellationDeadline
          }}</strong
          >.
        </p>
      </div>

      <!-- Option 2: Credit Card Immediate -->
      <div
        class="border rounded-lg p-4 cursor-pointer transition-colors"
        :class="
          selectedMethod === 'credit_card'
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-gray-600'
        "
        @click="selectedMethod = 'credit_card'"
      >
        <div class="flex items-center justify-between mb-2">
          <div
            class="flex items-center gap-2 font-bold text-gray-900 dark:text-white"
          >
            <UIcon
              name="i-heroicons-credit-card"
              class="w-5 h-5 text-primary-500"
            />
            Pago con tarjeta
            <div class="flex items-center gap-1 ml-2 opacity-80">
              <!-- Usando íconos flat simples o emojis temporales que emulen tarjetas -->
              <Icon
                name="i-fa-brands-cc-visa"
                class="w-6 h-6 text-primary-500"
              />
              <Icon
                name="i-fa-brands-cc-mastercard"
                class="w-6 h-6 text-primary-500"
              />
            </div>
          </div>
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            :class="
              selectedMethod === 'credit_card'
                ? 'border-primary-500'
                : 'border-gray-300 dark:border-gray-600'
            "
          >
            <div
              v-show="selectedMethod === 'credit_card'"
              class="w-2.5 h-2.5 bg-primary-500 rounded-full"
            ></div>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Has elegido pago con tarjeta, la reserva se cobrará al reservar.<br />
          Importe:
          <strong class="text-gray-900 dark:text-white"
            >${{
              totalPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}</strong
          >
        </p>
      </div>
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
