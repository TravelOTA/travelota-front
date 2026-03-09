<script setup lang="ts">
import { onMounted } from "vue";
import { useItinerary } from "~/composables/useItinerary";
import ItineraryDocument from "~/components/b2b/quoter/ItineraryDocument.vue";

definePageMeta({ layout: "print" });

const { itinerary } = useItinerary();

onMounted(() => {
  // Sync state from the originating tab
  const data = localStorage.getItem("print_itinerary");
  if (data) {
    try {
      itinerary.value = JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse print itinerary data", e);
    }
  }

  // Trigger print dialog after a brief delay to ensure fonts/images render
  setTimeout(() => {
    window.print();
  }, 500);
});
</script>

<template>
  <ItineraryDocument />
</template>
