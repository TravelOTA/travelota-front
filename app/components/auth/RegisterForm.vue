<script setup lang="ts">
import { reactive } from "vue";
import { registerSchema, type RegisterInput } from "~/utils/schemas";
import type { FormSubmitEvent } from "@nuxt/ui";

const emit = defineEmits<{ success: [] }>();

const { registerAgency } = useAgencies();

const form = reactive<RegisterInput>({
  nombreComercial: "",
  razonSocial: "",
  nif: "",
  telefono: "",
  email: "",
  web: "",
  pais: "",
  nombreContacto: "",
  aceptaPrivacidad: false,
});

const { countries: paises } = useConfig();

const isFormValid = computed(
  () =>
    form.nombreComercial.trim().length >= 2 &&
    form.razonSocial.trim().length >= 2 &&
    form.nif.trim().length >= 5 &&
    form.telefono.trim().length >= 9 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.pais.trim().length >= 1 &&
    form.nombreContacto.trim().length >= 2 &&
    form.aceptaPrivacidad === true,
);

async function onSubmit(event: FormSubmitEvent<RegisterInput>) {
  registerAgency(event.data);
  emit("success");
}
</script>

<template>
  <UForm :schema="registerSchema" :state="form" @submit="onSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <!-- Columna Izquierda -->
      <div class="space-y-5">
        <UFormField name="nombreComercial">
          <UInput
            v-model="form.nombreComercial"
            placeholder="NOMBRE COMERCIAL DE LA EMPRESA"
            size="xl"
            variant="outline"
            class="uppercase-placeholder w-full"
            :ui="{
              base: 'text-gray-600 dark:text-gray-300',
              rounded: 'rounded-sm',
              color: {
                white: {
                  outline:
                    'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
                },
              },
            }"
          />
        </UFormField>

        <UFormField name="razonSocial">
          <UInput
            v-model="form.razonSocial"
            placeholder="RAZÓN SOCIAL"
            size="xl"
            variant="outline"
            class="uppercase-placeholder w-full"
            :ui="{
              base: 'text-gray-600 dark:text-gray-300',
              rounded: 'rounded-sm',
              color: {
                white: {
                  outline:
                    'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
                },
              },
            }"
          />
        </UFormField>

        <UFormField name="nif">
          <UInput
            v-model="form.nif"
            placeholder="NÚMERO DE IDENTIFICADOR FISCAL"
            size="xl"
            variant="outline"
            class="uppercase-placeholder w-full"
            :ui="{
              base: 'text-gray-600 dark:text-gray-300',
              rounded: 'rounded-sm',
              color: {
                white: {
                  outline:
                    'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
                },
              },
            }"
          />
        </UFormField>

        <UFormField name="telefono">
          <UInput
            v-model="form.telefono"
            type="tel"
            placeholder="TELÉFONO"
            size="xl"
            variant="outline"
            class="uppercase-placeholder w-full"
            :ui="{
              base: 'text-gray-600 dark:text-gray-300',
              rounded: 'rounded-sm',
              color: {
                white: {
                  outline:
                    'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
                },
              },
            }"
          />
        </UFormField>
      </div>

      <!-- Columna Derecha -->
      <div class="space-y-5">
        <UFormField name="email">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="E-MAIL"
            size="xl"
            variant="outline"
            class="uppercase-placeholder w-full"
            :ui="{
              base: 'text-gray-600 dark:text-gray-300',
              rounded: 'rounded-sm',
              color: {
                white: {
                  outline:
                    'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
                },
              },
            }"
          />
        </UFormField>

        <UFormField name="web">
          <UInput
            v-model="form.web"
            type="url"
            placeholder="WEB (OPCIONAL)"
            size="xl"
            variant="outline"
            class="uppercase-placeholder w-full"
            :ui="{
              base: 'text-gray-600 dark:text-gray-300',
              rounded: 'rounded-sm',
              color: {
                white: {
                  outline:
                    'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
                },
              },
            }"
          />
        </UFormField>

        <UFormField name="pais">
          <USelectMenu
            v-model="form.pais"
            :items="paises"
            size="xl"
            placeholder="PAÍS"
            variant="outline"
            class="uppercase-placeholder-select w-full"
            :ui="{
              base: 'text-gray-600 dark:text-gray-300',
              rounded: 'rounded-sm',
              color: {
                white: {
                  outline:
                    'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
                },
              },
            }"
          />
        </UFormField>

        <UFormField name="nombreContacto">
          <UInput
            v-model="form.nombreContacto"
            placeholder="NOMBRE DE CONTACTO"
            size="xl"
            variant="outline"
            class="uppercase-placeholder w-full"
            :ui="{
              base: 'text-gray-600 dark:text-gray-300',
              rounded: 'rounded-sm',
              color: {
                white: {
                  outline:
                    'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
                },
              },
            }"
          />
        </UFormField>
      </div>
    </div>

    <!-- Separador -->
    <div class="mt-8 mb-6 border-t border-gray-200 dark:border-gray-700"></div>

    <!-- Checkbox privacidad -->
    <div class="mb-8 flex items-center pl-1">
      <ClientOnly>
        <UFormField name="aceptaPrivacidad">
          <UCheckbox
            v-model="form.aceptaPrivacidad"
            name="privacidad"
            :ui="{
              base: 'w-4 h-4',
              rounded: 'rounded',
              color: 'text-primary-500 focus:ring-primary-500',
              border: 'border-gray-300 dark:border-gray-600',
            }"
          >
            <template #label>
              <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">
                Acepto la
                <NuxtLink
                  to="/privacy"
                  class="text-[#00A1A1] hover:text-[#008181] underline underline-offset-2 decoration-[#00A1A1]"
                  >política de privacidad</NuxtLink
                >
              </span>
            </template>
          </UCheckbox>
        </UFormField>
      </ClientOnly>
    </div>

    <!-- Botón Registro -->
    <div>
      <UButton
        type="submit"
        color="primary"
        variant="solid"
        size="lg"
        :disabled="!isFormValid"
        class="px-8 py-2.5 uppercase tracking-wider font-bold text-sm btn-registro rounded-sm shadow-sm"
      >
        Regístrame
      </UButton>
    </div>
  </UForm>
</template>

<style scoped>
/* Estilos para forzar el placeholder en mayúsculas y ajustar el padding para coincidir con el diseño */
:deep(.uppercase-placeholder input::placeholder) {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

:deep(.uppercase-placeholder-select button) {
  height: 48px;
  min-height: 48px;
  padding-left: 1rem;
  padding-right: 1rem;
}

:deep(.uppercase-placeholder-select button) {
  display: flex;
  align-items: center;
}

:deep(.uppercase-placeholder-select button .text-gray-500),
:deep(.uppercase-placeholder-select button .text-gray-400) {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

/* Color exacto del botón como el cyan de la imagen y hover */
:deep(.btn-registro) {
  background-color: #bbe0e3;
  color: white;
}
:deep(.btn-registro:hover) {
  background-color: #a3d2d5;
}
</style>
