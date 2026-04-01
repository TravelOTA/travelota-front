<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const { t } = useI18n();

const QUICK_AMOUNTS = [1000, 5000, 10000, 20000];

const BANK_DETAILS = {
  bank: 'Banco Santander España',
  holder: 'TravelOTA S.L.',
  iban: 'ES91 2100 0418 4502 0005 1332',
  bic: 'CAIXESBBXXX',
};

const AGENCY_ID = 'AGC-0042'; // MVP: hardcoded; will come from useAgency when API is ready

const step = ref<1 | 2>(1);
const amount = ref<number | null>(null);
const note = ref('');
const amountError = ref('');
const submitting = ref(false);

const rechargeReference = computed(() => `TOT-${AGENCY_ID}`);

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

function selectQuickAmount(value: number) {
  amount.value = value;
  amountError.value = '';
}

function validate() {
  if (!amount.value || amount.value < 100) {
    amountError.value = t('agency.wallet.recharge.amountMin');
    return false;
  }
  amountError.value = '';
  return true;
}

async function confirm() {
  if (!validate()) return;
  submitting.value = true;
  try {
    await $fetch('/api/deposit-requests', {
      method: 'POST',
      body: {
        amount: amount.value,
        currency: 'USD',
        concept: rechargeReference.value,
        note: note.value || undefined,
      },
    });
    step.value = 2;
  } catch {
    // Non-blocking: still show bank details so agency can transfer manually
    step.value = 2;
  } finally {
    submitting.value = false;
  }
}

function close() {
  open.value = false;
}

function onAfterLeave() {
  // reset state when modal fully closes
  step.value = 1;
  amount.value = null;
  note.value = '';
  amountError.value = '';
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}
</script>

