<script setup lang="ts">
import { ref } from "vue";
import HotelSearchForm from "~/components/b2b/hotel/HotelSearchForm.vue";
import {
  useHotelSearch,
  type HotelSearchParams,
} from "~/composables/useHotelSearch";
import { formatIsoDate } from "~/utils/formatDate";

const props = defineProps<{
  hotelName?: string;
}>();

const { searchParams, navigateToResults } = useHotelSearch();
const isEditing = ref(false);

const handleSearchUpdate = async (newData: HotelSearchParams) => {
  await navigateToResults(newData);
  isEditing.value = false;
};
</script>

<template>
  <div
    class="sticky top-[104px] md:top-[64px] z-40 bg-gray-50 dark:bg-gray-900 pb-4 pt-2 -mt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-2"
  >
    <!-- Modo edición: formulario completo -->
    <div
      v-if="isEditing"
      class="bg-[#f2f4f6] dark:bg-gray-800 rounded-lg p-4 shadow-sm border-b-4 border-green-700 dark:border-green-600"
    >
      <HotelSearchForm
        :initial-data="searchParams"
        @search="handleSearchUpdate"
      />
    </div>

    <!-- Modo resumen: pill integrado -->
    <div
      v-else
      class="border-b-4 border-green-700 dark:border-green-600 rounded-t-2xl"
    >
      <!-- focus-within:ring-*: el anillo aparece al hacer foco en cualquier campo interno -->
      <div
        class="flex flex-col md:flex-row rounded-t-2xl overflow-visible bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-green-600 dark:focus-within:ring-green-500"
      >
        <!-- Destino — rounded-tl/tr-2xl en mobile (esquinas superiores del pill);
             en desktop solo rounded-tl-2xl, el wrapper exterior maneja rounded-t-2xl -->
        <div
          class="flex items-center gap-3 px-4 py-3 flex-[2] border-b border-gray-200 dark:border-gray-700 last:border-b-0 md:border-b-0 hover:bg-green-50 dark:hover:bg-green-900 transition-colors cursor-pointer rounded-tl-2xl rounded-tr-2xl md:rounded-tr-none"
          @click="isEditing = true"
        >
          <UIcon
            name="i-heroicons-map-pin-solid"
            class="w-5 h-5 shrink-0 text-green-700 dark:text-green-600"
          />
          <div class="flex flex-col overflow-hidden">
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Destino
            </span>
            <span
              class="text-sm font-medium text-gray-900 dark:text-gray-50 truncate"
            >
              {{ props.hotelName || searchParams.destination || "Sin destino" }}
            </span>
          </div>
        </div>

        <!-- Separador -->
        <div
          class="hidden md:block w-px self-stretch my-3 bg-gray-200 dark:bg-gray-700 shrink-0"
        />

        <!-- Fechas -->
        <div
          class="flex items-center gap-3 px-4 py-3 flex-[2] border-b border-gray-200 dark:border-gray-700 last:border-b-0 md:border-b-0 hover:bg-green-50 dark:hover:bg-green-900 transition-colors cursor-pointer"
          @click="isEditing = true"
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
              <template v-if="searchParams.checkIn && searchParams.checkOut">
                {{ formatIsoDate(searchParams.checkIn) }} -
                {{ formatIsoDate(searchParams.checkOut) }}
              </template>
              <span v-else class="text-gray-400 dark:text-gray-500"
                >dd/mm/yy - dd/mm/yy</span
              >
            </span>
          </div>
        </div>

        <!-- Separador -->
        <div
          class="hidden md:block w-px self-stretch my-3 bg-gray-200 dark:bg-gray-700 shrink-0"
        />

        <!-- Distribución -->
        <div
          class="flex items-center gap-3 px-4 py-3 flex-[2] border-b border-gray-200 dark:border-gray-700 last:border-b-0 md:border-b-0 hover:bg-green-50 dark:hover:bg-green-900 transition-colors cursor-pointer"
          @click="isEditing = true"
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
              <!-- searchParams.distribution ya tiene default "1 Habitación, 2 Adultos" del composable -->
              {{ searchParams.distribution }}
            </span>
          </div>
        </div>

        <!-- Separador -->
        <div
          class="hidden md:block w-px self-stretch my-3 bg-gray-200 dark:bg-gray-700 shrink-0"
        />

        <!-- Nacionalidad -->
        <div
          class="flex items-center gap-3 px-4 py-3 flex-[1.5] border-b border-gray-200 dark:border-gray-700 last:border-b-0 md:border-b-0 hover:bg-green-50 dark:hover:bg-green-900 transition-colors cursor-pointer"
          @click="isEditing = true"
        >
          <UIcon
            name="i-heroicons-globe-alt-solid"
            class="w-5 h-5 shrink-0 text-green-700 dark:text-green-600"
          />
          <div class="flex flex-col overflow-hidden">
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Nac.
            </span>
            <span
              class="text-sm font-medium text-gray-900 dark:text-gray-50 truncate"
            >
              {{ searchParams.nationality || "—" }}
            </span>
          </div>
        </div>

        <!-- Separador -->
        <div
          class="hidden md:block w-px self-stretch my-3 bg-gray-200 dark:bg-gray-700 shrink-0"
        />

        <!-- Botón Editar -->
        <div class="flex-none">
          <UButton
            color="primary"
            class="w-full md:w-[110px] h-full flex items-center justify-center gap-2 rounded-none rounded-b-2xl md:rounded-bl-none md:rounded-tr-2xl md:rounded-br-none bg-green-700 hover:bg-green-800 text-white font-bold px-5 py-3"
            @click="isEditing = true"
          >
            <UIcon name="i-heroicons-pencil-solid" class="w-4 h-4" />
            <span>Editar</span>
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
