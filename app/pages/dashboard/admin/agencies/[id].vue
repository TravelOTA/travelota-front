<script setup lang="ts">
import { useAgencies } from "~/composables/useAgencies";

definePageMeta({ layout: "dashboard" });

const { t } = useI18n();
const route = useRoute();
const agencyId = route.params.id as string;

const {
  fetchAgencies,
  getAgencyById,
  approveAgency,
  toggleBlock,
  updateAgency,
} = useAgencies();

onMounted(async () => {
  // Ensure agencies are loaded if navigating directly to this page
  if (!getAgencyById(agencyId)) {
    await fetchAgencies();
  }
});

const agency = computed(() => getAgencyById(agencyId) ?? null);

useHead({
  title: computed(
    () => `${agency.value?.commercial_name ?? "Agencia"} - TravelOTA Admin`,
  ),
});

// ── Tabs ───────────────────────────────────────────────────────────────────
const activeTab = ref("info");
const tabs = computed(() => [
  {
    key: "info",
    label: t("admin.agencyDetail.tabInfo"),
    icon: "i-heroicons-information-circle",
  },
  {
    key: "users",
    label: t("admin.agencyDetail.tabUsers"),
    icon: "i-heroicons-users",
  },
]);

// ── Status helpers ─────────────────────────────────────────────────────────
function statusColor(s: string) {
  if (s === "active") return "success";
  if (s === "pending") return "warning";
  if (s === "blocked") return "error";
  if (s === "denied") return "neutral";
  return "neutral";
}

const STATUS_LABELS: Record<string, string> = {
  active: "Activa",
  pending: "Pendiente",
  blocked: "Bloqueada",
  denied: "Denegada",
};

const { groups: agencyGroups } = useAgencyGroups();
const groupNames = computed(() => agencyGroups.value.map((g) => g.name));

// ── Aprobar modal ──────────────────────────────────────────────────────────
const isApproveOpen = ref(false);
const selectedGroupName = ref<string>("");
const selectedGroup = computed(
  () =>
    agencyGroups.value.find((g) => g.name === selectedGroupName.value) ?? null,
);

function openApprove() {
  selectedGroupName.value = "";
  isApproveOpen.value = true;
}

async function confirmApprove() {
  if (!selectedGroup.value) return;
  await approveAgency(agencyId, Number(selectedGroup.value.id));
  isApproveOpen.value = false;
}

// ── Edit Info modal ────────────────────────────────────────────────────────
const isEditOpen = ref(false);
const editForm = ref({
  commercial_name: "",
  country: "",
  email: "",
  phone: "",
  agency_group_id: null as number | null,
});

function openEdit() {
  if (!agency.value) return;
  editForm.value = {
    commercial_name: agency.value.commercial_name,
    country: agency.value.country,
    email: agency.value.email,
    phone: agency.value.phone,
    agency_group_id: agency.value.agency_group?.id ?? null,
  };
  isEditOpen.value = true;
}

const editGroupName = computed({
  get: () =>
    agencyGroups.value.find(
      (g) => Number(g.id) === editForm.value.agency_group_id,
    )?.name ?? "",
  set: (name: string) => {
    const found = agencyGroups.value.find((g) => g.name === name);
    editForm.value.agency_group_id = found ? Number(found.id) : null;
  },
});

async function saveEdit() {
  if (!agency.value) return;
  const patch: Record<string, unknown> = {
    commercial_name: editForm.value.commercial_name,
    country: editForm.value.country,
    email: editForm.value.email,
    phone: editForm.value.phone,
  };
  if (editForm.value.agency_group_id !== null) {
    patch.agency_group = { id: editForm.value.agency_group_id, name: "" };
  }
  await updateAgency(agencyId, patch as Parameters<typeof updateAgency>[1]);
  isEditOpen.value = false;
}

// ── Whitelabel modal ───────────────────────────────────────────────────────
const isWhitelabelOpen = ref(false);
const whitelabelForm = ref({
  logo: "",
  primary_color: "",
  public_email: "",
  public_phone: "",
});

