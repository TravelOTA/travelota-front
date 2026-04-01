<script setup>
const { t } = useI18n();

const links = computed(() => [
  { label: t('nav.home').toUpperCase(), to: '/' },
  { label: t('nav.about').toUpperCase(), to: '/about' },
  { label: t('nav.register').toUpperCase(), to: '/register' },
]);
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-2xl font-black tracking-tight text-primary"
            >TravelOTA</span
          >
        </NuxtLink>
      </template>

      <template #right>
        <UNavigationMenu :items="links" />
        <UButton
          :label="t('nav.login').toUpperCase()"
          icon="i-lucide-user"
          variant="ghost"
          color="neutral"
          to="/dashboard"
        />
        <AppLocaleSwitcher />
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain class="flex-grow">
      <slot />
    </UMain>

    <USeparator />

    <AppFooter />
  </div>
</template>
