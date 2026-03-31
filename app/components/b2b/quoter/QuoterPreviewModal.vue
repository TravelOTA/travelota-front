<script setup lang="ts">
import QuoterDocument from './QuoterDocument.vue';
import { toPng } from 'html-to-image';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['update:isOpen']);

const { t } = useI18n();

const downloadImage = async () => {
  const node = document.getElementById('quoter-document');
  if (!node) return;

  try {
    const dataUrl = await toPng(node, {
      backgroundColor: '#ffffff',
      cacheBust: true,
    });
    const link = document.createElement('a');
    link.download = `quote-${new Date().getTime()}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Oops, something went wrong!', err);
  }
};
</script>

<template>
  <UModal
    :open="isOpen"
    fullscreen
    @update:open="emit('update:isOpen', $event)"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="emit('update:isOpen', false)"
          />
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ t('quoter.previewModalTitle') }}
          </h3>
        </div>
        <UButton
          color="primary"
          icon="i-heroicons-photo"
          :label="t('quoter.previewDownloadButton')"
          @click="downloadImage"
        />
      </div>
    </template>

    <template #body>
      <div
        class="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-gray-200 my-8"
      >
        <QuoterDocument />
      </div>
    </template>
  </UModal>
</template>

<style scoped>
/* Empty style block to satisfy Vite/Tailwind v4 parser */
</style>
