<script setup lang="ts">
defineProps({
  hotel: {
    type: Object, // REFACTOR: This should be a corresponding hotel type
    required: true,
  },
});

const emit = defineEmits<{
  (e: "open-map", hotel: Record<string, unknown>): void;
}>();
</script>

<template>
  <div
    class="flex flex-col md:flex-row bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden"
  >
    <!-- Imagen -->
    <NuxtLink
      :to="`/dashboard/hotels/${hotel.id}`"
      class="relative w-full md:w-64 h-48 shrink-0 cursor-pointer block"
    >
      <img
        :src="hotel.image"
        :alt="hotel.name"
        class="w-full h-full object-cover"
      />
    </NuxtLink>

    <!-- Info Central -->
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <div class="flex text-yellow-400 mb-1">
          <UIcon
            v-for="i in hotel.stars"
            :key="i"
            name="i-heroicons-star-16-solid"
            class="w-4 h-4"
          />
        </div>
        <NuxtLink :to="`/dashboard/hotels/${hotel.id}`">
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
          >
            {{ hotel.name }}
          </h3>
        </NuxtLink>

        <div
          class="flex items-center text-sm text-gray-500 mb-4 cursor-pointer hover:text-gray-700"
          @click="emit('open-map', hotel)"
        >
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
          <span>{{ hotel.location }}</span>
          <span class="ml-2 underline underline-offset-2">Ver el mapa</span>
        </div>
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
        {{
          hotel.bestPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}
      </p>
    </div>
  </div>
</template>
