<script setup lang="ts">
import type { ICreditLine } from '#shared/types/wallet';

const props = defineProps<{
  modelValue: boolean;
  creditLine: ICreditLine;
  agencyName: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:creditLine': [value: ICreditLine];
}>();

const { t, locale } = useI18n();

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const newLimit = ref(props.creditLine.limit);

const mockLedger = [
  { date: '2026-03-10', description: 'Reserva HB-4921', type: 'Cargo', amount: -800, balance: 9200 },
  { date: '2026-03-15', description: 'Reserva HB-5102', type: 'Cargo', amount: -1200, balance: 8000 },
  { date: '2026-03-18', description: 'Ajuste manual', type: 'Crédito', amount: 500, balance: 8500 },
  { date: '2026-03-22', description: 'Reserva HB-5310', type: 'Cargo', amount: -1700, balance: 6800 },
];

const ledgerColumns = [
  { accessorKey: 'date', header: 'Fecha' },
  { accessorKey: 'description', header: 'Descripción' },
  { accessorKey: 'type', header: 'Tipo' },
  { accessorKey: 'amount', header: 'Monto' },
  { accessorKey: 'balance', header: 'Disponible' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'USD' }).format(amount);
}

function saveLimit() {
  if (!newLimit.value || newLimit.value === props.creditLine.limit) return;
  const updated: ICreditLine = {
    ...props.creditLine,
    limit: newLimit.value,
    available: newLimit.value - props.creditLine.used,
  };
  emit('update:creditLine', updated);
  open.value = false;
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`${agencyName} — ${t('agency.wallet.credit.title')}`"
    size="xl"
  >
    <template #body>
      <!-- 1. Summary row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p class="text-xs text-gray-500 mb-1">{{ t('agency.wallet.credit.limit') }}</p>
          <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(creditLine.limit) }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p class="text-xs text-gray-500 mb-1">{{ t('agency.wallet.credit.used') }}</p>
          <p class="text-lg font-bold text-orange-600 dark:text-orange-400">{{ formatCurrency(creditLine.used) }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p class="text-xs text-gray-500 mb-1">{{ t('agency.wallet.credit.available') }}</p>
          <p class="text-lg font-bold text-green-600 dark:text-green-400">{{ formatCurrency(creditLine.available) }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p class="text-xs text-gray-500 mb-1">{{ t('agency.wallet.credit.debt') }}</p>
          <p class="text-lg font-bold" :class="creditLine.debt > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'">
            {{ formatCurrency(creditLine.debt) }}
          </p>
          <UBadge
            :color="creditLine.status === 'active' ? 'success' : 'error'"
            variant="subtle"
            size="xs"
            class="mt-1"
          >
            {{ creditLine.status === 'active' ? t('agency.wallet.credit.statusActive') : t('agency.wallet.credit.statusBlocked') }}
          </UBadge>
        </div>
      </div>

      <!-- 2. Ledger table -->
      <h4 class="font-bold text-sm mb-2">{{ t('agency.wallet.movements.title') }}</h4>
      <UTable :data="mockLedger" :columns="ledgerColumns">
        <template #amount-cell="{ row }">
          <span :class="row.original.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
            {{ formatCurrency(row.original.amount) }}
          </span>
        </template>
        <template #balance-cell="{ row }">
          {{ formatCurrency(row.original.balance) }}
        </template>
        <template #type-cell="{ row }">
          <UBadge
            :color="row.original.type === 'Cargo' ? 'error' : 'success'"
            variant="subtle"
            size="xs"
          >
            {{ row.original.type }}
          </UBadge>
        </template>
      </UTable>

      <!-- 3. Adjust limit form -->
      <div class="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
        <h4 class="font-bold text-sm mb-3">Ajustar Límite</h4>
        <div class="flex items-end gap-3">
          <UFormField label="Nuevo límite (USD)" class="flex-1">
            <UInput v-model.number="newLimit" type="number" :min="0" />
          </UFormField>
          <UButton
            color="primary"
            :disabled="!newLimit || newLimit === creditLine.limit"
            @click="saveLimit"
          >
            Guardar
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