<template>
  <UModal v-model:open="open" @after-leave="onAfterLeave">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              {{ t('agency.wallet.recharge.title') }}
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="sm"
              @click="close"
            />
          </div>
        </template>

        <!-- Step 1: form -->
        <div v-if="step === 1" class="space-y-5">
          <p class="text-sm text-gray-500">
            {{ t('agency.wallet.recharge.subtitle') }}
          </p>

          <!-- Amount -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              {{ t('agency.wallet.recharge.amount') }}
            </label>
            <UInput
              v-model.number="amount"
              type="number"
              min="100"
              step="100"
              :placeholder="t('agency.wallet.recharge.amountPlaceholder')"
              :ui="{ base: 'pl-7' }"
              @input="amountError = ''"
            >
              <template #leading>
                <span class="text-gray-400 text-sm">$</span>
              </template>
            </UInput>
            <p v-if="amountError" class="mt-1 text-xs text-red-500">
              {{ amountError }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-400">
              {{ t('agency.wallet.recharge.amountMin') }}
            </p>
          </div>

          <!-- Quick amounts -->
          <div class="flex gap-2">
            <UButton
              v-for="qa in QUICK_AMOUNTS"
              :key="qa"
              :variant="amount === qa ? 'solid' : 'outline'"
              :color="amount === qa ? 'primary' : 'neutral'"
              size="sm"
              class="flex-1"
              @click="selectQuickAmount(qa)"
            >
              ${{ (qa / 1000).toFixed(0) }}K
            </UButton>
          </div>

          <!-- Method -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ t('agency.wallet.recharge.method') }}
            </label>
            <div class="space-y-2">
              <!-- Bank transfer (selected) -->
              <div
                class="flex items-start gap-3 rounded-lg border-2 border-primary-500 bg-primary-50 dark:bg-primary-950/20 p-3 cursor-pointer"
              >
                <UIcon
                  name="i-heroicons-building-library"
                  class="w-5 h-5 text-primary-600 mt-0.5 shrink-0"
                />
                <div>
                  <p
                    class="text-sm font-semibold text-primary-700 dark:text-primary-400"
                  >
                    {{ t('agency.wallet.recharge.methodBank') }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ t('agency.wallet.recharge.methodBankHint') }}
                  </p>
                </div>
              </div>

              <!-- Card (disabled) -->
              <div
                class="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 opacity-50 cursor-not-allowed"
              >
                <UIcon
                  name="i-heroicons-credit-card"
                  class="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                />
                <div>
                  <p
                    class="text-sm font-medium text-gray-500 flex items-center gap-2"
                  >
                    {{ t('agency.wallet.recharge.methodCard') }}
                    <UBadge color="neutral" variant="subtle" size="xs">
                      {{ t('agency.wallet.recharge.methodCardSoon') }}
                    </UBadge>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Note -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              {{ t('agency.wallet.recharge.note') }}
            </label>
            <UTextarea
              v-model="note"
              :placeholder="t('agency.wallet.recharge.notePlaceholder')"
              :rows="2"
            />
          </div>

          <UButton block size="md" :loading="submitting" @click="confirm">
            {{ t('agency.wallet.recharge.confirm') }}
          </UButton>
        </div>

        <!-- Step 2: bank instructions -->
        <div v-else class="space-y-5">
          <div class="text-center">
            <div
              class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-3"
            >
              <UIcon name="i-heroicons-check" class="w-6 h-6 text-green-600" />
            </div>
            <h4 class="text-base font-semibold text-gray-900 dark:text-white">
              {{ t('agency.wallet.recharge.success.title') }}
            </h4>
            <p class="mt-1 text-sm text-gray-500">
              {{ t('agency.wallet.recharge.success.description') }}
            </p>
          </div>

          <!-- Bank details -->
          <div
            class="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden"
          >
            <div class="px-4 py-2.5 bg-gray-50 dark:bg-gray-800">
              <p
                class="text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {{ t('agency.wallet.recharge.bank.title') }}
              </p>
            </div>

            <div
              v-for="field in [
                {
                  key: 'bank',
                  label: t('agency.wallet.recharge.bank.bankName'),
                  value: BANK_DETAILS.bank,
                  copy: false,
                },
                {
                  key: 'holder',
                  label: t('agency.wallet.recharge.bank.holder'),
                  value: BANK_DETAILS.holder,
                  copy: false,
                },
                {
                  key: 'iban',
                  label: t('agency.wallet.recharge.bank.iban'),
                  value: BANK_DETAILS.iban,
                  copy: true,
                },
                {
                  key: 'bic',
                  label: t('agency.wallet.recharge.bank.bic'),
                  value: BANK_DETAILS.bic,
                  copy: true,
                },
                {
                  key: 'concept',
                  label: t('agency.wallet.recharge.bank.concept'),
                  value: rechargeReference,
                  copy: true,
                },
              ]"
              :key="field.key"
              class="flex items-center justify-between px-4 py-3 gap-4"
            >
              <span class="text-xs text-gray-500 shrink-0">{{
                field.label
              }}</span>
              <div class="flex items-center gap-2 min-w-0">
                <span
                  class="text-sm font-semibold text-gray-900 dark:text-white font-mono truncate"
                  :class="{
                    'text-primary-600 dark:text-primary-400':
                      field.key === 'concept',
                  }"
                >
                  {{ field.value }}
                </span>
                <UButton
                  v-if="field.copy"
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-clipboard-document"
                  size="xs"
                  @click="copyToClipboard(String(field.value))"
                />
              </div>
            </div>
          </div>

          <!-- Exact amount highlight -->
          <div
            class="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 text-center"
          >
            <p class="text-xs font-medium text-green-700 dark:text-green-400">
              {{ t('agency.wallet.recharge.bank.exactAmount') }}
            </p>
            <p
              class="mt-1 text-2xl font-extrabold text-green-700 dark:text-green-400"
            >
              ${{ amount?.toLocaleString() }}
            </p>
          </div>

          <p class="text-xs text-gray-400 text-center">
            {{
              t('agency.wallet.recharge.bank.conceptWarning', {
                concept: rechargeReference,
              })
            }}
          </p>

          <UButton block color="neutral" variant="outline" @click="close">
            {{ t('agency.wallet.recharge.close') }}
          </UButton>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
