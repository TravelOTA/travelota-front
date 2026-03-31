<script setup lang="ts">
import { ref } from "vue";

const { t } = useI18n();

defineProps<{
  infoText: string;
}>();

const isOpen = ref(false);
</script>

<template>
  <div
    class="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-lg overflow-hidden"
  >
    <button
      class="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-2 text-blue-800 dark:text-blue-300">
        <UIcon name="i-heroicons-information-circle" class="w-5 h-5 shrink-0" />
        <span class="font-bold text-sm">{{ t('hotels.checkout.importantHotelInfo') }}</span>
      </div>
      <UIcon
        :name="isOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        class="w-5 h-5 text-blue-500 transition-transform duration-200"
      />
    </button>

    <div
      v-show="isOpen"
      class="px-4 pb-4 pt-1 text-sm text-blue-900/80 dark:text-blue-200/80"
    >
      <p class="leading-relaxed">{{ infoText }}</p>
    </div>
  </div>
</template>
