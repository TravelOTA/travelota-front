<script setup lang="ts">
import type { ItineraryOption } from '~/composables/useItinerary';

defineProps<{ option: ItineraryOption }>();
const { t } = useI18n();
</script>

<template>
  <div
    v-if="option.metadata?.type === 'extra'"
    class="text-xs text-gray-500 mt-2 space-y-0.5"
  >
    <p>{{ option.metadata.description }}</p>
    <p v-if="option.metadata.managementDate">
      <span class="font-semibold text-gray-700"
        >{{ t('itinerary.manualExtraDateLabel') }}:</span
      >
      {{ option.metadata.managementDate }}
    </p>
  </div>
</template>
