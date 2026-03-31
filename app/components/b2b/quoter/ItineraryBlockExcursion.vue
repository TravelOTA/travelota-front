<script setup lang="ts">
import type { ItineraryOption } from "~/composables/useItinerary";

defineProps<{ option: ItineraryOption }>();
const { t } = useI18n();
</script>

<template>
  <div v-if="option.metadata?.type === 'excursion'" class="text-xs text-gray-500 mt-2 space-y-0.5">
    <p>
      <span class="font-semibold text-gray-700">{{ t("itinerary.manualExcursionLocationLabel") }}:</span>
      {{ option.metadata.location }}
    </p>
    <p>
      <span class="font-semibold text-gray-700">{{ t("itinerary.manualExcursionDatetimeLabel") }}:</span>
      {{ option.metadata.datetime }}
      &nbsp;·&nbsp;
      {{ option.metadata.duration }}
    </p>
    <p v-if="option.metadata.includesTransport" class="text-primary-600 font-semibold">
      ✓ {{ t("itinerary.manualExcursionTransportLabel") }}
    </p>
  </div>
</template>
