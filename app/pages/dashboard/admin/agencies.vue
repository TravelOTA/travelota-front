<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Gestor de Agencias B2B - TravelOTA",
});

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Nombre Agencia" },
  { accessorKey: "country", header: "País" },
  { accessorKey: "markup", header: "MarkUp Base (%)" },
  { accessorKey: "status", header: "Estado" },
  { id: "actions" },
];

const agencies = [
  {
    id: "AG-1001",
    name: "Viajes El Corte Inglés",
    country: "España",
    markup: 12,
    status: "Activa",
  },
  {
    id: "AG-1002",
    name: "Destinia",
    country: "España",
    markup: 10,
    status: "Activa",
  },
  {
    id: "AG-1003",
    name: "Agencia Demo B2B",
    country: "México",
    markup: 15,
    status: "Pendiente",
  },
];
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <NuxtLink
          to="/dashboard/admin"
          class="text-sm font-medium text-primary-500 hover:underline mb-2 inline-flex items-center gap-1"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" /> Volver al
          Panel
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Agencias B2B
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Administra las agencias registradas y define su MarkUp global base
          asociado al proveedor.
        </p>
      </div>
      <UButton icon="i-heroicons-plus" color="primary" label="Nueva Agencia" />
    </div>

    <!-- Table content -->
    <UCard class="shadow-sm rounded-lg" :ui="{ body: 'p-0 sm:p-0' }">
      <div
        class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center"
      >
        <UInput
          icon="i-heroicons-magnifying-glass"
          placeholder="Buscar agencia..."
          class="w-72"
        />
        <USelectMenu
          :options="['Todas', 'Activas', 'Pendientes', 'Bloqueadas']"
          placeholder="Filtrar estado"
          class="w-40"
        />
      </div>

      <UTable :data="agencies" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge
            :color="
              row.original.status === 'Activa'
                ? 'success'
                : row.original.status === 'Pendiente'
                  ? 'warning'
                  : 'error'
            "
            variant="subtle"
          >
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #markup-cell="{ row }">
          <span class="font-bold text-gray-900 dark:text-gray-100"
            >{{ row.original.markup }}%</span
          >
        </template>

        <template #actions-cell>
          <div class="flex justify-end pr-2">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal"
            />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
