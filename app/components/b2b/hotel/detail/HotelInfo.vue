<script setup lang="ts">
const description = `¿Por qué todos soñamos con ir de vacaciones al Caribe? Quizá por su verano permanente, sus playas infinitas, su gastronomía que fusiona culturas, o la amabilidad de sus gentes. Quizá para bucear y descubrir y cuidar la belleza del océano... En primera línea de Playa Bávaro, rodeado de jardines tropicales, con infinidad de actividades para los más pequeños en el Star Camp y un campo de Golf de 18 hoyos -referencia de la zona- diseñado por P.B. Dye, en Iberostar Waves Punta Cana dejarás de soñar. Cuídate, con el programa Aliveness, en el SPA Sensations, la sala Fitness o probando una oferta gastronómica amplia y saludable que incluye 6 restaurantes temáticos. Descubre el Centro de buceo y, por supuesto, nuestro laboratorio de corales, un “arca de Noé”, única en el mundo, que nos ayuda a protegerlos.`;

const hotelServices = [
  "Jacuzzi",
  "Desayuno Buffet",
  "Peluquería",
  "Wifi",
  "Jardín",
  "Cena Buffet",
  "Hamacas piscina",
  "Discoteca",
  "Casino",
  "Aeropuerto (distancia) 25000",
  "Sombrillas piscina",
  "Alquiler Coches",
  "Botones",
  "Parking *",
  "Música en vivo",
  "Sala de juego",
  "Lobby Bar",
  "Snack Bar",
  "Toallas piscina",
  "Toallas playa",
  "Cambio de divisa",
  "Socorrista playa",
  "SPA",
  "Cena a la carta",
  "Año de construcción 1996",
  "Año última Reforma 2005",
  "Bar Playa",
  "Servicio de lavandería *",
  "Cajero automático",
  "Teatro",
  "Sombrilla playa",
  "Almuerzo",
  "Socorrista piscina",
  "Playa pública",
  "Agua",
  "Agua y refrescos",
  "Piscina niños integrada",
  "Hamacas en playa",
  "Playa de arena",
  "Euro/Master-Card",
  "American Express",
  "Hamán baño turco",
  "Visa",
];

const roomServices = [
  "TV",
  "Wifi",
  "Balcón",
  "Cama King Size",
  "Preparacion Te/Cafe",
  "A/C básico",
];

const sportServices = [
  "Tenis",
  "Tiro con Arco",
  "Minigolf",
  "Voleibol",
  "Ping Pong",
  "Volley Playa",
  "Yoga",
  "Tiro con carabina",
  "Buceo: Escuela *",
  "Centro fitness",
];

const distances = ["Aeropuerto (distancia): 25 km"];

const observations = [
  "* - En 2020 todos los hoteles Iberostar serán libres de plásticos de un solo uso.",
  "- Iberostar fomenta el consumo responsable de pescado",
  "- Promueve proyectos de salud costera",
  "",
  "* LUNA DE MIEL. Incluye:",
  "- Botella de champagne",
  "- Canasta de frutas",
  "- Regalo especial Iberostar",
  "- Cena romántica en un restaurante de especialidades",
  "Restricciones: Se requerirá copia del certificado de matrimonio a su llegada a la Recepción del Hotel. Para estancias a partir de noviembre de 2020.",
];
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 flex flex-col gap-8 shadow-sm mt-6"
  >
    <!-- Description -->
    <section>
      <h3 class="text-xl font-light text-gray-800 dark:text-gray-100 mb-3">
        Descripción del hotel
      </h3>
      <p
        class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-justify"
      >
        {{ description }}
      </p>
    </section>

    <!-- Hotel Services -->
    <section>
      <h3
        class="text-xl font-light text-gray-800 dark:text-gray-100 mb-3 block border-b border-gray-100 dark:border-gray-800 pb-2"
      >
        Servicios del hotel
      </h3>
      <ul
        class="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400"
      >
        <li
          v-for="(svc, idx) in hotelServices"
          :key="idx"
          class="flex items-start"
        >
          <span class="text-lime-500 mr-2 mt-0.5 font-bold">•</span>
          {{ svc }}
        </li>
      </ul>
      <p class="text-xs text-gray-400 mt-2">* Servicios de pago</p>
    </section>

    <!-- Room Services -->
    <section>
      <h3
        class="text-xl font-light text-gray-800 dark:text-gray-100 mb-3 block border-b border-gray-100 dark:border-gray-800 pb-2"
      >
        Servicio de habitaciones
      </h3>
      <ul
        class="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400"
      >
        <li
          v-for="(svc, idx) in roomServices"
          :key="idx"
          class="flex items-start"
        >
          <span class="text-lime-500 mr-2 mt-0.5 font-bold">•</span>
          {{ svc }}
        </li>
      </ul>
    </section>

    <!-- Sport Services -->
    <section>
      <h3
        class="text-xl font-light text-gray-800 dark:text-gray-100 mb-3 block border-b border-gray-100 dark:border-gray-800 pb-2"
      >
        Servicios de deporte
      </h3>
      <ul
        class="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400"
      >
        <li
          v-for="(svc, idx) in sportServices"
          :key="idx"
          class="flex items-start"
        >
          <span class="text-lime-500 mr-2 mt-0.5 font-bold">•</span>
          {{ svc }}
        </li>
      </ul>
      <p class="text-xs text-gray-400 mt-2">* Servicios de pago</p>
    </section>

    <!-- Distances -->
    <section>
      <h3
        class="text-xl font-light text-gray-800 dark:text-gray-100 mb-3 block border-b border-gray-100 dark:border-gray-800 pb-2"
      >
        Distancias
      </h3>
      <ul
        class="grid grid-cols-1 gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400"
      >
        <li
          v-for="(dist, idx) in distances"
          :key="idx"
          class="flex items-start"
        >
          <span class="text-lime-500 mr-2 mt-0.5 font-bold">•</span>
          {{ dist }}
        </li>
      </ul>
    </section>

    <!-- Observations -->
    <section>
      <h3
        class="text-xl font-light text-gray-800 dark:text-gray-100 mb-3 block border-b border-gray-100 dark:border-gray-800 pb-2"
      >
        Observaciones
      </h3>
      <ul
        class="grid grid-cols-1 gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400"
      >
        <li
          v-for="(obs, idx) in observations"
          :key="idx"
          class="flex items-start"
          :class="obs === '' ? 'h-2' : ''"
        >
          <span v-if="obs" class="text-lime-500 mr-2 mt-0.5 font-bold">•</span>
          {{ obs }}
        </li>
      </ul>
    </section>
  </div>
</template>
