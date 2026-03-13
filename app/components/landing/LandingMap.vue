<template>
  <section
    class="py-24 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 relative overflow-hidden"
  >
    <div class="px-4 lg:px-8 mx-auto max-w-7xl text-center relative z-10">
      <h2
        class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase mb-6"
      >
        Más de 17 Oficinas en 11 Países
      </h2>
      <div class="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
        <UBadge
          v-for="country in countries"
          :key="country"
          variant="subtle"
          color="primary"
          size="lg"
          class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
          >{{ country }}</UBadge
        >
      </div>

      <div class="relative max-w-3xl mx-auto">
        <UIcon
          name="i-lucide-globe-2"
          class="w-full h-[300px] text-gray-200 dark:text-gray-800 drop-shadow-xl opacity-80"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const countries = [
  "España",
  "Portugal",
  "Cabo Verde",
  "Marruecos",
  "Turquía",
  "México",
  "Cuba",
  "Finlandia",
  "Jamaica",
  "Egipto",
  "República Dominicana",
];
</script>
