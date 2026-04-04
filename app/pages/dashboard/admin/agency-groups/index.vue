<script setup lang="ts">
import {
  useAgencyGroups,
  type AgencyGroup,
} from "~/composables/useAgencyGroups";

definePageMeta({ layout: "dashboard" });
useHead({ title: "Grupos de Agencia - TravelOTA Admin" });

const { t } = useI18n();
const { groups, loading, error, fetchGroups } = useAgencyGroups();

onMounted(() => fetchGroups());

const searchQuery = ref("");
const filteredGroups = computed(() => {
  if (!searchQuery.value) return groups.value;
  const lowerSearch = searchQuery.value.toLowerCase();
  return groups.value.filter(
    (g) =>
      g.name.toLowerCase().includes(lowerSearch) ||
      g.description.toLowerCase().includes(lowerSearch),
  );
});

const columns = computed(() => [
  { accessorKey: "name", header: t("admin.agencyGroups.tableHeaders.group") },
  {
    accessorKey: "description",
    header: t("admin.agencyGroups.tableHeaders.description"),
  },
  {
    accessorKey: "agency_count",
    header: t("admin.agencyGroups.tableHeaders.assignedAgencies"),
  },
]);

// Detail modal (mutations require dedicated API endpoints not yet available)
const isDetailOpen = ref(false);
const detailGroup = ref<AgencyGroup | null>(null);

function openDetail(group: AgencyGroup) {
  detailGroup.value = group;
  isDetailOpen.value = true;
}
</script>

<template>
  <div class="max-w-6xl mx-auto pb-16">
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
          {{ t("admin.agencyGroups.backToPanel") }}
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t("admin.agencyGroups.title") }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t("admin.agencyGroups.subtitle") }}
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

    <!-- Table Card -->
    <UCard class="shadow-sm rounded-xl" :ui="{ body: 'p-0 sm:p-0' }">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          :placeholder="t('admin.agencyGroups.search')"
          class="w-full sm:w-80"
        />
      </div>

      <div v-if="loading" class="py-12 text-center text-sm text-gray-400">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-6 h-6 animate-spin mx-auto mb-2"
        />
        Cargando grupos...
      </div>

      <UTable
        v-else
        :data="filteredGroups"
        :columns="columns as any"
        class="w-full"
      >
        <!-- Name cell -->
        <template #name-cell="{ row }">
          <button
            class="text-left hover:text-primary-500 transition-colors"
            @click="openDetail(row.original)"
          >
            <div class="font-semibold text-gray-900 dark:text-white">
              {{ row.original.name }}
            </div>
            <div class="text-xs text-gray-400 font-mono">
              #{{ row.original.id }}
            </div>
          </button>
        </template>

        <!-- Description cell -->
        <template #description-cell="{ row }">
          <span class="text-sm text-gray-500">{{
            row.original.description || t("admin.agencyGroups.noDescription")
          }}</span>
        </template>

        <!-- Agencies count cell -->
        <template #agency_count-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-heroicons-building-office-2"
              class="w-4 h-4 text-gray-400"
            />
            <span class="text-sm"
              >{{ row.original.agency_count }} agencias</span
            >
          </div>
        </template>
      </UTable>

      <div
        v-if="!loading && filteredGroups.length === 0"
        class="py-16 text-center text-sm text-gray-500"
      >
        {{ t("admin.agencyGroups.noResults") }}
      </div>
    </UCard>

    <!-- Detail modal -->
    <UModal v-model:open="isDetailOpen" :title="detailGroup?.name ?? ''">
      <template #body>
        <div v-if="detailGroup" class="space-y-3 text-sm">
          <div>
            <p class="text-xs text-gray-400 uppercase font-semibold mb-0.5">
              {{ t("admin.agencyGroups.modals.edit.description") }}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              {{
                detailGroup.description || t("admin.agencyGroups.noDescription")
              }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase font-semibold mb-0.5">
              {{ t("admin.agencyGroups.tableHeaders.assignedAgencies") }}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              {{ detailGroup.agency_count }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cerrar"
            @click="isDetailOpen = false"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
