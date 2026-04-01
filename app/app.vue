<script setup>
import { onMounted } from 'vue';
import { useConfig } from '~/composables/useConfig';

const { fetchCountries } = useConfig();

onMounted(() => {
  fetchCountries();
});

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - TravelOTA` : 'TravelOTA';
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: '#ffffff' },
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'es',
  },
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
