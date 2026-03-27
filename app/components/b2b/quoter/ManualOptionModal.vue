<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useItinerary } from "~/composables/useItinerary";
import type { ItineraryBlock } from "~/composables/useItinerary";

const props = defineProps<{
  isOpen: boolean;
  blockId: string;
  blockType: ItineraryBlock["type"];
}>();

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
}>();

const { addOptionToBlock } = useItinerary();
const { t } = useI18n();
const toast = useToast();

// Common fields
const netPrice = ref<number | null>(null);
const notes = ref("");

// Hotel fields
const hotelName = ref("");
const hotelDestination = ref("");
const hotelCheckin = ref("");
const hotelCheckout = ref("");
const hotelRoomType = ref("");
const hotelRegime = ref<"SA" | "AD" | "MP" | "PC" | "TI">("SA");

// Transfer fields
const transferOrigin = ref("");
const transferDestination = ref("");
const transferPickupDatetime = ref("");
const transferVehicleType = ref<"sedan" | "van" | "bus" | "other">("sedan");
const transferCapacity = ref<number | null>(null);

// Flight fields
const flightOrigin = ref("");
const flightDestination = ref("");
const flightDepartureDatetime = ref("");
const flightArrivalDatetime = ref("");
const flightNumber = ref("");
const flightAirline = ref("");
const flightCabin = ref<"economy" | "business" | "first">("economy");

// Excursion fields
const excursionActivityName = ref("");
const excursionLocation = ref("");
const excursionDatetime = ref("");
const excursionDuration = ref("");
const excursionIncludesTransport = ref(false);

// Extra fields
const extraName = ref("");
const extraDescription = ref("");
const extraManagementDate = ref("");

const resetForm = () => {
  netPrice.value = null;
  notes.value = "";
  hotelName.value = "";
  hotelDestination.value = "";
  hotelCheckin.value = "";
  hotelCheckout.value = "";
  hotelRoomType.value = "";
  hotelRegime.value = "SA";
  transferOrigin.value = "";
  transferDestination.value = "";
  transferPickupDatetime.value = "";
  transferVehicleType.value = "sedan";
  transferCapacity.value = null;
  flightOrigin.value = "";
  flightDestination.value = "";
  flightDepartureDatetime.value = "";
  flightArrivalDatetime.value = "";
  flightNumber.value = "";
  flightAirline.value = "";
  flightCabin.value = "economy";
  excursionActivityName.value = "";
  excursionLocation.value = "";
  excursionDatetime.value = "";
  excursionDuration.value = "";
  excursionIncludesTransport.value = false;
  extraName.value = "";
  extraDescription.value = "";
  extraManagementDate.value = "";
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) resetForm();
  },
);

const modalTitle = computed(() => {
  const typeLabel: Record<ItineraryBlock["type"], string> = {
    hotel: t("itinerary.blockTypeAccommodation"),
    transfer: t("itinerary.blockTypeTransfer"),
    flight: t("itinerary.blockTypeFlight"),
    excursion: t("itinerary.blockTypeExcursion"),
    extra: t("itinerary.blockTypeExtra"),
  };
  return t("itinerary.manualModalTitle", { type: typeLabel[props.blockType] });
});

const regimeOptions = [
  { label: "SA", value: "SA" },
  { label: "AD", value: "AD" },
  { label: "MP", value: "MP" },
  { label: "PC", value: "PC" },
  { label: "TI", value: "TI" },
];

const vehicleOptions = computed(() => [
  { label: t("itinerary.vehicleTypeSedan"), value: "sedan" },
  { label: t("itinerary.vehicleTypeVan"), value: "van" },
  { label: t("itinerary.vehicleTypeBus"), value: "bus" },
  { label: t("itinerary.vehicleTypeOther"), value: "other" },
]);

const cabinOptions = computed(() => [
  { label: t("itinerary.cabinEconomy"), value: "economy" },
  { label: t("itinerary.cabinBusiness"), value: "business" },
  { label: t("itinerary.cabinFirst"), value: "first" },
]);

