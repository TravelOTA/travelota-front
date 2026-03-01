<script setup lang="ts">
useHead({
  title: "Configuración de MarkUp - TravelOTA",
});

const markupType = ref("global");
const globalPercentage = ref(15);

const rules = [
  { id: 1, type: "Destino", value: "Punta Cana", percentage: 20 },
  { id: 2, type: "Hotel", value: "Melia Caribe Beach", percentage: 18 },
];
</script>

<template>
  <div>
    <UCard class="shadow-sm rounded-lg">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-currency-dollar"
            class="w-5 h-5 text-primary"
          />
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Modelo de Beneficios
          </h2>
        </div>
      </template>

      <p class="text-sm text-gray-500 mb-6">
        Define el porcentaje de ganancia (**MarkUp**) que se sumará
        automáticamente al precio neto enviado por TravelOTA. Tus vendedores y
        clientes finales solo verán el precio final de venta.
      </p>

      <div class="space-y-6">
        <URadioGroup
          v-model="markupType"
          legend="Tipo de MarkUp Principal"
          :options="[
            { value: 'global', label: 'Porcentaje Fijo Global' },
            {
              value: 'dynamic',
              label: 'Reglas Dinámicas por Destino/Proveedor',
            },
          ]"
        />

        <div
          v-if="markupType === 'global'"
          class="flex items-end gap-4 max-w-sm"
        >
          <UFormGroup
            label="Porcentaje Global (%)"
            name="percentage"
            class="flex-1"
          >
            <UInput v-model="globalPercentage" type="number" min="0" step="0.1">
              <template #trailing>
                <span class="text-gray-500">%</span>
              </template>
            </UInput>
          </UFormGroup>
          <UButton color="neutral" label="Guardar MarkUp" />
        </div>

        <div v-else class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="font-medium text-gray-900 dark:text-white">
              Reglas Activas
            </h3>
            <UButton
              size="sm"
              color="neutral"
              variant="solid"
              icon="i-heroicons-plus"
              label="Añadir Regla"
            />
          </div>

          <div
            class="border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700"
          >
            <div
              v-for="rule in rules"
              :key="rule.id"
              class="p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50"
            >
              <div>
                <UBadge color="neutral" size="xs" class="mr-2">{{
                  rule.type
                }}</UBadge>
                <span class="text-sm font-medium">{{ rule.value }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-bold text-primary-600"
                  >{{ rule.percentage }}%</span
                >
                <UButton
                  icon="i-heroicons-trash"
                  size="xs"
                  color="error"
                  variant="ghost"
                />
              </div>
            </div>
            <div
              v-if="rules.length === 0"
              class="p-4 text-center text-sm text-gray-500"
            >
              No hay reglas dinámicas configuradas.
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
