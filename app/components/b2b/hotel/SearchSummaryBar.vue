<script setup lang="ts">
import HotelSearchForm from "~/components/b2b/hotel/HotelSearchForm.vue";

const props = defineProps<{
  hotelName?: string;
}>();

const isEditing = ref(false);

const mockSearchData = ref({
  destination: "Punta Cana, La Altagracia, Republica Dominicana",
  checkIn: "2026-06-13",
  nights: 6,
  checkOut: "2026-06-19",
  distribution: "1 Habitaciones, 2 Adultos",
  nationality: "Estados Unidos",
});

const handleSearchUpdate = (newData: typeof mockSearchData.value) => {
  console.log("Renewing results for:", newData);
  mockSearchData.value = { ...newData };
  isEditing.value = false;
  // Emit or regenerate search here
};
</script>

<template>
  <div>
    <!-- Barra de edición activa -->
    <div
      v-if="isEditing"
      class="bg-[#f2f4f6] dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-6 border-b-4 border-primary-500"
    >
      <HotelSearchForm
        :initial-data="mockSearchData"
        @search="handleSearchUpdate"
      />
    </div>

    <!-- Barra de resumen (Modo lectura) -->
    <div
      v-else
      class="bg-[#f2f4f6] dark:bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm mb-6 border-b-4 border-primary-500"
    >
      <div
        class="text-gray-700 dark:text-gray-300 font-medium text-sm lg:text-base"
      >
        <span class="font-bold text-gray-900 dark:text-white">{{
          props.hotelName || mockSearchData.destination
        }}</span
        >, {{ mockSearchData.checkIn }} - {{ mockSearchData.checkOut }},
        {{ mockSearchData.distribution }}
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
