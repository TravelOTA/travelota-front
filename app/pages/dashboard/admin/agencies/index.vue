<script setup lang="ts">
import { useAgencies, type AdminAgency } from "~/composables/useAgencies";
import { apiFetch } from "~/composables/useApi";

definePageMeta({ layout: "dashboard" });
useHead({ title: "Gestor de Agencias B2B - TravelOTA" });

const { t } = useI18n();

const {
  agencies,
  agencyStats: stats,
  fetchAgencies,
  approveAgency,
  denyAgency,
  deleteAgency,
  toggleBlock,
} = useAgencies();
const { groups: agencyGroups } = useAgencyGroups();

onMounted(() => fetchAgencies());

// ── Filters ────────────────────────────────────────────────────────────────
const searchQuery = ref("");
const statusFilter = ref<"all" | "active" | "pending" | "blocked" | "denied">(
  "all",
);

const STATUS_LABELS: Record<string, string> = {
  active: "Activa",
  pending: "Pendiente",
  blocked: "Bloqueada",
  denied: "Denegada",
};

const filteredAgencies = computed(() => {
  return agencies.value.filter((a) => {
    const matchSearch =
      !searchQuery.value ||
      a.commercial_name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.country.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus =
      statusFilter.value === "all" || a.status === statusFilter.value;
    return matchSearch && matchStatus;
  });
});

// ── Status helpers ─────────────────────────────────────────────────────────
function statusColor(s: string) {
  if (s === "active") return "success";
  if (s === "pending") return "warning";
  if (s === "blocked") return "error";
  if (s === "denied") return "neutral";
  return "neutral";
}

// ── Nueva Agencia modal ────────────────────────────────────────────────────
const isCreateOpen = ref(false);
const newAgency = ref({
  commercial_name: "",
  country: "",
  email: "",
  phone: "",
});

const isCreateValid = computed(
  () =>
    newAgency.value.commercial_name.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAgency.value.email),
);

const groupNames = computed(() => agencyGroups.value.map((g) => g.name));

function openCreate() {
  newAgency.value = {
    commercial_name: "",
    country: "",
    email: "",
    phone: "",
  };
  isCreateOpen.value = true;
}

async function saveAgency() {
  if (!isCreateValid.value) return;
  try {
    await apiFetch("/api/agency/agencies", {
      method: "POST",
      body: newAgency.value,
    });
    await fetchAgencies();
  } catch {
    // errors surfaced by composable
  }
  isCreateOpen.value = false;
}

// ── Aprobar modal ──────────────────────────────────────────────────────────
const isApproveOpen = ref(false);
const agencyToApprove = ref<AdminAgency | null>(null);
const selectedGroupId = ref<number | null>(null);

const selectedGroup = computed(
  () =>
    agencyGroups.value.find(
      (g) => String(g.id) === String(selectedGroupId.value),
    ) ?? null,
);

const selectedGroupName = computed({
  get: () => selectedGroup.value?.name ?? "",
  set: (name: string) => {
    const found = agencyGroups.value.find((g) => g.name === name);
    selectedGroupId.value = found ? Number(found.id) : null;
  },
});

function openApprove(agency: AdminAgency) {
  agencyToApprove.value = agency;
  selectedGroupId.value = null;
  isApproveOpen.value = true;
}

async function confirmApprove() {
  if (!agencyToApprove.value || selectedGroupId.value === null) return;
  await approveAgency(agencyToApprove.value.id, selectedGroupId.value);
  isApproveOpen.value = false;
  agencyToApprove.value = null;
}

// ── Denegar modal ──────────────────────────────────────────────────────────
const isDenyOpen = ref(false);
const agencyToDeny = ref<AdminAgency | null>(null);

function openDeny(agency: AdminAgency) {
  agencyToDeny.value = agency;
  isDenyOpen.value = true;
}

async function confirmDeny() {
  if (!agencyToDeny.value) return;
  await denyAgency(agencyToDeny.value.id);
  isDenyOpen.value = false;
  agencyToDeny.value = null;
}

