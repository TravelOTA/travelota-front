<script setup lang="ts">
import {
  useSupportUsers,
  type SupportUser,
} from "~/composables/useSupportUsers";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Usuarios de Soporte - TravelOTA Admin",
});

const { t } = useI18n();

const {
  users,
  stats: supportStats,
  loading,
  error,
  fetchUsers,
  updateUser,
} = useSupportUsers();

onMounted(() => fetchUsers());

function fullName(u: SupportUser) {
  return [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email;
}

const columns = computed(() => [
  {
    accessorKey: "fullName",
    header: t("admin.supportUsers.tableHeaders.name"),
  },
  { accessorKey: "email", header: t("admin.supportUsers.tableHeaders.email") },
  { accessorKey: "role", header: t("admin.supportUsers.tableHeaders.role") },
  {
    accessorKey: "status",
    header: t("admin.supportUsers.tableHeaders.status"),
  },
  { id: "actions" },
]);

const searchQuery = ref("");
const statusFilter = ref<"all" | "active" | "locked" | "inactive">("all");

const filteredUsers = computed(() => {
  return users.value.filter((u) => {
    const name = fullName(u).toLowerCase();
    const matchSearch =
      !searchQuery.value ||
      name.includes(searchQuery.value.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus =
      statusFilter.value === "all" ||
      (statusFilter.value === "active" && u.is_active && !u.is_locked) ||
      (statusFilter.value === "locked" && u.is_locked) ||
      (statusFilter.value === "inactive" && !u.is_active);
    return matchSearch && matchStatus;
  });
});

// Flatten users for UTable (add computed display fields)
const tableRows = computed(() =>
  filteredUsers.value.map((u) => ({
    ...u,
    fullName: fullName(u),
  })),
);

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Admin",
  SUPPORT: "Soporte",
};

function roleColor(role: string): "primary" | "neutral" {
  return role === "SUPER_ADMIN" ? "primary" : "neutral";
}

function statusLabel(u: SupportUser) {
  if (u.is_locked) return "Bloqueado";
  return u.is_active ? "Activo" : "Inactivo";
}

function statusBadgeColor(u: SupportUser): "success" | "error" | "neutral" {
  if (u.is_locked) return "error";
  return u.is_active ? "success" : "neutral";
}

async function toggleLock(user: SupportUser) {
  await updateUser(user.id, { is_locked: !user.is_locked });
}

// Edit modal — only supports toggling is_active / is_locked via PATCH
const isEditModalOpen = ref(false);
const editUser = ref<SupportUser | null>(null);

function openEditModal(user: SupportUser) {
  editUser.value = { ...user };
  isEditModalOpen.value = true;
}

async function saveEditUser() {
  if (!editUser.value) return;
  await updateUser(editUser.value.id, {
    is_active: editUser.value.is_active,
    is_locked: editUser.value.is_locked,
  });
  isEditModalOpen.value = false;
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
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
          {{ t("admin.supportUsers.backToPanel") }}
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t("admin.supportUsers.title") }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.supportUsers.subtitle") }}
        </p>
      </div>
    </div>

    <!-- Error state -->
    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="error"
      variant="soft"
      class="mb-6"
      :title="error"
    />

    <!-- Stats rápidas -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600"
          >
            <UIcon name="i-heroicons-users" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">
              {{ t("admin.supportUsers.stats.total") }}
            </p>
            <p class="text-xl font-bold">{{ supportStats.total }}</p>
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
              {{ t("admin.supportUsers.stats.active") }}
            </p>
            <p class="text-xl font-bold">{{ supportStats.active }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600"
          >
            <UIcon name="i-heroicons-shield-check" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">
              {{ t("admin.supportUsers.stats.admins") }}
            </p>
            <p class="text-xl font-bold">{{ supportStats.admins }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600"
          >
            <UIcon name="i-heroicons-headphone" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">
              {{ t("admin.supportUsers.stats.support") }}
            </p>
            <p class="text-xl font-bold">{{ supportStats.support }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Info de permisos -->
    <UAlert
      icon="i-heroicons-information-circle"
      color="info"
      variant="soft"
      class="mb-6"
      :title="t('admin.supportUsers.permissionsAlert')"
      :description="t('admin.supportUsers.permissionsDescription')"
    />

    <!-- Table -->
    <UCard class="shadow-sm rounded-lg" :ui="{ body: 'p-0 sm:p-0' }">
      <div
        class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          :placeholder="t('admin.supportUsers.search')"
          class="w-full sm:w-72"
        />
        <USelectMenu
          v-model="statusFilter"
          :items="[
            { label: 'Todos', value: 'all' },
            { label: 'Activo', value: 'active' },
            { label: 'Bloqueado', value: 'locked' },
            { label: 'Inactivo', value: 'inactive' },
          ]"
          value-key="value"
          label-key="label"
          placeholder="Estado"
          class="w-36"
        />
      </div>

      <div v-if="loading" class="py-12 text-center text-sm text-gray-400">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-6 h-6 animate-spin mx-auto mb-2"
        />
        Cargando usuarios...
      </div>

      <UTable v-else :data="tableRows" :columns="columns">
        <template #fullName-cell="{ row }">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ row.original.fullName }}
            </p>
            <p class="text-xs text-gray-400">
              {{ row.original.group_names || "—" }}
            </p>
          </div>
        </template>

        <template #role-cell="{ row }">
          <UBadge
            :color="roleColor(row.original.role)"
            variant="soft"
            size="xs"
          >
            {{ roleLabels[row.original.role] ?? row.original.role }}
          </UBadge>
        </template>

        <template #status-cell="{ row }">
          <UBadge :color="statusBadgeColor(row.original)" variant="subtle">
            {{ statusLabel(row.original) }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-1 pr-2">
            <UTooltip
              :text="
                row.original.is_locked
                  ? t('admin.supportUsers.tooltips.activate')
                  : t('admin.supportUsers.tooltips.deactivate')
              "
            >
              <UButton
                :icon="
                  row.original.is_locked
                    ? 'i-heroicons-lock-open'
                    : 'i-heroicons-no-symbol'
                "
                :color="row.original.is_locked ? 'success' : 'error'"
                variant="ghost"
                size="xs"
                @click="toggleLock(row.original)"
              />
            </UTooltip>
            <UTooltip :text="t('admin.supportUsers.tooltips.edit')">
              <UButton
                icon="i-heroicons-pencil-square"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="openEditModal(row.original)"
              />
            </UTooltip>
          </div>
        </template>
      </UTable>

      <div
        v-if="!loading && tableRows.length === 0"
        class="py-12 text-center text-sm text-gray-500"
      >
        {{ t("admin.supportUsers.noResults") }}
      </div>
    </UCard>

    <!-- Edit modal -->
    <UModal
      v-model:open="isEditModalOpen"
      :title="t('admin.supportUsers.modals.edit.title')"
    >
      <template #body>
        <div v-if="editUser" class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ fullName(editUser) }}
            <span class="text-gray-400">({{ editUser.email }})</span>
          </p>
          <UFormField
            :label="t('admin.supportUsers.modals.edit.status')"
            name="edit-active"
          >
            <UToggle v-model="editUser.is_active" />
            <span class="ml-2 text-sm text-gray-500">
              {{ editUser.is_active ? "Activo" : "Inactivo" }}
            </span>
          </UFormField>
          <UFormField label="Bloqueado" name="edit-locked">
            <UToggle v-model="editUser.is_locked" />
            <span class="ml-2 text-sm text-gray-500">
              {{ editUser.is_locked ? "Bloqueado" : "Desbloqueado" }}
            </span>
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('admin.supportUsers.modals.edit.cancel')"
            @click="isEditModalOpen = false"
          />
          <UButton
            color="primary"
            :label="t('admin.supportUsers.modals.edit.save')"
            icon="i-heroicons-check"
            @click="saveEditUser"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
