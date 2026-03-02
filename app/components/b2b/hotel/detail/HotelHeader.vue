<script setup lang="ts">
defineProps<{
  name: string;
  stars: number;
  address: string;
}>();
</script>

<template>
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b border-gray-200 dark:border-gray-800"
  >
    <div class="flex-1">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ name }}
        </h1>
        <div class="flex text-yellow-400">
          <UIcon
            v-for="i in stars"
            :key="i"
            name="i-heroicons-star-16-solid"
            class="w-5 h-5"
          />
        </div>
      </div>
      <div
        class="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1"
      >
        <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
        <span>{{ address }}</span>
      </div>
    </div>
  </div>
</template>
