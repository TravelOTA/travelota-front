<script setup lang="ts">
import ItineraryDocument from "./ItineraryDocument.vue";
import { useItinerary } from "~/composables/useItinerary";
import { toPng } from "html-to-image";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["update:isOpen"]);

const { itinerary } = useItinerary();

const printVoucher = () => {
  localStorage.setItem("print_itinerary", JSON.stringify(itinerary.value));
  window.open("/print/itinerary", "_blank");
};

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
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Previsualización de Itinerario
        </h3>
        <div class="flex items-center gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="emit('update:isOpen', false)"
          />
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-photo"
            label="Descargar Imagen (PNG)"
            @click="downloadImage"
          />
          <UButton
            color="primary"
            icon="i-heroicons-printer"
            label="Descargar PDF / Imprimir"
            @click="printVoucher"
          />
        </div>
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
