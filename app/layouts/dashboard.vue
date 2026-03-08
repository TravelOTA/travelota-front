<script setup lang="ts">
import AddToItineraryModal from "~/components/b2b/quoter/AddToItineraryModal.vue";
import { useAuth } from "~/composables/useAuth";

const appConfig = useAppConfig();

// Dynamically generate UI Hex colors when a custom color is set
const hexThemeStyles = computed(() => {
  const color = appConfig.ui?.colors?.primary;
  if (color && color.startsWith("#")) {
    return `
      :root, .dark, html.dark {
        --ui-color-primary-50: color-mix(in srgb, ${color}, white 90%);
        --ui-color-primary-100: color-mix(in srgb, ${color}, white 80%);
        --ui-color-primary-200: color-mix(in srgb, ${color}, white 60%);
        --ui-color-primary-300: color-mix(in srgb, ${color}, white 40%);
        --ui-color-primary-400: color-mix(in srgb, ${color}, white 20%);
        --ui-color-primary-500: ${color};
        --ui-color-primary-600: color-mix(in srgb, ${color}, black 20%);
        --ui-color-primary-700: color-mix(in srgb, ${color}, black 40%);
        --ui-color-primary-800: color-mix(in srgb, ${color}, black 60%);
        --ui-color-primary-900: color-mix(in srgb, ${color}, black 80%);
        --ui-color-primary-950: color-mix(in srgb, ${color}, black 90%);
      }
    `;
  }
  return "";
});

useHead(() => ({
  style: hexThemeStyles.value ? [{ innerHTML: hexThemeStyles.value }] : [],
}));

// Available roles: 'USER', 'AGENCY_ADMIN', 'SUPPORT', 'SUPER_ADMIN'
const { role: userRole, logout } = useAuth();

const { agency } = useAgency();

// Roles that are internal TravelOTA staff (no bookings, no agency management)
const isInternalRole = computed(() =>
  ["SUPER_ADMIN", "SUPPORT"].includes(userRole.value),
);

const userLinks = computed(() => {
  const baseLinks = [
    {
      label: "Hoteles",
      icon: "i-heroicons-building-office-2",
      to: "/dashboard",
    },
    {
      label: "Cotizador B2B",
      icon: "i-heroicons-calculator",
      to: "/dashboard/quoter/builder",
    },
    {
      label: "Traslados",
      icon: "i-heroicons-truck",
      to: "#",
      badge: "Prónto",
    },
  ];

  // "Mis Reservas" y "Mi Agencia" solo para roles de agencia (no para staff interno)
  if (!isInternalRole.value) {
    baseLinks.push({
      label: "Mis Reservas",
      icon: "i-heroicons-briefcase",
      to: "/dashboard/bookings",
    });
  }

  // "Mi Agencia" solo para AGENCY_ADMIN
  if (userRole.value === "AGENCY_ADMIN") {
    baseLinks.push({
      label: "Mi Agencia",
      icon: "i-heroicons-building-storefront",
      to: "/dashboard/agency",
    });
  }

  // Admin completo para SUPER_ADMIN
  if (userRole.value === "SUPER_ADMIN") {
    baseLinks.push({
      label: "Administración",
      icon: "i-heroicons-shield-check",
      to: "/dashboard/admin",
    });
  }

  // Soporte solo ve "Todas las Reservas" bajo una entrada de Administración
  if (userRole.value === "SUPPORT") {
    baseLinks.push({
      label: "Administración",
      icon: "i-heroicons-shield-check",
      to: "/dashboard/admin/bookings",
    });
  }

  // Enlaces comunes de administración interna para plantillas
  if (isInternalRole.value) {
    baseLinks.push({
      label: "Plantillas B2B",
      icon: "i-heroicons-document-duplicate",
      to: "/dashboard/admin/templates",
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
          <NuxtLink to="/dashboard" class="flex items-center gap-3">
            <template v-if="!isInternalRole">
              <UAvatar
                :src="agency.logo"
                :alt="agency.name"
                size="sm"
                class="bg-white border border-gray-100 shadow-sm"
              />
              <span
                class="text-lg sm:text-xl font-black tracking-tight text-primary truncate max-w-[140px] sm:max-w-[200px]"
                >{{ agency.name }}</span
              >
            </template>
            <template v-else>
              <span class="text-xl font-black tracking-tight text-primary"
                >TravelOTA Admin</span
              >
            </template>
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
              class="ml-1"
              @click="logout"
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

    <!-- Itinerary Global Modal -->
    <AddToItineraryModal />
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
