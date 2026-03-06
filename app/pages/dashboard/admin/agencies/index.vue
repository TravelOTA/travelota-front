<script setup lang="ts">
definePageMeta({ layout: "dashboard" });
useHead({ title: "Gestor de Agencias B2B - TravelOTA" });

interface Agency {
  id: string;
  name: string;
  country: string;
  email: string;
  phone: string;
  agencyGroup: string;
  markup: number;
  usersCount: number;
  bookingsCount: number;
  registeredAt: string;
  status: "Activa" | "Pendiente" | "Bloqueada";
}

const agencies = ref<Agency[]>([
  {
    id: "AG-1001",
    name: "Viajes El Corte Inglés",
    country: "España",
    email: "b2b@elcorteingles.es",
    phone: "+34 91 418 88 00",
    agencyGroup: "Grupo VIP",
    markup: 12,
    usersCount: 8,
    bookingsCount: 312,
    registeredAt: "2024-03-15",
    status: "Activa",
  },
  {
    id: "AG-1002",
    name: "Destinia",
    country: "España",
    email: "b2b@destinia.com",
    phone: "+34 91 123 45 67",
    agencyGroup: "Grupo Mayorista",
    markup: 10,
    usersCount: 5,
    bookingsCount: 187,
    registeredAt: "2024-06-01",
    status: "Activa",
  },
  {
    id: "AG-1003",
    name: "Agencia Demo B2B",
    country: "México",
    email: "contacto@agenciademo.mx",
    phone: "+52 55 1234 5678",
    agencyGroup: "Grupo Estándar",
    markup: 15,
    usersCount: 3,
    bookingsCount: 0,
    registeredAt: "2026-02-28",
    status: "Pendiente",
  },
  {
    id: "AG-1004",
    name: "Viajes Barceló",
    country: "España",
    email: "b2b@barcelo.com",
    phone: "+34 971 78 91 00",
    agencyGroup: "Grupo VIP",
    markup: 11,
    usersCount: 12,
    bookingsCount: 534,
    registeredAt: "2023-11-10",
    status: "Activa",
  },
  {
    id: "AG-1005",
    name: "TurMundo Colombia",
    country: "Colombia",
    email: "ventas@turmundo.co",
    phone: "+57 1 745 3210",
    agencyGroup: "Grupo Estándar",
    markup: 14,
    usersCount: 4,
    bookingsCount: 91,
    registeredAt: "2025-01-20",
    status: "Bloqueada",
  },
  {
    id: "AG-1006",
    name: "Global Travel Agency",
    country: "Argentina",
    email: "info@globaltravel.ar",
    phone: "+54 11 4567 8901",
    agencyGroup: "Grupo Estándar",
    markup: 13,
    usersCount: 0,
    bookingsCount: 0,
    registeredAt: "2026-03-01",
    status: "Pendiente",
  },
]);

// Filters
const searchQuery = ref("");
const statusFilter = ref("Todas");

const filteredAgencies = computed(() => {
  return agencies.value.filter((a) => {
    const matchSearch =
      !searchQuery.value ||
      a.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.country.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus =
      statusFilter.value === "Todas" || a.status === statusFilter.value;
    return matchSearch && matchStatus;
  });
});

// Stats
const stats = computed(() => ({
  total: agencies.value.length,
  active: agencies.value.filter((a) => a.status === "Activa").length,
  pending: agencies.value.filter((a) => a.status === "Pendiente").length,
  blocked: agencies.value.filter((a) => a.status === "Bloqueada").length,
}));

// Actions
function approveAgency(agency: Agency) {
  agency.status = "Activa";
}

function toggleBlock(agency: Agency) {
  agency.status = agency.status === "Bloqueada" ? "Activa" : "Bloqueada";
}

// Status helpers
const statusColor = (s: string) =>
  s === "Activa" ? "success" : s === "Pendiente" ? "warning" : "error";

const isCreateOpen = ref(false);
const newAgency = ref({
  name: "",
  country: "",
  email: "",
  phone: "",
  agencyGroup: "Grupo Estándar",
});

const isCreateValid = computed(
  () =>
    newAgency.value.name.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAgency.value.email),
);

