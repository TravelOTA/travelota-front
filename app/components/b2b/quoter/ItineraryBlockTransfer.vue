<script setup lang="ts">
import type { ItineraryOption } from "~/composables/useItinerary";

defineProps<{ option: ItineraryOption }>();
const { t } = useI18n();
</script>

<template>
  <div v-if="option.metadata?.type === 'transfer'" class="text-xs text-gray-500 mt-2 space-y-0.5">
    <p>
      <span class="font-semibold text-gray-700">{{ t("itinerary.manualTransferOriginLabel") }}:</span>
      {{ option.metadata.origin }}
      &rarr;
      {{ option.metadata.destination }}
    </p>
    <p>
      <span class="font-semibold text-gray-700">{{ t("itinerary.manualTransferPickupLabel") }}:</span>
      {{ option.metadata.pickupDatetime }}
    </p>
    <p>
      <span class="font-semibold text-gray-700">{{ t("itinerary.manualTransferVehicleLabel") }}:</span>
      {{ option.metadata.vehicleType }}
      &nbsp;·&nbsp;
      {{ option.metadata.passengerCapacity }} pax
    </p>
  </div>
</template>
