<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

const appConfig = useAppConfig();

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

const { t } = useI18n();
const { role: userRole, logout, currentUser } = useAuth();

const userDisplayName = computed(() => {
  if (!currentUser.value) return null;
  const { first_name, last_name } = currentUser.value;
  return [first_name, last_name].filter(Boolean).join(" ") || currentUser.value.email;
});

const userEmail = computed(() => currentUser.value?.email ?? null);
const userAvatar = computed(() => currentUser.value?.avatar ?? null);
const { agency } = useAgency();

const isInternalRole = computed(() =>
  ["SUPER_ADMIN", "SUPPORT"].includes(userRole.value),
);

const userLinks = computed(() => {
  const baseLinks = [
    {
      label: t("nav.hotels"),
      icon: "i-heroicons-building-office-2",
      to: "/dashboard",
    },
    {
      label: t("nav.quoterB2B"),
      icon: "i-heroicons-calculator",
      to: "/dashboard/quoter/builder",
    },
    {
      label: t("nav.transfers"),
      icon: "i-heroicons-truck",
      to: "#",
      badge: t("nav.comingSoon"),
    },
  ];

  if (!isInternalRole.value) {
    baseLinks.push({
      label: t("nav.myBookings"),
      icon: "i-heroicons-briefcase",
      to: "/dashboard/bookings",
    });
  }

  if (userRole.value === "AGENCY_ADMIN") {
    baseLinks.push({
      label: t("nav.myAgency"),
      icon: "i-heroicons-building-storefront",
      to: "/dashboard/agency",
    });
  }

  if (userRole.value === "SUPER_ADMIN") {
    baseLinks.push({
      label: t("nav.administration"),
      icon: "i-heroicons-shield-check",
      to: "/dashboard/admin",
    });
  }

  if (userRole.value === "SUPPORT") {
    baseLinks.push({
      label: t("nav.administration"),
      icon: "i-heroicons-shield-check",
      to: "/dashboard/admin/bookings",
    });
  }

  if (isInternalRole.value) {
    baseLinks.push({
      label: t("nav.b2bTemplates"),
      icon: "i-heroicons-document-duplicate",
      to: "/dashboard/admin/templates",
    });
  }

  return baseLinks;
});

</script>

<template>
  <header
    class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50"
  >
    <div
      class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between h-16"
    >
      <!-- Logo + Desktop Navigation -->
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
              >{{ t('nav.adminBrand') }}</span
            >
          </template>
        </NuxtLink>

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

      <!-- Right Side Actions -->
      <div class="flex items-center gap-4">
        <AppLocaleSwitcher />

        <UColorModeButton />

        <div
          class="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"
        ></div>

        <div class="flex items-center gap-3">
          <div v-if="userDisplayName" class="hidden sm:block text-right">
            <p
              class="text-xs font-bold text-gray-900 dark:text-white leading-none"
            >
              {{ userDisplayName }}
            </p>
            <p class="text-[10px] text-gray-500 mt-0.5">{{ userEmail }}</p>
          </div>
          <UAvatar
            :src="userAvatar ?? undefined"
            :alt="userDisplayName ?? t('nav.user')"
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

    <!-- Mobile Navigation -->
    <div
      class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto scrollbar-hide"
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
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
