<script setup lang="ts">
useHead({
  title: "Gestión de Vendedores - TravelOTA",
});

const columns = [
  { accessorKey: "name", header: "Vendedor" },
  { accessorKey: "email", header: "Correo Electrónico" },
  { accessorKey: "role", header: "Rol" },
  { accessorKey: "status", header: "Estado" },
  { id: "actions" },
];

const users = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@miagencia.com",
    role: "Vendedor",
    status: "Activo",
  },
  {
    id: 2,
    name: "María Gómez",
    email: "maria@miagencia.com",
    role: "Admin Agencia",
    status: "Activo",
  },
  {
    id: 3,
    name: "Carlos López",
    email: "carlos@miagencia.com",
    role: "Vendedor",
    status: "Inactivo",
  },
];
</script>

<template>
  <div>
    <UCard class="shadow-sm rounded-lg" :ui="{ body: 'p-0 sm:p-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-users" class="w-5 h-5 text-primary" />
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              Equipo de Ventas
            </h2>
          </div>
          <UButton
            icon="i-heroicons-user-plus"
            color="primary"
            label="Invitar Vendedor"
            size="sm"
          />
        </div>
      </template>

      <div
        class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center"
      >
        <UInput
          icon="i-heroicons-magnifying-glass"
          placeholder="Buscar empleado..."
          class="w-72"
        />
        <USelectMenu
          :options="['Todos', 'Activos', 'Inactivos']"
          placeholder="Filtrar"
          class="w-32"
        />
      </div>

      <UTable :data="users" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status === 'Activo' ? 'success' : 'error'"
            variant="subtle"
          >
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #role-cell="{ row }">
          <UBadge
            :color="
              row.original.role === 'Admin Agencia' ? 'primary' : 'neutral'
            "
            variant="soft"
            size="xs"
          >
            {{ row.original.role }}
          </UBadge>
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
