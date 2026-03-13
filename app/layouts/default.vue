<script setup>
const links = [
  { label: "INICIO", to: "/" },
  { label: "CONÓCENOS", to: "/about" },
  { label: "REGISTRO", to: "/register" },
];

const langItems = [[{ label: "ES" }, { label: "EN" }]];
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
          label="LOGIN"
          icon="i-lucide-user"
          variant="ghost"
          color="neutral"
          to="/dashboard"
        />
        <UDropdownMenu :items="langItems">
          <UButton
            variant="ghost"
            color="neutral"
            label="ES"
            trailing-icon="i-lucide-chevron-down"
          />
        </UDropdownMenu>
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
