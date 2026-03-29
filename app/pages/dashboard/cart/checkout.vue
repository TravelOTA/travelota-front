<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { navigateTo } from '#imports';
import { useRouter } from 'vue-router';
import { useCart } from '~/composables/useCart';
import type { CartItemHotel } from '~/composables/useCart';
import CartCheckoutSummary from '~/components/b2b/cart/checkout/CartCheckoutSummary.vue';
import CartCheckoutTitularForm from '~/components/b2b/cart/checkout/CartCheckoutTitularForm.vue';
import CartCheckoutPayment from '~/components/b2b/cart/checkout/CartCheckoutPayment.vue';

definePageMeta({ layout: 'dashboard' });

const { t } = useI18n();
const router = useRouter();
const { items, itemCount, total, confirmAll, clearCart } = useCart();

const titularFormRef = ref<InstanceType<typeof CartCheckoutTitularForm>>();
const paymentRef = ref<InstanceType<typeof CartCheckoutPayment>>();
const isProcessing = ref(false);
const confirmError = ref<string | null>(null);

// Price change modal state
const priceChangeModal = ref<{
  visible: boolean;
  item: CartItemHotel | null;
  oldPrice: number;
  newPrice: number;
  resolve: ((accepted: boolean) => void) | null;
}>({ visible: false, item: null, oldPrice: 0, newPrice: 0, resolve: null });

onMounted(() => {
  if (itemCount.value === 0) {
    navigateTo('/dashboard');
  }
});

useHead({
  title: computed(() => `${t('cart.checkout.title')} - TravelOTA B2B`),
});

function handlePriceChange(
  item: CartItemHotel,
  oldPrice: number,
  newPrice: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    priceChangeModal.value = { visible: true, item, oldPrice, newPrice, resolve };
  });
}

function resolvepriceChange(accepted: boolean) {
  priceChangeModal.value.resolve?.(accepted);
  priceChangeModal.value = { visible: false, item: null, oldPrice: 0, newPrice: 0, resolve: null };
}

async function handleConfirmAll() {
  const titular = titularFormRef.value?.form;
  if (!titular?.nombre || !titular.apellido) {
    confirmError.value = t('hotels.checkout.errorNameRequired') || 'Nombre requerido';
    return;
  }

  const paymentMethod = paymentRef.value?.selectedMethod ?? 'WALLET';
  confirmError.value = null;
  isProcessing.value = true;

  try {
    const results = await confirmAll(
      { nombre: titular.nombre, apellido: titular.apellido, refAgencia: titular.refAgencia, notas: titular.notas },
      paymentMethod,
      undefined,
      handlePriceChange,
    );

    // Store results for confirmation page via useState
    const confirmationResults = useState<typeof results>('cart:confirmation-results', () => []);
    confirmationResults.value = results;

    clearCart();
    await navigateTo('/dashboard/cart/confirmation');
  } catch (err) {
    confirmError.value = err instanceof Error ? err.message : t('hotels.checkout.errorConfirm') || 'Error al confirmar';
  } finally {
    isProcessing.value = false;
  }
}
</script>

<template>
  <div class="max-w-[1000px] mx-auto pb-12 pt-6">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        @click="router.back()"
      >
        {{ t('cart.checkout.backToCart') }}
      </UButton>
      <h1 class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
        {{ t('cart.checkout.title') }}
      </h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sidebar: Order summary -->
      <div class="lg:col-span-1">
        <div class="sticky top-24">
          <CartCheckoutSummary :items="items" :total="total" />
        </div>
      </div>

      <!-- Main: Forms -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <CartCheckoutTitularForm ref="titularFormRef" />
        <CartCheckoutPayment ref="paymentRef" />

        <UAlert
          v-if="confirmError"
          color="error"
          icon="i-heroicons-exclamation-circle"
          :description="confirmError"
        />

        <UButton
          color="primary"
          block
          size="lg"
          :loading="isProcessing"
          :disabled="isProcessing"
          @click="handleConfirmAll"
        >
          {{ isProcessing ? t('cart.checkout.processing') : t('cart.checkout.confirmAll') }}
        </UButton>
      </div>
    </div>

    <!-- Price change modal -->
    <UModal v-model:open="priceChangeModal.visible" :title="t('cart.checkout.priceChangedTitle')">
      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{
            t('cart.checkout.priceChangedDescription', {
              roomName: priceChangeModal.item?.room.name ?? '',
              oldPrice: priceChangeModal.oldPrice.toFixed(2),
              newPrice: priceChangeModal.newPrice.toFixed(2),
            })
          }}
        </p>
      </template>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <UButton color="neutral" variant="outline" @click="resolvepriceChange(false)">
            {{ t('cart.checkout.priceChangedSkip') }}
          </UButton>
          <UButton color="primary" @click="resolvepriceChange(true)">
            {{ t('cart.checkout.priceChangedConfirm') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
