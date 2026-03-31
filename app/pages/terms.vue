<template>
  <div
    class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 min-h-[80vh]"
  >
    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
      Aviso Legal y Condiciones de Uso
    </h1>

    <div
      class="prose prose-blue dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300"
    >
      <p class="text-lg leading-relaxed">
        Última actualización: {{ new Date().toLocaleDateString() }}
      </p>

      <section>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          1. Identidad del Titular
        </h2>
        <p>
          En cumplimiento con la normativa legal vigente, se informa que la
          titularidad del domino de este sitio web TravelOTA corresponde a
          TRAVELOTA GLOBAL SERVICES, con domicilio en Calle Falsa 123, 28000
          Madrid, España.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          2. Condiciones de Uso
        </h2>
        <p>
          El uso de este sitio web atribuye la condición de usuario e implica la
          aceptación total y sin reservas de todas y cada una de las
          disposiciones incluidas en este Aviso Legal. El usuario se compromete
          a hacer un uso adecuado y lícito del sitio web y de sus contenidos.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          3. Propiedad Intelectual e Industrial
        </h2>
        <p>
          Todos los contenidos de la página web —incluyendo de manera
          enumerativa pero no limitativa textos, imágenes, gráficos, iconos,
          tecnología, software, enlaces y demás contenidos audiovisuales o
          sonoros— son propiedad intelectual y no se entienden cedidos al
          Usuario ninguno de los derechos de explotación sobre los mismos más
          allá de lo estrictamente necesario para el correcto uso de la web.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          4. Exclusión de Responsabilidad
        </h2>
        <p>
          TravelOTA no se hace responsable de los daños y perjuicios que
          pudieran derivarse de interferencias, omisiones, interrupciones, virus
          informáticos, averías o desconexiones en el funcionamiento del sistema
          electrónico motivadas por causas ajenas a la empresa.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          5. Ley Aplicable y Jurisdicción
        </h2>
        <p>
          Para la resolución de todas las controversias o cuestiones
          relacionadas con el presente sitio web o de las actividades en él
          desarrolladas, será de aplicación la legislación española, a la que se
          someten expresamente las partes.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Aviso Legal - TravelOTA",
});
</script>
