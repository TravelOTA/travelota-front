<script setup lang="ts">
useHead({ title: "Equipo de Ventas - TravelOTA" });

interface AgencyUser {
  id: string;
  name: string;
  email: string;
  role: "Admin Agencia" | "Vendedor";
  status: "Activo" | "Inactivo";
  lastLogin: string;
}

const users = ref<AgencyUser[]>([
  {
    id: "U-851",
    name: "Juan Pérez",
    email: "juan@miagencia.com",
    role: "Vendedor",
    status: "Activo",
    lastLogin: "Hace 2 horas",
  },
  {
    id: "U-852",
    name: "María Gómez",
    email: "maria@miagencia.com",
    role: "Admin Agencia",
    status: "Activo",
    lastLogin: "Ayer",
  },
  {
    id: "U-853",
    name: "Carlos López",
    email: "carlos@miagencia.com",
    role: "Vendedor",
    status: "Inactivo",
    lastLogin: "Hace 1 mes",
  },
]);

// ── Table config ──
const columns = [
  { accessorKey: "name", header: "Usuario" },
  { accessorKey: "role", header: "Rol B2B" },
  { accessorKey: "status", header: "Estado" },
  { accessorKey: "lastLogin", header: "Último Acceso" },
  { id: "actions" },
];

const searchQuery = ref("");
const statusFilter = ref("Todos");

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchQuery =
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus =
      statusFilter.value === "Todos" || user.status === statusFilter.value;
    return matchQuery && matchStatus;
  });
});

// ── Modal config ──
const isUserModalOpen = ref(false);
const isEditing = ref(false);
const formUser = ref<Partial<AgencyUser> & { password?: string }>({});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailValid = computed(() => emailRegex.test(formUser.value.email || ""));
const emailTouched = ref(false);
const showPassword = ref(false);

const isFormValid = computed(() => {
  const isNameValid = (formUser.value.name?.trim() || "") !== "";
  const isPassValid = isEditing.value
    ? !formUser.value.password || formUser.value.password.length >= 8
    : (formUser.value.password?.length || 0) >= 8;
  return isNameValid && emailValid.value && isPassValid;
});

function openCreateModal() {
  isEditing.value = false;
  emailTouched.value = false;
  showPassword.value = false;
  formUser.value = {
    name: "",
    email: "",
    password: "",
    role: "Vendedor",
    status: "Activo",
  };
  isUserModalOpen.value = true;
}

function openEditModal(user: AgencyUser) {
  isEditing.value = true;
  emailTouched.value = false;
  showPassword.value = false;
  formUser.value = { ...user, password: "" };
  isUserModalOpen.value = true;
}

function saveUser() {
  if (!isFormValid.value) return;
  if (isEditing.value) {
    const index = users.value.findIndex((u) => u.id === formUser.value.id);
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index]!,
        ...formUser.value,
      } as AgencyUser;
    }
  } else {
    users.value.unshift({
      id: `U-${Math.floor(Math.random() * 1000)}`,
      name: formUser.value.name as string,
      email: formUser.value.email as string,
      role: formUser.value.role as "Admin Agencia" | "Vendedor",
      status: formUser.value.status as "Activo" | "Inactivo",
      lastLogin: "Nunca",
    });
  }
  isUserModalOpen.value = false;
}

function toggleUserStatus(user: AgencyUser) {
  user.status = user.status === "Activo" ? "Inactivo" : "Activo";
}
</script>

