<script setup lang="ts">
import type { Promotion } from "~/composables/usePromotions";

const props = defineProps<{ promotion: Promotion }>();
const emit = defineEmits<{ search: [destination: string] }>();
</script>

<template>
  <div
    class="group rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow cursor-pointer"
    @click="emit('search', props.promotion.destination)"
  >
    <div class="h-48 relative overflow-hidden">
      <img
        :src="promotion.image"
        :alt="promotion.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <UBadge
        v-if="promotion.badge"
        :color="promotion.badgeColor ?? 'primary'"
        class="absolute top-3 right-3 font-bold px-2 py-1"
      >
        {{ promotion.badge }}
      </UBadge>
    </div>

    <div class="p-5">
      <h3 class="font-bold text-lg mb-1 text-gray-900 dark:text-white">
        {{ promotion.title }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {{ promotion.subtitle }}
      </p>
      <div
        class="flex justify-end items-center pt-4 border-t border-gray-100 dark:border-gray-800"
      >
        <UButton
          variant="soft"
          size="xs"
          color="primary"
          trailing-icon="i-lucide-arrow-right"
        >
          Ver hoteles
        </UButton>
      </div>
    </div>
  </div>
</template>
