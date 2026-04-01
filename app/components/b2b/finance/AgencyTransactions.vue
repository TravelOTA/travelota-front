<script setup lang="ts">
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import type { ITransaction } from '#shared/types/wallet';

const emit = defineEmits<{ export: [] }>();

const { t, locale } = useI18n();
const { transactions, currency } = useWallet();

const dateLocale = computed(() => (locale.value === 'es' ? es : enUS));

const columns = computed(() => [
  { accessorKey: 'date', header: t('agency.wallet.movements.date') },
  {
    accessorKey: 'description',
    header: t('agency.wallet.movements.description'),
  },
  {
    accessorKey: 'reference',
    header: t('agency.wallet.movements.reference'),
  },
  { accessorKey: 'type', header: t('agency.wallet.movements.type') },
  { accessorKey: 'amount', header: t('agency.wallet.movements.amount') },
  {
    accessorKey: 'balanceAfter',
    header: t('agency.wallet.movements.balanceAfter'),
  },
]);

const formatDate = (dateString: string) =>
  format(new Date(dateString), 'dd MMM yyyy', { locale: dateLocale.value });

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: currency.value,
  }).format(amount);

const formatAmount = (amount: number, type: string) => {
  const formatted = formatCurrency(amount);
  return type === 'charge' ? `−${formatted}` : `+${formatted}`;
};

const getBadgeProps = (type: string) => {
  switch (type) {
    case 'charge':
      return {
        label: t('agency.wallet.type.charge'),
        color: 'orange',
        icon: 'i-heroicons-arrow-up-right',
      };
    case 'deposit':
      return {
        label: t('agency.wallet.type.deposit'),
        color: 'green',
        icon: 'i-heroicons-arrow-down-left',
      };
    case 'refund':
      return {
        label: t('agency.wallet.type.refund'),
        color: 'primary',
        icon: 'i-heroicons-arrow-path',
      };
    default:
      return {
        label: type,
        color: 'neutral',
        icon: 'i-heroicons-document',
      };
  }
};

const amountClass = (type: string) => ({
  'text-red-600 dark:text-red-400': type === 'charge',
  'text-green-600 dark:text-green-400': type === 'deposit' || type === 'refund',
});
</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }" class="shadow-sm overflow-hidden">
    <template #header>
      <div class="flex items-center justify-between">
        <h3
          class="text-base font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-2"
        >
          <UIcon
            name="i-heroicons-document-text"
            class="w-5 h-5 text-gray-500"
          />
          {{ t('agency.wallet.movements.title') }}
        </h3>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-down-tray"
          size="sm"
          :label="t('agency.wallet.movements.export')"
          @click="emit('export')"
        />
      </div>
    </template>

    <UTable
      :data="transactions"
      :columns="columns"
      class="w-full whitespace-nowrap"
    >
      <template #date-cell="{ row }">
        <span class="text-gray-500 text-sm">
          {{ formatDate((row.original as ITransaction).date) }}
        </span>
      </template>

      <template #description-cell="{ row }">
        <span class="font-medium text-gray-900 dark:text-white">
          {{ (row.original as ITransaction).description }}
        </span>
      </template>

      <template #reference-cell="{ row }">
        <span class="font-mono text-xs text-gray-500">
          {{ (row.original as ITransaction).bookingId || '—' }}
        </span>
      </template>

      <template #type-cell="{ row }">
        <UBadge
          :color="
            getBadgeProps((row.original as ITransaction).type).color as any
          "
          variant="subtle"
          size="xs"
          class="font-medium"
        >
          <UIcon
            :name="getBadgeProps((row.original as ITransaction).type).icon"
            class="mr-1 w-3 h-3"
          />
          {{ getBadgeProps((row.original as ITransaction).type).label }}
        </UBadge>
      </template>

      <template #amount-cell="{ row }">
        <span
          class="font-mono font-bold"
          :class="amountClass((row.original as ITransaction).type)"
        >
          {{
            formatAmount(
              (row.original as ITransaction).amount,
              (row.original as ITransaction).type,
            )
          }}
        </span>
      </template>

      <template #balanceAfter-cell="{ row }">
        <span class="font-mono text-sm text-gray-600 dark:text-gray-300">
          {{ formatCurrency((row.original as ITransaction).balanceAfter) }}
        </span>
      </template>

      <template #empty-state>
        <div class="py-10 text-center text-sm text-gray-500">
          {{ t('agency.wallet.movements.empty') }}
        </div>
      </template>
    </UTable>
  </UCard>
</template>
