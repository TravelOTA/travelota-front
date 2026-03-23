<script setup lang="ts">
import type { IDepositRequest, DepositRequestStatus } from "#shared/types/wallet";

definePageMeta({ layout: "dashboard" });
const { t, locale } = useI18n();

// --- Data ---
const { data: requests, refresh } = useAsyncData<IDepositRequest[]>(
  "admin:depositRequests",
  () => $fetch("/api/admin/deposit-requests"),
);

// --- Filter ---
const statusFilter = ref<DepositRequestStatus | "all">("all");

const statusOptions = computed(() => [
  { label: t("admin.depositRequests.filter.all"), value: "all" },
  { label: t("admin.depositRequests.status.pending"), value: "pending" },
  { label: t("admin.depositRequests.status.confirmed"), value: "confirmed" },
  { label: t("admin.depositRequests.status.rejected"), value: "rejected" },
]);

const filtered = computed(() => {
  if (!requests.value) return [];
  if (statusFilter.value === "all") return requests.value;
  return requests.value.filter((r) => r.status === statusFilter.value);
});

const pendingCount = computed(
  () => requests.value?.filter((r) => r.status === "pending").length ?? 0,
);

// --- Actions ---
const processing = ref<string | null>(null);
const confirmTarget = ref<IDepositRequest | null>(null);
const rejectTarget = ref<IDepositRequest | null>(null);

async function confirmRequest(req: IDepositRequest) {
  processing.value = req.id;
  try {
    await $fetch(`/api/admin/deposit-requests/${req.id}/confirm`, {
      method: "POST",
    });
    await refresh();
  } finally {
    processing.value = null;
    confirmTarget.value = null;
  }
}

async function rejectRequest(req: IDepositRequest) {
  processing.value = req.id;
  try {
    await $fetch(`/api/admin/deposit-requests/${req.id}/reject`, {
      method: "POST",
    });
    await refresh();
  } finally {
    processing.value = null;
    rejectTarget.value = null;
  }
}

// --- Formatting ---
const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat(locale.value, { style: "currency", currency }).format(
    amount,
  );

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(locale.value, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));

