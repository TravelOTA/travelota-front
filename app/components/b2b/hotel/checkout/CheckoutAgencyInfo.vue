<script setup lang="ts">
const agencyName = ref("ONE CLICK ADVENTURES INC");
const email = ref("sales@oneclickadventures.com");
const reference = ref("");
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm flex flex-col gap-5"
  >
    <h3 class="font-bold text-gray-900 dark:text-white text-lg">
      Datos de la agencia
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UFormGroup label="Nombre">
        <UInput
          v-model="agencyName"
          disabled
          class="opacity-70 bg-gray-100 dark:bg-gray-800 pointer-events-none"
        />
      </UFormGroup>

      <UFormGroup label="Email *" required>
        <UInput v-model="email" />
      </UFormGroup>

      <UFormGroup label="Ref. agencia*" required>
        <UInput v-model="reference" placeholder="Referencia agencia..." />
      </UFormGroup>
    </div>
  </div>
</template>
