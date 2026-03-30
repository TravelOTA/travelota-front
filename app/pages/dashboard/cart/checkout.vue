<!-- app/pages/dashboard/cart/checkout.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { navigateTo } from '#imports';
import { useRouter } from 'vue-router';
import { useCart } from '~/composables/useCart';
import type { CartItemHotel } from '~/composables/useCart';
import { apiFetch } from '~/composables/useApi';
import CartCheckoutSummary from '~/components/b2b/cart/checkout/CartCheckoutSummary.vue';
import CartCheckoutTitularForm from '~/components/b2b/cart/checkout/CartCheckoutTitularForm.vue';
import CartCheckoutPayment from '~/components/b2b/cart/checkout/CartCheckoutPayment.vue';
import CartCheckoutItemBlock from '~/components/b2b/cart/checkout/CartCheckoutItemBlock.vue';

definePageMeta({ layout: 'dashboard' });

const { t } = useI18n();
const router = useRouter();
const { items, itemCount, total, confirmAll, clearCart, removeItem } = useCart();

// ── Pre-check state ──────────────────────────────────────────────────────────

type PreCheckState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; bookingFlowId: number; remarks: string[]; currentPrice: number; priceChanged: boolean };

const preCheckMap = ref<Record<string, PreCheckState>>({});
const specialRequestsMap = ref<Record<string, string>>({});

async function runPreCheck(item: CartItemHotel): Promise<void> {
  preCheckMap.value[item.id] = { status: 'loading' };
  try {
    const rooms = (item.searchParams.rooms ?? [{ adults: 2, children: [] }]).map((r) => ({
      adults: r.adults,
      children: r.children.length,
      children_ages: r.children.map((c) =>
        typeof c === 'number' ? c : (c as { age: number }).age,
      ),
    }));

    const flow = await apiFetch<{
      id: number;
      current_net_rate: string;
      remarks: string[];
      status: string;
    }>('/api/hotel/booking-flow/select', {
      method: 'POST',
      body: {
        rate_key: item.room.rate_key,
        check_in: item.searchParams.checkIn,
        check_out: item.searchParams.checkOut,
        rooms,
        _mockPrice: item.room.price,
        _mockHotel: {
          id: String(item.hotel.id),
          name: item.hotel.name,
          stars: item.hotel.stars,
          image: item.hotel.image,
          address: item.hotel.location ?? item.hotel.address ?? '',
        },
        _mockRoom: {
          id: String((item.room as any).id ?? item.room.rate_key ?? 'room-1'),
          name: item.room.name,
          regimen: item.room.regimen ?? 'SA',
          cancellation: item.room.cancellation ?? '',
          cancellationPolicy: item.room.cancellationPolicy,
        },
      },
    });

    const currentPrice = parseFloat(flow.current_net_rate);
    preCheckMap.value[item.id] = {
      status: 'ready',
      bookingFlowId: flow.id,
      remarks: flow.remarks ?? [],
      currentPrice,
      priceChanged: currentPrice !== item.room.price,
    };
  } catch (err) {
    preCheckMap.value[item.id] = {
      status: 'error',
      message: err instanceof Error ? err.message : 'Error',
    };
  }
}

onMounted(async () => {
  if (itemCount.value === 0) {
    await navigateTo('/dashboard');
    return;
  }
  // Initialize special requests map
  for (const item of items.value) {
    specialRequestsMap.value[item.id] = '';
  }
  // Pre-check all items in parallel
  await Promise.allSettled(
    items.value
      .filter((i): i is CartItemHotel => i.type === 'hotel' && !!i.room.rate_key)
      .map(runPreCheck),
  );
});

useHead({
  title: computed(() => `${t('cart.checkout.title')} - TravelOTA B2B`),
});

// ── Price change modal ───────────────────────────────────────────────────────

const priceChangeModal = ref<{
  visible: boolean;
  item: CartItemHotel | null;
  oldPrice: number;
  newPrice: number;
  resolve: ((accepted: boolean) => void) | null;
}>({ visible: false, item: null, oldPrice: 0, newPrice: 0, resolve: null });