const statusBadge = (status: DepositRequestStatus) => {
  switch (status) {
    case "pending":
      return { color: "warning", label: t("admin.depositRequests.status.pending") };
    case "confirmed":
      return { color: "success", label: t("admin.depositRequests.status.confirmed") };
    case "rejected":
      return { color: "error", label: t("admin.depositRequests.status.rejected") };
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto pb-16">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton
          to="/dashboard/admin"
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          size="sm"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ t("admin.depositRequests.title") }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t("admin.depositRequests.subtitle") }}
          </p>
        </div>
      </div>
      <UBadge
        v-if="pendingCount > 0"
        color="warning"
        variant="solid"
        size="lg"
      >
        {{ pendingCount }} {{ t("admin.depositRequests.pendingBadge") }}
      </UBadge>
    </div>

    <!-- Filter -->
    <div class="mb-5 flex items-center gap-3">
      <USelect
        v-model="statusFilter"
        :options="statusOptions"
        option-attribute="label"
        value-attribute="value"
        class="w-48"
      />
      <span class="text-sm text-gray-500">
        {{ filtered.length }} {{ t("admin.depositRequests.results") }}
      </span>
    </div>

    <!-- Table -->
    <UCard :ui="{ body: 'p-0 sm:p-0' }">
      <UTable
        :data="filtered"
        :columns="[
          { accessorKey: 'createdAt', header: t('admin.depositRequests.col.date') },
          { accessorKey: 'agencyName', header: t('admin.depositRequests.col.agency') },
          { accessorKey: 'amount', header: t('admin.depositRequests.col.amount') },
          { accessorKey: 'concept', header: t('admin.depositRequests.col.concept') },
          { accessorKey: 'note', header: t('admin.depositRequests.col.note') },
          { accessorKey: 'status', header: t('admin.depositRequests.col.status') },
          { accessorKey: 'processedAt', header: t('admin.depositRequests.col.processedAt') },
          { accessorKey: 'actions', header: '' },
        ]"
        class="w-full"
      >
        <template #createdAt-cell="{ row }">
          <span class="text-sm text-gray-500">
            {{ formatDate((row.original as IDepositRequest).createdAt) }}
          </span>
        </template>

        <template #agencyName-cell="{ row }">
          <span class="font-medium text-gray-900 dark:text-white">
            {{ (row.original as IDepositRequest).agencyName }}
          </span>
          <p class="text-xs text-gray-400 font-mono">
            {{ (row.original as IDepositRequest).agencyId }}
          </p>
        </template>

        <template #amount-cell="{ row }">
          <span class="font-bold text-green-600 dark:text-green-400">
            {{
              formatCurrency(
                (row.original as IDepositRequest).amount,
                (row.original as IDepositRequest).currency,
              )
            }}
          </span>
        </template>

        <template #concept-cell="{ row }">
          <span class="font-mono text-xs text-primary-600 dark:text-primary-400 font-semibold">
            {{ (row.original as IDepositRequest).concept }}
          </span>
        </template>

        <template #note-cell="{ row }">
          <span class="text-sm text-gray-500 max-w-xs truncate block">
            {{ (row.original as IDepositRequest).note || "—" }}
          </span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="statusBadge((row.original as IDepositRequest).status).color as any"
            variant="subtle"
            size="xs"
          >
            {{ statusBadge((row.original as IDepositRequest).status).label }}
          </UBadge>
        </template>

        <template #processedAt-cell="{ row }">
          <span class="text-sm text-gray-500">
            {{
              (row.original as IDepositRequest).processedAt
                ? formatDate((row.original as IDepositRequest).processedAt!)
                : "—"
            }}
          </span>
        </template>

        <template #actions-cell="{ row }">
          <div
            v-if="(row.original as IDepositRequest).status === 'pending'"
            class="flex items-center gap-2"
          >
            <UButton
              size="xs"
              color="success"
              variant="soft"
              icon="i-heroicons-check"
              :loading="processing === (row.original as IDepositRequest).id"
              @click="confirmTarget = row.original as IDepositRequest"
            >
              {{ t("admin.depositRequests.confirm") }}
            </UButton>
            <UButton
              size="xs"
              color="error"
              variant="soft"
              icon="i-heroicons-x-mark"
              :loading="processing === (row.original as IDepositRequest).id"
              @click="rejectTarget = row.original as IDepositRequest"
            >
              {{ t("admin.depositRequests.reject") }}
            </UButton>
          </div>
        </template>

        <template #empty-state>
          <div class="py-12 text-center text-sm text-gray-500">
            {{ t("admin.depositRequests.empty") }}
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Confirm dialog -->
    <UModal v-model:open="confirmTarget" :ui="{ width: 'max-w-md' }">
      <template #content>
        <UCard v-if="confirmTarget">
          <template #header>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              {{ t("admin.depositRequests.confirmModal.title") }}
            </h3>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t("admin.depositRequests.confirmModal.body", {
              agency: confirmTarget.agencyName,
              amount: formatCurrency(confirmTarget.amount, confirmTarget.currency),
              concept: confirmTarget.concept,
            }) }}
          </p>
          <p class="mt-2 text-xs text-gray-400">
            {{ t("admin.depositRequests.confirmModal.warning") }}
          </p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="confirmTarget = null">
                {{ t("admin.depositRequests.cancel") }}
              </UButton>
              <UButton
                color="success"
                :loading="processing === confirmTarget?.id"
                @click="confirmRequest(confirmTarget!)"
              >
                {{ t("admin.depositRequests.confirmModal.action") }}
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Reject dialog -->
    <UModal v-model:open="rejectTarget" :ui="{ width: 'max-w-md' }">
      <template #content>
        <UCard v-if="rejectTarget">
          <template #header>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              {{ t("admin.depositRequests.rejectModal.title") }}
            </h3>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t("admin.depositRequests.rejectModal.body", {
              agency: rejectTarget.agencyName,
              amount: formatCurrency(rejectTarget.amount, rejectTarget.currency),
            }) }}
          </p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="ghost" @click="rejectTarget = null">
                {{ t("admin.depositRequests.cancel") }}
              </UButton>
              <UButton
                color="error"
                :loading="processing === rejectTarget?.id"
                @click="rejectRequest(rejectTarget!)"
              >
                {{ t("admin.depositRequests.rejectModal.action") }}
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
