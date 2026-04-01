<script setup lang="ts">
import type { ICreditLine } from '#shared/types/wallet';

const props = defineProps<{
  creditLine: ICreditLine;
  agencyName: string;
}>();

const emit = defineEmits<{
  save: [value: ICreditLine];
}>();

const { t, locale } = useI18n();

const newLimit = ref(props.creditLine.limit);
const selectedStatus = ref(props.creditLine.status);
const adjustmentAmount = ref<number | null>(null);
const adjustmentNote = ref('');

watch(
  () => props.creditLine.limit,
  (val) => {
    newLimit.value = val;
  },
);
watch(
  () => props.creditLine.status,
  (val) => {
    selectedStatus.value = val;
  },
);

const mockLedger = ref([
  {
    id: 1,
    date: '2026-03-10',
    description: 'Reserva HB-4921',
    type: 'charge',
    amount: -800,
    balance: 9200,
  },
  {
    id: 2,
    date: '2026-03-15',
    description: 'Reserva HB-5102',
    type: 'charge',
    amount: -1200,
    balance: 8000,
  },
  {
    id: 3,
    date: '2026-03-18',
    description: 'Ajuste manual',
    type: 'deposit',
    amount: 500,
    balance: 8500,
  },
  {
    id: 4,
    date: '2026-03-22',
    description: 'Reserva HB-5310',
    type: 'charge',
    amount: -1700,
    balance: 6800,
  },
]);

const ledgerColumns = computed(() => [
  { accessorKey: 'date', header: t('agency.wallet.movements.date') },
  {
    accessorKey: 'description',
    header: t('agency.wallet.movements.description'),
  },
  { accessorKey: 'type', header: t('agency.wallet.movements.type') },
  { accessorKey: 'amount', header: t('agency.wallet.movements.amount') },
  { accessorKey: 'balance', header: t('agency.wallet.movements.balanceAfter') },
]);

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

const usagePercent = computed(() => {
  if (!props.creditLine.limit) return 0;
  return Math.min((props.creditLine.used / props.creditLine.limit) * 100, 100);
});

const progressColor = computed(() => {
  const p = usagePercent.value;
  if (p > 90) return 'error';
  if (p > 70) return 'warning';
  return 'primary';
});

function saveChanges() {
  const updated: ICreditLine = {
    ...props.creditLine,
    limit: newLimit.value,
    status: selectedStatus.value,
    available: newLimit.value - props.creditLine.used,
  };
  emit('save', updated);
}

function applyAdjustment() {
  if (!adjustmentAmount.value) return;

  const amount = adjustmentAmount.value;
  const isDeposit = amount > 0; // Deposit increases balance/available, decreases used/debt

  const updated: ICreditLine = {
    ...props.creditLine,
    used: Math.max(0, props.creditLine.used - amount),
    debt: Math.max(0, props.creditLine.debt - amount),
    available: props.creditLine.available + amount,
  };

  // Add to mock ledger
  mockLedger.value.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0]!,
    description: adjustmentNote.value || 'Ajuste administrativo',
    type: isDeposit ? 'deposit' : 'charge',
    amount: amount,
    balance: updated.available, // Simple mock balance
  });

  adjustmentAmount.value = null;
  adjustmentNote.value = '';

  emit('save', updated);
}
</script>

