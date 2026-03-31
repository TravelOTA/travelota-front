<script setup lang="ts">
import { ref, computed } from "vue";

const { t } = useI18n();

const props = defineProps<{
  totalPax: number;
}>();

// 1 = main passenger only, 2 = all passengers
const includeMode = ref(1);

const passengers = ref(
  Array.from({ length: props.totalPax }).map((_, i) => ({
    id: i + 1,
    name: "",
    lastname: "",
  })),
);

const visiblePassengers = computed(() => {
  return includeMode.value === 1 ? [passengers.value[0]] : passengers.value;
});
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm flex flex-col gap-5"
  >
    <h3 class="font-bold text-gray-900 dark:text-white text-lg">
      {{ t('hotels.checkout.passengerData') }}
    </h3>

    <!-- Toggles -->
    <div class="flex items-center gap-6 text-sm">
      <URadio
        v-model="includeMode"
        :value="1"
        :label="t('hotels.checkout.mainPassengerOnly')"
      />
      <URadio
        v-model="includeMode"
        :value="2"
        :label="t('hotels.checkout.allPassengers')"
      />
    </div>

    <!-- Forms -->
    <div class="flex flex-col gap-4 mt-2">
      <div
        v-for="pax in visiblePassengers"
        :key="pax.id"
        class="flex flex-col gap-2"
      >
        <label
          class="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2"
        >
          <UIcon name="i-heroicons-user-solid" class="w-4 h-4" />
          {{ t('hotels.checkout.mainAdultPassenger') }} {{ pax.id }}
        </label>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField :label="t('hotels.checkout.name')">
            <UInput v-model="pax.name" :placeholder="t('hotels.checkout.namePlaceholder')" />
          </UFormField>
          <UFormField :label="t('hotels.checkout.lastName')">
            <UInput v-model="pax.lastname" :placeholder="t('hotels.checkout.lastNamePlaceholder')" />
          </UFormField>
        </div>
      </div>
    </div>
  </div>
</template>
