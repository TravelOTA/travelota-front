<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuoter } from '~/composables/useQuoter';
import QuoterDocument from '~/components/b2b/quoter/QuoterDocument.vue';

definePageMeta({ layout: 'print' });

// Get refs from the composable singleton
const { items, globalMarkupPercentage } = useQuoter();

onMounted(() => {
  // Sync state from the originating tab
  const data = localStorage.getItem('print_quoter');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.items) items.value = parsed.items;
      if (parsed.markup) globalMarkupPercentage.value = parsed.markup;
    } catch (e) {
      console.error('Failed to parse print quoter data', e);
    }
  }

  // Trigger print dialog after a brief delay to ensure fonts/images render
  setTimeout(() => {
    window.print();
  }, 500);
});
</script>

<template>
  <QuoterDocument />
</template>
