<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useItinerary } from '~/composables/useItinerary';
import { getLocalTimeZone, today as todayDate } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';

const formatDate = (date: DateValue): string => {
  const d = date.toDate(getLocalTimeZone());
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
};

const {
  itinerary,
  isAddOptionModalOpen,
  pendingOption,
  addBlock,
  addOptionToBlock,
} = useItinerary();

const { t } = useI18n();

// Local state for modal flow
const selectedBlockId = ref('');
const showNewBlockForm = ref(false);

const newBlockType = ref<
  'hotel' | 'flight' | 'transfer' | 'excursion' | 'extra'
>('hotel');
const newBlockTitle = ref('');

const dateRange = ref({
  start: todayDate(getLocalTimeZone()),
  end: todayDate(getLocalTimeZone()).add({ days: 2 }),
});

const toast = useToast();

const availableBlocks = computed(() => {
  return itinerary.value.blocks.filter((b) => b.options.length < 5);
});

// Resets internal state when opening modal
watch(isAddOptionModalOpen, (isOpen) => {
  if (isOpen) {
    selectedBlockId.value = '';
    showNewBlockForm.value = itinerary.value.blocks.length === 0;
    newBlockTitle.value = '';
    dateRange.value = {
      start: todayDate(getLocalTimeZone()),
      end: todayDate(getLocalTimeZone()).add({ days: 2 }),
    };
    newBlockType.value = 'hotel';
  }
});

const handleConfirm = () => {
  if (!pendingOption.value) return;

  try {
    let targetBlockId = selectedBlockId.value;

    if (showNewBlockForm.value) {
      if (!newBlockTitle.value) {
        toast.add({
          title: 'Error',
          description: t('itinerary.errorBlockTitleRequired'),
          color: 'error',
        });
        return;
      }

      const dateStr =
        dateRange.value.start && dateRange.value.end
          ? `${formatDate(dateRange.value.start)} - ${formatDate(dateRange.value.end)}`
          : '';

      targetBlockId = addBlock(
        newBlockType.value,
        newBlockTitle.value,
        dateStr,
      );
    }

    if (!targetBlockId) {
      toast.add({
        title: 'Error',
        description: t('itinerary.errorSelectValidBlock'),
        color: 'error',
      });
      return;
    }

    addOptionToBlock(targetBlockId, pendingOption.value);

    toast.add({
      title: t('itinerary.toastAddedTitle'),
      description: t('itinerary.successAddedToItinerary'),
      icon: 'i-heroicons-check-circle',
      color: 'primary',
    });

    isAddOptionModalOpen.value = false;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : t('itinerary.errorAddingToItinerary');
    toast.add({
      title: t('itinerary.errorAddTitle'),
      description: errorMessage,
      icon: 'i-heroicons-exclamation-triangle',
      color: 'error',
    });
  }
};
</script>

<template>
  <UModal
    v-model:open="isAddOptionModalOpen"
    :title="t('itinerary.addOptionModalTitle')"
  >
    <template #body>
      <div v-if="pendingOption" class="mb-4">
        <p class="text-sm text-gray-500">
          {{ t('itinerary.addOptionIntro') }}:
          <strong class="text-gray-900 dark:text-white">{{
            pendingOption.name
          }}</strong>
        </p>
      </div>

      <div class="space-y-4">
        <!-- Tab selector if there are existing blocks -->
        <div
          v-if="itinerary.blocks.length > 0"
          class="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
          <button
            class="flex-1 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="
              !showNewBlockForm
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            "
            @click="showNewBlockForm = false"
          >
            {{ t('itinerary.existingBlockTab') }}
          </button>
          <button
            class="flex-1 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="
              showNewBlockForm
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            "
            @click="showNewBlockForm = true"
          >
            {{ t('itinerary.newBlockTab') }}
          </button>
        </div>

        <!-- Add to Existing Block -->
        <div v-if="!showNewBlockForm">
          <UFormField :label="t('itinerary.selectBlockLabel')">
            <select
              v-model="selectedBlockId"
              class="relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-select rounded-md font-medium text-sm px-2.5 py-1.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <option value="" disabled selected>
                {{ t('itinerary.selectBlockPlaceholder') }}
              </option>
              <option
                v-for="block in availableBlocks"
                :key="block.id"
                :value="block.id"
              >
                {{ block.title }} ({{ block.options.length }}/5)
              </option>
            </select>
            <p
              v-if="availableBlocks.length === 0"
              class="text-xs text-red-500 mt-2"
            >
              {{ t('itinerary.blockMaxOptionsWarning') }}
            </p>
          </UFormField>
        </div>

        <!-- Create New Block -->
        <div
          v-if="showNewBlockForm"
          class="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
        >
          <UFormField :label="t('itinerary.serviceTypeLabel')">
            <USelect
              v-model="newBlockType"
              :items="[
                {
                  label: t('itinerary.serviceTypeAccommodation'),
                  value: 'hotel',
                },
                { label: t('itinerary.serviceTypeFlight'), value: 'flight' },
                {
                  label: t('itinerary.serviceTypeTransfer'),
                  value: 'transfer',
                },
                {
                  label: t('itinerary.serviceTypeExcursion'),
                  value: 'excursion',
                },
                { label: t('itinerary.serviceTypeExtra'), value: 'extra' },
              ]"
            />
          </UFormField>
          <UFormField :label="t('itinerary.blockTitleLabel')">
            <UInput
              v-model="newBlockTitle"
              :placeholder="t('itinerary.blockTitlePlaceholder')"
            />
          </UFormField>
          <UFormField :label="t('itinerary.stayDatesLabel')">
            <UPopover class="w-full">
              <UButton
                color="neutral"
                icon="i-lucide-calendar"
                class="w-full justify-start font-normal text-gray-700 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              >
                <template v-if="dateRange.start">
                  <template v-if="dateRange.end">
                    {{ formatDate(dateRange.start) }}
                    &nbsp;&rarr;&nbsp;
                    {{ formatDate(dateRange.end) }}
                  </template>
                  <template v-else>
                    {{ formatDate(dateRange.start) }}
                  </template>
                </template>
                <template v-else>
                  {{ t('itinerary.stayDatesPlaceholder') }}
                </template>
              </UButton>

              <template #content>
                <UCalendar
                  v-model="dateRange"
                  class="p-2"
                  :number-of-months="1"
                  :fixed-weeks="false"
                  :ui="{
                    cellTrigger:
                      'data-[outside-view]:opacity-0 data-[outside-view]:pointer-events-none',
                  }"
                  range
                />
              </template>
            </UPopover>
          </UFormField>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          @click="isAddOptionModalOpen = false"
          >{{ t('itinerary.cancelButton') }}</UButton
        >
        <UButton color="primary" @click="handleConfirm">
          {{ t('itinerary.addToItineraryButton') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
