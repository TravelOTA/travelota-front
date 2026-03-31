<script setup lang="ts">
import type { ITransaction } from "#shared/types/wallet";

const props = defineProps<{
  modelValue: boolean;
  transactions: ITransaction[];
  currency: string;
}>();
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const { t, locale } = useI18n();

type RangeKey = "lastMonth" | "last3Months" | "lastYear" | "allTime" | "custom";

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const selectedRange = ref<RangeKey>("lastMonth");
const customFrom = ref("");
const customTo = ref("");

const ranges: { key: RangeKey; label: string }[] = [
  { key: "lastMonth", label: "" },
  { key: "last3Months", label: "" },
  { key: "lastYear", label: "" },
  { key: "allTime", label: "" },
  { key: "custom", label: "" },
];

const localizedRanges = computed(() =>
  ranges.map((r) => ({ ...r, label: t(`agency.wallet.export.${r.key}`) })),
);

const filteredTransactions = computed(() => {
  const now = new Date();
  const from = (() => {
    switch (selectedRange.value) {
      case "lastMonth": {
        const d = new Date(now);
        d.setMonth(d.getMonth() - 1);
        return d;
      }
      case "last3Months": {
        const d = new Date(now);
        d.setMonth(d.getMonth() - 3);
        return d;
      }
      case "lastYear": {
        const d = new Date(now);
        d.setFullYear(d.getFullYear() - 1);
        return d;
      }
      case "allTime":
        return null;
      case "custom":
        return customFrom.value ? new Date(customFrom.value) : null;
    }
  })();

  const to =
    selectedRange.value === "custom" && customTo.value
      ? new Date(customTo.value)
      : null;

  return props.transactions.filter((tx) => {
    const date = new Date(tx.date);
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  });
});

function formatCurrency(amount: number) {
  return new Intl.NumberFormat(locale.value, {
    style: "currency",
    currency: props.currency,
  }).format(amount);
}

function typeLabel(type: string) {
  switch (type) {
    case "charge":
      return t("agency.wallet.type.charge");
    case "deposit":
      return t("agency.wallet.type.deposit");
    case "refund":
      return t("agency.wallet.type.refund");
    default:
      return type;
  }
}

function downloadCSV() {
  const headers = [
    t("agency.wallet.movements.date"),
    t("agency.wallet.movements.description"),
    t("agency.wallet.movements.reference"),
    t("agency.wallet.movements.type"),
    t("agency.wallet.movements.amount"),
    t("agency.wallet.movements.balanceAfter"),
  ];

  const rows = filteredTransactions.value.map((tx) => [
    new Date(tx.date).toISOString().split("T")[0],
    `"${tx.description.replace(/"/g, '""')}"`,
    tx.bookingId ?? "",
    typeLabel(tx.type),
    tx.type === "charge" ? -tx.amount : tx.amount,
    tx.balanceAfter,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wallet-export-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  open.value = false;
}
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              {{ t("agency.wallet.export.title") }}
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="sm"
              @click="open = false"
            />
          </div>
        </template>

        <div class="space-y-5">
          <!-- Range selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t("agency.wallet.export.range") }}
            </label>
            <div class="space-y-2">
              <label
                v-for="range in localizedRanges"
                :key="range.key"
                class="flex items-center gap-3 cursor-pointer"
              >
                <input
                  v-model="selectedRange"
                  type="radio"
                  :value="range.key"
                  class="text-primary-600"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {{ range.label }}
                </span>
              </label>
            </div>
          </div>

          <!-- Custom range inputs -->
          <div v-if="selectedRange === 'custom'" class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">
                {{ t("agency.wallet.export.from") }}
              </label>
              <UInput v-model="customFrom" type="date" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">
                {{ t("agency.wallet.export.to") }}
              </label>
              <UInput v-model="customTo" type="date" />
            </div>
          </div>

          <!-- Preview -->
          <p class="text-sm text-gray-500">
            {{
              t("agency.wallet.export.preview", {
                n: filteredTransactions.length,
              })
            }}
          </p>

          <UButton
            block
            icon="i-heroicons-arrow-down-tray"
            :disabled="filteredTransactions.length === 0"
            @click="downloadCSV"
          >
            {{ t("agency.wallet.export.download") }}
          </UButton>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
