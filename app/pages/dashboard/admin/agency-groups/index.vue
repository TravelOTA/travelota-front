<script setup lang="ts">
definePageMeta({ layout: 'dashboard' });
useHead({ title: 'Grupos de Agencia - TravelOTA Admin' });

const { t } = useI18n();
const { groups, addGroup, updateGroup, deleteGroup } = useAgencyGroups();

// ── Search & Filter ──
const searchQuery = ref('');
const filteredGroups = computed(() => {
  if (!searchQuery.value) return groups.value;
  const lowerSearch = searchQuery.value.toLowerCase();
  return groups.value.filter(
    (g) =>
      g.name.toLowerCase().includes(lowerSearch) ||
      g.description.toLowerCase().includes(lowerSearch),
  );
});

// ── Columns ──
const columns = computed(() => [
  { accessorKey: 'name', header: t('admin.agencyGroups.tableHeaders.group') },
  {
    accessorKey: 'description',
    header: t('admin.agencyGroups.tableHeaders.description'),
  },
  {
    accessorKey: 'baseMarkup',
    header: t('admin.agencyGroups.tableHeaders.baseMarkup'),
  },
  {
    accessorKey: 'baseCreditLimit',
    header: t('admin.agencyGroups.tableHeaders.baseCreditLimit'),
  },
  {
    accessorKey: 'agenciesCount',
    header: t('admin.agencyGroups.tableHeaders.assignedAgencies'),
  },
  { accessorKey: 'actions', header: '' },
]);

// ── Create Modal ──
const isCreateOpen = ref(false);
const newGroup = ref({
  name: '',
  description: '',
  baseMarkup: 10,
  baseCreditLimit: 5000,
});
const isCreateValid = computed(() => newGroup.value.name.trim() !== '');

function openCreate() {
  newGroup.value = {
    name: '',
    description: '',
    baseMarkup: 10,
    baseCreditLimit: 5000,
  };
  isCreateOpen.value = true;
}

function saveGroup() {
  if (!isCreateValid.value) return;
  addGroup({
    name: newGroup.value.name,
    description: newGroup.value.description,
    baseMarkup: newGroup.value.baseMarkup,
    baseCreditLimit: newGroup.value.baseCreditLimit,
  });
  isCreateOpen.value = false;
}

// ── Edit Modal ──
const isEditOpen = ref(false);
const editGroup = ref<AgencyGroup | null>(null);

function openEdit(group: AgencyGroup) {
  editGroup.value = { ...group };
  isEditOpen.value = true;
}

function saveEdit() {
  if (!editGroup.value) return;
  updateGroup(editGroup.value.id, {
    name: editGroup.value.name,
    description: editGroup.value.description,
    baseMarkup: editGroup.value.baseMarkup,
    baseCreditLimit: editGroup.value.baseCreditLimit,
  });
  isEditOpen.value = false;
}

