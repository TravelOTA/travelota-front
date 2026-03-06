<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
useHead({ title: "Mi Agencia - TravelOTA" });

const agency = ref({
  name: "Viajes El Corte Inglés",
  rut: "B-12345678",
  country: "España",
  email: "b2b@elcorteingles.es",
  phone: "+34 91 418 88 00",
  address: "Hermosilla 112, Madrid, España",
  logo: "https://ui-avatars.com/api/?name=V+C&color=0284c7&background=e0f2fe",
  registeredAt: "2024-03-15",
  status: "Activa",
  usersCount: 8,
  bookingsCount: 312,
  nextSettlement: "2026-04-01",
});
</script>

<template>
  <div class="max-w-6xl mx-auto pb-16">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        Mi Agencia
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Resumen operativo y datos corporativos de tu empresa en TravelOTA.
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"
          >
            <UIcon name="i-heroicons-users" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Equipo de Ventas
            </p>
            <p class="text-2xl font-bold">{{ agency.usersCount }}</p>
          </div>
        </div>
        <template #footer>
          <NuxtLink
            to="/dashboard/agency/users"
            class="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1"
          >
            Gestionar Equipo
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </template>
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
              Reservas Totales
            </p>
            <p class="text-2xl font-bold">{{ agency.bookingsCount }}</p>
          </div>
        </div>
        <template #footer>
          <NuxtLink
            to="/dashboard/bookings"
            class="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1"
          >
            Ir a Mis Reservas
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </template>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400"
          >
            <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Beneficios y Markup
            </p>
            <p class="text-2xl font-bold">Activo</p>
          </div>
        </div>
        <template #footer>
          <NuxtLink
            to="/dashboard/agency/markup"
            class="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1"
          >
            Configurar Markup
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </template>
      </UCard>
    </div>

    <!-- Agency Profile Data -->
    <UCard class="shadow-sm rounded-xl overflow-hidden">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-identification"
            class="w-5 h-5 text-gray-500"
          />
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Perfil Corporativo
          </h2>
        </div>
      </template>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Logo Sidebar -->
        <div class="flex flex-col items-center justify-start md:w-1/4 pt-2">
          <UAvatar
            :src="agency.logo"
            :alt="agency.name"
            size="3xl"
            class="mb-4 shadow-sm"
          />
          <UBadge
            :color="agency.status === 'Activa' ? 'success' : 'warning'"
            variant="subtle"
            class="mb-2"
          >
            {{ agency.status }}
          </UBadge>
          <p class="text-xs text-gray-500 mt-2 text-center">
            Registrada el {{ agency.registeredAt }}
          </p>
        </div>

        <!-- Info Grid -->
        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <dt class="text-xs font-semibold text-gray-400 uppercase mb-1">
              Nombre Comercial
            </dt>
            <dd class="text-sm font-medium text-gray-900 dark:text-white">
              {{ agency.name }}
            </dd>
          </div>
          <div>
            <dt class="text-xs font-semibold text-gray-400 uppercase mb-1">
              DNI / RUT Fiscal
            </dt>
            <dd class="text-sm font-medium text-gray-900 dark:text-white">
              {{ agency.rut }}
            </dd>
          </div>
          <div>
            <dt class="text-xs font-semibold text-gray-400 uppercase mb-1">
              Dirección Registrada
            </dt>
            <dd class="text-sm font-medium text-gray-900 dark:text-white">
              {{ agency.address }}
            </dd>
          </div>
          <div>
            <dt class="text-xs font-semibold text-gray-400 uppercase mb-1">
              País Operativo
            </dt>
            <dd class="text-sm font-medium text-gray-900 dark:text-white">
              {{ agency.country }}
            </dd>
          </div>
          <div>
            <dt class="text-xs font-semibold text-gray-400 uppercase mb-1">
              Correo Administrador
            </dt>
            <dd class="text-sm font-medium text-gray-900 dark:text-white">
              {{ agency.email }}
            </dd>
          </div>
          <div>
            <dt class="text-xs font-semibold text-gray-400 uppercase mb-1">
              Teléfono Principal
            </dt>
            <dd class="text-sm font-medium text-gray-900 dark:text-white">
              {{ agency.phone }}
            </dd>
          </div>
        </div>
      </div>

      <!-- Support Footer Note -->
      <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        <p class="text-sm text-gray-500">
          * Para modificar los datos corporativos, legales o fiscales de tu
          agencia, por favor contacta con tu soporte asignado en TravelOTA.
        </p>
      </div>
    </UCard>
  </div>
</template>
