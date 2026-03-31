<script setup lang="ts">
import { ref } from "vue";

const { t } = useI18n();

const form = ref({
  name: "",
  lastName: "",
  reference: "",
  observations: "",
});

defineExpose({ form });
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5"
  >
    <h3
      class="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2"
    >
      <UIcon name="i-heroicons-user" class="w-5 h-5 text-primary-500" />
      {{ t('hotels.checkout.titularData') }}
    </h3>
    <p class="text-sm text-gray-500 mb-4">
      {{ t('hotels.checkout.titularNote') }}
    </p>

    <div class="flex flex-col gap-5">
      <!-- First Row: Symmetrical -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-bold text-gray-700 dark:text-gray-200"
            >{{ t('hotels.checkout.name') }} <span class="text-red-500">*</span></label
          >
          <UInput v-model="form.name" :placeholder="t('hotels.checkout.namePlaceholder')" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-bold text-gray-700 dark:text-gray-200"
            >{{ t('hotels.checkout.lastName') }} <span class="text-red-500">*</span></label
          >
          <UInput v-model="form.lastName" :placeholder="t('hotels.checkout.lastNamePlaceholder')" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-bold text-gray-700 dark:text-gray-200"
            >{{ t('hotels.checkout.agencyReference') }}</label
          >
          <UInput v-model="form.reference" :placeholder="t('hotels.checkout.agencyReferencePlaceholder')" />
        </div>
      </div>

      <!-- Observations Row -->
      <div class="w-full">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-bold text-gray-700 dark:text-gray-200"
            >{{ t('hotels.checkout.observations') }}</label
          >
          <UTextarea
            v-model="form.observations"
            :placeholder="t('hotels.checkout.observationsPlaceholder')"
            :rows="4"
            class="w-full"
          />
          <span
            class="text-[11px] text-gray-500/80 dark:text-gray-400/80 font-medium tracking-tight mt-1"
          >
            {{ t('hotels.checkout.observationsNote') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
