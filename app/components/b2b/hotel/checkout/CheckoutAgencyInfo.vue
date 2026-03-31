<script setup lang="ts">
import { ref } from 'vue';

const { t } = useI18n();

const agencyName = ref('ONE CLICK ADVENTURES INC');
const email = ref('sales@oneclickadventures.com');
const reference = ref('');
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm flex flex-col gap-5"
  >
    <h3 class="font-bold text-gray-900 dark:text-white text-lg">
      {{ t('hotels.checkout.agencyData') }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UFormField :label="t('hotels.checkout.agencyName')">
        <UInput
          v-model="agencyName"
          disabled
          class="opacity-70 bg-gray-100 dark:bg-gray-800 pointer-events-none"
        />
      </UFormField>

      <UFormField :label="t('hotels.checkout.email')" required>
        <UInput v-model="email" />
      </UFormField>

      <UFormField :label="t('hotels.checkout.agencyReferenceLabel')" required>
        <UInput
          v-model="reference"
          :placeholder="t('hotels.checkout.referencePlaceholder')"
        />
      </UFormField>
    </div>
  </div>
</template>
