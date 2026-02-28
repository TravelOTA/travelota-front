<script setup>
const links = [
  {
    label: "Inicio",
    icon: "i-heroicons-home",
    to: "/dashboard",
  },
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
    to: "#",
  },
  {
    label: "Mi Agencia",
    icon: "i-heroicons-cog-8-tooth",
    to: "#",
  },
];

const langItems = [[{ label: "ES" }, { label: "EN" }]];
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside
      class="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col hidden md:flex"
    >
      <div
        class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 shrink-0"
      >
        <NuxtLink to="/dashboard" class="flex items-center gap-2">
          <span class="text-xl font-black tracking-tight text-primary"
            >TravelOTA B2B</span
          >
        </NuxtLink>
      </div>
      <div class="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        <UButton
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          :icon="link.icon"
          :label="link.label"
          variant="ghost"
          color="gray"
          class="w-full justify-start text-[15px] py-2.5 font-medium"
        >
          <template #trailing>
            <UBadge
              v-if="link.badge"
              size="xs"
              color="primary"
              variant="subtle"
              class="ml-auto"
            >
              {{ link.badge }}
            </UBadge>
          </template>
        </UButton>
      </div>

      <!-- User Profile summary in sidebar footer -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <div class="flex items-center gap-3">
          <UAvatar
            src="https://avatars.githubusercontent.com/u/739984"
            alt="Usuario"
            size="sm"
          />
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium text-gray-900 dark:text-white truncate"
            >
              Agencia Demo
            </p>
            <p class="text-xs text-gray-500 truncate">Vendedor 1</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar -->
      <header
        class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-end px-6 shrink-0 z-10"
      >
        <div class="flex items-center gap-4">
          <!-- TODO: Mobile Menu toggle button -->
          <UDropdownMenu :items="langItems">
            <UButton
              variant="ghost"
              color="neutral"
              label="ES"
              trailing-icon="i-lucide-chevron-down"
            />
          </UDropdownMenu>
          <UColorModeButton />
          <UButton
            icon="i-heroicons-arrow-right-on-rectangle"
            color="red"
            variant="ghost"
            label="Salir"
            to="/"
          />
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6 md:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
