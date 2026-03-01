<script setup lang="ts">
import { getLocalTimeZone, today as todayDate } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";

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
      distribution: "1 Habitación",
      nationality: "Estados Unidos",
    }),
  },
});

const { initialData } = props;
const emit = defineEmits(["search"]);
const form = ref({ ...initialData });

// Default date range: today + 2 nights
const todayCalDate = todayDate(getLocalTimeZone());
const defaultEnd = todayCalDate.add({ days: 2 });

const dateRange = ref({
  start: todayCalDate,
  end: defaultEnd,
});

// Sync dates back to form when submitting
const submitSearch = () => {
  if (dateRange.value.start && dateRange.value.end) {
    form.value.checkIn = dateRange.value.start.toString();
    form.value.checkOut = dateRange.value.end.toString();
  }
  emit("search", form.value);
};

const distributionOptions = [
  "1 Habitación",
  "1 Habitación, 2 Adultos",
  "2 Habitaciones",
  "2 Habitaciones, 4 Adultos",
];

const nationalityOptions = [
  "Estados Unidos",
  "España",
  "República Dominicana",
  "México",
  "Colombia",
  "Argentina",
];
</script>

<template>
  <form
    class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 flex flex-col lg:flex-row gap-4 items-end w-full"
    @submit.prevent="submitSearch"
  >
    <!-- Destination -->
    <div class="flex-1 w-full lg:min-w-[200px]">
      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5"
        >Selecciona un destino</label
      >
      <UInput
        v-model="form.destination"
        icon="i-heroicons-map-pin"
        placeholder="Ciudad, País o Aeropuerto"
      />
    </div>

    <!-- Date Range Picker -->
    <div class="flex-[1.5] w-full">
      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5"
        >Fechas</label
      >
      <UPopover>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-calendar"
          class="w-full justify-start h-10 font-normal"
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
            range
          />
        </template>
      </UPopover>
    </div>

    <!-- Distribution -->
    <div class="flex-1 w-full">
      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5"
        >Distribución</label
      >
      <USelectMenu v-model="form.distribution" :options="distributionOptions">
        <template #leading>
          <UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-500" />
        </template>
      </USelectMenu>
    </div>

    <!-- Origin (Nationality) -->
    <div class="flex-1 w-full">
      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1.5"
        >Origen</label
      >
      <USelectMenu v-model="form.nationality" :options="nationalityOptions">
        <template #leading>
          <UIcon
            name="i-heroicons-globe-americas"
            class="w-5 h-5 text-gray-500"
          />
        </template>
      </USelectMenu>
    </div>

    <!-- Search Button -->
    <div class="w-full lg:w-auto mt-4 lg:mt-0">
      <UButton
        type="submit"
        class="h-10 w-full lg:w-16 flex justify-center items-center !bg-[#bedb39] hover:!bg-[#a6c12d] text-gray-900 transition-colors"
      >
        <UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6" />
      </UButton>
    </div>
  </form>
</template>