<template>
  <div class="space-y-6">
    <!-- 0. Sticky Progress Bar -->
    <div
      class="sticky top-[-24px] bg-white dark:bg-gray-900 z-20 pt-2 pb-4 -mx-6 px-6 border-b border-gray-100 dark:border-gray-800 shadow-sm mb-4"
    >
      <div class="flex justify-between items-end mb-2">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-widest"
          >Uso de la Línea</span
        >
        <span
          class="text-xs font-black"
          :class="
            usagePercent > 90
              ? 'text-red-500'
              : usagePercent > 70
                ? 'text-orange-500'
                : 'text-primary-500'
          "
        >
          {{ usagePercent.toFixed(1) }}%
        </span>
      </div>
      <UProgress
        v-model="usagePercent"
        :color="progressColor as any"
        size="lg"
      />
    </div>

    <!-- 1. Summary row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <p
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
        >
          {{ t('agency.wallet.credit.limit') }}
        </p>
        <p class="text-xl font-black text-gray-900 dark:text-white">
          {{ formatCurrency(creditLine.limit) }}
        </p>
      </div>
      <div
        class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <p
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
        >
          {{ t('agency.wallet.credit.used') }}
        </p>
        <p class="text-xl font-black text-orange-600 dark:text-orange-400">
          {{ formatCurrency(creditLine.used) }}
        </p>
      </div>
      <div
        class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <p
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
        >
          {{ t('agency.wallet.credit.available') }}
        </p>
        <p class="text-xl font-black text-green-600 dark:text-green-400">
          {{ formatCurrency(creditLine.available) }}
        </p>
      </div>
      <div
        class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <div class="flex justify-between items-start mb-2">
          <p
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            {{ t('agency.wallet.credit.debt') }}
          </p>
          <UBadge
            :color="creditLine.status === 'active' ? 'success' : 'error'"
            variant="subtle"
            size="xs"
            class="font-bold uppercase tracking-tighter text-[9px]"
          >
            {{ creditLine.status === 'active' ? 'Activo' : 'Bloqueado' }}
          </UBadge>
        </div>
        <p
          class="text-xl font-black"
          :class="
            creditLine.debt > 0
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-900 dark:text-white'
          "
        >
          {{ formatCurrency(creditLine.debt) }}
        </p>
      </div>
    </div>

    <!-- 2. Ledger table -->
    <div>
      <h4 class="font-bold text-sm mb-2">
        {{ t('agency.wallet.movements.title') }}
      </h4>
      <UTable :data="mockLedger" :columns="ledgerColumns">
        <template #amount-cell="{ row }">
          <span
            :class="
              row.original.amount < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            "
          >
            {{ formatCurrency(row.original.amount) }}
          </span>
        </template>
        <template #balance-cell="{ row }">
          {{ formatCurrency(row.original.balance) }}
        </template>
        <template #type-cell="{ row }">
          <UBadge
            :color="row.original.type === 'charge' ? 'error' : 'success'"
            variant="soft"
            size="xs"
          >
            {{ t(`agency.wallet.type.${row.original.type}`) }}
          </UBadge>
        </template>
      </UTable>
    </div>

    <!-- 3. Management Actions (Stacked vertically) -->
    <div
      class="flex flex-col gap-8 border-t border-gray-200 dark:border-gray-800 pt-8 mt-4"
    >
      <!-- 3a. Adjust limit and Status -->
      <div class="space-y-6">
        <h4 class="font-bold text-sm flex items-center gap-2">
          <UIcon
            name="i-heroicons-cog-6-tooth"
            class="w-4 h-4 text-primary-500"
          />
          Configuración General
        </h4>

        <UFormField :label="t('agency.wallet.credit.newLimit')">
          <div class="flex gap-2">
            <UInput
              v-model.number="newLimit"
              type="number"
              :min="0"
              class="flex-1"
            />
            <UButton
              color="primary"
              variant="soft"
              :disabled="newLimit === props.creditLine.limit"
              @click="saveChanges"
            >
              {{ t('agency.wallet.credit.save') }}
            </UButton>
          </div>
        </UFormField>

        <UFormField label="Estado de la Línea">
          <div class="flex items-center gap-4">
            <UBadge
              :color="selectedStatus === 'active' ? 'success' : 'error'"
              variant="subtle"
              class="font-bold uppercase tracking-wider text-[10px]"
            >
              {{ selectedStatus === 'active' ? 'Activa' : 'Bloqueada' }}
            </UBadge>
            <UButton
              :color="selectedStatus === 'active' ? 'error' : 'success'"
              variant="ghost"
              size="xs"
              :icon="
                selectedStatus === 'active'
                  ? 'i-heroicons-lock-closed'
                  : 'i-heroicons-lock-open'
              "
              @click="
                selectedStatus =
                  selectedStatus === 'active' ? 'blocked' : 'active';
                saveChanges();
              "
            >
              {{
                selectedStatus === 'active'
                  ? 'Bloquear Crédito'
                  : 'Activar Crédito'
              }}
            </UButton>
          </div>
        </UFormField>
      </div>

      <div class="h-px bg-gray-100 dark:bg-gray-800 w-full" />

      <!-- 3b. Manual Adjustment -->
      <div
        class="space-y-4 bg-gray-50/50 dark:bg-gray-800/20 p-5 rounded-2xl border border-gray-200 dark:border-gray-800"
      >
        <h4 class="font-bold text-sm flex items-center gap-2">
          <UIcon
            name="i-heroicons-arrows-right-left"
            class="w-4 h-4 text-primary-500"
          />
          Ajuste Manual / Pago
        </h4>
        <p class="text-xs text-gray-500">
          Usa este formulario para registrar pagos recibidos o ajustes de saldo
          manuales.
          <br /><strong>Positivo (+):</strong> Registra un pago (reduce deuda).
          <br /><strong>Negativo (-):</strong> Registra un cargo manual.
        </p>

        <div class="space-y-3">
          <UFormField label="Monto del Ajuste (USD)">
            <UInput
              v-model.number="adjustmentAmount"
              type="number"
              placeholder="Ej: 500 o -500"
            />
          </UFormField>
          <UFormField label="Nota / Concepto">
            <UInput
              v-model="adjustmentNote"
              placeholder="Ej: Pago transferencia BBVA..."
            />
          </UFormField>
          <UButton
            block
            color="primary"
            :disabled="!adjustmentAmount"
            icon="i-heroicons-check"
            @click="applyAdjustment"
          >
            Aplicar Ajuste
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
