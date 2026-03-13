<script setup lang="ts">
import { reactive } from "vue";
import { loginSchema, type LoginInput } from "~/utils/schemas";
import { useAuth } from "~/composables/useAuth";
import type { FormSubmitEvent } from "@nuxt/ui";

const form = reactive<LoginInput>({
  email: "",
  password: "",
  rememberMe: false,
});

const { loginAs } = useAuth();

async function onSubmit(event: FormSubmitEvent<LoginInput>) {
  console.log("Login attempt:", event.data);
}
</script>

<template>
  <UCard
    class="backdrop-blur-md bg-white/95 dark:bg-gray-900/95 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800"
    :ui="{ header: { padding: 'px-4 py-5 sm:px-6 text-center' } }"
  >
    <template #header>
      <h2
        class="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider text-center"
      >
        Login para Agencias
      </h2>
    </template>

    <UForm
      :schema="loginSchema"
      :state="form"
      class="space-y-5"
      @submit="onSubmit"
    >
      <UFormField label="Usuario" name="email">
        <UInput
          v-model="form.email"
          placeholder="Ingresa tu usuario"
          icon="i-lucide-user"
          class="w-full"
          size="xl"
        />
      </UFormField>

      <UFormField label="Contraseña" name="password">
        <template #help>
          <div class="text-right w-full mt-1">
            <NuxtLink
              class="text-xs text-primary-500 hover:text-primary-600 transition-colors"
              >Recuperar contraseña</NuxtLink
            >
          </div>
        </template>
        <UInput
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          icon="i-lucide-lock"
          class="w-full"
          size="xl"
        />
      </UFormField>

      <div class="flex items-center justify-between pt-2">
        <UCheckbox
          v-model="form.rememberMe"
          name="rememberMe"
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
      </div>

      <UButton
        type="submit"
        color="primary"
        block
        size="xl"
        class="mt-6 font-bold tracking-wide uppercase"
      >
        Entrar
      </UButton>
    </UForm>

    <div class="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
      <p
        class="text-xs text-center text-gray-500 font-bold uppercase tracking-wider mb-4"
      >
        Simulador de Roles de Prueba
      </p>
      <div class="grid grid-cols-2 gap-2">
        <UButton
          color="neutral"
          variant="soft"
          size="sm"
          icon="i-lucide-user"
          class="justify-center text-xs"
          @click="loginAs('USER')"
        >
          Usuario
        </UButton>
        <UButton
          color="primary"
          variant="soft"
          size="sm"
          icon="i-lucide-building"
          class="justify-center text-xs"
          @click="loginAs('AGENCY_ADMIN')"
        >
          Admin Agencia
        </UButton>
        <UButton
          color="warning"
          variant="soft"
          size="sm"
          icon="i-lucide-life-buoy"
          class="justify-center text-xs"
          @click="loginAs('SUPPORT')"
        >
          Soporte
        </UButton>
        <UButton
          color="error"
          variant="soft"
          size="sm"
          icon="i-lucide-shield-alert"
          class="justify-center text-xs"
          @click="loginAs('SUPER_ADMIN')"
        >
          Super Admin
        </UButton>
      </div>
    </div>

    <template #footer>
      <div
        class="text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center"
      >
        <span class="mb-1">¿Necesitas una cuenta?</span>
        <NuxtLink
          to="/register"
          class="text-primary-500 hover:underline font-medium"
          >Regístrate ahora</NuxtLink
        >
      </div>
    </template>
  </UCard>
</template>
