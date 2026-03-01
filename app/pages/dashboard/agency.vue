<script setup lang="ts">
import { useRoute } from "vue-router";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Mi Agencia - Dashboard B2B",
});

const route = useRoute();

const agencyTabs = computed(() => {
  return [
    {
      label: "Gestión de Vendedores",
      icon: "i-heroicons-users",
      to: "/dashboard/agency/users",
      current: route.path === "/dashboard/agency/users",
    },
    {
      label: "Configuración MarkUp",
      icon: "i-heroicons-currency-dollar",
      to: "/dashboard/agency/markup",
      current: route.path === "/dashboard/agency/markup",
    },
  ];
});
</script>

<template>
  <div class="max-w-7xl mx-auto h-full flex flex-col">
    <!-- Título de Sección -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        Mi Agencia
      </h1>
      <p class="text-gray-500 dark:text-gray-400">
        Configura el comportamiento comercial de tu negocio y administra a tu
        equipo de agentes.
      </p>
    </div>

    <!-- Menú Horiztonal de sub-rutas -->
    <div class="border-b border-gray-200 dark:border-gray-800 mb-6">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <NuxtLink
          v-for="tab in agencyTabs"
          :key="tab.label"
          :to="tab.to"
          :class="[
            tab.current
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
          ]"
          :aria-current="tab.current ? 'page' : undefined"
        >
          <UIcon
            :name="tab.icon"
            :class="[
              tab.current
                ? 'text-primary-500 dark:text-primary-400'
                : 'text-gray-400 group-hover:text-gray-500',
              '-ml-0.5 mr-2 h-5 w-5',
            ]"
            aria-hidden="true"
          />
          <span>{{ tab.label }}</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Renderizado dinámico de Subrutas (users.vue o markup.vue) -->
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