// ── Eliminar modal ─────────────────────────────────────────────────────────
const isDeleteOpen = ref(false);
const agencyToDelete = ref<AdminAgency | null>(null);

function openDelete(agency: AdminAgency) {
  agencyToDelete.value = agency;
  isDeleteOpen.value = true;
}

async function confirmDelete() {
  if (!agencyToDelete.value) return;
  await deleteAgency(agencyToDelete.value.id);
  isDeleteOpen.value = false;
  agencyToDelete.value = null;
}

// ── Table columns ──────────────────────────────────────────────────────────
const columns = computed(() => [
  {
    accessorKey: "commercial_name",
    header: t("admin.agencies.tableHeaders.agency"),
  },
  { accessorKey: "country", header: t("admin.agencies.tableHeaders.country") },
  { accessorKey: "email", header: t("admin.agencies.tableHeaders.contact") },
  {
    accessorKey: "agency_group",
    header: t("admin.agencies.tableHeaders.group"),
  },
  { accessorKey: "user_count", header: t("admin.agencies.tableHeaders.users") },
  {
    accessorKey: "booking_count",
    header: t("admin.agencies.tableHeaders.bookings"),
  },
  { accessorKey: "status", header: t("admin.agencies.tableHeaders.status") },
  { accessorKey: "actions", header: "" },
]);
</script>