const buildOption = () => {
  const price = netPrice.value ?? 0;

  if (props.blockType === "hotel") {
    return {
      providerId: "MANUAL",
      name: hotelName.value,
      image: "",
      description: `${hotelRoomType.value} · ${hotelRegime.value} · ${hotelCheckin.value} → ${hotelCheckout.value}`,
      netPrice: price,
      isManual: true,
      metadata: {
        type: "hotel" as const,
        hotelName: hotelName.value,
        destination: hotelDestination.value,
        checkin: hotelCheckin.value,
        checkout: hotelCheckout.value,
        roomType: hotelRoomType.value,
        regime: hotelRegime.value,
      },
      notes: notes.value || undefined,
    };
  }

  if (props.blockType === "transfer") {
    return {
      providerId: "MANUAL",
      name: `${transferOrigin.value} → ${transferDestination.value}`,
      image: "",
      description: `${t(`itinerary.vehicleType${transferVehicleType.value.charAt(0).toUpperCase() + transferVehicleType.value.slice(1)}`)} · ${transferCapacity.value ?? 1} pax · ${transferPickupDatetime.value}`,
      netPrice: price,
      isManual: true,
      metadata: {
        type: "transfer" as const,
        origin: transferOrigin.value,
        destination: transferDestination.value,
        pickupDatetime: transferPickupDatetime.value,
        vehicleType: transferVehicleType.value,
        passengerCapacity: transferCapacity.value ?? 1,
      },
      notes: notes.value || undefined,
    };
  }

  if (props.blockType === "flight") {
    return {
      providerId: "MANUAL",
      name: `${flightOrigin.value} → ${flightDestination.value}`,
      image: "",
      description: `${flightNumber.value} · ${flightAirline.value} · ${flightCabin.value}`,
      netPrice: price,
      isManual: true,
      metadata: {
        type: "flight" as const,
        origin: flightOrigin.value,
        destination: flightDestination.value,
        departureDatetime: flightDepartureDatetime.value,
        arrivalDatetime: flightArrivalDatetime.value,
        flightNumber: flightNumber.value,
        airline: flightAirline.value,
        cabin: flightCabin.value,
      },
      notes: notes.value || undefined,
    };
  }

  if (props.blockType === "excursion") {
    return {
      providerId: "MANUAL",
      name: excursionActivityName.value,
      image: "",
      description: `${excursionLocation.value} · ${excursionDuration.value}`,
      netPrice: price,
      isManual: true,
      metadata: {
        type: "excursion" as const,
        activityName: excursionActivityName.value,
        location: excursionLocation.value,
        datetime: excursionDatetime.value,
        duration: excursionDuration.value,
        includesTransport: excursionIncludesTransport.value,
      },
      notes: notes.value || undefined,
    };
  }

  // extra
  return {
    providerId: "MANUAL",
    name: extraName.value,
    image: "",
    description: extraDescription.value,
    netPrice: price,
    isManual: true,
    metadata: {
      type: "extra" as const,
      name: extraName.value,
      description: extraDescription.value,
      managementDate: extraManagementDate.value || undefined,
    },
    notes: notes.value || undefined,
  };
};

const handleSubmit = () => {
  if (netPrice.value === null || netPrice.value === undefined) {
    toast.add({
      title: "Error",
      description: t("itinerary.errorNetPriceRequired"),
      color: "error",
    });
    return;
  }

  try {
    addOptionToBlock(props.blockId, buildOption());
    toast.add({
      title: t("itinerary.toastAddedTitle"),
      description: t("itinerary.successAddedToItinerary"),
      icon: "i-heroicons-check-circle",
      color: "primary",
    });
    emit("update:isOpen", false);
  } catch (err: unknown) {
    const msg =
      err instanceof Error
        ? err.message
        : t("itinerary.errorAddingToItinerary");
    toast.add({
      title: t("itinerary.errorAddTitle"),
      description: msg,
      color: "error",
    });
  }
};
</script>

