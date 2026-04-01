<script setup lang="ts">
import { computed } from 'vue';
import { navigateTo } from '#imports';
import type { BookingResult } from '~/composables/useCart';

definePageMeta({ layout: 'dashboard' });

const { t } = useI18n();

const results = useState<BookingResult[]>(
  'cart:confirmation-results',
  () => [],
);

const orderRef = computed(() => results.value[0]?.orderRef ?? '');
const confirmedCount = computed(
  () => results.value.filter((r) => r.status === 'confirmed').length,
);
const failedCount = computed(
  () => results.value.filter((r) => r.status !== 'confirmed').length,
);

const summaryMessage = computed(() => {
  if (failedCount.value === 0) return t('cart.confirmation.allConfirmed');
  if (confirmedCount.value === 0) return t('cart.confirmation.allFailed');
  return t('cart.confirmation.partialError');
});

const summaryColor = computed(() => {
  if (failedCount.value === 0) return 'success';
  if (confirmedCount.value === 0) return 'error';
  return 'warning';
});

useHead({
  title: computed(() => `${t('cart.confirmation.title')} - TravelOTA B2B`),
});
</script>

<template>
  <div class="max-w-[800px] mx-auto pb-12 pt-6">
    <h1
      class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6"
    >
      {{ t('cart.confirmation.title') }}
    </h1>

    <!-- Order ref -->
    <div
      v-if="orderRef"
      class="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
    >
      <UIcon name="i-heroicons-tag" class="w-4 h-4" />
      <span
        >{{ t('cart.confirmation.orderRef') }}:
        <strong class="text-gray-900 dark:text-white">{{
          orderRef
        }}</strong></span
      >
    </div>

    <!-- Summary banner -->
    <UAlert :color="summaryColor" :description="summaryMessage" class="mb-6" />

    <!-- Results table -->
    <UCard>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 dark:border-gray-800">
            <th
              class="text-left py-2 px-3 font-semibold text-gray-600 dark:text-gray-400"
            >
              Hotel
            </th>
            <th
              class="text-left py-2 px-3 font-semibold text-gray-600 dark:text-gray-400"
            >
              {{ t('cart.confirmation.pnr') }}
            </th>
            <th
              class="text-left py-2 px-3 font-semibold text-gray-600 dark:text-gray-400"
            >
              Estado
            </th>
            <th class="py-2 px-3" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="result in results"
            :key="result.cartItemId"
            class="border-b border-gray-50 dark:border-gray-900 last:border-0"
          >
            <td class="py-3 px-3 text-gray-900 dark:text-white font-medium">
              {{ result.hotelName }}
            </td>
            <td class="py-3 px-3 font-mono text-gray-700 dark:text-gray-300">
              {{ result.pnr ?? '—' }}
            </td>
            <td class="py-3 px-3">
              <UBadge
                :color="result.status === 'confirmed' ? 'success' : 'error'"
                :label="
                  result.status === 'confirmed'
                    ? t('cart.confirmation.confirmed')
                    : result.status === 'unavailable'
                      ? t('cart.confirmation.unavailable')
                      : t('cart.confirmation.failed')
                "
                variant="subtle"
              />
              <p v-if="result.error" class="text-xs text-red-500 mt-1">
                {{ result.error }}
              </p>
            </td>
            <td class="py-3 px-3 text-right">
              <UButton
                v-if="result.status === 'confirmed' && result.bookingId"
                color="primary"
                variant="ghost"
                size="xs"
                :to="`/dashboard/hotels/booking/${result.bookingId}`"
              >
                {{ t('cart.confirmation.viewBooking') }}
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </UCard>

    <div class="mt-6 flex justify-end">
      <UButton
        color="primary"
        icon="i-heroicons-magnifying-glass"
        @click="navigateTo('/dashboard')"
      >
        {{ t('cart.confirmation.newSearch') }}
      </UButton>
    </div>
  </div>
</template>
