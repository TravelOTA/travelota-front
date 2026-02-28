<template>
  <div
    class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 min-h-[80vh]"
  >
    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
      Políticas de Privacidad
    </h1>

    <div
      class="prose prose-blue dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300"
    >
      <p class="text-lg leading-relaxed">
        Última actualización: {{ new Date().toLocaleDateString() }}
      </p>

      <section>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          1. Información General
        </h2>
        <p>
          En TravelOTA respetamos su privacidad y estamos comprometidos a
          proteger la información personal que pueda proporcionarnos a través de
          este sitio web.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          2. Recopilación de Datos
        </h2>
        <p>
          Recopilamos información personal cuando usted se registra, utiliza
          nuestros servicios de reserva o se pone en contacto con nosotros. Esta
          información puede incluir su nombre, dirección de correo electrónico,
          detalles de contacto y, si aplicara, datos de facturación.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          3. Uso de la Información
        </h2>
        <p>
          Utilizamos la información recopilada para proporcionarle nuestros
          servicios, procesar sus reservas, comunicarnos con usted y mejorar su
          experiencia en nuestra plataforma.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          4. Seguridad
        </h2>
        <p>
          Implementamos medidas de seguridad para proteger su información
          personal contra el acceso no autorizado, la alteración, divulgación o
          destrucción.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
          5. Contacto
        </h2>
        <p>
          Si tiene preguntas sobre nuestras prácticas de privacidad, puede
          contactarnos a través de los datos provistos en la sección de contacto
          de nuestro sitio.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Políticas de Privacidad - TravelOTA",
});
</script>
