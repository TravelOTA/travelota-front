<script setup lang="ts">
defineProps({
  hotel: {
    type: Object,
    required: true,
  },
});

const isExpanded = ref(true); // Simulate that by default the first 2 are shown expanded
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6 shadow-sm hover:shadow transition-shadow"
  >
    <!-- Cabecera de la Tarjeta de Hotel -->
    <div class="flex flex-col md:flex-row bg-white dark:bg-gray-900">
      <!-- Imagen -->
      <div
        class="relative w-full md:w-64 h-48 md:h-auto shrink-0 cursor-pointer"
      >
        <img
          :src="hotel.image"
          :alt="hotel.name"
          class="w-full h-full object-cover"
        />
        <div v-if="hotel.badge" class="absolute top-0 left-0">
          <span
            v-if="hotel.badge === 'recomendado'"
            class="bg-[#bedb39] text-white p-2 block"
            ><UIcon name="i-heroicons-hand-thumb-up" class="w-5 h-5"
          /></span>
          <span
            v-else-if="hotel.badge === 'hot'"
            class="bg-[#bedb39] text-white px-2 py-1 text-xs font-bold uppercase tracking-wider block"
            >Hot Deal!</span
          >
        </div>
      </div>

      <!-- Info Central -->
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h3
              class="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 transition-colors"
            >
              {{ hotel.name }}
            </h3>
            <div class="flex text-yellow-400">
              <UIcon
                v-for="i in hotel.stars"
                :key="i"
                name="i-heroicons-star-16-solid"
                class="w-4 h-4"
              />
            </div>
          </div>

          <div
            class="flex items-center text-sm text-gray-500 mb-4 cursor-pointer hover:text-gray-700"
          >
            <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
            <span>{{ hotel.location }}</span>
            <span class="ml-2 underline underline-offset-2">Ver el mapa</span>
          </div>

          <UButton variant="outline" color="neutral" size="sm" class="mb-2"
            >Comparar</UButton
          >
        </div>
      </div>

      <!-- Bloque de Precio (Mejor Precio) -->
      <div
        class="p-4 md:w-48 shrink-0 flex flex-col justify-center items-end text-right border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800"
      >
        <p
          class="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1 leading-tight text-right w-full"
        >
          Mejor Precio<br />Por Estancia
        </p>
        <p
          class="text-3xl font-light text-gray-900 dark:text-white tracking-tight mb-2"
        >
          <span class="font-bold">$</span>
          {{ hotel.bestPrice.toLocaleString("en-US") }}
        </p>
        <div class="bg-[#bedb39] p-1 rounded-sm text-white">
          <UIcon name="i-heroicons-hand-thumb-up" class="w-4 h-4 block" />
        </div>
      </div>
    </div>

    <!-- Separador Estético opcional si está colapsado -->
    <div v-if="isExpanded" class="w-full h-1 bg-[#bedb39]/20"></div>

    <!-- Grid de Habitaciones (Accordion Mode) -->
    <div v-if="isExpanded" class="bg-gray-50 dark:bg-gray-800/20 px-4 py-2">
      <div
        v-for="(room, idx) in hotel.rooms"
        :key="idx"
        class="flex flex-col sm:flex-row items-center py-4 border-b border-gray-200 dark:border-gray-700 last:border-0 gap-4"
      >
        <!-- Icono (Medalla) -->
        <div class="w-8 flex justify-center text-[#bedb39]">
          <UIcon name="i-heroicons-check-badge" class="w-6 h-6" />
        </div>

        <!-- Tipo Habitación -->
        <div class="flex-1 min-w-[150px]">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{
            room.name
          }}</span>
        </div>

        <!-- Régimen -->
        <div class="w-16 font-bold text-gray-800 dark:text-gray-300">
          {{ room.regimen }}
        </div>

        <!-- Cancelación -->
        <div class="w-40">
          <span
            class="text-xs text-gray-500 underline underline-offset-2 cursor-pointer hover:text-gray-700"
            >{{ room.cancellation }}</span
          >
        </div>

        <!-- Precio Fila -->
        <div
          class="w-32 text-right font-bold text-gray-900 dark:text-white flex items-center justify-end gap-1"
        >
          $ {{ room.price.toLocaleString("en-US") }}
          <UIcon
            name="i-heroicons-information-circle"
            class="w-4 h-4 text-gray-400 cursor-help"
          />
        </div>

        <!-- Botón Reservar -->
        <div class="w-28 text-right">
          <UButton
            block
            class="!bg-[#bedb39] hover:!bg-[#a6c12d] text-gray-900 font-bold border border-[#a6c12d]"
            >Reservar</UButton
          >
        </div>
      </div>

      <!-- Toggle "Ver Más opciones" -->
      <div
        class="py-3 text-center border-t border-gray-200 dark:border-gray-700 mt-2"
      >
        <button
          class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
        >
          <UIcon name="i-heroicons-plus-circle" class="w-5 h-5 mr-2" />
          Ver más opciones
        </button>
      </div>
    </div>
  </div>
</template>