function askPriceChange(item: CartItemHotel, oldPrice: number, newPrice: number): Promise<boolean> {
  return new Promise((resolve) => {
    priceChangeModal.value = { visible: true, item, oldPrice, newPrice, resolve };
  });
}

function resolvePriceChange(accepted: boolean) {
  priceChangeModal.value.resolve?.(accepted);
  priceChangeModal.value = { visible: false, item: null, oldPrice: 0, newPrice: 0, resolve: null };
}

// ── Confirm ──────────────────────────────────────────────────────────────────

const titularFormRef = ref<InstanceType<typeof CartCheckoutTitularForm>>();
const paymentRef = ref<InstanceType<typeof CartCheckoutPayment>>();
const isProcessing = ref(false);
const confirmError = ref<string | null>(null);

async function handleConfirmAll() {
  const titular = titularFormRef.value?.form;
  if (!titular?.nombre || !titular.apellido || !titular.email) {
    confirmError.value = t('hotels.checkout.errorNameRequired') || 'Nombre y email requeridos';
    return;
  }

  // Build accepted preCheckResults (skip items with price change that user rejects)
  const acceptedPreCheck: Record<string, { bookingFlowId: number; currentPrice: number }> = {};
  const skippedIds = new Set<string>();

  for (const item of items.value) {
    if (item.type !== 'hotel') continue;
    const pc = preCheckMap.value[item.id];
    if (pc?.status === 'ready') {
      if (pc.priceChanged) {
        const accepted = await askPriceChange(item as CartItemHotel, item.room.price, pc.currentPrice);
        if (!accepted) {
          skippedIds.add(item.id);
          continue;
        }
      }
      acceptedPreCheck[item.id] = { bookingFlowId: pc.bookingFlowId, currentPrice: pc.currentPrice };
    }
  }

  const paymentMethod = paymentRef.value?.selectedMethod ?? 'WALLET';
  confirmError.value = null;
  isProcessing.value = true;

  try {
    const results = await confirmAll(
      { nombre: titular.nombre, apellido: titular.apellido, refAgencia: titular.refAgencia, email: titular.email },
      paymentMethod,
      specialRequestsMap.value,
      acceptedPreCheck,
      undefined,
      skippedIds,
    );

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

function handleRemoveItem(id: string) {
  removeItem(id);
  delete preCheckMap.value[id];
  delete specialRequestsMap.value[id];
  if (itemCount.value === 0) navigateTo('/dashboard');
}

function handleSpecialRequest(id: string, value: string) {
  specialRequestsMap.value[id] = value;
}

const preCheckForItem = (id: string): PreCheckState =>
  preCheckMap.value[id] ?? { status: 'loading' };
</script>

<template>
  <div class="max-w-[1000px] mx-auto pb-12 pt-6">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-left" @click="router.back()">
        {{ t('cart.checkout.backToCart') }}
      </UButton>
      <h1 class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
        {{ t('cart.checkout.title') }}
      </h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Sidebar: numerical summary -->
      <div class="lg:col-span-1">
        <div class="sticky top-24">
          <CartCheckoutSummary :items="items" :total="total" />
        </div>
      </div>

      <!-- Main: item blocks + form -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Item blocks -->
        <CartCheckoutItemBlock
          v-for="(item, i) in items"
          :key="item.id"
          :item="item"
          :index="i"
          :total="items.length"
          :pre-check="preCheckForItem(item.id)"
          :special-request="specialRequestsMap[item.id] ?? ''"
          @remove="handleRemoveItem"
          @update:special-request="handleSpecialRequest"
        />

        <!-- Titular + payment + confirm -->
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
          <UButton color="neutral" variant="outline" @click="resolvePriceChange(false)">
            {{ t('cart.checkout.priceChangedSkip') }}
          </UButton>
          <UButton color="primary" @click="resolvePriceChange(true)">
            {{ t('cart.checkout.priceChangedConfirm') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
