<script setup lang="ts">
import { computed } from "vue";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useItinerary } from "~/composables/useItinerary";
import { useAgency } from "~/composables/useAgency";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["update:isOpen"]);

const { itinerary, calculateOptionSellPrice, minItineraryPrice } =
  useItinerary();
const { agency } = useAgency();

const printVoucher = () => {
  window.print();
};

const currentDate = computed(() => {
  return format(new Date(), "dd 'de' MMMM, yyyy", { locale: es });
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
</script>

<template>
  <UModal
    :open="isOpen"
    fullscreen
    @update:open="emit('update:isOpen', $event)"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Previsualización de Itinerario
        </h3>
        <div class="flex items-center gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="emit('update:isOpen', false)"
          />
          <UButton
            color="primary"
            icon="i-heroicons-printer"
            label="Descargar PDF / Imprimir"
            @click="printVoucher"
          />
        </div>
      </div>
    </template>

    <template #body>
      <!-- PRINTABLE AREA -->
      <div
        id="printable-itinerary"
        class="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 my-8 print:my-0 text-gray-900"
      >
        <!-- Header: Agency Branding -->
        <div
          class="flex justify-between items-start border-b-2 border-primary-500 pb-6 mb-8"
        >
          <div>
            <h1
              class="text-3xl font-black text-primary-600 mb-2 tracking-tight"
            >
              {{ itinerary.title }}
            </h1>
            <p class="text-sm text-gray-500 font-medium">
              Cliente:
              <span class="font-bold text-gray-900">{{
                itinerary.clientName || "No Especificado"
              }}</span>
              • Viajeros:
              <span class="font-bold text-gray-900"
                >{{ itinerary.pax }} PAX</span
              >
            </p>
            <p class="text-sm text-gray-500 font-medium">
              Fecha de Emisión: {{ currentDate }}
            </p>
          </div>

          <div class="text-right">
            <img
              v-if="agency.logo"
              :src="agency.logo"
              alt="Agency Logo"
              class="h-16 w-auto object-contain mb-2 ml-auto"
            />
            <p class="font-bold text-lg text-gray-900">{{ agency.name }}</p>
            <p class="text-sm text-gray-500">{{ agency.phone }}</p>
            <p class="text-sm text-gray-500">{{ agency.email }}</p>
          </div>
        </div>

        <!-- Warning / Intro -->
        <div
          class="bg-gray-50 p-4 rounded-md mb-10 border border-gray-200 flex items-start gap-3"
        >
          <UIcon
            name="i-heroicons-information-circle"
            class="w-5 h-5 text-primary-500 mt-0.5 shrink-0"
          />
          <p class="text-sm text-gray-700 leading-relaxed">
            Estimado {{ itinerary.clientName || "Cliente" }}, a continuación le
            presentamos las opciones disponibles para su viaje. Las tarifas
            están sujetas a disponibilidad y podrían variar. Le sugerimos
            confirmar su elección a la brevedad.
          </p>
        </div>

        <!-- Timeline / Blocks -->
        <div class="mb-8 space-y-12">
          <div
            v-if="itinerary.blocks.length === 0"
            class="text-center text-gray-500 py-10"
          >
            Este itinerario aún no tiene bloques configurados.
          </div>

          <div
            v-for="(block, bIndex) in itinerary.blocks"
            :key="block.id"
            class="relative"
          >
            <!-- Block Header -->
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0 border-2 border-primary-500 text-primary-700 font-black"
              >
                {{ bIndex + 1 }}
              </div>
              <div>
                <h2
                  class="text-xl font-bold text-gray-900 uppercase tracking-wide"
                >
                  {{ block.title }}
                </h2>
                <p class="text-sm text-gray-500 font-semibold">
                  {{ block.date || "Fechas por confirmar" }}
                </p>
              </div>
            </div>

            <!-- Block Options -->
            <div class="pl-14">
              <div
                v-if="block.options.length === 0"
                class="text-sm text-gray-400 italic"
              >
                Opciones pendientes por confirmar para este bloque.
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(opt, oIndex) in block.options"
                  :key="opt.id"
                  class="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
                >
                  <div class="h-32 bg-gray-100 overflow-hidden relative">
                    <img :src="opt.image" class="w-full h-full object-cover" />
                    <div
                      class="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-sm"
                    >
                      Opción {{ oIndex + 1 }}
                    </div>
                  </div>
                  <div
                    class="p-4 flex-1 flex flex-col justify-between bg-white"
                  >
                    <div>
                      <h4
                        class="font-bold text-gray-900 text-sm mb-1 leading-tight"
                      >
                        {{ opt.name }}
                      </h4>
                      <p
                        class="text-xs text-gray-500 line-clamp-2 leading-relaxed"
                      >
                        {{ opt.description }}
                      </p>
                    </div>
                    <div class="mt-4 pt-3 border-t border-gray-100">
                      <p
                        class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5"
                      >
                        Precio de Venta
                      </p>
                      <p
                        class="text-lg font-black text-primary-600 font-mono tracking-tight"
                      >
                        {{
                          formatCurrency(calculateOptionSellPrice(opt.netPrice))
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Estimate Summary -->
        <div class="flex justify-end mb-12 mt-16">
          <div
            class="w-1/2 md:w-1/3 text-right border-t-2 border-gray-900 pt-4"
          >
            <p
              class="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1"
            >
              Paquete base estimado desde:
            </p>
            <p
              class="text-4xl font-black text-gray-900 font-mono tracking-tighter"
            >
              {{ formatCurrency(minItineraryPrice) }}
            </p>
          </div>
        </div>

        <!-- Print Footer -->
        <div
          class="border-t border-gray-200 pt-6 mt-12 text-center text-xs text-gray-400"
        >
          <p class="mb-1">
            Itinerario interactivo generado para {{ agency.name }}.
          </p>
          <p>
            Los precios cotizados toman como referencia la configuración de
            habitaciones y ocupantes detallada. Para cualquier cambio, contacte
            a su agente.
          </p>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #printable-itinerary,
  #printable-itinerary * {
    visibility: visible;
  }
  #printable-itinerary {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    color: black !important;
  }
}
</style>
