<script setup lang="ts">
import { computed } from "vue";
import { format } from "date-fns";
import { es } from "date-fns/locale";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["update:isOpen"]);

const { items, totalSellPrice, calculateItemSellPrice } = useQuoter();
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
          Previsualización de Cotización
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
        id="printable-quoter"
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
              Presupuesto de Servicios
            </h1>
            <p class="text-sm text-gray-500 font-medium">
              Referencia:
              <span class="font-mono text-gray-900"
                >COT-{{ Math.floor(Math.random() * 100000) }}</span
              >
            </p>
            <p class="text-sm text-gray-500 font-medium">
              Fecha: {{ currentDate }}
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

        <!-- Warning / Expiration -->
        <div
          class="bg-gray-50 p-4 rounded-md mb-8 border border-gray-200 flex items-start gap-3"
        >
          <UIcon
            name="i-heroicons-information-circle"
            class="w-5 h-5 text-primary-500 mt-0.5 shrink-0"
          />
          <p class="text-sm text-gray-700 leading-relaxed">
            Estimado cliente, las tarifas y disponibilidad presentadas en este
            presupuesto están sujetas a cambios sin previo aviso por parte de
            los proveedores. Te recomendamos confirmar los servicios a la
            brevedad posible para garantizar el precio mostrado.
          </p>
        </div>

        <!-- Items Table -->
        <div class="mb-8">
          <h2
            class="text-xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2"
          >
            Detalle de Servicios
          </h2>

          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider"
              >
                <th class="p-3 font-semibold rounded-tl-md">Servicio</th>
                <th class="p-3 font-semibold">Ubicación</th>
                <th class="p-3 text-right font-semibold rounded-tr-md">
                  Total (PVP)
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(item, index) in items"
                :key="index"
                class="hover:bg-gray-50/50"
              >
                <td class="p-3">
                  <p class="font-bold text-gray-900">{{ item.hotelName }}</p>
                  <p class="text-xs text-gray-500">
                    {{ item.roomsDescription }}
                  </p>
                </td>
                <td class="p-3 text-sm text-gray-600">
                  {{ item.location }}
                </td>
                <td class="p-3 text-right font-bold font-mono text-gray-900">
                  {{ formatCurrency(calculateItemSellPrice(item)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total Price Summary -->
        <div class="flex justify-end mb-12">
          <div
            class="w-1/2 md:w-1/3 text-right border-t-2 border-gray-900 pt-4"
          >
            <p
              class="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1"
            >
              Precio Total a Pagar
            </p>
            <p
              class="text-4xl font-black text-primary-600 font-mono tracking-tighter"
            >
              {{ formatCurrency(totalSellPrice) }}
            </p>
          </div>
        </div>

        <!-- Print Footer -->
        <div
          class="border-t border-gray-200 pt-6 mt-12 text-center text-xs text-gray-400"
        >
          <p class="mb-1">
            Documento generado vía sistema automatizado para {{ agency.name }}.
          </p>
          <p>
            Para preguntas sobre este presupuesto, por favor contacte al agente
            a cargo.
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
  #printable-quoter,
  #printable-quoter * {
    visibility: visible;
  }
  #printable-quoter {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    color: black !important;
  }
}
</style>
