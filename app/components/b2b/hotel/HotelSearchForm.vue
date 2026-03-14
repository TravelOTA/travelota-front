<script setup lang="ts">
import { getLocalTimeZone, today as todayDate } from "@internationalized/date";
import type { SearchRoomDistribution } from "~/composables/useItinerary";
import { useConfig } from "~/composables/useConfig";

interface InitialSearchData {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  nationality?: string;
  distribution?: string;
  rooms?: SearchRoomDistribution[];
}

const props = defineProps<{
  initialData?: InitialSearchData;
}>();

const emit = defineEmits(["search"]);

// Default values if no initialData is provided
const defaultInitial = {
  destination: "",
  checkIn: "",
  checkOut: "",
  nationality: "Estados Unidos",
  distribution: "1 Habitación, 2 Adultos",
  rooms: [{ adults: 2, children: [] }] as SearchRoomDistribution[],
};

const initialData = props.initialData || { ...defaultInitial };

const form = ref({ ...initialData });

// Local room distribution state (Array) to sync with component
const rooms = ref<SearchRoomDistribution[]>(
  initialData.rooms ||
    ([{ adults: 2, children: [] }] as SearchRoomDistribution[]),
);

// Default date range: today + 2 nights
const todayCalDate = todayDate(getLocalTimeZone());
const defaultEnd = todayCalDate.add({ days: 2 });

const dateRange = ref({
  start: todayCalDate,
  end: defaultEnd,
});

// Format rooms array back to a descriptive string for search services
const formatDistributionLabel = (roomsArray: SearchRoomDistribution[]) => {
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
  <div
    class="relative z-10 w-full rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 p-2 lg:p-3 shadow-2xl overflow-visible"
  >
    <form
      class="grid grid-cols-1 md:grid-cols-12 gap-2 lg:gap-3 items-end"
      @submit.prevent="submitSearch"
    >
      <!-- Destination -->
      <div class="md:col-span-3">
        <UFormField label="Destino o Hotel">
          <UInput
            v-model="form.destination"
            placeholder="¿A dónde vas?"
            icon="i-heroicons-map-pin"
            class="w-full"
            variant="none"
            size="lg"
            :ui="{
              base: 'bg-white/90 dark:bg-gray-900/90 border-0 focus:ring-2 focus:ring-primary-500 rounded-xl transition-all duration-300',
            }"
          />
        </UFormField>
      </div>

      <!-- Dates -->
      <div class="md:col-span-3">
        <UFormField label="Fechas">
          <UPopover class="w-full">
            <UButton
              variant="none"
              icon="i-heroicons-calendar-days"
              class="w-full justify-start text-left bg-white/90 dark:bg-gray-900/90 border-0 focus:ring-2 focus:ring-primary-500 rounded-xl h-[44px] transition-all duration-300"
            >
              <span class="truncate font-medium">
                {{ dateRange.start ? dateRange.start.toString() : "Entrada" }} -
                {{ dateRange.end ? dateRange.end.toString() : "Salida" }}
              </span>
            </UButton>

            <template #content>
              <div class="p-2">
                <UCalendar v-model="dateRange" range :number-of-months="2" />
              </div>
            </template>
          </UPopover>
        </UFormField>
      </div>

      <!-- Passengers / Distribution -->
      <div class="md:col-span-3">
        <UFormField label="Distribución">
          <B2bHotelRoomDistribution v-model="rooms" />
        </UFormField>
      </div>

      <!-- Nationality -->
      <div class="md:col-span-2">
        <UFormField label="Nacionalidad">
          <USelect
            v-model="form.nationality"
            :options="nationalityOptions"
            variant="none"
            size="lg"
            class="w-full"
            :ui="{
              base: 'bg-white/90 dark:bg-gray-900/90 border-0 focus:ring-2 focus:ring-primary-500 rounded-xl transition-all duration-300',
            }"
          />
        </UFormField>
      </div>

      <!-- Search Button -->
      <div class="md:col-span-1">
        <UButton
          type="submit"
          color="primary"
          size="lg"
          class="w-full h-[44px] flex justify-center items-center rounded-xl shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6" />
        </UButton>
      </div>
    </form>
  </div>
</template>
