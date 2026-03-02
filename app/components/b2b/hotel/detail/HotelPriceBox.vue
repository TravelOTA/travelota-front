<script setup lang="ts">
defineProps<{
  bestPrice: number;
}>();

const emit = defineEmits<{
  (e: "open-map"): void;
}>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Precio Box -->
    <div
      class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-right relative shadow-sm rounded-lg"
    >
      <p
        class="text-[10px] text-gray-500 dark:text-gray-400 capitalize tracking-widest font-bold mb-1 w-full text-center"
      >
        MEJOR PRECIO POR ESTANCIA
      </p>
      <p
        class="text-4xl font-light text-gray-900 dark:text-white tracking-tight mb-2"
      >
        <span class="font-bold">$</span>
        {{
          bestPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}
      </p>
    </div>

    <!-- Map Box -->
    <div
      class="rounded-lg overflow-hidden shadow-sm relative h-32 bg-gray-200 dark:bg-gray-700"
    >
      <img
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        alt="Map"
        class="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
        @click="emit('open-map')"
      >
        <div
          class="bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-md font-bold text-sm tracking-wide"
        >
          Ver hotel en el mapa
        </div>
      </div>
    </div>
  </div>
</template>
