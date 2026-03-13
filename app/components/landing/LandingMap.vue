<template>
  <section
    class="py-24 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 relative overflow-hidden"
  >
    <div class="px-4 lg:px-8 mx-auto max-w-7xl text-center relative z-10">
      <Motion
        as="div"
        :initial="{ opacity: 0, y: -20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true }"
        :transition="{ duration: 0.5 }"
      >
        <h2
          class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase mb-6"
        >
          Más de 17 Oficinas en 11 Países
        </h2>
        <div
          class="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto"
        >
          <Motion
            v-for="(country, index) in countries"
            :key="country"
            as="span"
            :initial="{ opacity: 0, scale: 0.8 }"
            :while-in-view="{ opacity: 1, scale: 1 }"
            :viewport="{ once: true }"
            :transition="{ duration: 0.3, delay: index * 0.05 }"
          >
            <UBadge
              variant="subtle"
              color="primary"
              size="lg"
              class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
              >{{ country }}</UBadge
            >
          </Motion>
        </div>
      </Motion>

      <Motion
        as="div"
        class="relative max-w-3xl mx-auto"
        :initial="{ opacity: 0, scale: 0.95 }"
        :while-in-view="{ opacity: 1, scale: 1 }"
        :viewport="{ once: true }"
        :transition="{ duration: 0.6, delay: 0.2 }"
      >
        <LandingInteractiveMap />
      </Motion>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Motion } from "motion-v";

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
