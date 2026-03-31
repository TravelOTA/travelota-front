<script setup>
useHead({
  title: "Conócenos - TravelOTA",
});
</script>

<template>
  <div
    class="min-h-[85vh] bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 flex justify-center mt-8"
  >
    <div class="max-w-4xl w-full">
      <!-- Título de sección -->
      <div class="mb-8 flex items-center gap-3">
        <div class="w-1 h-8 bg-primary-500 rounded-sm"></div>
        <h2
          class="text-[26px] font-normal text-slate-500 dark:text-gray-300 tracking-normal uppercase"
        >
          Conócenos
        </h2>
      </div>

      <!-- Contenido Base -->
      <div
        class="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
      >
        <p class="text-lg leading-relaxed mb-8">
          En <strong class="text-primary-500">TravelOTA</strong> somos más que
          una plataforma de viajes; somos tu socio global en la organización y
          gestión de experiencias turísticas de primer nivel. Con años de
          experiencia en la industria, conectamos a agencias, proveedores y
          viajeros a través de tecnología de vanguardia y un servicio
          excepcional.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
          <UCard :ui="{ shadow: 'shadow-sm', rounded: 'rounded-sm' }">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-globe-alt"
                  class="w-6 h-6 text-primary-500"
                />
                <h3 class="text-xl font-bold text-gray-800 dark:text-white m-0">
                  Nuestra Misión
                </h3>
              </div>
            </template>
            <p class="text-sm">
              Potenciar el crecimiento de empresas turísticas en todo el mundo
              ofreciendo herramientas tecnológicas robustas, un inventario de
              viajes inigualable y un soporte humano comprometido con la
              excelencia.
            </p>
          </UCard>

          <UCard :ui="{ shadow: 'shadow-sm', rounded: 'rounded-sm' }">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-eye"
                  class="w-6 h-6 text-primary-500"
                />
                <h3 class="text-xl font-bold text-gray-800 dark:text-white m-0">
                  Nuestra Visión
                </h3>
              </div>
            </template>
            <p class="text-sm">
              Convertirnos en el ecosistema número uno para la industria B2B de
              viajes, donde la innovación y la confianza sean los pilares para
              transformar la forma en la que el mundo explora nuevos destinos.
            </p>
          </UCard>
        </div>

        <h3
          class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100"
        >
          Por qué elegirnos
        </h3>
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
            />
            <div>
              <strong class="block text-gray-900 dark:text-white"
                >Tecnología Inteligente:</strong
              >
              <span
                >Nuestra plataforma es intuitiva, rápida y está diseñada para
                optimizar tus procesos de reserva y facturación.</span
              >
            </div>
          </li>
          <li class="flex items-start gap-3">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
            />
            <div>
              <strong class="block text-gray-900 dark:text-white"
                >Cobertura Global:</strong
              >
              <span
                >Acceso directo a miles de hoteles, vuelos, traslados y
                actividades en todos los continentes.</span
              >
            </div>
          </li>
          <li class="flex items-start gap-3">
            <UIcon
              name="i-heroicons-check-circle"
              class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
            />
            <div>
              <strong class="block text-gray-900 dark:text-white"
                >Asistencia y Soporte 24/7:</strong
              >
              <span
                >Un equipo de soporte siempre disponible para resolver
                incidencias antes, durante y después del viaje.</span
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
