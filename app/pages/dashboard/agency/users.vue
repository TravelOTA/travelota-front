<script setup lang="ts">
useHead({ title: 'Equipo de Ventas - TravelOTA' });
const { t } = useI18n();

interface AgencyUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin Agencia' | 'Vendedor';
  status: 'Activo' | 'Inactivo';
  lastLogin: string;
}

const users = ref<AgencyUser[]>([
  {
    id: 'U-851',
    name: 'Juan Pérez',
    email: 'juan@miagencia.com',
    role: 'Vendedor',
    status: 'Activo',
    lastLogin: 'Hace 2 horas',
  },
  {
    id: 'U-852',
    name: 'María Gómez',
    email: 'maria@miagencia.com',
    role: 'Admin Agencia',
    status: 'Activo',
    lastLogin: 'Ayer',
  },
  {
    id: 'U-853',
    name: 'Carlos López',
    email: 'carlos@miagencia.com',
    role: 'Vendedor',
    status: 'Inactivo',
    lastLogin: 'Hace 1 mes',
  },
]);

// ── Table config ──
const columns = computed(() => [
  { accessorKey: 'name', header: t('agency.users.tableHeaders.user') },
  { accessorKey: 'role', header: t('agency.users.tableHeaders.role') },
  { accessorKey: 'status', header: t('agency.users.tableHeaders.status') },
  {
    accessorKey: 'lastLogin',
    header: t('agency.users.tableHeaders.lastLogin'),
  },
  { id: 'actions' },
]);

const searchQuery = ref('');
const statusFilter = ref('Todos');

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchQuery =
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus =
      statusFilter.value === 'Todos' || user.status === statusFilter.value;
    return matchQuery && matchStatus;
  });
});

// ── Modal config ──
const isUserModalOpen = ref(false);
const isEditing = ref(false);
const formUser = ref<Partial<AgencyUser> & { password?: string }>({});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailValid = computed(() => emailRegex.test(formUser.value.email || ''));
const emailTouched = ref(false);
const showPassword = ref(false);

const isFormValid = computed(() => {
  const isNameValid = (formUser.value.name?.trim() || '') !== '';
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
    name: '',
    email: '',
    password: '',
    role: 'Vendedor',
    status: 'Activo',
  };
  isUserModalOpen.value = true;
}

function openEditModal(user: AgencyUser) {
  isEditing.value = true;
  emailTouched.value = false;
  showPassword.value = false;
  formUser.value = { ...user, password: '' };
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
      role: formUser.value.role as 'Admin Agencia' | 'Vendedor',
      status: formUser.value.status as 'Activo' | 'Inactivo',
      lastLogin: 'Nunca',
    });
  }
  isUserModalOpen.value = false;
}

function toggleUserStatus(user: AgencyUser) {
  user.status = user.status === 'Activo' ? 'Inactivo' : 'Activo';
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
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          {{ t('agency.users.backToAgency') }}
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {{ t('agency.users.title') }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t('agency.users.subtitle') }}
        </p>
      </div>
      <UButton
        icon="i-heroicons-user-plus"
        color="primary"
        :label="t('agency.users.inviteSeller')"
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
          :placeholder="t('agency.users.search')"
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
          label: t('agency.users.tableEmpty'),
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
            {{
              row.original.role === 'Admin Agencia'
                ? t('agency.users.roles.adminAgency')
                : t('agency.users.roles.seller')
            }}
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
            {{
              row.original.status === 'Activo'
                ? t('agency.users.statuses.active')
                : t('agency.users.statuses.inactive')
            }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-2">
            <UTooltip
              :text="
                row.original.status === 'Activo'
                  ? t('agency.users.tooltips.deactivate')
                  : t('agency.users.tooltips.reactivate')
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
            <UTooltip :text="t('agency.users.tooltips.edit')">
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
      :title="
        isEditing
          ? t('agency.users.modal.edit')
          : t('agency.users.modal.create')
      "
    >
      <template #body>
        <form class="space-y-4" @submit.prevent="saveUser">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField
              :label="t('agency.users.modal.fullName')"
              name="name"
              required
              class="sm:col-span-2"
            >
              <UInput
                v-model="formUser.name"
                :placeholder="t('agency.users.modal.fullNameExample')"
                icon="i-heroicons-user"
              />
            </UFormField>

            <UFormField
              :label="t('agency.users.modal.email')"
              name="email"
              required
              class="sm:col-span-2"
              :error="
                emailTouched &&
                !emailValid &&
                t('agency.users.modal.emailError')
              "
            >
              <UInput
                v-model="formUser.email"
                type="email"
                :placeholder="t('agency.users.modal.emailExample')"
                icon="i-heroicons-envelope"
                @blur="emailTouched = true"
              />
            </UFormField>

            <UFormField
              :label="
                isEditing
                  ? t('agency.users.modal.newPassword')
                  : t('agency.users.modal.password')
              "
              name="password"
              :required="!isEditing"
              class="sm:col-span-2"
              :description="
                isEditing
                  ? t('agency.users.modal.passwordHint')
                  : t('agency.users.modal.passwordRequirement')
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
            </UFormField>

            <UFormField
              :label="t('agency.users.modal.role')"
              name="role"
              required
            >
              <USelectMenu
                v-model="formUser.role"
                :items="['Vendedor', 'Admin Agencia']"
              />
            </UFormField>

            <UFormField
              :label="t('agency.users.modal.initialStatus')"
              name="status"
            >
              <USelectMenu
                v-model="formUser.status"
                :items="['Activo', 'Inactivo']"
              />
            </UFormField>
          </div>
        </form>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('agency.users.modal.cancel')"
            @click="isUserModalOpen = false"
          />
          <UButton
            color="primary"
            :label="
              isEditing
                ? t('agency.users.modal.saveChanges')
                : t('agency.users.modal.sendInvitation')
            "
            :disabled="!isFormValid"
            @click="saveUser"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