<template>
  <div class="max-w-7xl mx-auto pb-16">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <NuxtLink
          to="/dashboard/admin"
          class="text-sm font-medium text-primary-500 hover:underline mb-2 inline-flex items-center gap-1"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          {{ t("admin.agencies.backToPanel") }}
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t("admin.agencies.title") }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.agencies.subtitle") }}
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        :label="t('admin.agencies.newAgency')"
        @click="openCreate"
      />
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600"
          >
            <UIcon name="i-heroicons-building-storefront" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">
              {{ t("admin.agencies.stats.total") }}
            </p>
            <p class="text-xl font-bold">{{ stats.total }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"
          >
            <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">
              {{ t("admin.agencies.stats.active") }}
            </p>
            <p class="text-xl font-bold">{{ stats.active }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600"
          >
            <UIcon name="i-heroicons-clock" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">
              {{ t("admin.agencies.stats.pending") }}
            </p>
            <p class="text-xl font-bold">{{ stats.pending }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600"
          >
            <UIcon name="i-heroicons-no-symbol" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">
              {{ t("admin.agencies.stats.blocked") }}
            </p>
            <p class="text-xl font-bold">{{ stats.blocked }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Pending alert -->
    <UAlert
      v-if="stats.pending > 0"
      icon="i-heroicons-exclamation-triangle"
      color="warning"
      variant="soft"
      class="mb-6"
      :title="`${stats.pending} agencia${stats.pending > 1 ? 's' : ''} pendiente${stats.pending > 1 ? 's' : ''} de aprobación`"
      :description="t('admin.agencies.alertDescription')"
    />

    <!-- Table card -->
    <UCard class="shadow-sm rounded-xl" :ui="{ body: 'p-0 sm:p-0' }">
      <div
        class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          :placeholder="t('admin.agencies.search')"
          class="w-full sm:w-80"
        />
        <USelectMenu
          v-model="statusFilter"
          :items="[
            { label: 'Todas', value: 'all' },
            { label: 'Pendiente', value: 'pending' },
            { label: 'Activa', value: 'active' },
            { label: 'Bloqueada', value: 'blocked' },
            { label: 'Denegada', value: 'denied' },
          ]"
          value-key="value"
          :placeholder="t('admin.agencies.filterPlaceholder')"
          class="w-40"
        />
      </div>

      <UTable :data="filteredAgencies" :columns="columns as any" class="w-full">
        <!-- Agency name -->
        <template #commercial_name-cell="{ row }">
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ row.original.commercial_name }}
            </p>
            <p class="text-xs text-gray-400 font-mono">{{ row.original.id }}</p>
          </div>
        </template>

        <!-- Contact -->
        <template #email-cell="{ row }">
          <div class="text-sm">
            <p class="text-gray-700 dark:text-gray-300">
              {{ row.original.email }}
            </p>
            <p class="text-xs text-gray-400">{{ row.original.phone }}</p>
          </div>
        </template>

        <!-- Agency group -->
        <template #agency_group-cell="{ row }">
          <span class="font-medium text-gray-900 dark:text-gray-100">
            {{ row.original.agency_group?.name ?? "—" }}
          </span>
        </template>

        <!-- Users -->
        <template #user_count-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-users" class="w-3.5 h-3.5 text-gray-400" />
            <span class="text-sm">{{ row.original.user_count }}</span>
          </div>
        </template>

        <!-- Bookings -->
        <template #booking_count-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-heroicons-briefcase"
              class="w-3.5 h-3.5 text-gray-400"
            />
            <span class="text-sm">{{ row.original.booking_count }}</span>
          </div>
        </template>

        <!-- Status -->
        <template #status-cell="{ row }">
          <UBadge
            :color="statusColor(row.original.status) as any"
            variant="subtle"
            class="font-bold text-[10px] uppercase tracking-wider"
          >
            {{ STATUS_LABELS[row.original.status] ?? row.original.status }}
          </UBadge>
        </template>

        <!-- Actions -->
        <template #actions-cell="{ row }">
          <div class="flex items-center justify-end gap-1 pr-2">
            <UTooltip :text="t('admin.agencies.tooltips.viewDetail')">
              <UButton
                icon="i-heroicons-eye"
                color="neutral"
                variant="ghost"
                size="xs"
                :to="`/dashboard/admin/agencies/${row.original.id}`"
              />
            </UTooltip>

            <!-- pending: Aprobar + Denegar -->
            <UTooltip
              v-if="row.original.status === 'pending'"
              :text="t('admin.agencies.tooltips.approve')"
            >
              <UButton
                icon="i-heroicons-check-circle"
                color="success"
                variant="ghost"
                size="xs"
                @click="openApprove(row.original)"
              />
            </UTooltip>
            <UTooltip
              v-if="row.original.status === 'pending'"
              :text="t('admin.agencies.tooltips.deny')"
            >
              <UButton
                icon="i-heroicons-x-circle"
                color="error"
                variant="ghost"
                size="xs"
                @click="openDeny(row.original)"
              />
            </UTooltip>

            <!-- active / blocked: toggleBlock -->
            <UTooltip
              v-if="
                row.original.status === 'active' ||
                row.original.status === 'blocked'
              "
              :text="
                row.original.status === 'blocked'
                  ? t('admin.agencies.tooltips.unblock')
                  : t('admin.agencies.tooltips.block')
              "
            >
              <UButton
                :icon="
                  row.original.status === 'blocked'
                    ? 'i-heroicons-lock-open'
                    : 'i-heroicons-no-symbol'
                "
                :color="row.original.status === 'blocked' ? 'success' : 'error'"
                variant="ghost"
                size="xs"
                @click="toggleBlock(row.original.id)"
              />
            </UTooltip>

            <!-- denied: Eliminar -->
            <UTooltip
              v-if="row.original.status === 'denied'"
              :text="t('admin.agencies.tooltips.delete')"
            >
              <UButton
                icon="i-heroicons-trash"
                color="error"
                variant="ghost"
                size="xs"
                @click="openDelete(row.original)"
              />
            </UTooltip>
          </div>
        </template>
      </UTable>

      <div
        v-if="filteredAgencies.length === 0"
        class="py-16 text-center text-sm text-gray-500"
      >
        {{ t("admin.agencies.noResults") }}
      </div>
    </UCard>

    <!-- Create modal -->
    <UModal
      v-model:open="isCreateOpen"
      :title="t('admin.agencies.modals.create.title')"
    >
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField
              :label="t('admin.agencies.modals.create.agencyName')"
              name="commercial_name"
              required
              class="sm:col-span-2"
            >
              <UInput
                v-model="newAgency.commercial_name"
                :placeholder="t('admin.agencies.modals.create.nameExample')"
                icon="i-heroicons-building-storefront"
              />
            </UFormField>
            <UFormField
              :label="t('admin.agencies.modals.create.country')"
              name="country"
              required
            >
              <UInput
                v-model="newAgency.country"
                placeholder="España"
                icon="i-heroicons-globe-alt"
              />
            </UFormField>
            <UFormField
              :label="t('admin.agencies.modals.create.email')"
              name="email"
              required
              class="sm:col-span-2"
            >
              <UInput
                v-model="newAgency.email"
                type="email"
                placeholder="b2b@agencia.com"
                icon="i-heroicons-envelope"
              />
            </UFormField>
            <UFormField
              :label="t('admin.agencies.modals.create.phone')"
              name="phone"
              class="sm:col-span-2"
            >
              <UInput
                v-model="newAgency.phone"
                placeholder="+34 91 000 00 00"
                icon="i-heroicons-phone"
              />
            </UFormField>
          </div>
          <UAlert
            icon="i-heroicons-information-circle"
            color="info"
            variant="soft"
            :description="t('admin.agencies.modals.create.alert')"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('admin.agencies.modals.create.cancel')"
            @click="isCreateOpen = false"
          />
          <UButton
            color="primary"
            :label="t('admin.agencies.modals.create.create')"
            icon="i-heroicons-plus"
            :disabled="!isCreateValid"
            @click="saveAgency"
          />
        </div>
      </template>
    </UModal>

    <!-- Aprobar modal -->
    <UModal
      v-model:open="isApproveOpen"
      :title="t('admin.agencies.modals.approve.title')"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ t("admin.agencies.modals.approve.selectGroup") }}
            <strong>{{ agencyToApprove?.commercial_name }}</strong
            >.
          </p>
          <UFormField
            :label="t('admin.agencies.modals.approve.groupField')"
            name="approveGroup"
            required
          >
            <USelectMenu
              v-model="selectedGroupName"
              :items="groupNames"
              :placeholder="t('admin.agencies.modals.approve.groupPlaceholder')"
              icon="i-heroicons-user-group"
              class="w-full"
            />
          </UFormField>
          <UAlert
            v-if="selectedGroup"
            icon="i-heroicons-information-circle"
            color="info"
            variant="soft"
            :description="`${t('admin.agencies.modals.approve.markupApplied')} ${selectedGroup.baseMarkup}%`"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('admin.agencies.modals.approve.cancel')"
            @click="isApproveOpen = false"
          />
          <UButton
            color="success"
            :label="t('admin.agencies.modals.approve.approve')"
            icon="i-heroicons-check-circle"
            :disabled="!selectedGroup"
            @click="confirmApprove"
          />
        </div>
      </template>
    </UModal>

    <!-- Denegar modal -->
    <UModal
      v-model:open="isDenyOpen"
      :title="t('admin.agencies.modals.deny.title')"
    >
      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ t("admin.agencies.modals.deny.message") }}
          <strong>{{ agencyToDeny?.commercial_name }}</strong
          >?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('admin.agencies.modals.deny.cancel')"
            @click="isDenyOpen = false"
          />
          <UButton
            color="error"
            :label="t('admin.agencies.modals.deny.deny')"
            icon="i-heroicons-x-circle"
            @click="confirmDeny"
          />
        </div>
      </template>
    </UModal>

    <!-- Eliminar modal -->
    <UModal
      v-model:open="isDeleteOpen"
      :title="t('admin.agencies.modals.delete.title')"
    >
      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ t("admin.agencies.modals.delete.message") }}
          <strong>{{ agencyToDelete?.commercial_name }}</strong
          >. {{ t("admin.agencies.modals.delete.continue") }}
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('admin.agencies.modals.delete.cancel')"
            @click="isDeleteOpen = false"
          />
          <UButton
            color="error"
            :label="t('admin.agencies.modals.delete.delete')"
            icon="i-heroicons-trash"
            @click="confirmDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
