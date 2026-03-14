<script setup lang="ts">
import { useAgencies, type AdminAgencyUser } from "~/composables/useAgencies";

definePageMeta({ layout: "dashboard" });

const route = useRoute();
const agencyId = route.params.id as string;

const { getAgencyById, approveAgency, toggleBlock, updateAgency } =
  useAgencies();
const agency = computed(() => getAgencyById(agencyId) ?? null);

useHead({
  title: computed(() => `${agency.value?.name ?? "Agencia"} - TravelOTA Admin`),
});

// ── Tabs ──────────────────────────────────────────────────────────────────
const activeTab = ref("info");
const tabs = [
  {
    key: "info",
    label: "Información General",
    icon: "i-heroicons-information-circle",
  },
  { key: "users", label: "Usuarios", icon: "i-heroicons-users" },
];

// ── Status helpers ────────────────────────────────────────────────────────
const statusColor = (s: string) =>
  s === "Activa" ? "success" : s === "Pendiente" ? "warning" : "error";

const { groups: agencyGroups, incrementAgencyCount } = useAgencyGroups();
const groupNames = computed(() => agencyGroups.value.map((g) => g.name));

// ── Edit Info modal ───────────────────────────────────────────────────────
const isEditOpen = ref(false);
const editForm = ref({
  name: "",
  country: "",
  email: "",
  phone: "",
  agencyGroup: "",
});

function openEdit() {
  if (!agency.value) return;
  editForm.value = {
    name: agency.value.name,
    country: agency.value.country,
    email: agency.value.email,
    phone: agency.value.phone,
    agencyGroup: agency.value.agencyGroup,
  };
  isEditOpen.value = true;
}

function saveEdit() {
  if (!agency.value) return;

  const oldGroup = agency.value.agencyGroup;
  let markup = agency.value.markup;

  // If group changed, update markup and global counters (mock logic)
  if (oldGroup !== editForm.value.agencyGroup) {
    const selectedGroup = agencyGroups.value.find(
      (g) => g.name === editForm.value.agencyGroup,
    );
    if (selectedGroup) {
      markup = selectedGroup.baseMarkup;
      incrementAgencyCount(selectedGroup.name);
      // Normally we would also decrement the old group here, but keeping it simple for mock
    }
  }

  updateAgency(agencyId, { ...editForm.value, markup });
  isEditOpen.value = false;
}

// ── Users tab ─────────────────────────────────────────────────────────────
const userSearch = ref("");
const filteredUsers = computed(() =>
  (agency.value?.users ?? []).filter(
    (u) =>
      !userSearch.value ||
      u.name.toLowerCase().includes(userSearch.value.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.value.toLowerCase()),
  ),
);

function toggleUserStatus(user: AdminAgencyUser) {
  user.status = user.status === "Activo" ? "Inactivo" : "Activo";
}

