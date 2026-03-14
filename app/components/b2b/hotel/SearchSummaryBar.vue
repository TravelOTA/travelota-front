<script setup lang="ts">
import HotelSearchForm from "~/components/b2b/hotel/HotelSearchForm.vue";
import {
  useHotelSearch,
  type HotelSearchParams,
} from "~/composables/useHotelSearch";

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
    <!-- Barra de edición activa -->
    <div
      v-if="isEditing"
      class="bg-[#f2f4f6] dark:bg-gray-800 rounded-lg p-4 shadow-sm border-b-4 border-primary-500"
    >
      <HotelSearchForm
        :initial-data="searchParams"
        @search="handleSearchUpdate"
      />
    </div>

    <!-- Barra de resumen (Modo lectura) -->
    <div
      v-else
      class="bg-[#f2f4f6] dark:bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm border-b-4 border-primary-500"
    >
      <div
        class="text-gray-700 dark:text-gray-300 font-medium text-sm lg:text-base"
      >
        <span class="font-bold text-gray-900 dark:text-white">{{
          props.hotelName || searchParams.destination || "Sin destino"
        }}</span
        >, {{ searchParams.checkIn }} - {{ searchParams.checkOut }},
        {{ searchParams.distribution }}
      </div>

      <div class="mt-4 sm:mt-0 flex gap-2">
        <UButton
          color="primary"
          variant="solid"
          class="font-bold px-6"
          @click="isEditing = true"
        >
          Editar
        </UButton>
      </div>
    </div>
  </div>
</template>
