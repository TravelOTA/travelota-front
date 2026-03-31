<script setup lang="ts">
useHead({ title: 'Markup de Agencia - TravelOTA' });
const { t } = useI18n();

const markupType = ref('global');
const globalPercentage = ref(15);

interface Rule {
  id: number;
  type: string;
  value: string;
  percentage: number;
}

const rules = ref<Rule[]>([
  { id: 1, type: 'Destino', value: 'Todos', percentage: 12 },
  { id: 2, type: 'Destino', value: 'Punta Cana', percentage: 20 },
  { id: 3, type: 'Hotel', value: 'Melia Caribe Beach', percentage: 18 },
]);

// ── Modal State ──
const isRuleModalOpen = ref(false);
const newRule = ref({ type: 'Destino', value: '', percentage: 10 });

// Para destinos, sugeriremos opciones comunes y "Todos"
const popularDestinations = [
  'Todos',
  'Punta Cana',
  'Cancún',
  'Miami',
  'Madrid',
  'Roma',
];

function deleteRule(id: number) {
  rules.value = rules.value.filter((r) => r.id !== id);
}

function openAddRule() {
  newRule.value = { type: 'Destino', value: 'Todos', percentage: 10 };
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
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        {{ t('agency.markup.backToAgency') }}
      </NuxtLink>
      <div class="flex items-center gap-2 mb-1">
        <UIcon
          name="i-heroicons-currency-dollar"
          class="w-6 h-6 text-primary"
        />
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('agency.markup.title') }}
        </h1>
      </div>
      <p class="text-sm text-gray-500">
        {{ t('agency.markup.subtitle') }}
        <strong>{{ t('agency.markup.markupAgency') }}</strong>
        {{ t('agency.markup.description') }}
      </p>
    </div>

    <UCard class="shadow-sm rounded-lg">
      <div class="space-y-6">
        <URadioGroup
          v-model="markupType"
          :legend="t('agency.markup.scheme')"
          :options="[
            {
              value: 'global',
              label: t('agency.markup.globalPercentage'),
            },
            { value: 'dynamic', label: t('agency.markup.dynamicRules') },
          ]"
        />

        <div
          v-if="markupType === 'global'"
          class="flex items-end gap-4 max-w-sm"
        >
          <UFormField
            :label="t('agency.markup.markupPercentage')"
            name="percentage"
            class="flex-1"
          >
            <UInput v-model="globalPercentage" type="number" min="0" step="0.5">
              <template #trailing
                ><span class="text-gray-500">%</span></template
              >
            </UInput>
          </UFormField>
          <UButton color="primary" :label="t('agency.markup.saveChanges')" />
        </div>

        <div v-else class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ t('agency.markup.configuredRules') }}
            </h3>
            <UButton
              size="sm"
              color="primary"
              variant="solid"
              icon="i-heroicons-plus"
              :label="t('agency.markup.addRule')"
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
              {{ t('agency.markup.noRules') }}
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Modal: Nueva Regla -->
    <UModal
      v-model:open="isRuleModalOpen"
      :title="t('agency.markup.modalTitle')"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField :label="t('agency.markup.applyRuleTo')" name="rule-type">
            <USelectMenu
              v-model="newRule.type"
              :options="['Destino', 'Hotel']"
            />
          </UFormField>

          <UFormField
            :label="
              newRule.type === 'Destino'
                ? t('agency.markup.selectDestination')
                : t('agency.markup.hotelName')
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
              :placeholder="t('agency.markup.exampleHotel')"
            />
          </UFormField>

          <UFormField
            :label="t('agency.markup.markupToAdd')"
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
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('agency.users.modal.cancel')"
            @click="isRuleModalOpen = false"
          />
          <UButton
            color="primary"
            :label="t('agency.markup.saveRule')"
            :disabled="!newRule.value || newRule.value.trim() === ''"
            @click="saveRule"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
