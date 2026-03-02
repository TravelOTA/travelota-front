<script setup lang="ts">
defineProps<{
  name: string;
  stars: number;
  address: string;
  image: string;
}>();
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-6 shadow-sm"
  >
    <!-- Image -->
    <div
      class="w-full md:w-64 h-40 shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800"
    >
      <img :src="image" :alt="name" class="w-full h-full object-cover" />
    </div>

    <!-- Details -->
    <div class="flex-1 flex flex-col justify-center">
      <div class="flex text-yellow-400 mb-1">
        <UIcon
          v-for="i in stars"
          :key="i"
          name="i-heroicons-star-16-solid"
          class="w-4 h-4"
        />
      </div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {{ name }}
      </h2>
      <div class="flex items-start text-sm text-gray-500 dark:text-gray-400">
        <UIcon name="i-heroicons-map-pin" class="w-5 h-5 mr-1 shrink-0" />
        <span>{{ address }}</span>
      </div>
    </div>
  </div>
</template>
