<script setup lang="ts">
import type { ItineraryOption } from "~/composables/useItinerary";

defineProps<{ option: ItineraryOption }>();
const { t } = useI18n();
</script>

<template>
  <div v-if="option.metadata?.type === 'hotel'" class="text-xs text-gray-500 mt-2 space-y-0.5">
    <p>
      <span class="font-semibold text-gray-700">{{ t("itinerary.manualHotelDestinationLabel") }}:</span>
      {{ option.metadata.destination }}
    </p>
    <p>
      <span class="font-semibold text-gray-700">{{ t("itinerary.manualHotelCheckinLabel") }}:</span>
      {{ option.metadata.checkin }}
      &rarr;
      <span class="font-semibold text-gray-700">{{ t("itinerary.manualHotelCheckoutLabel") }}:</span>
      {{ option.metadata.checkout }}
    </p>
    <p>
      <span class="font-semibold text-gray-700">{{ t("itinerary.manualHotelRoomTypeLabel") }}:</span>
      {{ option.metadata.roomType }}
      &nbsp;·&nbsp;
      <span class="font-semibold text-gray-700">{{ t("itinerary.manualHotelRegimeLabel") }}:</span>
      {{ option.metadata.regime }}
    </p>
  </div>
</template>
