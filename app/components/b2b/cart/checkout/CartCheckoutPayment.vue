<script setup lang="ts">
import { ref } from 'vue';

const { t } = useI18n();

const selectedMethod = ref<string>('WALLET');

const paymentMethods = [
  { value: 'WALLET', label: 'Saldo de billetera', icon: 'i-heroicons-wallet' },
  { value: 'CREDIT', label: 'Crédito de agencia', icon: 'i-heroicons-credit-card' },
];

defineExpose({ selectedMethod });
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="font-bold text-gray-900 dark:text-white text-sm">
        {{ t('cart.checkout.payment') }}
      </h3>
    </template>
    <div class="flex flex-col gap-3">
      <label
        v-for="method in paymentMethods"
        :key="method.value"
        class="flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-colors"
        :class="selectedMethod === method.value
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'"
      >
        <input
          v-model="selectedMethod"
          type="radio"
          :value="method.value"
          class="accent-primary-600"
        />
        <UIcon :name="method.icon" class="w-5 h-5 text-gray-500" />
        <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
          {{ method.label }}
        </span>
      </label>
    </div>
  </UCard>
</template>
