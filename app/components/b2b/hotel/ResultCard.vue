<script setup lang="ts">
const props = defineProps({
  hotel: {
    type: Object, // REFACTOR: This should be a corresponding hotel type
    required: true,
  },
});

const emit = defineEmits<{
  (e: "open-map", hotel: Record<string, unknown>): void;
}>();

const isExpanded = ref(true); // Simulate that by default the first 2 are shown expanded
const showAllRooms = ref(false);

const sortedRooms = computed(() => {
  if (!props.hotel || !Array.isArray(props.hotel.rooms)) return [];
  return [...props.hotel.rooms].sort(
    (a: { price?: number }, b: { price?: number }) =>
      (a.price || 0) - (b.price || 0),
  );
});

const visibleRooms = computed(() => {
  return showAllRooms.value ? sortedRooms.value : sortedRooms.value.slice(0, 1);
});
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6 shadow-sm hover:shadow transition-shadow"
  >
    <!-- Cabecera de la Tarjeta de Hotel -->
    <div class="flex flex-col md:flex-row bg-white dark:bg-gray-900">
      <!-- Imagen -->
      <div class="relative w-full md:w-64 h-48 shrink-0 cursor-pointer">
        <img
          :src="hotel.image"
          :alt="hotel.name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Info Central -->
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex text-yellow-400 mb-1">
            <UIcon
              v-for="i in hotel.stars"
              :key="i"
              name="i-heroicons-star-16-solid"
              class="w-4 h-4"
            />
          </div>
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 transition-colors"
          >
            {{ hotel.name }}
          </h3>

          <div
            class="flex items-center text-sm text-gray-500 mb-4 cursor-pointer hover:text-gray-700"
            @click="emit('open-map', hotel)"
          >
            <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
            <span>{{ hotel.location }}</span>
            <span class="ml-2 underline underline-offset-2">Ver el mapa</span>
          </div>
        </div>
      </div>

      <!-- Bloque de Precio (Mejor Precio) -->
      <div
        class="p-4 md:w-48 shrink-0 flex flex-col justify-center items-end text-right border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800"
      >
        <p
          class="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1 leading-tight text-right w-full"
        >
          Mejor Precio<br />Por Estancia
        </p>
        <p
          class="text-3xl font-light text-gray-900 dark:text-white tracking-tight mb-2"
        >
          <span class="font-bold">$</span>
          {{
            hotel.bestPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </p>
      </div>
    </div>

    <!-- Separador Estético opcional si está colapsado -->
    <div v-if="isExpanded" class="w-full h-1 bg-primary-500/20"></div>

    <!-- Grid de Habitaciones (Accordion Mode) -->
    <div v-if="isExpanded" class="bg-gray-50 dark:bg-gray-800/20 px-4 py-2">
      <div
        v-for="(room, idx) in visibleRooms"
        :key="idx"
        class="flex flex-col sm:flex-row items-center py-1 border-b border-gray-200 dark:border-gray-700 last:border-0 gap-1"
      >
        <!-- Icono (Medalla) -->
        <div class="w-8 flex justify-center text-primary-500">
          <UIcon name="i-heroicons-check-badge" class="w-6 h-6" />
        </div>

        <!-- Tipo Habitación -->
        <div class="flex-1 min-w-[150px]">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{
            room.name
          }}</span>
        </div>

        <!-- Régimen -->
        <div class="w-16 font-bold text-gray-800 dark:text-gray-300">
          {{ room.regimen }}
        </div>

        <!-- Cancelación -->
        <div class="w-auto sm:w-48 flex items-center gap-1">
          <UPopover>
            <span
              class="text-xs text-gray-500 underline underline-offset-2 cursor-pointer hover:text-gray-700 block"
            >
              Gastos de cancelación
            </span>
            <template #content>
              <div class="p-3 w-64 text-sm z-50">
                <p class="font-bold text-gray-900 dark:text-white mb-1">
                  Política de Cancelación
                </p>
                <p class="text-gray-600 dark:text-gray-300 text-xs">
                  {{ room.cancellation }}. (Texto de ejemplo, será devuelto por
                  el backend próximamente).
                </p>
              </div>
            </template>
          </UPopover>
          <UBadge
            v-if="
              String(room.cancellation)
                .toLowerCase()
                .includes('no reembolsable')
            "
            color="error"
            variant="soft"
            size="xs"
            class="ml-1 px-1 py-0 text-[9px] font-bold leading-tight"
          >
            NR
          </UBadge>
          <UBadge
            v-if="room.onRequest"
            color="warning"
            variant="soft"
            size="xs"
            class="ml-1 px-1 py-0 text-[9px] font-bold leading-tight"
          >
            OR
          </UBadge>
        </div>

        <div class="w-32 text-right font-bold text-gray-900 dark:text-white">
          $
          {{
            room.price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </div>

        <!-- Botón Reservar -->
        <div class="w-28 text-right">
          <UButton block color="primary" class="font-bold">Reservar</UButton>
        </div>
      </div>

      <!-- Toggle "Ver Más opciones" -->
      <div
        v-if="sortedRooms.length > 1"
        class="py-3 text-center border-t border-gray-200 dark:border-gray-700 mt-2"
      >
        <button
          class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
          @click="showAllRooms = !showAllRooms"
        >
          <UIcon
            :name="
              showAllRooms
                ? 'i-heroicons-minus-circle'
                : 'i-heroicons-plus-circle'
            "
            class="w-5 h-5 mr-2"
          />
          {{ showAllRooms ? "Ver menos opciones" : "Ver más opciones" }}
        </button>
      </div>
    </div>
  </div>
</template>
