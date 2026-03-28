<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useTemplates } from "~/composables/useTemplates";
import type { ItineraryTemplate } from "~/composables/useTemplates";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ "update:isOpen": [value: boolean] }>();

const { t } = useI18n();
const toast = useToast();
const { role } = useAuth();
const {
  personalTemplates,
  agencyTemplates,
  platformTemplates,
  fetchTemplates,
  updateTemplate,
  deleteTemplate,
  loadTemplateIntoBuilder,
} = useTemplates();

const search = ref("");
const activeTab = ref<string | number>("personal");

// Tabs visible based on role
const tabs = computed(() => {
  const list = [{ label: t("templates.pickerModal.tabPersonal"), value: "personal" }];
  if (role.value === "USER" || role.value === "AGENCY_ADMIN") {
    list.push({ label: t("templates.pickerModal.tabAgency"), value: "agency" });
  }
  list.push({ label: t("templates.pickerModal.tabPlatform"), value: "platform" });
  return list;
});

const filterBySearch = (list: ItineraryTemplate[]) => {
  const q = search.value.toLowerCase();
  if (!q) return list;
  return list.filter(
    (tpl) =>
      tpl.name.toLowerCase().includes(q) ||
      tpl.destination.toLowerCase().includes(q),
  );
};

const visibleTemplates = computed(() => {
  if (activeTab.value === "personal") return filterBySearch(personalTemplates.value);
  if (activeTab.value === "agency") return filterBySearch(agencyTemplates.value);
  return filterBySearch(platformTemplates.value);
});

// Rename inline
const editingId = ref<number | null>(null);
const editingName = ref("");
const editingDescription = ref("");
const editingDestination = ref("");

const startEdit = (tpl: ItineraryTemplate) => {
  editingId.value = tpl.id;
  editingName.value = tpl.name;
  editingDescription.value = tpl.description;
  editingDestination.value = tpl.destination;
};

const cancelEdit = () => {
  editingId.value = null;
};

const confirmEdit = async () => {
  if (!editingId.value) return;
  await updateTemplate(editingId.value, {
    name: editingName.value.trim(),
    description: editingDescription.value.trim(),
    destination: editingDestination.value.trim(),
  });
  editingId.value = null;
};

const handleDelete = async (id: number) => {
  if (!confirm(t("templates.pickerModal.deleteConfirm"))) return;
  await deleteTemplate(id);
};

const handleUse = (tpl: ItineraryTemplate) => {
  loadTemplateIntoBuilder(tpl);
  toast.add({
    title: t("templates.pickerModal.loadedToast"),
    color: "primary",
    icon: "i-heroicons-document-duplicate",
  });
  emit("update:isOpen", false);
};

// Load templates when modal opens
watch(
  () => props.isOpen,
  (val) => {
    if (val) fetchTemplates();
  },
);
</script>

<template>
  <UModal
    :open="isOpen"
    :title="t('templates.pickerModal.title')"
    @update:open="emit('update:isOpen', $event)"
  >
    <template #body>
      <div class="space-y-4">
        <!-- Search -->
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass"
          :placeholder="t('templates.pickerModal.searchPlaceholder')"
        />

        <!-- Tabs: content=false renders only the tab list, not built-in content panels -->
        <UTabs
          v-model="activeTab"
          :items="tabs"
          variant="link"
          :content="false"
        />

        <!-- Template list -->
        <div class="max-h-80 space-y-2 overflow-y-auto pr-1">
          <div
            v-if="visibleTemplates.length === 0"
            class="py-8 text-center text-sm text-gray-400"
          >
            {{ t("templates.pickerModal.emptyState") }}
          </div>

          <template v-for="tpl in visibleTemplates" :key="tpl.id">
            <!-- Inline edit mode -->
            <div
              v-if="editingId === tpl.id"
              class="space-y-2 rounded-lg border border-primary-300 bg-primary-50/30 p-3 dark:bg-primary-900/10"
            >
              <UInput v-model="editingName" size="sm" />
              <UInput
                v-model="editingDescription"
                size="sm"
                :placeholder="t('templates.saveModal.descriptionPlaceholder')"
              />
              <UInput
                v-model="editingDestination"
                size="sm"
                :placeholder="t('templates.saveModal.destinationPlaceholder')"
              />
              <div class="flex justify-end gap-2">
                <UButton size="xs" color="neutral" variant="ghost" @click="cancelEdit">
                  {{ t("itinerary.cancelButton") }}
                </UButton>
                <UButton
                  size="xs"
                  color="primary"
                  :disabled="!editingName.trim()"
                  @click="confirmEdit"
                >
                  OK
                </UButton>
              </div>
            </div>

            <!-- Normal card -->
            <div
              v-else
              class="group flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:border-primary-300 dark:border-gray-800"
            >
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {{ tpl.name }}
                </p>
                <div class="mt-0.5 flex items-center gap-2">
                  <span
                    v-if="tpl.destination"
                    class="text-xs text-primary-600 dark:text-primary-400"
                  >{{ tpl.destination }}</span>
                  <span class="text-xs text-gray-400">
                    {{ t("templates.pickerModal.blocksCount", { n: tpl.itinerary.blocks.length }, tpl.itinerary.blocks.length) }}
                  </span>
                </div>
              </div>

              <div class="flex shrink-0 items-center gap-1">
                <!-- Management actions: only for the owner -->
                <UDropdownMenu
                  v-if="tpl.is_owner"
                  :items="[
                    [
                      {
                        label: t('templates.pickerModal.renameAction'),
                        icon: 'i-heroicons-pencil',
                        onSelect: () => startEdit(tpl),
                      },
                      {
                        label: t('templates.pickerModal.deleteAction'),
                        icon: 'i-heroicons-trash',
                        color: 'error',
                        onSelect: () => handleDelete(tpl.id),
                      },
                    ],
                  ]"
                  :content="{ align: 'end' }"
                >
                  <UButton
                    icon="i-heroicons-ellipsis-horizontal"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    class="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </UDropdownMenu>

                <UButton
                  size="xs"
                  color="primary"
                  variant="solid"
                  @click="handleUse(tpl)"
                >
                  {{ t("templates.pickerModal.useButton") }}
                </UButton>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </UModal>
</template>
