<script setup lang="ts">
defineProps<{
  policyText: string;
}>();
</script>

<template>
  <div
    class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-5"
  >
    <div class="flex items-start gap-3">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5"
      />
      <div>
        <h3 class="font-bold text-red-800 dark:text-red-300 mb-2">
          Políticas de Cancelación
        </h3>
        <p
          class="text-sm text-red-700 dark:text-red-200/80 leading-relaxed text-justify"
        >
          {{ policyText }}
        </p>
      </div>
    </div>
  </div>
</template>