// ── Delete Action ──
function handleDelete(id: string) {
  deleteGroup(id);
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
          {{ t('admin.agencyGroups.backToPanel') }}
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('admin.agencyGroups.title') }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t('admin.agencyGroups.subtitle') }}
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        :label="t('admin.agencyGroups.newGroup')"
        @click="openCreate"
      />
    </div>

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

      <UTable :data="filteredGroups" :columns="columns as any" class="w-full">
        <!-- Name cell -->
        <template #name-cell="{ row }">
          <div class="font-semibold text-gray-900 dark:text-white">
            {{ row.original.name }}
          </div>
          <div class="text-xs text-gray-400 font-mono">
            {{ row.original.id }}
          </div>
        </template>

        <!-- Description cell -->
        <template #description-cell="{ row }">
          <span class="text-sm text-gray-500">{{
            row.original.description || t('admin.agencyGroups.noDescription')
          }}</span>
        </template>

        <!-- Markup cell -->
        <template #baseMarkup-cell="{ row }">
          <UBadge color="primary" variant="subtle" class="font-bold">
            {{ row.original.baseMarkup }}% Base
          </UBadge>
        </template>

        <!-- Credit limit cell -->
        <template #baseCreditLimit-cell="{ row }">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            ${{ row.original.baseCreditLimit.toLocaleString() }}
          </span>
        </template>

        <!-- Agencies count cell -->
        <template #agenciesCount-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-heroicons-building-office-2"
              class="w-4 h-4 text-gray-400"
            />
            <span class="text-sm"
              >{{ row.original.agenciesCount }} agencias</span
            >
          </div>
        </template>

        <!-- Actions -->
        <template #actions-cell="{ row }">
          <div class="flex items-center justify-end gap-1 pr-2">
            <UTooltip :text="t('admin.agencyGroups.tooltips.edit')">
              <UButton
                icon="i-heroicons-pencil-square"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="openEdit(row.original)"
              />
            </UTooltip>
            <UTooltip :text="t('admin.agencyGroups.tooltips.delete')">
              <UButton
                icon="i-heroicons-trash"
                color="error"
                variant="ghost"
                size="xs"
                :disabled="row.original.agenciesCount > 0"
                @click="handleDelete(row.original.id)"
              />
            </UTooltip>
          </div>
        </template>
      </UTable>

      <div
        v-if="filteredGroups.length === 0"
        class="py-16 text-center text-sm text-gray-500"
      >
        {{ t('admin.agencyGroups.noResults') }}
      </div>
    </UCard>

    <!-- Create Modal -->
    <UModal
      v-model:open="isCreateOpen"
      :title="t('admin.agencyGroups.modals.create.title')"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            :label="t('admin.agencyGroups.modals.create.groupName')"
            name="name"
            required
          >
            <UInput
              v-model="newGroup.name"
              :placeholder="t('admin.agencyGroups.modals.create.groupExample')"
              icon="i-heroicons-user-group"
            />
          </UFormField>
          <UFormField
            :label="t('admin.agencyGroups.modals.create.description')"
            name="desc"
          >
            <UInput
              v-model="newGroup.description"
              :placeholder="
                t('admin.agencyGroups.modals.create.descriptionExample')
              "
            />
          </UFormField>
          <UFormField
            :label="t('admin.agencyGroups.modals.create.baseMarkup')"
            name="markup"
            required
          >
            <UInput
              v-model="newGroup.baseMarkup"
              type="number"
              min="0"
              max="50"
              step="0.5"
            >
              <template #trailing
                ><span class="text-gray-400 text-sm">%</span></template
              >
            </UInput>
          </UFormField>
          <UFormField
            :label="t('admin.agencyGroups.modals.create.baseCreditLimit')"
            name="creditLimit"
            required
          >
            <UInput
              v-model.number="newGroup.baseCreditLimit"
              type="number"
              min="0"
              step="1000"
            >
              <template #leading
                ><span class="text-gray-400 text-sm">$</span></template
              >
            </UInput>
          </UFormField>
          <UAlert
            icon="i-heroicons-information-circle"
            color="info"
            variant="soft"
            :description="t('admin.agencyGroups.modals.create.alert')"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('admin.agencyGroups.modals.create.cancel')"
            @click="isCreateOpen = false"
          />
          <UButton
            color="primary"
            :label="t('admin.agencyGroups.modals.create.create')"
            icon="i-heroicons-plus"
            :disabled="!isCreateValid"
            @click="saveGroup"
          />
        </div>
      </template>
    </UModal>

    <!-- Edit Modal -->
    <UModal
      v-model:open="isEditOpen"
      :title="t('admin.agencyGroups.modals.edit.title')"
    >
      <template #body>
        <div v-if="editGroup" class="space-y-4">
          <UFormField
            :label="t('admin.agencyGroups.modals.edit.groupName')"
            name="edit-name"
            required
          >
            <UInput v-model="editGroup.name" icon="i-heroicons-user-group" />
          </UFormField>
          <UFormField
            :label="t('admin.agencyGroups.modals.edit.description')"
            name="edit-desc"
          >
            <UInput v-model="editGroup.description" />
          </UFormField>
          <UFormField
            :label="t('admin.agencyGroups.modals.edit.baseMarkup')"
            name="edit-markup"
            required
          >
            <UInput
              v-model="editGroup.baseMarkup"
              type="number"
              min="0"
              max="50"
              step="0.5"
            >
              <template #trailing
                ><span class="text-gray-400 text-sm">%</span></template
              >
            </UInput>
          </UFormField>
          <UFormField
            :label="t('admin.agencyGroups.modals.edit.baseCreditLimit')"
            name="edit-creditLimit"
            required
          >
            <UInput
              v-model.number="editGroup.baseCreditLimit"
              type="number"
              min="0"
              step="1000"
            >
              <template #leading
                ><span class="text-gray-400 text-sm">$</span></template
              >
            </UInput>
          </UFormField>
          <UAlert
            v-if="editGroup.agenciesCount > 0"
            icon="i-heroicons-exclamation-triangle"
            color="warning"
            variant="soft"
            :description="`Modificar el Markup Base afectará a las ${editGroup.agenciesCount} agencias asociadas actualmente al grupo.`"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('admin.agencyGroups.modals.edit.cancel')"
            @click="isEditOpen = false"
          />
          <UButton
            color="primary"
            :label="t('admin.agencyGroups.modals.edit.save')"
            icon="i-heroicons-check"
            @click="saveEdit"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
