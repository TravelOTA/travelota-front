<script setup>
import { reactive } from "vue";

useSeoMeta({
  title: "TravelOTA - Inicio",
  description:
    "Somos tu mayorista de viajes. Operador turístico líder para Agencias de Viaje.",
});

const form = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const handleLogin = () => {
  console.log("Login attempt:", form);
};
</script>

<template>
  <div class="min-h-screen">
    <!-- HERO SECTION -->
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
                        to="/recuperar"
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
                      <span
                        class="text-sm text-gray-500 dark:text-gray-400 ml-2"
                      >
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

    <!-- INCOMING SERVICE SECTION -->
    <section id="dmc" class="py-24 bg-white dark:bg-gray-950">
      <div class="px-4 lg:px-8 mx-auto max-w-7xl">
        <div class="text-center mb-16">
          <h2
            class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase"
          >
            TravelOTA - Incoming Service
          </h2>
          <div class="mt-4 w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="flex flex-col items-center text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-primary-500/50 transition-colors hover:shadow-lg dark:hover:shadow-primary/5"
          >
            <div
              class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
            >
              <UIcon name="i-lucide-hotel" class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Servicios Receptivos
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Receptivo independiente en los principales destinos.
              <strong
                >Reservas de hoteles, traslados, coches de alquiler</strong
              >
              y excursiones.
            </p>
          </div>

          <div
            class="flex flex-col items-center text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-primary-500/50 transition-colors hover:shadow-lg dark:hover:shadow-primary/5"
          >
            <div
              class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
            >
              <UIcon name="i-lucide-lightbulb" class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Conocimiento Profundo
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Nuestra trayectoria nos concede un
              <strong>conocimiento profundo</strong> de la oferta en cada
              destino para ofrecer respuestas ágiles y ventajosas.
            </p>
          </div>

          <div
            class="flex flex-col items-center text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-primary-500/50 transition-colors hover:shadow-lg dark:hover:shadow-primary/5"
          >
            <div
              class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
            >
              <UIcon name="i-lucide-map" class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Incentivos y Circuitos
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Ofrecemos servicios integrales para
              <strong>grupos de incentivos y circuitos</strong>, junto con
              representación profesional en el destino.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- MAP SECTION -->
    <section
      class="py-24 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 relative overflow-hidden"
    >
      <div class="px-4 lg:px-8 mx-auto max-w-7xl text-center relative z-10">
        <h2
          class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase mb-6"
        >
          Más de 17 Oficinas en 11 Países
        </h2>
        <div
          class="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto"
        >
          <UBadge
            variant="subtle"
            color="primary"
            size="lg"
            class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
            >España</UBadge
          >
          <UBadge
            variant="subtle"
            color="primary"
            size="lg"
            class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
            >Portugal</UBadge
          >
          <UBadge
            variant="subtle"
            color="primary"
            size="lg"
            class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
            >Cabo Verde</UBadge
          >
          <UBadge
            variant="subtle"
            color="primary"
            size="lg"
            class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
            >Marruecos</UBadge
          >
          <UBadge
            variant="subtle"
            color="primary"
            size="lg"
            class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
            >Turquía</UBadge
          >
          <UBadge
            variant="subtle"
            color="primary"
            size="lg"
            class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
            >México</UBadge
          >
          <UBadge
            variant="subtle"
            color="primary"
            size="lg"
            class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
            >Cuba</UBadge
          >
          <UBadge
            variant="subtle"
            color="primary"
            size="lg"
            class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
            >Finlandia</UBadge
          >
          <UBadge
            variant="subtle"
            color="primary"
            size="lg"
            class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
            >Jamaica</UBadge
          >
          <UBadge
            variant="subtle"
            color="primary"
            size="lg"
            class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
            >Egipto</UBadge
          >
          <UBadge
            variant="subtle"
            color="primary"
            size="lg"
            class="m-1 rounded-full px-4 py-1.5 font-medium tracking-wide"
            >República Dominicana</UBadge
          >
        </div>

        <div class="relative max-w-3xl mx-auto">
          <UIcon
            name="i-lucide-globe-2"
            class="w-full h-[300px] text-gray-200 dark:text-gray-800 drop-shadow-xl opacity-80"
          />
        </div>
      </div>
    </section>

    <!-- BED BANK SECTION -->
    <section class="py-24 bg-white dark:bg-gray-950">
      <div class="px-4 lg:px-8 mx-auto max-w-7xl">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <div class="flex-1 space-y-8">
            <h2
              class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase"
            >
              TravelOTA - Bed Bank
            </h2>
            <div class="w-16 h-1 bg-primary rounded-full"></div>

            <ul class="space-y-6 text-lg text-gray-600 dark:text-gray-400">
              <li class="flex items-start gap-4">
                <UIcon
                  name="i-lucide-check-circle-2"
                  class="w-6 h-6 text-primary shrink-0 mt-1"
                />
                <span
                  >Uno de los bancos de camas líderes del mercado. Ofrecemos la
                  posibilidad de reservar en
                  <strong>más de 500.000 hoteles</strong> de todo el mundo de
                  forma fácil e intuitiva.</span
                >
              </li>
              <li class="flex items-start gap-4">
                <UIcon
                  name="i-lucide-check-circle-2"
                  class="w-6 h-6 text-primary shrink-0 mt-1"
                />
                <span
                  >Líderes en destinos nacionales e internacionales.
                  Contratación directa de más de
                  <strong>25.000 alojamientos</strong> alrededor del mundo y
                  mucho más a través de asociados.</span
                >
              </li>
              <li class="flex items-start gap-4">
                <UIcon
                  name="i-lucide-check-circle-2"
                  class="w-6 h-6 text-primary shrink-0 mt-1"
                />
                <span
                  >Además, ofrecemos la contratación de traslados, excursiones y
                  entradas en todo el mundo en un par de clics.</span
                >
              </li>
            </ul>

            <div class="pt-4">
              <UButton
                size="xl"
                color="primary"
                variant="solid"
                class="group shadow-lg shadow-primary/30"
              >
                Explorar Alojamiento
                <template #trailing>
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="group-hover:translate-x-1 transition-transform"
                  />
                </template>
              </UButton>
            </div>
          </div>
          <div class="flex-1 relative">
            <div class="aspect-square max-w-md mx-auto relative">
              <div
                class="absolute inset-0 bg-primary/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-70"
              ></div>
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop"
                class="rounded-3xl shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 relative z-10 object-cover w-full h-full"
                alt="Bed Bank Hotels"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Scoped styles mainly for specific overrides if needed */
</style>
