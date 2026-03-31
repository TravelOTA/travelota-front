<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useTemplates } from '~/composables/useTemplates';
import type { ItineraryTemplate } from '~/composables/useTemplates';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ 'update:isOpen': [value: boolean] }>();

const { t } = useI18n();
const toast = useToast();
const { role } = useAuth();
const { saveTemplate } = useTemplates();

const name = ref('');
const description = ref('');
const destination = ref('');
const scope = ref<ItineraryTemplate['scope']>('personal');
const loading = ref(false);

// Scope options the current user is allowed to choose
const scopeOptions = computed(() => {
  const opts: { label: string; value: ItineraryTemplate['scope'] }[] = [
    { label: t('templates.saveModal.scopePersonal'), value: 'personal' },
  ];
  if (role.value === 'AGENCY_ADMIN') {
    opts.push({ label: t('templates.saveModal.scopeAgency'), value: 'agency' });
  }
  if (role.value === 'SUPPORT' || role.value === 'SUPER_ADMIN') {
    opts.push({
      label: t('templates.saveModal.scopePlatform'),
      value: 'platform',
    });
  }
  return opts;
});

const showScopeSelector = computed(() => scopeOptions.value.length > 1);

const handleSubmit = async () => {
  if (!name.value.trim()) return;
  loading.value = true;
  try {
    await saveTemplate({
      name: name.value.trim(),
      description: description.value.trim(),
      destination: destination.value.trim(),
      scope: scope.value,
    });
    toast.add({
      title: t('templates.saveModal.successToast'),
      color: 'primary',
      icon: 'i-heroicons-check-circle',
    });
    emit('update:isOpen', false);
    name.value = '';
    description.value = '';
    destination.value = '';
    scope.value = 'personal';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UModal
    :open="isOpen"
    :title="t('templates.saveModal.title')"
    @update:open="emit('update:isOpen', $event)"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField :label="t('templates.saveModal.nameLabel')" required>
          <UInput
            v-model="name"
            :placeholder="t('templates.saveModal.namePlaceholder')"
            autofocus
          />
        </UFormField>

        <UFormField :label="t('templates.saveModal.descriptionLabel')">
          <UTextarea
            v-model="description"
            :placeholder="t('templates.saveModal.descriptionPlaceholder')"
            :rows="2"
          />
        </UFormField>

        <UFormField :label="t('templates.saveModal.destinationLabel')">
          <UInput
            v-model="destination"
            :placeholder="t('templates.saveModal.destinationPlaceholder')"
          />
        </UFormField>

        <UFormField
          v-if="showScopeSelector"
          :label="t('templates.saveModal.visibilityLabel')"
        >
          <USelect
            v-model="scope"
            :items="scopeOptions"
            value-key="value"
            label-key="label"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          @click="emit('update:isOpen', false)"
        >
          {{ t('itinerary.cancelButton') }}
        </UButton>
        <UButton
          color="primary"
          :disabled="!name.trim()"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ t('templates.saveModal.saveButton') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
