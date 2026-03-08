<script setup lang="ts">
import { ref } from "vue";
import { useItinerary } from "~/composables/useItinerary";
import ItineraryPreviewModal from "~/components/b2b/quoter/ItineraryPreviewModal.vue";
import { getLocalTimeZone, today as todayDate } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import type { ItineraryBlock } from "~/composables/useItinerary";

const formatDate = (date: DateValue): string => {
  const d = date.toDate(getLocalTimeZone());
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
};

definePageMeta({ layout: "dashboard" });

const {
  itinerary,
  totalPax,
  addBlock,
  removeBlock,
  removeOptionFromBlock,
  calculateOptionSellPrice,
  minItineraryPrice,
  clearItinerary,
} = useItinerary();

// For adding new blocks
const isAddBlockModalOpen = ref(false);
const newBlockType = ref<"hotel" | "flight" | "transfer" | "activity">("hotel");
const newBlockTitle = ref("");

const dateRange = ref({
  start: todayDate(getLocalTimeZone()),
  end: todayDate(getLocalTimeZone()).add({ days: 2 }),
});

const handleAddBlock = () => {
  if (!newBlockTitle.value) return;

  const dateStr =
    dateRange.value.start && dateRange.value.end
      ? `${formatDate(dateRange.value.start)} - ${formatDate(dateRange.value.end)}`
      : "";

  addBlock(newBlockType.value, newBlockTitle.value, dateStr);
  isAddBlockModalOpen.value = false;
  newBlockTitle.value = "";
  dateRange.value = {
    start: todayDate(getLocalTimeZone()),
    end: todayDate(getLocalTimeZone()).add({ days: 2 }),
  };
};

const isPreviewOpen = ref(false);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const nationalityOptions = [
  "Estados Unidos",
  "Canadá",
  "México",
  "Guatemala",
  "Honduras",
  "El Salvador",
  "Nicaragua",
  "Costa Rica",
  "Panamá",
  "Cuba",
  "República Dominicana",
  "Puerto Rico",
  "Colombia",
  "Venezuela",
  "Ecuador",
  "Perú",
  "Bolivia",
  "Chile",
  "Argentina",
  "Uruguay",
  "Paraguay",
  "Brasil",
  "España",
  "Portugal",
  "Francia",
  "Italia",
  "Alemania",
  "Reino Unido",
];
</script>

