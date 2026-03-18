<script setup lang="ts">
const { t } = useI18n();
useSeoMeta({
  title: t("auth.seo.homeTitle"),
  description: t("auth.seo.homeDescription"),
});
</script>

<template>
  <div class="min-h-screen">
    <LandingHero />
    <LandingServices />
    <LandingMap />
    <LandingBedBank />
  </div>
</template>
