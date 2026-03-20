<script setup lang="ts">
import { ref, computed, watch } from "vue";

const { t } = useI18n();
import type { ICancellationPolicy } from "#shared/types/booking";
import type { PaymentMethod } from "#shared/types/payment";
import { useCheckout } from "~/composables/useCheckout";
import { createCardSchema } from "~/utils/schemas";
import PaymentMethodSelector from "~/components/b2b/hotel/checkout/PaymentMethodSelector.vue";

const props = defineProps<{
  totalPrice?: number;
  paymentDeadline?: string;
  cancellationDeadline?: string;
  cancellationPolicy?: ICancellationPolicy;
  titular?: {
    nombre: string;
    apellido: string;
    refAgencia?: string;
    notas?: string;
  };
}>();

const emit = defineEmits<{
  confirmed: [pnr: string];
  error: [message: string];
}>();

const selectedMethod = ref<string>("deferred");

const acceptConditions = ref(false);
const acceptPrivacy = ref(false);

const isBookEnabled = computed(() => {
  return acceptConditions.value && acceptPrivacy.value;
});

const { confirmBooking, isSubmitting, submitError } = useCheckout();

// Card data state (only shown when method === 'card')
const cardNumber = ref("");
const cardExpiry = ref("");
const cardCvv = ref("");

// Card validation — only active after first submit attempt
const cardSubmitAttempted = ref(false);

const cardSchema = computed(() => createCardSchema(t));

const cardErrors = computed(() => {
  if (!cardSubmitAttempted.value || selectedMethod.value !== "card") return {};
  const result = cardSchema.value.safeParse({
    number: cardNumber.value,
    expiry: cardExpiry.value,
    cvv: cardCvv.value,
  });
  if (result.success) return {};
  return Object.fromEntries(
    result.error.errors.map((e) => [e.path[0], e.message]),
  );
});

watch(selectedMethod, () => {
  cardSubmitAttempted.value = false;
});

const isCardValid = computed(() => {
  if (selectedMethod.value !== "card") return true;
  return cardSchema.value.safeParse({
    number: cardNumber.value,
    expiry: cardExpiry.value,
    cvv: cardCvv.value,
  }).success;
});

async function submitBooking() {
  if (!isBookEnabled.value) return;

  if (selectedMethod.value === "card") {
    cardSubmitAttempted.value = true;
    if (!isCardValid.value) return;
  }

  try {
    const cardData =
      selectedMethod.value === "card"
        ? {
            number: cardNumber.value,
            expiry: cardExpiry.value,
            cvv: cardCvv.value,
          }
        : undefined;

    const titular = props.titular ?? { nombre: "", apellido: "" };
    const pnr = await confirmBooking(
      titular,
      selectedMethod.value as PaymentMethod,
      cardData,
    );
    emit("confirmed", pnr);
  } catch (err) {
    emit("error", err instanceof Error ? err.message : t('hotels.checkout.errorConfirm'));
  }
}
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5"
  >
    <h3
      class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
    >
      <UIcon name="i-heroicons-credit-card" class="w-5 h-5 text-primary-500" />
      {{ t('hotels.checkout.paymentMethods') }}
    </h3>

    <!-- Payment Options (shared component with pay-later option) -->
    <div class="mb-6">
      <PaymentMethodSelector
        v-model="selectedMethod"
        show-pay-later
        :total-price="totalPrice"
        :payment-deadline="paymentDeadline"
        :cancellation-deadline="cancellationDeadline"
        :cancellation-policy="props.cancellationPolicy"
      />
    </div>

    <!-- Card fields (shown when method = 'card') -->
    <div
      v-if="selectedMethod === 'card'"
      class="mt-4 space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
    >
      <UFormField
        :label="t('hotels.checkout.cardNumber')"
        :error="cardErrors.number"
      >
        <UInput
          v-model="cardNumber"
          :placeholder="t('hotels.checkout.cardNumberPlaceholder')"
          maxlength="16"
        />
      </UFormField>
      <div class="grid grid-cols-2 gap-3">
        <UFormField
          :label="t('hotels.checkout.expiry')"
          :error="cardErrors.expiry"
        >
          <UInput v-model="cardExpiry" :placeholder="t('hotels.checkout.expiryPlaceholder')" maxlength="5" />
        </UFormField>
        <UFormField
          :label="t('hotels.checkout.cvv')"
          :error="cardErrors.cvv"
        >
          <UInput
            v-model="cardCvv"
            :placeholder="t('hotels.checkout.cvvPlaceholder')"
            maxlength="4"
            type="password"
          />
        </UFormField>
      </div>
    </div>

    <!-- Legal Terms & Checks -->
    <div
      class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-6 border border-gray-100 dark:border-gray-700/50"
    >
      <p
        class="text-xs text-gray-500 dark:text-gray-400 text-justify mb-4 leading-relaxed tracking-tight"
      >
        {{ t('hotels.checkout.privacyNotice') }}
      </p>

      <div class="flex flex-col gap-2">
        <UCheckbox
          v-model="acceptConditions"
          :label="t('hotels.checkout.acceptConditions')"
        />
        <UCheckbox
          v-model="acceptPrivacy"
          :label="t('hotels.checkout.acceptPrivacy')"
        />
      </div>
    </div>

    <!-- Submit Error -->
    <UAlert
      v-if="submitError"
      color="error"
      :description="submitError"
      class="mb-3"
    />

    <!-- Submit Button -->
    <UButton
      block
      size="xl"
      color="primary"
      class="font-black text-lg py-3 shadow-lg hover:shadow-xl transition-shadow uppercase tracking-wider disabled:opacity-50"
      :loading="isSubmitting"
      :disabled="!isBookEnabled || isSubmitting"
      @click="submitBooking"
    >
      {{ t('hotels.checkout.confirmReservation') }}
    </UButton>
  </div>
</template>
