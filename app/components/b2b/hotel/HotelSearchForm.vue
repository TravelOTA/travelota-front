<script setup lang="ts">
import { getLocalTimeZone, today as todayDate } from "@internationalized/date";
import type { SearchRoomDistribution } from "~/composables/useItinerary";
import { useConfig } from "~/composables/useConfig";
import { formatCalendarDate } from "~/utils/formatDate";

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
  <!-- Pill container: overflow-visible para que los popovers (fechas, distribución)
       no sean recortados por el borde redondeado.
       focus-within:ring: el anillo aparece al enfocar cualquier campo interno -->
  <div
    class="relative z-10 w-full flex flex-col md:flex-row rounded-2xl overflow-visible bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md focus-within:ring-2 focus-within:ring-green-600 dark:focus-within:ring-green-500"
  >
    <form
      class="flex flex-col md:flex-row w-full"
      @submit.prevent="submitSearch"
    >
      <!-- ── Destino ── -->
      <!-- last:border-b-0: elimina el borde inferior del último segmento en mobile -->
      <div
        class="flex items-center gap-3 px-4 py-3 flex-[2] cursor-text border-b border-gray-200 dark:border-gray-700 last:border-b-0 md:border-b-0 hover:bg-green-50 dark:hover:bg-green-900 transition-colors rounded-tl-2xl rounded-tr-2xl md:rounded-tr-none md:rounded-bl-2xl"
      >
        <UIcon
          name="i-heroicons-map-pin-solid"
          class="w-5 h-5 shrink-0 text-green-700 dark:text-green-600"
        />
        <div class="flex flex-col overflow-hidden w-full">
          <span
            class="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
          >
            Destino
          </span>
          <UInput
            v-model="form.destination"
            placeholder="¿A dónde vas?"
            variant="none"
            size="sm"
            class="w-full p-0"
            :ui="{
              base: 'bg-transparent border-0 ring-0 shadow-none p-0 text-sm font-medium text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0',
            }"
          />
        </div>
      </div>

      <!-- Separador vertical (solo desktop) -->
      <div
        class="hidden md:block w-px self-stretch my-3 bg-gray-200 dark:bg-gray-700 shrink-0"
      />

      <!-- ── Fechas ── -->
      <div
        class="flex-[2] border-b border-gray-200 dark:border-gray-700 last:border-b-0 md:border-b-0"
      >
        <UPopover class="w-full h-full">
          <div
            class="flex items-center gap-3 px-4 py-3 h-full cursor-pointer hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
          >
            <UIcon
              name="i-heroicons-calendar-days-solid"
              class="w-5 h-5 shrink-0 text-green-700 dark:text-green-600"
            />
            <div class="flex flex-col overflow-hidden">
              <span
                class="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Fechas
              </span>
              <span
                class="text-sm font-medium text-gray-900 dark:text-gray-50 truncate"
              >
                <template v-if="dateRange.start && dateRange.end">
                  {{ formatCalendarDate(dateRange.start) }} -
                  {{ formatCalendarDate(dateRange.end) }}
                </template>
                <span v-else class="text-gray-400 dark:text-gray-500"
                  >dd/mm/yy - dd/mm/yy</span
                >
              </span>
            </div>
          </div>
          <template #content>
            <div class="p-2">
              <UCalendar v-model="dateRange" range :number-of-months="2" />
            </div>
          </template>
        </UPopover>
      </div>

      <!-- Separador vertical (solo desktop) -->
      <div
        class="hidden md:block w-px self-stretch my-3 bg-gray-200 dark:bg-gray-700 shrink-0"
      />

      <!-- ── Distribución ── -->
      <div
        class="flex-[2] border-b border-gray-200 dark:border-gray-700 last:border-b-0 md:border-b-0"
      >
        <B2bHotelRoomDistribution v-model="rooms">
          <template #trigger="{ label }">
            <div
              class="flex items-center gap-3 px-4 py-3 h-full cursor-pointer hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
            >
              <UIcon
                name="i-heroicons-users-solid"
                class="w-5 h-5 shrink-0 text-green-700 dark:text-green-600"
              />
              <div class="flex flex-col overflow-hidden">
                <span
                  class="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Distribución
                </span>
                <span
                  class="text-sm font-medium text-gray-900 dark:text-gray-50 truncate"
                >
                  {{ label }}
                </span>
              </div>
            </div>
          </template>
        </B2bHotelRoomDistribution>
      </div>

      <!-- Separador vertical (solo desktop) -->
      <div
        class="hidden md:block w-px self-stretch my-3 bg-gray-200 dark:bg-gray-700 shrink-0"
      />

      <!-- ── Nacionalidad ── -->
      <!-- nationalityOptions viene de useConfig() — ya está disponible en el script existente:
           `const { nationalities: nationalityOptions } = useConfig();` — no requiere cambio -->
      <div
        class="flex items-center gap-3 px-4 py-3 flex-[1.5] border-b border-gray-200 dark:border-gray-700 last:border-b-0 md:border-b-0 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
      >
        <UIcon
          name="i-heroicons-globe-alt-solid"
          class="w-5 h-5 shrink-0 text-green-700 dark:text-green-600"
        />
        <div class="flex flex-col overflow-hidden w-full">
          <span
            class="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
          >
            Nacionalidad
          </span>
          <USelect
            v-model="form.nationality"
            :options="nationalityOptions"
            variant="none"
            size="sm"
            class="w-full p-0"
            :ui="{
              base: 'bg-transparent border-0 ring-0 shadow-none p-0 text-sm font-medium text-gray-900 dark:text-gray-50 focus:ring-0',
            }"
          />
        </div>
      </div>

      <!-- Separador vertical (solo desktop) -->
      <div
        class="hidden md:block w-px self-stretch my-3 bg-gray-200 dark:bg-gray-700 shrink-0"
      />

      <!-- ── Botón Buscar ── -->
      <div class="flex-none">
        <UButton
          type="submit"
          color="primary"
          class="w-full md:w-[110px] h-full flex items-center justify-center gap-2 rounded-none rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl bg-green-700 hover:bg-green-800 text-white font-bold px-5 py-3"
        >
          <UIcon name="i-heroicons-magnifying-glass-solid" class="w-5 h-5" />
          <span>Buscar</span>
        </UButton>
      </div>
    </form>
  </div>
</template>
