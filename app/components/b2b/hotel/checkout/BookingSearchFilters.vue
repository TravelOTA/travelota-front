<script setup lang="ts">
import { reactive } from "vue";

const emit = defineEmits<{
  (e: "search", filters: typeof filters): void;
  (e: "clear"): void;
}>();

const filters = reactive({
  pnr: "",
  titular: "",
  destination: "",
  statuses: [] as string[],
  createdFrom: "",
  createdTo: "",
  checkInFrom: "",
  checkInTo: "",
});

const statusOptions = [
  { label: "Confirmada", value: "Confirmada" },
  { label: "Pendiente Pago", value: "Pendiente Pago" },
  { label: "Cancelada", value: "Cancelada" },
  { label: "Vencida", value: "Vencida" },
];

const handleSearch = () => {
  emit("search", { ...filters });
};

const handleClear = () => {
  filters.pnr = "";
  filters.titular = "";
  filters.destination = "";
  filters.statuses = [];
  filters.createdFrom = "";
  filters.createdTo = "";
  filters.checkInFrom = "";
  filters.checkInTo = "";
  emit("clear");
};

const hasActiveFilters = computed(() => {
  return (
    filters.pnr ||
    filters.titular ||
    filters.destination ||
    filters.statuses.length > 0 ||
    filters.createdFrom ||
    filters.createdTo ||
    filters.checkInFrom ||
    filters.checkInTo
  );
});
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
  >
    <div class="flex items-center gap-3 mb-6">
      <div
        class="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center"
      >
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="w-5 h-5 text-primary-500"
        />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">
          Buscar Reservas
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Utiliza los filtros para encontrar reservas específicas.
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSearch">
      <!-- Row 1: Text search fields -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <UFormField label="Localizador PNR">
          <UInput
            v-model="filters.pnr"
            placeholder="TRV-XXXXXXXXX"
            icon="i-heroicons-document-text"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Titular / Pasajero">
          <UInput
            v-model="filters.titular"
            placeholder="Nombre del titular..."
            icon="i-heroicons-user"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Destino / Hotel">
          <UInput
            v-model="filters.destination"
            placeholder="Ciudad o hotel..."
            icon="i-heroicons-map-pin"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Row 2: Status + Date ranges -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <UFormField label="Estado" class="md:col-span-1">
          <USelectMenu
            v-model="filters.statuses"
            :items="statusOptions"
            multiple
            placeholder="Todos"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Creación desde" class="md:col-span-1">
          <UInput v-model="filters.createdFrom" type="date" class="w-full" />
        </UFormField>

        <UFormField label="Creación hasta" class="md:col-span-1">
          <UInput v-model="filters.createdTo" type="date" class="w-full" />
        </UFormField>

        <UFormField label="Check-in desde" class="md:col-span-1">
          <UInput v-model="filters.checkInFrom" type="date" class="w-full" />
        </UFormField>

        <UFormField label="Check-in hasta" class="md:col-span-1">
          <UInput v-model="filters.checkInTo" type="date" class="w-full" />
        </UFormField>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800"
      >
        <div class="flex items-center gap-2">
          <UBadge
            v-if="hasActiveFilters"
            color="primary"
            variant="subtle"
            class="text-xs"
          >
            Filtros activos
          </UBadge>
        </div>
        <div class="flex items-center gap-3">
          <UButton
            type="button"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            class="font-medium"
            :disabled="!hasActiveFilters"
            @click="handleClear"
          >
            Limpiar Filtros
          </UButton>
          <UButton
            type="submit"
            color="primary"
            icon="i-heroicons-magnifying-glass"
            class="font-bold px-6"
            size="lg"
          >
            Buscar
          </UButton>
        </div>
      </div>
    </form>
  </div>
</template>
