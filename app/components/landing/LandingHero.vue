<script setup lang="ts">
import { reactive } from "vue";
import { useAuth } from "~/composables/useAuth";

const form = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const { loginAs } = useAuth();

const handleLogin = () => {
  console.log("Login attempt:", form);
};
</script>

<template>
  <section class="relative bg-gray-900 overflow-hidden">
    <div class="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2674&auto=format&fit=crop"
        class="w-full h-full object-cover opacity-60 mix-blend-overlay"
        alt="Viajes"
      />
      <div
        class="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40"
      ></div>
    </div>

    <div class="relative px-4 py-24 sm:py-32 lg:px-8 mx-auto max-w-7xl">
      <div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
        <!-- LEFT CONTENT -->
        <div class="flex-1 text-center lg:text-left">
          <h1
            class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md uppercase"
          >
            <span class="block">Somos tu</span>
            <span class="block text-primary-400">Mayorista</span>
            <span class="block">De Viajes</span>
          </h1>
          <div
            class="mt-4 w-16 h-1 bg-primary mx-auto lg:mx-0 rounded-full"
          ></div>
          <p
            class="mt-6 text-xl text-gray-200 font-medium drop-shadow max-w-3xl mx-auto lg:mx-0"
          >
            Operador turístico líder para Agencias de Viaje
          </p>
        </div>

        <!-- RIGHT CONTENT: LOGIN CARD -->
        <div class="w-full max-w-md">
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

            <form class="space-y-5" @submit.prevent="handleLogin">
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
            </form>

            <div
              class="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6"
            >
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
        </div>
      </div>
    </div>
  </section>
</template>
