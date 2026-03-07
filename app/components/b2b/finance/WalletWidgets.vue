<script setup lang="ts">
const { creditLimit, currentBalance, availableCredit, creditUsagePercentage } =
  useWallet();

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Credit Limit -->
    <UCard>
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500"
        >
          <UIcon name="i-heroicons-banknotes" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Límite de Crédito
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(creditLimit) }}
          </p>
        </div>
      </div>
    </UCard>

    <!-- Current Balance (Consumed) -->
    <UCard>
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400"
        >
          <UIcon name="i-heroicons-arrow-trending-down" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Crédito Consumido
          </p>
          <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {{ formatCurrency(currentBalance) }}
          </p>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center gap-3">
          <div
            class="flex-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
          >
            <div
              class="bg-orange-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${creditUsagePercentage}%`, maxWidth: '100%' }"
            ></div>
          </div>
          <span class="text-xs font-semibold text-gray-500"
            >{{ creditUsagePercentage }}%</span
          >
        </div>
      </template>
    </UCard>

    <!-- Available Credit -->
    <UCard>
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"
        >
          <UIcon name="i-heroicons-wallet" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Crédito Disponible
          </p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ formatCurrency(availableCredit) }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
