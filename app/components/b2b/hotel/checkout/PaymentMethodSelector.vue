<script setup lang="ts">
/**
 * PaymentMethodSelector — Componente reutilizable de selección de método de pago.
 *
 * Uso básico (3 opciones: tarjeta, transferencia, crédito):
 *   <PaymentMethodSelector v-model="selectedMethod" />
 *
 * Con opción "Reservar y no Pagar Ahora" (checkout):
 *   <PaymentMethodSelector v-model="selectedMethod" show-pay-later
 *     :total-price="6281.41" payment-deadline="01/03/2026" cancellation-deadline="25/02/2026" />
 */
import { computed } from "vue";

const props = defineProps<{
  modelValue: string;
  /** Show "Reservar y no Pagar Ahora" option (only for checkout confirmation) */
  showPayLater?: boolean;
  /** Required when showPayLater is true */
  totalPrice?: number;
  paymentDeadline?: string;
  cancellationDeadline?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const { hasSufficientCredit } = useWallet();

const isCreditSufficient = computed(() => {
  if (!props.totalPrice) return true;
  return hasSufficientCredit(props.totalPrice);
});

const select = (key: string) => {
  if (!isCreditSufficient.value && (key === "pay_later" || key === "credit")) {
    return; // Block selection
  }
  emit("update:modelValue", key);
};

const { paymentMethods: baseMethods } = useConfig();

const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

<template>
  <div class="space-y-3">
    <!-- Pay Later option (only at checkout) -->
    <div
      v-if="props.showPayLater"
      class="border rounded-lg p-4 transition-all"
      :class="[
        !isCreditSufficient
          ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800'
          : 'cursor-pointer',
        modelValue === 'pay_later'
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 shadow-sm'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-gray-600',
      ]"
      @click="select('pay_later')"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-lg flex items-center justify-center"
            :class="
              modelValue === 'pay_later'
                ? 'bg-primary-100 dark:bg-primary-800/30'
                : 'bg-gray-100 dark:bg-gray-800'
            "
          >
            <UIcon
              name="i-heroicons-clock"
              class="w-5 h-5"
              :class="
                modelValue === 'pay_later'
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500'
              "
            />
          </div>
          <div>
            <p
              class="font-bold text-sm"
              :class="
                modelValue === 'pay_later'
                  ? 'text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-white'
              "
            >
              Reservar y no Pagar Ahora
              <UBadge
                v-if="!isCreditSufficient"
                color="error"
                variant="soft"
                size="xs"
                class="ml-2"
                >Crédito Insuficiente</UBadge
              >
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              <template v-if="totalPrice">
                Importe total:
                <strong class="text-gray-900 dark:text-white"
                  >${{ formatPrice(totalPrice) }}</strong
                >.
              </template>
              <template v-if="paymentDeadline">
                Límite de pago:
                <strong class="text-gray-900 dark:text-white">{{
                  paymentDeadline
                }}</strong
                >.
              </template>
              <template v-if="cancellationDeadline">
                Cancelar sin gastos hasta:
                <strong class="text-gray-900 dark:text-white">{{
                  cancellationDeadline
                }}</strong
                >.
              </template>
            </p>
          </div>
        </div>
        <div
          class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
          :class="
            modelValue === 'pay_later'
              ? 'border-primary-500'
              : 'border-gray-300 dark:border-gray-600'
          "
        >
          <div
            v-show="modelValue === 'pay_later'"
            class="w-2.5 h-2.5 bg-primary-500 rounded-full"
          ></div>
        </div>
      </div>
    </div>

    <!-- Base payment methods -->
    <div
      v-for="method in baseMethods"
      :key="method.key"
      class="border rounded-lg p-4 transition-all"
      :class="[
        !isCreditSufficient && method.key === 'credit'
          ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800'
          : 'cursor-pointer',
        modelValue === method.key
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 shadow-sm'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-gray-600',
      ]"
      @click="select(method.key)"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-lg flex items-center justify-center"
            :class="
              modelValue === method.key
                ? 'bg-primary-100 dark:bg-primary-800/30'
                : 'bg-gray-100 dark:bg-gray-800'
            "
          >
            <UIcon
              :name="method.icon"
              class="w-5 h-5"
              :class="
                modelValue === method.key
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500'
              "
            />
          </div>
          <div>
            <p
              class="font-bold text-sm"
              :class="
                modelValue === method.key
                  ? 'text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-white'
              "
            >
              {{ method.label }}
              <UBadge
                v-if="!isCreditSufficient && method.key === 'credit'"
                color="error"
                variant="soft"
                size="xs"
                class="ml-2"
                >Crédito Insuficiente</UBadge
              >
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ method.description }}
            </p>
          </div>
        </div>
        <div
          class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
          :class="
            modelValue === method.key
              ? 'border-primary-500'
              : 'border-gray-300 dark:border-gray-600'
          "
        >
          <div
            v-show="modelValue === method.key"
            class="w-2.5 h-2.5 bg-primary-500 rounded-full"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
