<script setup lang="ts">
const hotelComments = ref(
  "Estimado cliente, las habitaciones estándar están sujetas a disponibilidad y asignadas al momento del Check-in. No se garantizan peticiones especiales previas a la llegada.",
);
const userComments = ref("");
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm flex flex-col gap-6"
  >
    <!-- Comentarios del hotel -->
    <div>
      <h3 class="font-bold text-gray-900 dark:text-white mb-2 text-sm">
        Comentarios del hotel
      </h3>
      <div
        class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300"
      >
        {{ hotelComments }}
      </div>
    </div>

    <!-- Observaciones del cliente -->
    <div>
      <h3 class="font-bold text-gray-900 dark:text-white mb-2 text-sm">
        Observaciones al hotel (opcional)
      </h3>
      <UTextarea
        v-model="userComments"
        placeholder="Indique si requiere camas separadas, cuna, o alguna observación especial..."
        :rows="3"
        class="w-full"
      />
      <p class="text-xs text-gray-500 mt-1">
        Estas peticiones no están garantizadas y podrían incurrir en gastos
        adicionales en destino.
      </p>
    </div>
  </div>
</template>