<template>
  <div class="max-w-7xl mx-auto pb-16">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-6"
    >
      <div>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-map" class="w-8 h-8 text-primary-500" />
          <UInput
            v-model="itinerary.title"
            variant="none"
            size="xl"
            class="font-bold text-2xl text-gray-900 dark:text-white p-0 -ml-2"
            placeholder="Nombre del Itinerario"
          />
        </div>
        <p
          class="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-4"
        >
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-user" class="w-4 h-4" />
            <UInput
              v-model="itinerary.clientName"
              variant="none"
              size="xs"
              placeholder="Nombre del Cliente"
              class="w-48 border-b border-dashed border-gray-300 dark:border-gray-700"
            />
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-users" class="w-4 h-4" />
            <UInput
              :model-value="totalPax"
              readonly
              variant="none"
              size="xs"
              class="w-8 text-center text-primary-600 font-bold bg-transparent pr-0"
              :ui="{
                wrapper: 'pr-0',
                base: 'px-0 text-center font-bold text-primary-600 cursor-default',
              }"
            />
            <span class="text-xs font-bold text-gray-500">PAX</span>
          </span>
          <span
            class="flex items-center gap-1 ml-2 border-l pl-4 border-gray-200 dark:border-gray-700"
          >
            <B2bHotelRoomDistribution v-model="itinerary.rooms" />
          </span>
          <span
            class="flex items-center gap-1 ml-2 border-l pl-4 border-gray-200 dark:border-gray-700"
          >
            <UIcon name="i-heroicons-globe-americas" class="w-4 h-4" />
            <select
              v-model="itinerary.origin"
              class="w-32 bg-transparent border-0 border-b border-dashed border-gray-300 dark:border-gray-700 text-xs px-1 py-0.5 focus:ring-0 cursor-pointer outline-none"
            >
              <option value="" disabled selected>Origen</option>
              <option
                v-for="country in nationalityOptions"
                :key="country"
                :value="country"
              >
                {{ country }}
              </option>
            </select>
          </span>
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-trash"
          label="Vaciar"
          @click="clearItinerary"
        />
        <UButton
          color="gray"
          variant="solid"
          icon="i-heroicons-document-duplicate"
          label="Guardar Plantilla"
        />
        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-eye"
          label="Previsualizar Itinerario"
          @click="isPreviewOpen = true"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Main Canvas Timeline -->
      <div class="lg:col-span-3 space-y-8">
        <!-- Empty State -->
        <div
          v-if="itinerary.blocks.length === 0"
          class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center"
        >
          <UIcon
            name="i-heroicons-document-plus"
            class="w-12 h-12 mx-auto text-gray-400 mb-4"
          />
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Comienza a armar tu viaje
          </h3>
          <p class="text-gray-500 mb-6">
            Añade tu primer bloque (Alojamiento, Vuelo, etc.) para empezar el
            itinerario.
          </p>
          <UButton
            icon="i-heroicons-plus"
            color="primary"
            @click="isAddBlockModalOpen = true"
          >
            Añadir Bloque de Producto
          </UButton>
        </div>

        <!-- Blocks Render -->
        <div
          v-for="(block, index) in itinerary.blocks as ItineraryBlock[]"
          :key="block.id"
          class="relative"
        >
          <!-- Timeline Vertical Line -->
          <div
            v-if="index !== itinerary.blocks.length - 1"
            class="absolute left-6 top-16 bottom-[-3rem] w-0.5 bg-gray-200 dark:bg-gray-800 z-0"
          ></div>

          <div class="flex gap-4 relative z-10">
            <!-- Block Icon Marker -->
            <div
              class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center shrink-0 border-4 border-white dark:border-gray-950 shadow-sm text-primary-600"
            >
              <UIcon
                :name="
                  block.type === 'hotel'
                    ? 'i-heroicons-building-office'
                    : block.type === 'flight'
                      ? 'i-heroicons-paper-airplane'
                      : block.type === 'transfer'
                        ? 'i-heroicons-truck'
                        : 'i-heroicons-ticket'
                "
                class="w-5 h-5"
              />
            </div>

            <!-- Block Content Box -->
            <div
              class="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
            >
              <div
                class="px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between"
              >
                <div>
                  <h4
                    class="font-bold text-gray-900 dark:text-white uppercase text-sm tracking-wide"
                  >
                    {{ block.title }}
                  </h4>
                  <p class="text-xs text-gray-500 font-medium font-mono mt-0.5">
                    {{ block.date || "Fecha por definir" }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <UBadge
                    v-if="block.options.length > 0"
                    color="primary"
                    variant="subtle"
                    >{{ block.options.length }} / 5 Opciones</UBadge
                  >
                  <UBadge v-else color="warning" variant="subtle"
                    >Bloque Vacío</UBadge
                  >
                  <UButton
                    icon="i-heroicons-trash"
                    color="error"
                    variant="ghost"
                    size="xs"
                    :padded="false"
                    class="ml-2"
                    @click="removeBlock(block.id)"
                  />
                </div>
              </div>

              <div class="p-5">
                <!-- Dropzone / Empty Options -->
                <div
                  v-if="block.options.length === 0"
                  class="border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center"
                >
                  <p class="text-sm text-gray-500 mb-3">
                    No hay opciones para este bloque todavía.
                  </p>
                  <UButton
                    size="xs"
                    color="gray"
                    variant="solid"
                    icon="i-heroicons-magnifying-glass"
                    to="/dashboard/hotels/results"
                    >Buscar Opciones</UButton
                  >
                </div>

                <!-- Listed Options (Max 5) -->
                <div v-else class="space-y-3">
                  <div
                    v-for="(opt, optIdx) in block.options"
                    :key="opt.id"
                    class="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-primary-300 transition-colors group"
                  >
                    <span
                      class="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs flex items-center justify-center font-bold"
                    >
                      #{{ optIdx + 1 }}
                    </span>
                    <img
                      :src="opt.image"
                      class="w-16 h-12 object-cover rounded"
                    />
                    <div class="flex-1">
                      <p
                        class="font-bold text-gray-900 dark:text-white text-sm"
                      >
                        {{ opt.name }}
                      </p>
                      <p class="text-xs text-gray-500">{{ opt.description }}</p>
                    </div>
                    <div class="text-right">
                      <p
                        class="text-xs text-gray-400 uppercase tracking-widest mb-0.5"
                      >
                        PVP Cliente
                      </p>
                      <p
                        class="font-bold text-primary-600 dark:text-primary-400 font-mono"
                      >
                        {{
                          formatCurrency(calculateOptionSellPrice(opt.netPrice))
                        }}
                      </p>
                    </div>
                    <UButton
                      icon="i-heroicons-x-mark"
                      color="red"
                      variant="ghost"
                      size="xs"
                      class="opacity-0 group-hover:opacity-100 transition-opacity"
                      @click="removeOptionFromBlock(block.id, opt.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="itinerary.blocks.length > 0" class="pl-16">
          <UButton
            icon="i-heroicons-plus"
            color="gray"
            variant="outline"
            @click="isAddBlockModalOpen = true"
          >
            Añadir Siguiente Bloque
          </UButton>
        </div>
      </div>

      <!-- Financial Setup Sidebar -->
      <div class="lg:col-span-1">
        <UCard
          class="sticky top-6 shadow-sm border border-gray-200 dark:border-gray-800"
        >
          <template #header>
            <h3
              class="font-bold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <UIcon
                name="i-heroicons-cog-8-tooth"
                class="w-5 h-5 text-gray-500"
              />
              Reglas de Cotización
            </h3>
          </template>

          <div class="space-y-6">
            <div
              class="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-lg border border-primary-100 dark:border-primary-800/50"
            >
              <label
                class="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider block mb-3"
              >
                Markup Global
              </label>
              <div class="flex items-center gap-3">
                <URange
                  v-model="itinerary.markupPercentage"
                  min="0"
                  max="100"
                  class="flex-1"
                />
                <span
                  class="font-bold text-lg text-primary-700 dark:text-primary-300 w-12 text-right"
                >
                  +{{ itinerary.markupPercentage }}%
                </span>
              </div>
              <p class="text-[10px] text-primary-600/70 mt-3 leading-snug">
                Se aplica dinámicamente sobre los precios netos B2B en todos los
                bloques.
              </p>
            </div>

            <UDivider />

            <div>
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2"
              >
                Precio Mínimo Base
              </p>
              <p
                class="text-3xl font-black text-gray-900 dark:text-white font-mono tracking-tighter"
              >
                {{ formatCurrency(minItineraryPrice) }}
              </p>
              <p class="text-xs text-gray-500 mt-1 leading-snug">
                Estimación usando la opción más económica de cada bloque actual.
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Modal Add Block -->
    <UModal v-model:open="isAddBlockModalOpen" title="Añadir Nuevo Bloque">
      <template #body>
        <div class="space-y-4">
          <UFormGroup label="Tipo de Producto">
            <USelect
              v-model="newBlockType"
              :options="[
                { label: 'Alojamiento', value: 'hotel' },
                { label: 'Vuelo', value: 'flight' },
                { label: 'Traslado', value: 'transfer' },
                { label: 'Actividad', value: 'activity' },
              ]"
            />
          </UFormGroup>
          <UFormGroup label="Título del Bloque">
            <UInput
              v-model="newBlockTitle"
              placeholder="Ej: 3 Noches en Punta Cana"
            />
          </UFormGroup>
          <UFormGroup label="Fechas / Referencia">
            <UPopover class="w-full">
              <UButton
                color="white"
                icon="i-lucide-calendar"
                class="w-full justify-start font-normal text-gray-700 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              >
                <template v-if="dateRange.start">
                  <template v-if="dateRange.end">
                    {{ formatDate(dateRange.start) }}
                    &nbsp;&rarr;&nbsp;
                    {{ formatDate(dateRange.end) }}
                  </template>
                  <template v-else>
                    {{ formatDate(dateRange.start) }}
                  </template>
                </template>
                <template v-else> Fechas opcionales </template>
              </UButton>

              <template #content>
                <UCalendar
                  v-model="dateRange"
                  class="p-2"
                  :number-of-months="2"
                  :fixed-weeks="false"
                  :ui="{
                    cellTrigger:
                      'data-[outside-view]:opacity-0 data-[outside-view]:pointer-events-none',
                  }"
                  range
                />
              </template>
            </UPopover>
          </UFormGroup>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="gray"
            variant="ghost"
            @click="isAddBlockModalOpen = false"
            >Cancelar</UButton
          >
          <UButton
            color="primary"
            :disabled="!newBlockTitle"
            @click="handleAddBlock"
            >Añadir Bloque</UButton
          >
        </div>
      </template>
    </UModal>

    <ItineraryPreviewModal v-model:is-open="isPreviewOpen" />
  </div>
</template>
