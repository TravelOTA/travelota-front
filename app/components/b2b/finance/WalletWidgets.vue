<script setup lang="ts">
const emit = defineEmits<{ 'request-recharge': [] }>();

const { t, locale } = useI18n();
const {
  balance,
  creditLine,
  usageLevel,
  isCreditBlocked,
  lowBalanceThreshold,
  isLowBalance,
  currency,
  totalDeposited,
  totalConsumed,
  lastUpdatedAt,
} = useWallet();

const displayUsage = computed(() => Math.min(usageLevel.value, 100));

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: currency.value,
  }).format(amount);

const updatedAgo = computed(() => {
  if (!lastUpdatedAt.value) return null;
  const diff = Math.floor(
    (Date.now() - new Date(lastUpdatedAt.value).getTime()) / 60000,
  );
  if (diff < 1) return t('agency.wallet.updatedNow');
  if (diff === 1) return t('agency.wallet.updatedMinute');
  if (diff < 60) return t('agency.wallet.updatedMinutes', { n: diff });
  return t('agency.wallet.updatedHours', { n: Math.floor(diff / 60) });
});
</script>

<template>
  <div class="space-y-4">
    <!-- Low balance alert -->
    <UAlert
      v-if="isLowBalance"
      icon="i-heroicons-exclamation-triangle"
      color="warning"
      variant="soft"
      :title="t('agency.wallet.lowBalance.title')"
      :description="
        t('agency.wallet.lowBalance.description', {
          threshold: formatCurrency(lowBalanceThreshold),
        })
      "
    >
      <template #actions>
        <UButton color="warning" size="sm" @click="emit('request-recharge')">
          {{ t('agency.wallet.rechargeNow') }}
        </UButton>
      </template>
    </UAlert>

    <!-- Two-panel grid -->
    <div
      :class="[
        'grid gap-6',
        creditLine ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1',
      ]"
    >
      <!-- Wallet Panel (Left) -->
      <div
        class="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white flex flex-col justify-between gap-4"
      >
        <div>
          <p
            class="text-xs font-medium uppercase tracking-wider text-indigo-200"
          >
            {{ t('agency.wallet.balance') }}
          </p>
          <p class="mt-1 text-4xl font-extrabold tracking-tight">
            {{ formatCurrency(balance) }}
          </p>
          <p v-if="updatedAgo" class="mt-1 text-xs text-indigo-300">
            {{ currency }} · {{ updatedAgo }}
          </p>
        </div>
        <div>
          <UButton
            variant="outline"
            color="white"
            size="md"
            icon="i-heroicons-plus"
            @click="emit('request-recharge')"
          >
            {{ t('agency.wallet.requestRecharge') }}
          </UButton>
        </div>
      </div>

      <!-- Credit Facility Panel (Right) -->
      <UCard v-if="creditLine" :ui="{ body: { padding: 'p-6' } }">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold flex items-center gap-2">
            <UIcon name="i-heroicons-credit-card" class="text-primary-500" />
            {{ t('agency.wallet.credit.title') }}
          </h3>
          <UBadge :color="isCreditBlocked ? 'error' : 'success'" variant="soft">
            {{
              isCreditBlocked
                ? t('agency.wallet.credit.statusBlocked')
                : t('agency.wallet.credit.statusActive')
            }}
          </UBadge>
        </div>

        <!-- Usage progress bar -->
        <div class="mb-4">
          <UProgress v-model="displayUsage" color="primary" />
          <p class="text-xs text-gray-500 mt-1">
            {{ Math.round(displayUsage) }}% {{ t('agency.wallet.credit.used') }}
          </p>
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p
              class="text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              {{ t('agency.wallet.credit.available') }}
            </p>
            <p class="text-xl font-bold text-primary-600">
              {{ formatCurrency(creditLine.available ?? 0) }}
            </p>
          </div>
          <div>
            <p
              class="text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              {{ t('agency.wallet.credit.limit') }}
            </p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(creditLine.limit ?? 0) }}
            </p>
          </div>
          <div>
            <p
              class="text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              {{ t('agency.wallet.credit.used') }}
            </p>
            <p class="text-xl font-bold text-gray-700 dark:text-gray-200">
              {{ formatCurrency(creditLine.used ?? 0) }}
            </p>
          </div>
          <div>
            <p
              class="text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              {{ t('agency.wallet.credit.debt') }}
            </p>
            <p class="text-xl font-bold text-orange-500">
              {{ formatCurrency(creditLine.debt ?? 0) }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Mini stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <UCard :ui="{ body: { padding: 'p-4' } }">
        <p
          class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          {{ t('agency.wallet.totalDeposited') }}
        </p>
        <p class="mt-1 text-xl font-bold text-gray-900 dark:text-white">
          {{ formatCurrency(totalDeposited) }}
        </p>
        <p class="mt-0.5 text-xs text-gray-400">
          {{ t('agency.wallet.historical') }}
        </p>
      </UCard>

      <UCard :ui="{ body: { padding: 'p-4' } }">
        <p
          class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          {{ t('agency.wallet.totalConsumed') }}
        </p>
        <p class="mt-1 text-xl font-bold text-gray-900 dark:text-white">
          {{ formatCurrency(totalConsumed) }}
        </p>
        <p class="mt-0.5 text-xs text-gray-400">
          {{ t('agency.wallet.inBookings') }}
        </p>
      </UCard>

      <UCard :ui="{ body: { padding: 'p-4' } }">
        <p
          class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          {{ t('agency.wallet.alertThreshold') }}
        </p>
        <p class="mt-1 text-xl font-bold text-orange-500">
          {{ formatCurrency(lowBalanceThreshold) }}
        </p>
        <p class="mt-0.5 text-xs text-gray-400">
          {{ t('agency.wallet.configuredByGroup') }}
        </p>
      </UCard>
    </div>
  </div>
</template>
