<script setup lang="ts">
import type { ItineraryOption } from '~/composables/useItinerary';

defineProps<{ option: ItineraryOption }>();
const { t } = useI18n();
</script>

<template>
  <div
    v-if="option.metadata?.type === 'flight'"
    class="text-xs text-gray-500 mt-2 space-y-0.5"
  >
    <p>
      <span class="font-semibold text-gray-700">{{
        option.metadata.origin
      }}</span>
      &rarr;
      <span class="font-semibold text-gray-700">{{
        option.metadata.destination
      }}</span>
    </p>
    <p>
      <span class="font-semibold text-gray-700"
        >{{ t('itinerary.manualFlightDepartureLabel') }}:</span
      >
      {{ option.metadata.departureDatetime }}
      &nbsp;·&nbsp;
      <span class="font-semibold text-gray-700"
        >{{ t('itinerary.manualFlightArrivalLabel') }}:</span
      >
      {{ option.metadata.arrivalDatetime }}
    </p>
    <p>
      {{ option.metadata.airline }} · {{ option.metadata.flightNumber }}
      &nbsp;·&nbsp;
      <span class="font-semibold text-gray-700"
        >{{ t('itinerary.manualFlightCabinLabel') }}:</span
      >
      {{ option.metadata.cabin }}
    </p>
  </div>
</template>
