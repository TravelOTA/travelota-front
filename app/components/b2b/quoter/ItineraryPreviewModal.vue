<script setup lang="ts">
import ItineraryDocument from "./ItineraryDocument.vue";
import { useItinerary } from "~/composables/useItinerary";
import { toPng } from "html-to-image";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["update:isOpen"]);

const { itinerary } = useItinerary();

const downloadImage = async () => {
  const node = document.getElementById("itinerary-document");
  if (!node) return;

  try {
    const dataUrl = await toPng(node, {
      backgroundColor: "#ffffff",
      cacheBust: true,
    });
    const link = document.createElement("a");
    link.download = `itinerary-${itinerary.value.clientName || "travel"}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Oops, something went wrong!", err);
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
            Previsualización de Itinerario
          </h3>
        </div>
        <UButton
          color="primary"
          icon="i-heroicons-photo"
          label="Descargar Itinerario"
          @click="downloadImage"
        />
      </div>
    </template>

    <template #body>
      <div
        class="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-gray-200 my-8"
      >
        <ItineraryDocument />
      </div>
    </template>
  </UModal>
</template>

<style scoped>
/* Empty style block to satisfy Vite/Tailwind v4 parser */
</style>