<template>
  <UModal
    :open="isOpen"
    :title="modalTitle"
    @update:open="emit('update:isOpen', $event)"
  >
    <template #body>
      <div class="space-y-4">
        <!-- Hotel fields -->
        <template v-if="blockType === 'hotel'">
          <UFormField :label="t('itinerary.manualHotelNameLabel')">
            <UInput v-model="hotelName" />
          </UFormField>
          <UFormField :label="t('itinerary.manualHotelDestinationLabel')">
            <UInput v-model="hotelDestination" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField :label="t('itinerary.manualHotelCheckinLabel')">
              <UInput v-model="hotelCheckin" type="date" />
            </UFormField>
            <UFormField :label="t('itinerary.manualHotelCheckoutLabel')">
              <UInput v-model="hotelCheckout" type="date" />
            </UFormField>
          </div>
          <UFormField :label="t('itinerary.manualHotelRoomTypeLabel')">
            <UInput v-model="hotelRoomType" />
          </UFormField>
          <UFormField :label="t('itinerary.manualHotelRegimeLabel')">
            <USelect v-model="hotelRegime" :items="regimeOptions" />
          </UFormField>
        </template>

        <!-- Transfer fields -->
        <template v-else-if="blockType === 'transfer'">
          <UFormField :label="t('itinerary.manualTransferOriginLabel')">
            <UInput v-model="transferOrigin" />
          </UFormField>
          <UFormField :label="t('itinerary.manualTransferDestinationLabel')">
            <UInput v-model="transferDestination" />
          </UFormField>
          <UFormField :label="t('itinerary.manualTransferPickupLabel')">
            <UInput v-model="transferPickupDatetime" type="datetime-local" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField :label="t('itinerary.manualTransferVehicleLabel')">
              <USelect v-model="transferVehicleType" :items="vehicleOptions" />
            </UFormField>
            <UFormField :label="t('itinerary.manualTransferCapacityLabel')">
              <UInput
                v-model.number="transferCapacity"
                type="number"
                :min="1"
              />
            </UFormField>
          </div>
        </template>

        <!-- Flight fields -->
        <template v-else-if="blockType === 'flight'">
          <div class="grid grid-cols-2 gap-4">
            <UFormField :label="t('itinerary.manualFlightOriginLabel')">
              <UInput v-model="flightOrigin" />
            </UFormField>
            <UFormField :label="t('itinerary.manualFlightDestinationLabel')">
              <UInput v-model="flightDestination" />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField :label="t('itinerary.manualFlightDepartureLabel')">
              <UInput
                v-model="flightDepartureDatetime"
                type="datetime-local"
              />
            </UFormField>
            <UFormField :label="t('itinerary.manualFlightArrivalLabel')">
              <UInput v-model="flightArrivalDatetime" type="datetime-local" />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField :label="t('itinerary.manualFlightNumberLabel')">
              <UInput v-model="flightNumber" />
            </UFormField>
            <UFormField :label="t('itinerary.manualFlightAirlineLabel')">
              <UInput v-model="flightAirline" />
            </UFormField>
          </div>
          <UFormField :label="t('itinerary.manualFlightCabinLabel')">
            <USelect v-model="flightCabin" :items="cabinOptions" />
          </UFormField>
        </template>

        <!-- Excursion fields -->
        <template v-else-if="blockType === 'excursion'">
          <UFormField :label="t('itinerary.manualExcursionNameLabel')">
            <UInput v-model="excursionActivityName" />
          </UFormField>
          <UFormField :label="t('itinerary.manualExcursionLocationLabel')">
            <UInput v-model="excursionLocation" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField :label="t('itinerary.manualExcursionDatetimeLabel')">
              <UInput v-model="excursionDatetime" type="datetime-local" />
            </UFormField>
            <UFormField :label="t('itinerary.manualExcursionDurationLabel')">
              <UInput v-model="excursionDuration" placeholder="Ej: 3 horas" />
            </UFormField>
          </div>
          <UFormField :label="t('itinerary.manualExcursionTransportLabel')">
            <UToggle v-model="excursionIncludesTransport" />
          </UFormField>
        </template>

        <!-- Extra fields -->
        <template v-else-if="blockType === 'extra'">
          <UFormField :label="t('itinerary.manualExtraNameLabel')">
            <UInput v-model="extraName" />
          </UFormField>
          <UFormField :label="t('itinerary.manualExtraDescriptionLabel')">
            <UTextarea v-model="extraDescription" :rows="2" />
          </UFormField>
          <UFormField :label="t('itinerary.manualExtraDateLabel')">
            <UInput v-model="extraManagementDate" type="date" />
          </UFormField>
        </template>

        <USeparator />

        <!-- Common: net price -->
        <UFormField :label="t('itinerary.manualNetPriceLabel')">
          <UInput
            v-model.number="netPrice"
            type="number"
            :min="0"
            :step="0.01"
            placeholder="0.00"
          />
        </UFormField>

        <!-- Common: notes -->
        <UFormField :label="t('itinerary.manualNotesLabel')">
          <UTextarea
            v-model="notes"
            :rows="2"
            :placeholder="t('itinerary.manualNotesPlaceholder')"
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
          >{{ t("itinerary.cancelButton") }}</UButton
        >
        <UButton color="primary" @click="handleSubmit">
          {{ t("itinerary.manualAddButton") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
