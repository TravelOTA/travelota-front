<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Usuarios de Soporte - TravelOTA Admin",
});

const columns = [
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "email", header: "Correo Electrónico" },
  { accessorKey: "role", header: "Rol" },
  { accessorKey: "lastLogin", header: "Último Acceso" },
  { accessorKey: "status", header: "Estado" },
  { id: "actions" },
];

const users = ref([
  {
    id: 1,
    name: "Laura Martínez",
    email: "laura@travelota.com",
    role: "SUPER_ADMIN",
    lastLogin: "2026-03-05",
    status: "Activo",
  },
  {
    id: 2,
    name: "Carlos Ríos",
    email: "carlos@travelota.com",
    role: "SUPPORT",
    lastLogin: "2026-03-04",
    status: "Activo",
  },
  {
    id: 3,
    name: "Sofía Delgado",
    email: "sofia@travelota.com",
    role: "SUPPORT",
    lastLogin: "2026-02-28",
    status: "Inactivo",
  },
]);

const searchQuery = ref("");
const statusFilter = ref("Todos");
const roleFilter = ref("Todos");

const filteredUsers = computed(() => {
  return users.value.filter((u) => {
    const matchSearch =
      !searchQuery.value ||
      u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus =
      statusFilter.value === "Todos" || u.status === statusFilter.value;
    const matchRole =
      roleFilter.value === "Todos" || u.role === roleFilter.value;
    return matchSearch && matchStatus && matchRole;
  });
});