const { groups: agencyGroups, incrementAgencyCount } = useAgencyGroups();
const groupNames = computed(() => agencyGroups.value.map((g) => g.name));

function openCreate() {
  const defaultGroupName = groupNames.value[0] || "Grupo Estándar";
  newAgency.value = {
    name: "",
    country: "",
    email: "",
    phone: "",
    agencyGroup: defaultGroupName,
  };
  isCreateOpen.value = true;
}

function saveAgency() {
  if (!isCreateValid.value) return;

  const selectedGroup = agencyGroups.value.find(
    (g) => g.name === newAgency.value.agencyGroup,
  );
  const appliedMarkup = selectedGroup?.baseMarkup || 10;

  agencies.value.push({
    id: `AG-${1000 + agencies.value.length + 1}`,
    name: newAgency.value.name as string,
    country: newAgency.value.country as string,
    email: newAgency.value.email as string,
    phone: newAgency.value.phone as string,
    agencyGroup: String(
      newAgency.value.agencyGroup || groupNames.value[0] || "Grupo Estándar",
    ),
    markup: appliedMarkup as number,
    usersCount: 0,
    bookingsCount: 0,
    registeredAt: new Date().toISOString().split("T")[0],
    status: "Pendiente",
  });

  if (selectedGroup) {
    incrementAgencyCount(selectedGroup.name);
  }

  isCreateOpen.value = false;
}

// Table columns
const columns = [
  { accessorKey: "name", header: "Agencia" },
  { accessorKey: "country", header: "País" },
  { accessorKey: "email", header: "Contacto" },
  { accessorKey: "agencyGroup", header: "Grupo" },
  { accessorKey: "usersCount", header: "Usuarios" },
  { accessorKey: "bookingsCount", header: "Reservas" },
  { accessorKey: "status", header: "Estado" },
  { accessorKey: "actions", header: "" },
];
</script>

