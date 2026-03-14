<script setup lang="ts">
import { ref } from "vue";
import QuoterPreviewModal from "~/components/b2b/quoter/QuoterPreviewModal.vue";

definePageMeta({ layout: "dashboard" });

const {
  items,
  globalMarkupPercentage,
  removeItem,
  clearQuote,
  calculateItemSellPrice,
  totalNetPrice,
  totalSellPrice,
  totalProfit,
} = useQuoter();

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const tableColumns = [
  { accessorKey: "hotel", header: "Servicio Seleccionado" },
  { accessorKey: "netPrice", header: "Precio Neto" },
  { accessorKey: "markup", header: "Markup / Ganancia" },
  { accessorKey: "sellPrice", header: "PVP (Venta Final)" },
  { accessorKey: "actions", header: "" },
];

const checkoutSelected = () => {
  const toast = useToast();
  toast.add({
    title: "Reserva Múltiple",
    description:
      "La funcionalidad de checkout de cotizaciones completas en lote se encuentra en desarrollo.",
    icon: "i-heroicons-information-circle",
    color: "primary",
  });
};

const isPreviewOpen = ref(false);

const openPreview = () => {
  isPreviewOpen.value = true;
};
</script>

<template>
  <div class="max-w-7xl mx-auto pb-16">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h1
          class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <UIcon
            name="i-heroicons-calculator"
            class="w-8 h-8 text-primary-500"
          />
          Cotizador B2B
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Arma presupuestos personalizados, ajusta tus márgenes y compártelos
          fácilmente con tus clientes.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          v-if="items.length > 0"
          color="error"
          variant="ghost"
          icon="i-heroicons-trash"
          label="Vaciar Cotizador"
          size="sm"
          @click="clearQuote"
        />
        <UButton
          v-if="items.length > 0"
          color="primary"
          variant="solid"
          icon="i-heroicons-document-magnifying-glass"
          label="Previsualizar PDF"
          size="sm"
          @click="openPreview"
        />
      </div>
    </div>

    <!-- Empty State -->
    <UCard v-if="items.length === 0" class="py-16 text-center shadow-sm">
      <UIcon
        name="i-heroicons-shopping-cart"
        class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
      />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Tu cotizador está vacío
      </h3>
      <p class="text-gray-500 mb-6 max-w-sm mx-auto">
        Selecciona "Añadir a Cotización" desde cualquier hotel o habitación en
        nuestros resultados de búsqueda para empezar a armar tu presupuesto.
      </p>
      <UButton
        color="primary"
        to="/dashboard/hotels/results"
        icon="i-heroicons-magnifying-glass"
      >
        Buscar Hoteles
      </UButton>
    </UCard>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Cart Table -->
      <div class="lg:col-span-2 space-y-6">
        <UCard :ui="{ body: 'p-0 sm:p-0' }" class="shadow-sm overflow-hidden">
          <template #header>
            <div class="flex items-center justify-between px-2">
              <h2 class="font-bold text-gray-900 dark:text-white">
                Servicios en el Presupuesto
              </h2>
              <UBadge color="primary" variant="subtle"
                >{{ items.length }} items</UBadge
              >
            </div>
          </template>

          <UTable :data="items" :columns="tableColumns as any" class="w-full">
            <template #hotel-cell="{ row }">
              <div class="flex items-center gap-3">
                <img
                  :src="row.original.hotelImage"
                  class="w-12 h-12 rounded object-cover shadow-sm"
                />
                <div>
                  <p class="font-bold text-gray-900 dark:text-white text-sm">
                    {{ row.original.hotelName }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ row.original.roomsDescription }}
                  </p>
                </div>
              </div>
            </template>

            <template #netPrice-cell="{ row }">
              <span class="text-sm font-mono text-gray-500">{{
                formatCurrency(row.original.netPrice)
              }}</span>
            </template>

            <template #markup-cell="{ row }">
              <div class="flex items-center gap-1">
                <UInput
                  v-model.number="row.original.markupPercentage"
                  type="number"
                  min="0"
                  max="100"
                  size="xs"
                  class="w-16"
                />
                <span class="text-xs text-gray-500">%</span>
              </div>
            </template>

            <template #sellPrice-cell="{ row }">
              <span class="font-bold text-gray-900 dark:text-white font-mono">
                {{ formatCurrency(calculateItemSellPrice(row.original)) }}
              </span>
            </template>

            <template #actions-cell="{ row }">
              <UButton
                icon="i-heroicons-x-mark"
                color="error"
                variant="ghost"
                size="xs"
                @click="removeItem(row.original.id)"
              />
            </template>
          </UTable>
        </UCard>
      </div>

      <!-- Financial Summary Sidebar -->
      <div class="lg:col-span-1">
        <UCard class="shadow-sm sticky top-6">
          <template #header>
            <h2 class="font-bold text-gray-900 dark:text-white">
              Resumen de Cotización
            </h2>
          </template>

          <div class="space-y-4">
            <!-- Global Rules -->
            <div
              class="bg-primary-50 dark:bg-primary-900/10 p-3 rounded-md border border-primary-100 dark:border-primary-800"
            >
              <label
                class="text-xs font-bold text-primary-700 dark:text-primary-400 block mb-2 uppercase tracking-wide"
              >
                Markup Global Predeterminado
              </label>
              <div class="flex items-center gap-2">
                <USlider
                  v-model="globalMarkupPercentage"
                  :min="0"
                  :max="100"
                  class="flex-1"
                />
                <span
                  class="font-bold text-primary-700 dark:text-primary-300 w-10 text-right"
                  >{{ globalMarkupPercentage }}%</span
                >
              </div>
              <p class="text-[10px] text-gray-500 mt-2 leading-tight">
                Mueve este slider para ajustar el rendimiento de todos los
                nuevos ítems de inmediato.
              </p>
            </div>

            <USeparator class="my-4" />

            <!-- Cost Breakdown -->
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500">Costo Neto (Total OTA)</span>
              <span class="font-mono text-gray-700 dark:text-gray-300">{{
                formatCurrency(totalNetPrice)
              }}</span>
            </div>

            <div
              class="flex justify-between items-center text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 p-2 rounded"
            >
              <span>Tu Ganancia (Markup)</span>
              <span class="font-mono">+ {{ formatCurrency(totalProfit) }}</span>
            </div>

            <USeparator class="my-4" />

            <div
              class="flex justify-between items-end border-t border-gray-100 dark:border-gray-800 pt-4 mt-4"
            >
              <span class="text-gray-900 dark:text-white font-bold"
                >Precio de Venta<br /><span
                  class="text-xs text-gray-500 font-normal"
                  >PVP al Cliente</span
                ></span
              >
              <span
                class="text-2xl font-black text-gray-900 dark:text-white font-mono"
                >{{ formatCurrency(totalSellPrice) }}</span
              >
            </div>
          </div>

          <template #footer>
            <div class="grid grid-cols-1 gap-2">
              <UButton
                block
                color="primary"
                size="lg"
                class="font-bold"
                icon="i-heroicons-credit-card"
                @click="checkoutSelected"
              >
                Reservar Todo
              </UButton>
              <UButton
                block
                color="primary"
                variant="subtle"
                class="font-medium"
                icon="i-heroicons-user-plus"
              >
                Guardar Cliente
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </div>

    <QuoterPreviewModal v-model:is-open="isPreviewOpen" />
  </div>
</template>
