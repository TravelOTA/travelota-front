<script setup lang="ts">
// Available roles: 'USER', 'AGENCY_ADMIN', 'SUPPORT', 'SUPER_ADMIN'
// TODO: This should be connected to the real session store in the future
const userRole = ref("SUPER_ADMIN");

const userLinks = computed(() => {
  const baseLinks = [
    {
      label: "Hoteles",
      icon: "i-heroicons-building-office-2",
      to: "/dashboard",
    },
    {
      label: "Traslados",
      icon: "i-heroicons-truck",
      to: "#",
      badge: "Prónto",
    },
    {
      label: "Mis Reservas",
      icon: "i-heroicons-briefcase",
      to: "/dashboard/bookings",
    },
  ];

  // B2B Navbar permission logic
  if (["AGENCY_ADMIN", "SUPER_ADMIN"].includes(userRole.value)) {
    baseLinks.push({
      label: "Mi Agencia",
      icon: "i-heroicons-building-storefront",
      to: "/dashboard/agency/markup", // Redirect to first tab
    });
  }

  if (userRole.value === "SUPER_ADMIN") {
    baseLinks.push({
      label: "Administración",
      icon: "i-heroicons-shield-check",
      to: "/dashboard/admin",
    });
  }

  return baseLinks;
});

const langItems = [[{ label: "ES" }, { label: "EN" }]];
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Topbar (Navbar B2B) -->
    <header
      class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50"
    >
      <div
        class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between h-16"
      >
        <!-- Logo -->
        <div class="flex items-center gap-8">
          <NuxtLink to="/dashboard" class="flex items-center gap-2">
            <span class="text-xl font-black tracking-tight text-primary"
              >TravelOTA B2B</span
            >
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <template v-for="link in userLinks" :key="link.label">
              <UButton
                :to="link.to"
                :icon="link.icon"
                :label="link.label"
                variant="ghost"
                color="neutral"
                class="font-medium"
                :class="[
                  $route.path === link.to
                    ? 'bg-gray-100 dark:bg-gray-800 text-primary-500'
                    : '',
                ]"
              >
                <template v-if="link.badge" #trailing>
                  <UBadge size="xs" color="primary" variant="subtle">{{
                    link.badge
                  }}</UBadge>
                </template>
              </UButton>
            </template>
          </nav>
        </div>

        <!-- Right Side Actions & Profile -->
        <div class="flex items-center gap-4">
          <UDropdownMenu :items="langItems">
            <UButton
              variant="ghost"
              color="neutral"
              label="ES"
              trailing-icon="i-lucide-chevron-down"
            />
          </UDropdownMenu>

          <UColorModeButton />

          <div
            class="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"
          ></div>

          <!-- User Profile Menu -->
          <div class="flex items-center gap-3">
            <div class="hidden sm:block text-right">
              <p
                class="text-xs font-bold text-gray-900 dark:text-white leading-none"
              >
                Agencia Demo
              </p>
              <p class="text-[10px] text-gray-500 mt-0.5">Vendedor 1</p>
            </div>
            <UAvatar
              src="https://avatars.githubusercontent.com/u/739984"
              alt="Usuario"
              size="sm"
            />
            <UButton
              icon="i-heroicons-arrow-right-on-rectangle"
              color="error"
              variant="ghost"
              to="/"
              class="ml-1"
            />
          </div>
        </div>
      </div>

      <!-- Mobile Navigation (Scrollable horizontal) -->
      <div
        class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto scrolbar-hide"
      >
        <ul class="flex items-center px-4 py-2 space-x-2">
          <li v-for="link in userLinks" :key="link.label" class="shrink-0">
            <UButton
              :to="link.to"
              :icon="link.icon"
              :label="link.label"
              size="sm"
              variant="ghost"
              color="neutral"
              :class="[
                $route.path === link.to
                  ? 'bg-gray-100 dark:bg-gray-800 text-primary-500'
                  : '',
              ]"
            />
          </li>
        </ul>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.scrolbar-hide::-webkit-scrollbar {
  display: none;
}
.scrolbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
