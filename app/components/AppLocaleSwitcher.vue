<script setup lang="ts">
import type { SupportedLocale } from "~/composables/useAppLocale";

const { locale, switchLocale } = useAppLocale();

const toggle = () => {
  const next: SupportedLocale = locale.value === "es" ? "en" : "es";
  switchLocale(next);
};
</script>

<template>
  <UButton variant="ghost" :label="locale.toString() === 'es' ? 'ES' : 'EN'" @click="toggle" />
</template>
