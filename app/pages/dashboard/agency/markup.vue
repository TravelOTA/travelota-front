<script setup lang="ts">
useHead({ title: "Markup de Agencia - TravelOTA" });

const markupType = ref("global");
const globalPercentage = ref(15);

interface Rule {
  id: number;
  type: string;
  value: string;
  percentage: number;
}

const rules = ref<Rule[]>([
  { id: 1, type: "Destino", value: "Todos", percentage: 12 },
  { id: 2, type: "Destino", value: "Punta Cana", percentage: 20 },
  { id: 3, type: "Hotel", value: "Melia Caribe Beach", percentage: 18 },
]);

// ── Modal State ──
const isRuleModalOpen = ref(false);
const newRule = ref({ type: "Destino", value: "", percentage: 10 });

// Para destinos, sugeriremos opciones comunes y "Todos"
const popularDestinations = [
  "Todos",
  "Punta Cana",
  "Cancún",
  "Miami",
  "Madrid",
  "Roma",
];

function deleteRule(id: number) {
  rules.value = rules.value.filter((r) => r.id !== id);
}

function openAddRule() {
  newRule.value = { type: "Destino", value: "Todos", percentage: 10 };
  isRuleModalOpen.value = true;
}

function saveRule() {
  if (!newRule.value.value) return;
  rules.value.push({
    id: Date.now(),
    type: newRule.value.type,
    value: newRule.value.value,
    percentage: newRule.value.percentage,
  });
  isRuleModalOpen.value = false;
}
</script>

<template>
  <div class="max-w-4xl mx-auto pb-8">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink
        to="/dashboard/agency"
        class="text-sm font-medium text-primary-500 hover:underline mb-2 inline-flex items-center gap-1"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" /> Volver a Mi
        Agencia
      </NuxtLink>
      <div class="flex items-center gap-2 mb-1">
        <UIcon
          name="i-heroicons-currency-dollar"
          class="w-6 h-6 text-primary"
        />
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Modelo de Beneficios
        </h1>
      </div>
      <p class="text-sm text-gray-500">
        Define tu ganancia. El porcentaje que configures aquí será tu
        <strong>Markup de Agencia</strong>
        y se sumará automáticamente al Precio Neto ofrecido por el sistema. Tus
        vendedores y clientes finales solo verán el precio final de venta.
      </p>
    </div>

    <UCard class="shadow-sm rounded-lg">
      <div class="space-y-6">
        <URadioGroup
          v-model="markupType"
          legend="Esquema de Ganancia"
          :options="[
            {
              value: 'global',
              label: 'Porcentaje Fijo sobre todo el inventario',
            },
            { value: 'dynamic', label: 'Reglas Dinámicas por Destino/Hotel' },
          ]"
        />

        <div
          v-if="markupType === 'global'"
          class="flex items-end gap-4 max-w-sm"
        >
          <UFormGroup
            label="Markup de tu Agencia (%)"
            name="percentage"
            class="flex-1"
          >
            <UInput v-model="globalPercentage" type="number" min="0" step="0.5">
              <template #trailing
                ><span class="text-gray-500">%</span></template
              >
            </UInput>
          </UFormGroup>
          <UButton color="primary" label="Guardar Cambios" />
        </div>

        <div v-else class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="font-medium text-gray-900 dark:text-white">
              Reglas Configuradas
            </h3>
            <UButton
              size="sm"
              color="primary"
              variant="solid"
              icon="i-heroicons-plus"
              label="Añadir Regla"
              @click="openAddRule"
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
                  >+{{ rule.percentage }}%</span
                >
                <UButton
                  icon="i-heroicons-trash"
                  size="xs"
                  color="error"
                  variant="ghost"
                  @click="deleteRule(rule.id)"
                />
              </div>
            </div>
            <div
              v-if="rules && rules.length === 0"
              class="p-4 text-center text-sm text-gray-500"
            >
              No has configurado reglas aún. El sistema no cobrará markup
              adicional al precio neto.
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Modal: Nueva Regla -->
    <UModal v-model:open="isRuleModalOpen" title="Nueva Regla de Beneficios">
      <template #body>
        <div class="space-y-4">
          <UFormGroup label="Aplicar Regla A" name="rule-type">
            <USelectMenu
              v-model="newRule.type"
              :options="['Destino', 'Hotel']"
            />
          </UFormGroup>

          <UFormGroup
            :label="
              newRule.type === 'Destino'
                ? 'Seleccionar Destino'
                : 'Nombre del Hotel'
            "
            name="rule-value"
            required
          >
            <USelectMenu
              v-if="newRule.type === 'Destino'"
              v-model="newRule.value"
              :options="popularDestinations"
              searchable
              placeholder="Ej: Todos"
            />
            <UInput
              v-else
              v-model="newRule.value"
              placeholder="Ej: Hard Rock Hotel"
            />
          </UFormGroup>

          <UFormGroup
            label="Markup a Sumar al Neto (%)"
            name="rule-percentage"
            required
          >
            <UInput
              v-model="newRule.percentage"
              type="number"
              min="0"
              step="0.5"
            >
              <template #trailing
                ><span class="text-gray-500">%</span></template
              >
            </UInput>
          </UFormGroup>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="isRuleModalOpen = false"
          />
          <UButton
            color="primary"
            label="Guardar Regla"
            :disabled="!newRule.value || newRule.value.trim() === ''"
            @click="saveRule"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