<template>
  <div class="max-w-7xl mx-auto pb-16">
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
          Gestión de Agencias B2B
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Administra las agencias registradas, aprueba nuevos accesos y
          configura sus condiciones comerciales.
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        label="Nueva Agencia"
        @click="openCreate"
      />
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600"
          >
            <UIcon name="i-heroicons-building-storefront" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Total</p>
            <p class="text-xl font-bold">{{ stats.total }}</p>
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
            <p class="text-xs text-gray-500 font-medium">Activas</p>
            <p class="text-xl font-bold">{{ stats.active }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600"
          >
            <UIcon name="i-heroicons-clock" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Pendientes</p>
            <p class="text-xl font-bold">{{ stats.pending }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600"
          >
            <UIcon name="i-heroicons-no-symbol" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">Bloqueadas</p>
            <p class="text-xl font-bold">{{ stats.blocked }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Pending alert -->
    <UAlert
      v-if="stats.pending > 0"
      icon="i-heroicons-exclamation-triangle"
      color="warning"
      variant="soft"
      class="mb-6"
      :title="`${stats.pending} agencia${stats.pending > 1 ? 's' : ''} pendiente${stats.pending > 1 ? 's' : ''} de aprobación`"
      description="Revisa las solicitudes de registro y aprueba o rechaza el acceso al sistema."
    />

    <!-- Table card -->
    <UCard class="shadow-sm rounded-xl" :ui="{ body: 'p-0 sm:p-0' }">
      <div
        class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Buscar por nombre, email o país..."
          class="w-full sm:w-80"
        />
        <USelectMenu
          v-model="statusFilter"
          :items="['Todas', 'Activa', 'Pendiente', 'Bloqueada']"
          placeholder="Filtrar estado"
          class="w-40"
        />
      </div>

      <UTable :data="filteredAgencies" :columns="columns as any" class="w-full">
        <!-- Agency name -->
        <template #name-cell="{ row }">
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ row.original.name }}
            </p>
            <p class="text-xs text-gray-400 font-mono">{{ row.original.id }}</p>
          </div>
        </template>

        <!-- Contact -->
        <template #email-cell="{ row }">
          <div class="text-sm">
            <p class="text-gray-700 dark:text-gray-300">
              {{ row.original.email }}
            </p>
            <p class="text-xs text-gray-400">{{ row.original.phone }}</p>
          </div>
        </template>

        <!-- Contenedor agencyGroup -->
        <template #agencyGroup-cell="{ row }">
          <span class="font-medium text-gray-900 dark:text-gray-100">{{
            row.original.agencyGroup
          }}</span>
        </template>

        <!-- Users -->
        <template #usersCount-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-users" class="w-3.5 h-3.5 text-gray-400" />
            <span class="text-sm">{{ row.original.usersCount }}</span>
          </div>
        </template>

        <!-- Bookings -->
        <template #bookingsCount-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-heroicons-briefcase"
              class="w-3.5 h-3.5 text-gray-400"
            />
            <span class="text-sm">{{ row.original.bookingsCount }}</span>
          </div>
        </template>

        <!-- Status -->
        <template #status-cell="{ row }">
          <UBadge
            :color="statusColor(row.original.status) as any"
            variant="subtle"
            class="font-bold text-[10px] uppercase tracking-wider"
          >
            {{ row.original.status }}
          </UBadge>
        </template>

        <!-- Actions -->
        <template #actions-cell="{ row }">
          <div class="flex items-center justify-end gap-1 pr-2">
            <UTooltip text="Ver detalle">
              <UButton
                icon="i-heroicons-eye"
                color="neutral"
                variant="ghost"
                size="xs"
                :to="`/dashboard/admin/agencies/${row.original.id}`"
              />
            </UTooltip>
            <UTooltip
              v-if="row.original.status === 'Pendiente'"
              text="Aprobar acceso"
            >
              <UButton
                icon="i-heroicons-check-circle"
                color="success"
                variant="ghost"
                size="xs"
                @click="approveAgency(row.original)"
              />
            </UTooltip>
            <UTooltip
              :text="
                row.original.status === 'Bloqueada' ? 'Activar' : 'Bloquear'
              "
            >
              <UButton
                :icon="
                  row.original.status === 'Bloqueada'
                    ? 'i-heroicons-lock-open'
                    : 'i-heroicons-no-symbol'
                "
                :color="
                  row.original.status === 'Bloqueada' ? 'success' : 'error'
                "
                variant="ghost"
                size="xs"
                @click="toggleBlock(row.original)"
              />
            </UTooltip>
          </div>
        </template>
      </UTable>

      <div
        v-if="filteredAgencies.length === 0"
        class="py-16 text-center text-sm text-gray-500"
      >
        No se encontraron agencias con los filtros aplicados.
      </div>
    </UCard>

    <!-- Create modal -->
    <UModal v-model:open="isCreateOpen" title="Nueva Agencia">
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormGroup
              label="Nombre de la agencia"
              name="name"
              required
              class="sm:col-span-2"
            >
              <UInput
                v-model="newAgency.name"
                placeholder="Ej: Viajes López"
                icon="i-heroicons-building-storefront"
              />
            </UFormGroup>
            <UFormGroup label="País" name="country" required>
              <UInput
                v-model="newAgency.country"
                placeholder="España"
                icon="i-heroicons-globe-alt"
              />
            </UFormGroup>
            <UFormGroup label="Grupo de Agencia" name="group" required>
              <USelectMenu
                v-model="newAgency.agencyGroup"
                :items="groupNames"
                icon="i-heroicons-user-group"
              />
            </UFormGroup>
            <UFormGroup
              label="Email de contacto"
              name="email"
              required
              class="sm:col-span-2"
            >
              <UInput
                v-model="newAgency.email"
                type="email"
                placeholder="b2b@agencia.com"
                icon="i-heroicons-envelope"
              />
            </UFormGroup>
            <UFormGroup label="Teléfono" name="phone" class="sm:col-span-2">
              <UInput
                v-model="newAgency.phone"
                placeholder="+34 91 000 00 00"
                icon="i-heroicons-phone"
              />
            </UFormGroup>
          </div>
          <UAlert
            icon="i-heroicons-information-circle"
            color="info"
            variant="soft"
            description="La agencia se creará con estado Pendiente. Deberás aprobarla manualmente para que pueda operar."
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="isCreateOpen = false"
          />
          <UButton
            color="primary"
            label="Crear Agencia"
            icon="i-heroicons-plus"
            :disabled="!isCreateValid"
            @click="saveAgency"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