const userColumns = [
  { accessorKey: "name", header: "Vendedor" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Rol" },
  { accessorKey: "lastLogin", header: "Último Acceso" },
  { accessorKey: "status", header: "Estado" },
  { accessorKey: "userActions", header: "" },
];

// ── Users tab ─────────────────────────────────────────────────────────────
</script>

<template>
  <div class="max-w-7xl mx-auto pb-16">
    <!-- 404 state -->
    <div v-if="!agency" class="py-24 text-center">
      <UIcon
        name="i-heroicons-building-storefront"
        class="w-16 h-16 text-gray-300 mx-auto mb-4"
      />
      <h2 class="text-xl font-bold text-gray-700 dark:text-gray-300">
        Agencia no encontrada
      </h2>
      <NuxtLink
        to="/dashboard/admin/agencies"
        class="text-primary-500 hover:underline text-sm mt-2 inline-block"
      >
        ← Volver al listado
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Breadcrumb + header -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <NuxtLink
            to="/dashboard/admin"
            class="hover:text-primary-500 transition-colors"
            >Panel Admin</NuxtLink
          >
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
          <NuxtLink
            to="/dashboard/admin/agencies"
            class="hover:text-primary-500 transition-colors"
            >Agencias</NuxtLink
          >
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
          <span class="text-gray-700 dark:text-gray-200 font-medium">{{
            agency.name
          }}</span>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0"
            >
              <UIcon
                name="i-heroicons-building-storefront"
                class="w-7 h-7 text-primary-500"
              />
            </div>
            <div>
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ agency.name }}
                </h1>
                <UBadge
                  :color="statusColor(agency.status) as any"
                  variant="subtle"
                  class="font-bold text-[10px] uppercase tracking-wider"
                >
                  {{ agency.status }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-500">
                {{ agency.id }} · {{ agency.country }} · Registrada el
                {{ agency.registeredAt }}
              </p>
            </div>
          </div>

          <!-- Header actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <UButton
              v-if="agency.status === 'Pendiente'"
              icon="i-heroicons-check-circle"
              color="success"
              size="sm"
              label="Aprobar"
              @click="approveAgency(agencyId)"
            />
            <UButton
              :icon="
                agency.status === 'Bloqueada'
                  ? 'i-heroicons-lock-open'
                  : 'i-heroicons-no-symbol'
              "
              :color="agency.status === 'Bloqueada' ? 'success' : 'error'"
              variant="soft"
              size="sm"
              :label="agency.status === 'Bloqueada' ? 'Activar' : 'Bloquear'"
              @click="toggleBlock(agencyId)"
            />
            <UButton
              icon="i-heroicons-pencil-square"
              color="neutral"
              variant="soft"
              size="sm"
              label="Editar"
              @click="openEdit"
            />
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div
        class="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto"
      >
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
          :class="
            activeTab === tab.key
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          "
          @click="activeTab = tab.key"
        >
          <UIcon :name="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- ── TAB: Información General ── -->
      <div v-if="activeTab === 'info'">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UCard class="lg:col-span-2">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-information-circle"
                  class="w-5 h-5 text-primary-500"
                />
                <h2 class="font-bold">Datos de la Agencia</h2>
              </div>
            </template>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  Nombre
                </dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ agency.name }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  País
                </dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ agency.country }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  Email B2B
                </dt>
                <dd class="text-sm text-gray-900 dark:text-white">
                  {{ agency.email }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  Teléfono
                </dt>
                <dd class="text-sm text-gray-900 dark:text-white">
                  {{ agency.phone }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  Grupo de Agencia
                </dt>
                <dd
                  class="text-sm font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2"
                >
                  {{ agency.agencyGroup }}
                  <UBadge color="neutral" variant="soft" size="xs"
                    >{{ agency.markup }}% MK</UBadge
                  >
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  Fecha de registro
                </dt>
                <dd class="text-sm text-gray-900 dark:text-white">
                  {{ agency.registeredAt }}
                </dd>
              </div>
            </dl>
          </UCard>

          <div class="space-y-4">
            <UCard>
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600"
                >
                  <UIcon name="i-heroicons-users" class="w-5 h-5" />
                </div>
                <div>
                  <p class="text-xs text-gray-500">Usuarios</p>
                  <p class="text-2xl font-bold">
                    {{ agency.users?.length ?? 0 }}
                  </p>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>

      <!-- ── TAB: Usuarios ── -->
      <div v-else-if="activeTab === 'users'">
        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-users"
                  class="w-5 h-5 text-primary-500"
                />
                <h2 class="font-bold">Equipo de la Agencia</h2>
              </div>
              <UButton
                icon="i-heroicons-user-plus"
                size="sm"
                color="primary"
                label="Invitar usuario"
              />
            </div>
          </template>
          <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <UInput
              v-model="userSearch"
              icon="i-heroicons-magnifying-glass"
              placeholder="Buscar usuario..."
              class="w-72"
            />
          </div>
          <UTable
            :data="filteredUsers"
            :columns="userColumns as any"
            class="w-full"
          >
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
            <template #status-cell="{ row }">
              <UBadge
                :color="
                  row.original.status === 'Activo' ? 'success' : 'neutral'
                "
                variant="subtle"
              >
                {{ row.original.status }}
              </UBadge>
            </template>
            <template #userActions-cell="{ row }">
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
                    :color="
                      row.original.status === 'Activo' ? 'error' : 'success'
                    "
                    variant="ghost"
                    size="xs"
                    @click="toggleUserStatus(row.original)"
                  />
                </UTooltip>
              </div>
            </template>
            <template #empty-state>
              <div class="py-10 text-center text-sm text-gray-500">
                No hay usuarios registrados en esta agencia.
              </div>
            </template>
          </UTable>
        </UCard>
      </div>

      <!-- ── Edit Info Modal ── -->
      <UModal v-model:open="isEditOpen" title="Editar Agencia">
        <template #body>
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField
                label="Nombre"
                name="edit-name"
                required
                class="sm:col-span-2"
              >
                <UInput
                  v-model="editForm.name"
                  icon="i-heroicons-building-storefront"
                />
              </UFormField>
              <UFormField label="País" name="edit-country" required>
                <UInput
                  v-model="editForm.country"
                  icon="i-heroicons-globe-alt"
                />
              </UFormField>
              <UFormField label="Grupo de Agencia" name="edit-group" required>
                <USelectMenu
                  v-model="editForm.agencyGroup"
                  :items="groupNames"
                  icon="i-heroicons-user-group"
                />
              </UFormField>
              <UFormField
                label="Email"
                name="edit-email"
                required
                class="sm:col-span-2"
              >
                <UInput
                  v-model="editForm.email"
                  type="email"
                  icon="i-heroicons-envelope"
                />
              </UFormField>
              <UFormField
                label="Teléfono"
                name="edit-phone"
                class="sm:col-span-2"
              >
                <UInput v-model="editForm.phone" icon="i-heroicons-phone" />
              </UFormField>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              label="Cancelar"
              @click="isEditOpen = false"
            />
            <UButton
              color="primary"
              label="Guardar cambios"
              icon="i-heroicons-check"
              @click="saveEdit"
            />
          </div>
        </template>
      </UModal>
    </template>
  </div>
</template>
