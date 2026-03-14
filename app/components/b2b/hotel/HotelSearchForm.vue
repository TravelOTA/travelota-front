<script setup lang="ts">
import { getLocalTimeZone, today as todayDate } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import type { Room } from "~/composables/useItinerary";

// Format date as dd/MM/yy (e.g. 25/05/26)
const formatDate = (date: DateValue): string => {
  const d = date.toDate(getLocalTimeZone());
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
};

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      destination: "",
      checkIn: "",
      checkOut: "",
      distribution: "1 Habitación, 2 Adultos",
      nationality: "Estados Unidos",
    }),
  },
});

const { initialData } = props;
const emit = defineEmits(["search"]);
const form = ref({ ...initialData });

// Local room distribution state (Array) to sync with component
const rooms = ref<Room[]>(initialData.rooms || [{ adults: 2, children: [] }]);

// Simple parser removed because we now pass rich data via useHotelSearch

// Default date range: today + 2 nights
const todayCalDate = todayDate(getLocalTimeZone());
const defaultEnd = todayCalDate.add({ days: 2 });

const dateRange = ref({
  start: todayCalDate,
  end: defaultEnd,
});

// Format rooms array back to a descriptive string for search services
const formatDistributionLabel = (roomsArray: Room[]) => {
  const totalRooms = roomsArray.length;
  const totalAdults = roomsArray.reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = roomsArray.reduce(
    (sum, r) => sum + r.children.length,
    0,
  );

  let label = `${totalRooms} Habitación${totalRooms > 1 ? "es" : ""}`;
  label += `, ${totalAdults} Adulto${totalAdults > 1 ? "s" : ""}`;
  if (totalChildren > 0) {
    label += `, ${totalChildren} Niño${totalChildren > 1 ? "s" : ""}`;
  }
  return label;
};

// Sync dates and distribution back to form when submitting
const submitSearch = () => {
  if (dateRange.value.start && dateRange.value.end) {
    form.value.checkIn = dateRange.value.start.toString();
    form.value.checkOut = dateRange.value.end.toString();
  }
  form.value.distribution = formatDistributionLabel(rooms.value);
  emit("search", {
    ...form.value,
    rooms: rooms.value,
  });
};

const { nationalities: nationalityOptions } = useConfig();
</script>

<template>
  <form
    class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 flex flex-col lg:flex-row gap-4 lg:items-end w-full"
    @submit.prevent="submitSearch"
  >
    <!-- Destination -->
    <div class="flex-1 w-full min-w-0">
      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
        Selecciona un destino
      </label>
      <UInput
        v-model="form.destination"
        icon="i-heroicons-map-pin"
        placeholder="Ciudad, País o Aeropuerto"
        size="md"
        class="w-full"
      />
    </div>

    <!-- Date Range Picker -->
    <div class="flex-1 w-full min-w-0">
      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
        Fechas
      </label>
      <UPopover class="w-full">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-calendar"
          size="md"
          class="w-full justify-start font-normal"
        >
          <template v-if="dateRange.start">
            <template v-if="dateRange.end">
              {{ formatDate(dateRange.start) }}
              &nbsp;→&nbsp;
              {{ formatDate(dateRange.end) }}
            </template>
            <template v-else>
              {{ formatDate(dateRange.start) }}
            </template>
          </template>
          <template v-else> Entrada - Salida </template>
        </UButton>

        <template #content>
          <UCalendar
            v-model="dateRange"
            class="p-2"
            :number-of-months="2"
            :fixed-weeks="false"
            :ui="{
              cellTrigger:
                'data-[outside-view]:opacity-0 data-[outside-view]:pointer-events-none',
            }"
            range
          />
        </template>
      </UPopover>
    </div>

    <!-- Distribution -->
    <div class="flex-1 w-full min-w-0">
      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
        Distribución
      </label>
      <B2bHotelRoomDistribution v-model="rooms" />
    </div>

    <!-- Origin (Nationality) -->
    <div class="flex-1 w-full min-w-0">
      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
        Origen
      </label>
      <USelectMenu
        v-model="form.nationality"
        :items="nationalityOptions"
        size="md"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-heroicons-globe-americas"
            class="w-5 h-5 text-gray-500"
          />
        </template>
      </USelectMenu>
    </div>

    <!-- Search Button -->
    <div class="w-full lg:w-auto">
      <UButton
        type="submit"
        color="primary"
        size="md"
        class="w-full lg:w-auto flex justify-center items-center transition-colors px-4"
      >
        <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
      </UButton>
    </div>
  </form>
</template>
