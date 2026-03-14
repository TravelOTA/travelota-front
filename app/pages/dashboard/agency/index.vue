<script setup lang="ts">
import WalletWidgets from "~/components/b2b/finance/WalletWidgets.vue";
import AgencyTransactions from "~/components/b2b/finance/AgencyTransactions.vue";

definePageMeta({ layout: "dashboard" });
const appConfig = useAppConfig();
const { agency, updateAgency } = useAgency();

const isEditModalOpen = ref(false);
const formAgency = ref({ ...agency.value });

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

function openEditModal() {
  formAgency.value = { ...agency.value };
  isEditModalOpen.value = true;
}

function handleLogoUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      formAgency.value.logo = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function saveAgency() {
  updateAgency(formAgency.value);

  if (formAgency.value.primaryColor) {
    if (appConfig.ui && appConfig.ui.colors) {
      appConfig.ui.colors.primary = formAgency.value.primaryColor;
    }
  }

  isEditModalOpen.value = false;
}
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
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-identification"
              class="w-5 h-5 text-gray-500"
            />
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              Perfil Corporativo
            </h2>
          </div>
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            label="Configurar White-Label"
            @click="openEditModal"
          />
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
          agencia, por favor contacta con tu soporte asignado en TravelOTA. El
          branding y logos pueden editarse libremente.
        </p>
      </div>
    </UCard>

    <!-- Wallet Finances -->
    <div class="mt-8 mb-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Crédito y Finanzas
      </h2>
      <WalletWidgets />
    </div>

    <!-- Transactions -->
    <div class="mb-8">
      <AgencyTransactions />
    </div>

    <!-- Modal Formulario de Branding -->
    <UModal v-model:open="isEditModalOpen" title="Configuración White-Label">
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="Logo de la Agencia"
            name="logo"
            description="Sube una imagen para mostrar en la plataforma y documentos."
          >
            <div class="flex items-center gap-4 mt-1">
              <UAvatar
                :src="formAgency.logo"
                size="lg"
                class="bg-white border border-gray-200 p-0.5"
              />
              <div class="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/20 dark:file:text-primary-400 cursor-pointer"
                  @change="handleLogoUpload"
                />
              </div>
            </div>
          </UFormField>

          <UFormField
            label="Color Principal del Sistema"
            name="primaryColor"
            description="Personaliza el color de botones y acentos visuales B2B."
          >
            <div class="flex flex-col gap-4 mt-2">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in themeColors"
                  :key="color"
                  type="button"
                  :class="[
                    'w-8 h-8 rounded-full border-2 focus:outline-none transition-transform hover:scale-110 shadow-sm',
                    formAgency.primaryColor === color
                      ? 'border-gray-900 dark:border-white scale-110'
                      : 'border-transparent',
                  ]"
                  :style="`background-color: ${colorMap[color]}`"
                  :title="color"
                  @click="formAgency.primaryColor = color"
                />
              </div>
              <div class="flex items-center gap-3">
                <div class="text-sm text-gray-500 font-medium">
                  O usa un código HEX personalizado:
                </div>
                <div class="flex items-center gap-2">
                  <input
                    v-model="formAgency.primaryColor"
                    type="color"
                    class="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden"
                  />
                  <UInput
                    v-model="formAgency.primaryColor"
                    placeholder="#000000"
                    class="w-32"
                  />
                </div>
              </div>
            </div>
          </UFormField>

          <UFormField label="Correo de Contacto Público" name="email">
            <UInput
              v-model="formAgency.email"
              type="email"
              icon="i-heroicons-envelope"
            />
          </UFormField>

          <UFormField label="Teléfono de Contacto" name="phone">
            <UInput v-model="formAgency.phone" icon="i-heroicons-phone" />
          </UFormField>
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
            @click="saveAgency"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