// Modal nuevo usuario
const isModalOpen = ref(false);
const newUser = ref({
  name: "",
  email: "",
  password: "",
  role: "SUPPORT",
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailValid = computed(() => emailRegex.test(newUser.value.email));
const emailTouched = ref(false);
const showPassword = ref(false);
const showEditPassword = ref(false);

const isFormValid = computed(
  () =>
    newUser.value.name.trim() !== "" &&
    emailValid.value &&
    newUser.value.password.length >= 8,
);

function openModal() {
  newUser.value = { name: "", email: "", password: "", role: "SUPPORT" };
  emailTouched.value = false;
  isModalOpen.value = true;
}

function saveUser() {
  if (!isFormValid.value) return;
  users.value.push({
    id: users.value.length + 1,
    name: newUser.value.name,
    email: newUser.value.email,
    role: newUser.value.role,
    lastLogin: "—",
    status: "Activo",
  });
  isModalOpen.value = false;
}

const roleColors: Record<string, "primary" | "neutral"> = {
  SUPER_ADMIN: "primary",
  SUPPORT: "neutral",
};

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Admin",
  SUPPORT: "Soporte",
};

function toggleStatus(user: (typeof users.value)[0]) {
  user.status = user.status === "Activo" ? "Inactivo" : "Activo";
}

function deleteUser(user: (typeof users.value)[0]) {
  if (confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) {
    users.value = users.value.filter((u) => u.id !== user.id);
  }
}

// Modal edición
const isEditModalOpen = ref(false);
const editUser = ref<(typeof users.value)[0] | null>(null);
const editPassword = ref("");
const editEmailTouched = ref(false);
const editEmailValid = computed(() =>
  emailRegex.test(editUser.value?.email ?? ""),
);
const isEditFormValid = computed(
  () =>
    (editUser.value?.name.trim() ?? "") !== "" &&
    editEmailValid.value &&
    (editPassword.value === "" || editPassword.value.length >= 8),
);

function openEditModal(user: (typeof users.value)[0]) {
  editUser.value = { ...user };
  editPassword.value = "";
  editEmailTouched.value = false;
  isEditModalOpen.value = true;
}

function saveEditUser() {
  if (!isEditFormValid.value || !editUser.value) return;
  const idx = users.value.findIndex((u) => u.id === editUser.value!.id);
  if (idx !== -1) users.value[idx] = { ...editUser.value };
  isEditModalOpen.value = false;
}
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
          Usuarios de Soporte
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Gestiona los agentes internos de TravelOTA. Tienen acceso a precios
          netos y todas las reservas del sistema.
        </p>
      </div>
      <UButton
        id="btn-new-support-user"
        icon="i-heroicons-user-plus"
        color="primary"
        label="Nuevo Usuario"
        @click="openModal"
      />
    </div>

    <!-- Stats rápidas -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600"
          >
            <UIcon name="i-heroicons-users" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Total</p>
            <p class="text-xl font-bold">{{ users.length }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"
          >
            <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Activos</p>
            <p class="text-xl font-bold">
              {{ users.filter((u) => u.status === "Activo").length }}
            </p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600"
          >
            <UIcon name="i-heroicons-shield-check" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Admins</p>
            <p class="text-xl font-bold">
              {{ users.filter((u) => u.role === "SUPER_ADMIN").length }}
            </p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600"
          >
            <UIcon name="i-heroicons-headphone" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Soporte</p>
            <p class="text-xl font-bold">
              {{ users.filter((u) => u.role === "SUPPORT").length }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Info de permisos -->
    <UAlert
      icon="i-heroicons-information-circle"
      color="info"
      variant="soft"
      class="mb-6"
      title="Permisos del personal interno"
      description="Estos usuarios ven precios netos en todas sus búsquedas. No pueden confirmar reservas. No tienen acceso a 'Mis Reservas' ni 'Mi Agencia'."
    />

    <!-- Table -->
    <UCard class="shadow-sm rounded-lg" :ui="{ body: 'p-0 sm:p-0' }">
      <div
        class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Buscar usuario..."
          class="w-full sm:w-72"
        />
        <div class="flex gap-2">
          <USelectMenu
            v-model="roleFilter"
            :options="['Todos', 'SUPER_ADMIN', 'SUPPORT']"
            placeholder="Rol"
            class="w-36"
          />
          <USelectMenu
            v-model="statusFilter"
            :options="['Todos', 'Activo', 'Inactivo']"
            placeholder="Estado"
            class="w-32"
          />
        </div>
      </div>

      <UTable :data="filteredUsers" :columns="columns">
        <template #role-cell="{ row }">
          <UBadge
            :color="roleColors[row.original.role] ?? 'neutral'"
            variant="soft"
            size="xs"
          >
            {{ roleLabels[row.original.role] ?? row.original.role }}
          </UBadge>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status === 'Activo' ? 'success' : 'neutral'"
            variant="subtle"
          >
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #lastLogin-cell="{ row }">
          <span class="text-sm text-gray-500">{{
            row.original.lastLogin
          }}</span>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-1 pr-2">
            <UTooltip
              :text="
                row.original.status === 'Activo' ? 'Desactivar' : 'Activar'
              "
            >
              <UButton
                :icon="
                  row.original.status === 'Activo'
                    ? 'i-heroicons-no-symbol'
                    : 'i-heroicons-check-circle'
                "
                :color="row.original.status === 'Activo' ? 'error' : 'success'"
                variant="ghost"
                size="xs"
                @click="toggleStatus(row.original)"
              />
            </UTooltip>
            <UTooltip text="Editar">
              <UButton
                icon="i-heroicons-pencil-square"
                color="neutral"
                variant="ghost"
                size="xs"
                @click="openEditModal(row.original)"
              />
            </UTooltip>
            <UTooltip text="Eliminar">
              <UButton
                icon="i-heroicons-trash"
                color="error"
                variant="ghost"
                size="xs"
                @click="deleteUser(row.original)"
              />
            </UTooltip>
          </div>
        </template>
      </UTable>

      <div
        v-if="filteredUsers.length === 0"
        class="py-12 text-center text-sm text-gray-500"
      >
        No se encontraron usuarios con los filtros aplicados.
      </div>
    </UCard>

    <!-- Modal nuevo usuario -->
    <UModal v-model:open="isModalOpen" title="Nuevo Usuario Interno">
      <template #body>
        <div class="space-y-4">
          <UAlert
            icon="i-heroicons-shield-exclamation"
            color="warning"
            variant="soft"
            title="Usuario interno TravelOTA"
            description="Este usuario verá precios netos y tendrá visión global del sistema. No podrá confirmar reservas."
          />

          <UFormGroup label="Nombre completo" name="name" required>
            <UInput
              v-model="newUser.name"
              placeholder="Ej: Laura Martínez"
              icon="i-heroicons-user"
            />
          </UFormGroup>

          <UFormGroup
            label="Correo electrónico (usuario de acceso)"
            name="email"
            required
            :error="
              emailTouched && !emailValid
                ? 'Introduce un email válido (ej: usuario@travelota.com)'
                : undefined
            "
          >
            <UInput
              v-model="newUser.email"
              type="email"
              placeholder="usuario@travelota.com"
              icon="i-heroicons-envelope"
              :color="emailTouched && !emailValid ? 'error' : undefined"
              @blur="emailTouched = true"
            />
          </UFormGroup>

          <UFormGroup
            label="Contraseña"
            name="password"
            required
            hint="Mínimo 8 caracteres"
          >
            <UInput
              v-model="newUser.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed"
            >
              <template #trailing>
                <UButton
                  :icon="
                    showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                  "
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  tabindex="-1"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormGroup>

          <UFormGroup label="Rol" name="role" required>
            <USelectMenu
              v-model="newUser.role"
              :items="[
                { label: 'Soporte', value: 'SUPPORT' },
                { label: 'Admin', value: 'SUPER_ADMIN' },
              ]"
              value-key="value"
              label-key="label"
            />
          </UFormGroup>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="isModalOpen = false"
          />
          <UButton
            color="primary"
            label="Crear Usuario"
            icon="i-heroicons-user-plus"
            :disabled="!isFormValid"
            @click="saveUser"
          />
        </div>
      </template>
    </UModal>

    <!-- Modal edición de usuario -->
    <UModal v-model:open="isEditModalOpen" title="Editar Usuario">
      <template #body>
        <div v-if="editUser" class="space-y-4">
          <UFormGroup label="Nombre completo" name="edit-name" required>
            <UInput
              v-model="editUser.name"
              placeholder="Ej: Laura Martínez"
              icon="i-heroicons-user"
            />
          </UFormGroup>

          <UFormGroup
            label="Correo electrónico (usuario de acceso)"
            name="edit-email"
            required
            :error="
              editEmailTouched && !editEmailValid
                ? 'Introduce un email válido'
                : undefined
            "
          >
            <UInput
              v-model="editUser.email"
              type="email"
              placeholder="usuario@travelota.com"
              icon="i-heroicons-envelope"
              :color="editEmailTouched && !editEmailValid ? 'error' : undefined"
              @blur="editEmailTouched = true"
            />
          </UFormGroup>

          <UFormGroup
            label="Contraseña"
            name="edit-password"
            hint="Dejar en blanco para no cambiarla. Mínimo 8 caracteres si se modifica."
            :error="
              editPassword.length > 0 && editPassword.length < 8
                ? 'La contraseña debe tener al menos 8 caracteres'
                : undefined
            "
          >
            <UInput
              v-model="editPassword"
              :type="showEditPassword ? 'text' : 'password'"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed"
            >
              <template #trailing>
                <UButton
                  :icon="
                    showEditPassword
                      ? 'i-heroicons-eye-slash'
                      : 'i-heroicons-eye'
                  "
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  tabindex="-1"
                  @click="showEditPassword = !showEditPassword"
                />
              </template>
            </UInput>
          </UFormGroup>

          <UFormGroup label="Rol" name="edit-role" required>
            <USelectMenu
              v-model="editUser.role"
              :items="[
                { label: 'Soporte', value: 'SUPPORT' },
                { label: 'Admin', value: 'SUPER_ADMIN' },
              ]"
              value-key="value"
              label-key="label"
            />
          </UFormGroup>

          <UFormGroup label="Estado" name="edit-status">
            <USelectMenu
              v-model="editUser.status"
              :items="[
                { label: 'Activo', value: 'Activo' },
                { label: 'Inactivo', value: 'Inactivo' },
              ]"
              value-key="value"
              label-key="label"
            />
          </UFormGroup>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="isEditModalOpen = false"
          />
          <UButton
            color="primary"
            label="Guardar Cambios"
            icon="i-heroicons-check"
            :disabled="!isEditFormValid"
            @click="saveEditUser"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