<template>
  <div class="max-w-6xl mx-auto pb-8">
    <div
      class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <NuxtLink
          to="/dashboard/agency"
          class="text-sm font-medium text-primary-500 hover:underline mb-2 inline-flex items-center gap-1"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" /> Volver a Mi
          Agencia
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Equipo de Ventas
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Gestiona los accesos de tus vendedores a la plataforma TravelOTA.
        </p>
      </div>
      <UButton
        icon="i-heroicons-user-plus"
        color="primary"
        label="Invitar Vendedor"
        @click="openCreateModal"
      />
    </div>

    <UCard
      class="shadow-sm rounded-xl overflow-hidden"
      :ui="{ body: 'p-0 sm:p-0' }"
    >
      <!-- Filtros -->
      <div
        class="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex flex-col sm:flex-row gap-4"
      >
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Buscar por nombre o email..."
          class="flex-1 max-w-sm"
        />
        <USelectMenu
          v-model="statusFilter"
          :items="['Todos', 'Activos', 'Inactivos']"
          class="w-full sm:w-40"
        />
      </div>

      <!-- Tabla -->
      <UTable
        :data="filteredUsers"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-users',
          label: 'No se encontraron usuarios.',
        }"
      >
        <template #name-cell="{ row }">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ row.original.name }}
            </p>
            <p class="text-xs text-gray-500">{{ row.original.email }}</p>
          </div>
        </template>

        <template #role-cell="{ row }">
          <UBadge
            :color="
              row.original.role === 'Admin Agencia' ? 'primary' : 'neutral'
            "
            variant="subtle"
            size="xs"
          >
            <UIcon
              :name="
                row.original.role === 'Admin Agencia'
                  ? 'i-heroicons-shield-check'
                  : 'i-heroicons-user'
              "
              class="mr-1 w-3 h-3"
            />
            {{ row.original.role }}
          </UBadge>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status === 'Activo' ? 'success' : 'neutral'"
            variant="subtle"
            size="xs"
            class="capitalize"
          >
            <span
              v-if="row.original.status === 'Activo'"
              class="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"
            ></span>
            <span
              v-else
              class="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"
            ></span>
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-2">
            <UTooltip
              :text="
                row.original.status === 'Activo'
                  ? 'Desactivar acceso'
                  : 'Reactivar acceso'
              "
            >
              <UButton
                :icon="
                  row.original.status === 'Activo'
                    ? 'i-heroicons-no-symbol'
                    : 'i-heroicons-check-circle'
                "
                size="sm"
                :color="row.original.status === 'Activo' ? 'error' : 'success'"
                variant="ghost"
                @click="toggleUserStatus(row.original)"
              />
            </UTooltip>
            <UTooltip text="Editar usuario">
              <UButton
                icon="i-heroicons-pencil-square"
                size="sm"
                color="neutral"
                variant="ghost"
                @click="openEditModal(row.original)"
              />
            </UTooltip>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Modal Formulario -->
    <UModal
      v-model:open="isUserModalOpen"
      :title="isEditing ? 'Editar Usuario' : 'Invitar Nuevo Vendedor'"
    >
      <template #body>
        <form class="space-y-4" @submit.prevent="saveUser">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormGroup
              label="Nombre Completo"
              name="name"
              required
              class="sm:col-span-2"
            >
              <UInput
                v-model="formUser.name"
                placeholder="Ej: Ana Martinez"
                icon="i-heroicons-user"
              />
            </UFormGroup>

            <UFormGroup
              label="Correo Electrónico"
              name="email"
              required
              class="sm:col-span-2"
              :error="emailTouched && !emailValid && 'Ingresa un correo válido'"
            >
              <UInput
                v-model="formUser.email"
                type="email"
                placeholder="ana@miagencia.com"
                icon="i-heroicons-envelope"
                @blur="emailTouched = true"
              />
            </UFormGroup>

            <UFormGroup
              :label="isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña'"
              name="password"
              :required="!isEditing"
              class="sm:col-span-2"
              :description="
                isEditing
                  ? 'Déjalo en blanco para mantener la contraseña actual.'
                  : 'Mínimo 8 caracteres.'
              "
            >
              <UInput
                v-model="formUser.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                icon="i-heroicons-lock-closed"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    :icon="
                      showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                    "
                    :padded="false"
                    tabindex="-1"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup label="Rol en Plataforma" name="role" required>
              <USelectMenu
                v-model="formUser.role"
                :items="['Vendedor', 'Admin Agencia']"
              />
            </UFormGroup>

            <UFormGroup label="Estado Inicial" name="status">
              <USelectMenu
                v-model="formUser.status"
                :items="['Activo', 'Inactivo']"
              />
            </UFormGroup>
          </div>
        </form>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="isUserModalOpen = false"
          />
          <UButton
            color="primary"
            :label="isEditing ? 'Guardar Cambios' : 'Enviar Invitación'"
            :disabled="!isFormValid"
            @click="saveUser"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
