<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Portal de Administración - TravelOTA",
});
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8 flex items-center gap-3">
      <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-primary" />
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Administrador del Sistema
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          Visión global e indicadores de rendimiento de TravelOTA B2B.
        </p>
      </div>
    </div>

    <!-- Stats Globales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"
          >
            <UIcon name="i-heroicons-building-office" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Agencias Activas
            </p>
            <p class="text-2xl font-bold">142</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"
          >
            <UIcon name="i-heroicons-document-check" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Reservas del Mes
            </p>
            <p class="text-2xl font-bold">3,850</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400"
          >
            <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Volumen Neto
            </p>
            <p class="text-2xl font-bold">$1.2M</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400"
          >
            <UIcon name="i-heroicons-users" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Agentes de Soporte
            </p>
            <p class="text-2xl font-bold">8</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Accesos Rápidos Admin -->
    <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">
      Gestor de Plataforma
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        class="cursor-pointer hover:border-primary-500 transition-colors"
        @click="$router.push('/dashboard/admin/agencies')"
      >
        <div class="p-2">
          <div
            class="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-lg flex items-center justify-center mb-4"
          >
            <UIcon name="i-heroicons-building-storefront" class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-lg mb-1">Empresas (Agencias B2B)</h3>
          <p class="text-sm text-gray-500">
            Aprobar registros, listar agencias activas y gestionar sus MarkUps
            Base.
          </p>
        </div>
        <template #footer>
          <div
            class="flex items-center justify-between text-primary text-sm font-semibold"
          >
            Gestionar Agencias
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </div>
        </template>
      </UCard>

      <UCard
        class="cursor-pointer hover:border-primary-500 transition-colors opacity-75"
      >
        <div class="p-2">
          <div
            class="w-10 h-10 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg flex items-center justify-center mb-4"
          >
            <UIcon name="i-heroicons-user-group" class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-lg mb-1">Usuarios de Soporte</h3>
          <p class="text-sm text-gray-500">
            Crear agentes TravelOTA con vista NETA y acceso a todas las
            reservas.
          </p>
        </div>
        <template #footer>
          <div
            class="flex items-center justify-between text-gray-500 text-sm font-semibold"
          >
            Gestionar Soporte
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </div>
        </template>
      </UCard>

      <UCard
        class="cursor-pointer hover:border-primary-500 transition-colors opacity-75"
      >
        <div class="p-2">
          <div
            class="w-10 h-10 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg flex items-center justify-center mb-4"
          >
            <UIcon name="i-heroicons-briefcase" class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-lg mb-1">Todas las Reservas</h3>
          <p class="text-sm text-gray-500">
            Monitor multiproveedor de operaciones cerradas y cancelaciones a
            nivel global.
          </p>
        </div>
        <template #footer>
          <div
            class="flex items-center justify-between text-gray-500 text-sm font-semibold"
          >
            Ver todas <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
