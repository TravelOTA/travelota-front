<script setup lang="ts">
import { ref } from 'vue';
import { useNetPrice } from '~/composables/useNetPrice';
import { useSalePrice } from '~/composables/useSalePrice';

const { t } = useI18n();

defineProps<{
  bookingStatus: string;
  totalPrice: number;
  policies: {
    status: string;
    fromDate: string;
    toDate: string;
    time: string;
    price: number;
  }[];
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
}>();

const { netPriceVisible } = useNetPrice();
const { salePrice } = useSalePrice();

const showConfirmModal = ref(false);
const isCancelling = ref(false);

const handleCancel = () => {
  isCancelling.value = true;
  // TODO: Emulate API call
  setTimeout(() => {
    isCancelling.value = false;
    showConfirmModal.value = false;
    emit('cancel');
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
      <UIcon
        name="i-heroicons-shield-exclamation"
        class="w-5 h-5 text-primary-500"
      />
      {{ t('hotels.cancellation.title') }}
    </h3>

    <!-- Si la reserva ya está cancelada -->
    <div
      v-if="bookingStatus === 'Cancelada'"
      class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center"
    >
      <UIcon
        name="i-heroicons-x-circle"
        class="w-8 h-8 text-red-500 mx-auto mb-2"
      />
      <p class="text-sm font-bold text-red-700 dark:text-red-400">
        {{ t('hotels.cancellation.alreadyCancelled') }}
      </p>
      <p class="text-xs text-red-600 dark:text-red-300 mt-1">
        {{ t('hotels.cancellation.feesApplied') }}
      </p>
    </div>

    <!-- Si la reserva está activa: Mostrar tabla de gastos y botón de cancelar -->
    <template v-else>
      <!-- Tabla de gastos de cancelación -->
      <div class="mb-4 flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400"
            >{{ t('hotels.cancellationPolicy.total') }}
          </span>
          <span class="font-bold text-gray-900 dark:text-white"
            >${{
              salePrice(totalPrice).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}</span
          >
        </div>
        <span
          v-if="netPriceVisible"
          class="text-[10px] text-gray-400 font-medium"
        >
          neto ${{
            totalPrice.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </span>
      </div>

      <div class="overflow-x-auto mb-6">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr
              class="border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              <th class="py-2 pr-4 font-bold">
                {{ t('hotels.cancellationPolicy.costsHeader') }}
              </th>
              <th class="py-2 pr-4 font-bold">
                {{ t('hotels.cancellationPolicy.fromDate') }}
              </th>
              <th class="py-2 pr-4 font-bold">
                {{ t('hotels.cancellationPolicy.toDate') }}
              </th>
              <th class="py-2 pr-4 font-bold">
                {{ t('hotels.cancellationPolicy.time') }}
              </th>
              <th class="py-2 font-bold">
                {{ t('hotels.cancellationPolicy.price') }}
              </th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-300"
          >
            <tr
              v-for="(policy, idx) in policies"
              :key="idx"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td class="py-2.5 pr-4">{{ policy.status }}</td>
              <td class="py-2.5 pr-4">{{ policy.fromDate }}</td>
              <td class="py-2.5 pr-4">{{ policy.toDate }}</td>
              <td class="py-2.5 pr-4">{{ policy.time }}</td>
              <td class="py-2.5">
                <div class="flex flex-col text-right">
                  <span class="font-bold text-gray-900 dark:text-white">
                    ${{
                      salePrice(policy.price).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }}
                  </span>
                  <span
                    v-if="netPriceVisible"
                    class="text-[10px] text-gray-400 font-normal"
                  >
                    neto ${{
                      policy.price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botón de cancelar -->
      <UButton
        color="error"
        variant="soft"
        block
        icon="i-heroicons-x-circle"
        class="font-bold uppercase tracking-wider"
        @click="showConfirmModal = true"
      >
        {{ t('hotels.cancellation.requestCancel') }}
      </UButton>

      <!-- Modal de confirmación -->
      <UModal v-model:open="showConfirmModal">
        <template #content>
          <div class="p-6">
            <div class="text-center mb-6">
              <div
                class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="w-8 h-8 text-red-600 dark:text-red-400"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ t('hotels.cancellation.confirmTitle') }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ t('hotels.cancellation.confirmText') }}
              </p>
            </div>

            <div class="flex gap-3">
              <UButton
                block
                variant="outline"
                color="neutral"
                class="font-bold"
                @click="showConfirmModal = false"
              >
                {{ t('hotels.cancellation.back') }}
              </UButton>
              <UButton
                block
                color="error"
                class="font-bold"
                :loading="isCancelling"
                @click="handleCancel"
              >
                {{ t('hotels.cancellation.confirm') }}
              </UButton>
            </div>
          </div>
        </template>
      </UModal>
    </template>
  </div>
</template>
