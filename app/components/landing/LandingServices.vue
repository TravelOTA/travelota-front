<template>
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
            <strong>Reservas de hoteles, traslados, coches de alquiler</strong>
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
            <strong>conocimiento profundo</strong> de la oferta en cada destino
            para ofrecer respuestas ágiles y ventajosas.
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
</template>