const colorMap: Record<string, string> = {
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
};
const themeColors = Object.keys(colorMap);

function openWhitelabel() {
  if (!agency.value) return;
  whitelabelForm.value = {
    logo: agency.value.logo,
    primary_color: agency.value.primary_color,
    public_email: agency.value.public_email,
    public_phone: agency.value.public_phone,
  };
  isWhitelabelOpen.value = true;
}

function handleLogoUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      whitelabelForm.value.logo = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async function saveWhitelabel() {
  await updateAgency(agencyId, whitelabelForm.value);
  isWhitelabelOpen.value = false;
}

// ── Users tab ──────────────────────────────────────────────────────────────
// Users are not fetched inline — user_count comes from AgencyDetailSerializer.
// A dedicated endpoint (e.g. /api/agency/agencies/{id}/users) is needed for
// the full list; this will be implemented in a future task.
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
        {{ t("admin.agencyDetail.notFound") }}
      </h2>
      <NuxtLink
        to="/dashboard/admin/agencies"
        class="text-primary-500 hover:underline text-sm mt-2 inline-block"
      >
        ← {{ t("admin.agencyDetail.backToList") }}
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
            agency.commercial_name
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
                  {{ agency.commercial_name }}
                </h1>
                <UBadge
                  :color="statusColor(agency.status) as any"
                  variant="subtle"
                  class="font-bold text-[10px] uppercase tracking-wider"
                >
                  {{ STATUS_LABELS[agency.status] ?? agency.status }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-500">
                {{ agency.id }} · {{ agency.country }} · Registrada el
                {{ agency.created_at }}
              </p>
            </div>
          </div>

          <!-- Header actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <UButton
              v-if="agency.status === 'pending'"
              icon="i-heroicons-check-circle"
              color="success"
              size="sm"
              :label="t('admin.agencyDetail.actions.approve')"
              @click="openApprove"
            />
            <UButton
              v-if="agency.status === 'active' || agency.status === 'blocked'"
              :icon="
                agency.status === 'blocked'
                  ? 'i-heroicons-lock-open'
                  : 'i-heroicons-no-symbol'
              "
              :color="agency.status === 'blocked' ? 'success' : 'error'"
              variant="soft"
              size="sm"
              :label="
                agency.status === 'blocked'
                  ? t('admin.agencyDetail.actions.activate')
                  : t('admin.agencyDetail.actions.block')
              "
              @click="toggleBlock(agencyId)"
            />
            <UButton
              icon="i-heroicons-swatch"
              color="neutral"
              variant="soft"
              size="sm"
              :label="t('admin.agencyDetail.actions.whiteLabel')"
              @click="openWhitelabel"
            />
            <UButton
              icon="i-heroicons-pencil-square"
              color="neutral"
              variant="soft"
              size="sm"
              :label="t('admin.agencyDetail.actions.edit')"
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
                <h2 class="font-bold">
                  {{ t("admin.agencyDetail.generalInfo.title") }}
                </h2>
              </div>
            </template>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  {{ t("admin.agencyDetail.generalInfo.name") }}
                </dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ agency.commercial_name }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  {{ t("admin.agencyDetail.generalInfo.operatingCountry") }}
                </dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ agency.country }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  {{ t("admin.agencyDetail.generalInfo.email") }}
                </dt>
                <dd class="text-sm text-gray-900 dark:text-white">
                  {{ agency.email }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  {{ t("admin.agencyDetail.generalInfo.phone") }}
                </dt>
                <dd class="text-sm text-gray-900 dark:text-white">
                  {{ agency.phone }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  {{ t("admin.agencyDetail.generalInfo.agencyGroup") }}
                </dt>
                <dd
                  class="text-sm font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2"
                >
                  {{ agency.agency_group?.name ?? "—" }}
                  <UBadge color="neutral" variant="soft" size="xs"
                    >{{ agency.markup }}% MK</UBadge
                  >
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  {{ t("admin.agencyDetail.generalInfo.registrationDate") }}
                </dt>
                <dd class="text-sm text-gray-900 dark:text-white">
                  {{ agency.created_at }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  {{ t("admin.agencyDetail.generalInfo.taxId") }}
                </dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ agency.fiscal_id || "—" }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  {{ t("admin.agencyDetail.generalInfo.registeredAddress") }}
                </dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ agency.address || "—" }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  {{ t("admin.agencyDetail.generalInfo.contactName") }}
                </dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ agency.contact_name || "—" }}
                </dd>
              </div>
              <div>
                <dt
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                >
                  {{ t("admin.agencyDetail.generalInfo.website") }}
                </dt>
                <dd class="text-sm text-gray-900 dark:text-white">
                  <a
                    v-if="agency.web"
                    :href="agency.web"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary-500 hover:underline"
                    >{{ agency.web }}</a
                  >
                  <span v-else>—</span>
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
                  <p class="text-xs text-gray-500">
                    {{ t("admin.agencyDetail.generalInfo.users") }}
                  </p>
                  <p class="text-2xl font-bold">
                    {{ agency.user_count }}
                  </p>
                </div>
              </div>
            </UCard>

            <!-- Perfil Corporativo White-Label -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-swatch"
                    class="w-4 h-4 text-primary-500"
                  />
                  <h3 class="text-sm font-bold">White-Label</h3>
                </div>
              </template>
              <div class="flex flex-col items-center gap-3">
                <UAvatar
                  :src="agency.logo || undefined"
                  :alt="agency.commercial_name"
                  size="xl"
                  class="bg-gray-100 dark:bg-gray-800"
                />
                <div class="flex items-center gap-2">
                  <span
                    class="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                    :style="`background-color: ${colorMap[agency.primary_color] ?? agency.primary_color}`"
                  />
                  <span class="text-xs text-gray-500 capitalize">{{
                    agency.primary_color
                  }}</span>
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
                <h2 class="font-bold">
                  {{ t("admin.agencyDetail.generalInfo.agencyTeam") }}
                </h2>
              </div>
              <UButton
                icon="i-heroicons-user-plus"
                size="sm"
                color="primary"
                :label="t('admin.agencyDetail.generalInfo.inviteUser')"
                disabled
              />
            </div>
          </template>
          <div class="py-16 text-center text-sm text-gray-500">
            <UIcon
              name="i-heroicons-users"
              class="w-10 h-10 text-gray-300 mx-auto mb-3"
            />
            <p>{{ t("admin.agencyDetail.generalInfo.noUsersRegistered") }}</p>
            <p class="text-xs text-gray-400 mt-1">
              {{ agency.user_count }}
              {{ t("admin.agencyDetail.generalInfo.users") }}
            </p>
          </div>
        </UCard>
      </div>

      <!-- ── Edit Info Modal ── -->
      <UModal
        v-model:open="isEditOpen"
        :title="t('admin.agencyDetail.editModal.title')"
      >
        <template #body>
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField
                :label="t('admin.agencyDetail.editModal.name')"
                name="edit-commercial_name"
                required
                class="sm:col-span-2"
              >
                <UInput
                  v-model="editForm.commercial_name"
                  icon="i-heroicons-building-storefront"
                />
              </UFormField>
              <UFormField
                :label="t('admin.agencyDetail.editModal.country')"
                name="edit-country"
                required
              >
                <UInput
                  v-model="editForm.country"
                  icon="i-heroicons-globe-alt"
                />
              </UFormField>
              <UFormField
                :label="t('admin.agencyDetail.editModal.agencyGroup')"
                name="edit-group"
                required
              >
                <USelectMenu
                  v-model="editGroupName"
                  :items="groupNames"
                  icon="i-heroicons-user-group"
                />
              </UFormField>
              <UFormField
                :label="t('admin.agencyDetail.editModal.email')"
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
                :label="t('admin.agencyDetail.editModal.phone')"
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
              :label="t('admin.agencyDetail.editModal.cancel')"
              @click="isEditOpen = false"
            />
            <UButton
              color="primary"
              :label="t('admin.agencyDetail.editModal.save')"
              icon="i-heroicons-check"
              @click="saveEdit"
            />
          </div>
        </template>
      </UModal>

      <!-- Aprobar modal -->
      <UModal
        v-model:open="isApproveOpen"
        :title="t('admin.agencies.modals.approve.title')"
      >
        <template #body>
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ t("admin.agencies.modals.approve.selectGroup") }}
              <strong>{{ agency?.commercial_name }}</strong
              >.
            </p>
            <UFormField
              :label="t('admin.agencies.modals.approve.groupField')"
              name="approveGroup"
              required
            >
              <USelectMenu
                v-model="selectedGroupName"
                :items="groupNames"
                :placeholder="
                  t('admin.agencies.modals.approve.groupPlaceholder')
                "
                icon="i-heroicons-user-group"
                class="w-full"
              />
            </UFormField>
            <UAlert
              v-if="selectedGroup"
              icon="i-heroicons-information-circle"
              color="info"
              variant="soft"
              :description="`${t('admin.agencies.modals.approve.groupSelected', { group: selectedGroup.name })}`"
            />
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              :label="t('admin.agencies.modals.approve.cancel')"
              @click="isApproveOpen = false"
            />
            <UButton
              color="success"
              :label="t('admin.agencies.modals.approve.approve')"
              icon="i-heroicons-check-circle"
              :disabled="!selectedGroup"
              @click="confirmApprove"
            />
          </div>
        </template>
      </UModal>
      <!-- Whitelabel modal -->
      <UModal v-model:open="isWhitelabelOpen" title="Configuración White-Label">
        <template #body>
          <div class="space-y-4">
            <UFormField
              label="Logo de la Agencia"
              name="wl-logo"
              description="Sube una imagen para mostrar en la plataforma y documentos."
            >
              <div class="flex items-center gap-4 mt-1">
                <UAvatar
                  :src="whitelabelForm.logo || undefined"
                  size="lg"
                  class="bg-white border border-gray-200 p-0.5"
                />
                <input
                  type="file"
                  accept="image/*"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/20 dark:file:text-primary-400 cursor-pointer"
                  @change="handleLogoUpload"
                />
              </div>
            </UFormField>

            <UFormField
              label="Color Principal"
              name="wl-color"
              description="Personaliza el color de botones y acentos visuales B2B."
            >
              <div class="flex flex-col gap-3 mt-2">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="color in themeColors"
                    :key="color"
                    type="button"
                    :class="[
                      'w-7 h-7 rounded-full border-2 focus:outline-none transition-transform hover:scale-110 shadow-sm',
                      whitelabelForm.primary_color === color
                        ? 'border-gray-900 dark:border-white scale-110'
                        : 'border-transparent',
                    ]"
                    :style="`background-color: ${colorMap[color]}`"
                    :title="color"
                    @click="whitelabelForm.primary_color = color"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <input
                    v-model="whitelabelForm.primary_color"
                    type="color"
                    class="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden"
                  />
                  <UInput
                    v-model="whitelabelForm.primary_color"
                    placeholder="#000000"
                    class="w-32"
                  />
                </div>
              </div>
            </UFormField>

            <UFormField
              label="Correo de Contacto Público"
              name="wl-publicEmail"
              description="Visible para clientes. Distinto del correo corporativo de registro."
            >
              <UInput
                v-model="whitelabelForm.public_email"
                type="email"
                icon="i-heroicons-envelope"
              />
            </UFormField>

            <UFormField
              label="Teléfono de Contacto Público"
              name="wl-publicPhone"
              description="Visible para clientes. Distinto del teléfono corporativo de registro."
            >
              <UInput
                v-model="whitelabelForm.public_phone"
                icon="i-heroicons-phone"
              />
            </UFormField>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              label="Cancelar"
              @click="isWhitelabelOpen = false"
            />
            <UButton
              color="primary"
              label="Guardar"
              icon="i-heroicons-check"
              @click="saveWhitelabel"
            />
          </div>
        </template>
      </UModal>
    </template>
  </div>
</template>
