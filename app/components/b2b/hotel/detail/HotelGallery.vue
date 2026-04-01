<script setup lang="ts">
import { ref, computed } from 'vue';

const { t } = useI18n();

const props = defineProps<{
  images: string[];
}>();

const mainImage = ref(props.images[0] || '');

const setMainImage = (img: string) => {
  mainImage.value = img;
};

const currentIndex = computed(() => props.images.indexOf(mainImage.value));

const nextImage = () => {
  if (props.images.length === 0) return;
  const nextIdx = (currentIndex.value + 1) % props.images.length;
  mainImage.value = props.images[nextIdx] ?? '';
};

const prevImage = () => {
  if (props.images.length === 0) return;
  const prevIdx =
    (currentIndex.value - 1 + props.images.length) % props.images.length;
  mainImage.value = props.images[prevIdx] ?? '';
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Main Image -->
    <div
      class="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden group bg-gray-100 dark:bg-gray-800"
    >
      <img
        v-if="mainImage"
        :src="mainImage"
        class="w-full h-full object-cover transition-opacity duration-300"
        alt="Hotel"
      />
      <!-- Navigation arrows -->
      <button
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/80 w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        @click="prevImage"
      >
        <UIcon
          name="i-heroicons-chevron-left"
          class="w-6 h-6 text-gray-900 dark:text-white"
        />
      </button>
      <button
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/80 w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        @click="nextImage"
      >
        <UIcon
          name="i-heroicons-chevron-right"
          class="w-6 h-6 text-gray-900 dark:text-white"
        />
      </button>
    </div>

    <!-- Thumbnails -->
    <div class="flex gap-2 h-20 overflow-x-auto no-scrollbar">
      <button
        v-for="(img, idx) in images"
        :key="idx"
        class="w-28 shrink-0 rounded-lg overflow-hidden border-2 transition-colors"
        :class="
          mainImage === img
            ? 'border-primary-500'
            : 'border-transparent hover:border-primary-300'
        "
        @click="setMainImage(img)"
      >
        <img :src="img" class="w-full h-full object-cover" alt="Thumbnail" />
      </button>

      <!-- See all button -->
      <button
        class="w-28 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex flex-col items-center justify-center transition-colors"
      >
        <span class="text-lg font-bold text-gray-700 dark:text-gray-200">{{
          images.length
        }}</span>
        <span
          class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest"
          >{{ t('hotels.detail.photos') }}</span
        >
      </button>
    </div>
  </div>
</template>
