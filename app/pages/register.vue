<script setup lang="ts">
const showConfirmation = ref(false);

function onRegistrationSuccess() {
  showConfirmation.value = true;
}

function onConfirm() {
  showConfirmation.value = false;
  navigateTo("/");
}
</script>

<template>
  <div
    class="min-h-[85vh] bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 flex justify-center mt-8"
  >
    <div class="max-w-4xl w-full">
      <!-- Título de sección -->
      <div class="mb-8 flex items-center gap-3">
        <div class="w-1 h-8 bg-primary-500 rounded-sm"></div>
        <h2
          class="text-[26px] font-normal text-slate-500 dark:text-gray-300 tracking-normal uppercase"
        >
          Datos Empresa
        </h2>
      </div>

      <AuthRegisterForm @success="onRegistrationSuccess" />
    </div>
  </div>

  <UModal v-model:open="showConfirmation" :dismissible="false">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-check-circle"
          class="w-5 h-5 text-success-500"
        />
        <h3 class="font-semibold text-gray-900 dark:text-white">
          Solicitud recibida
        </h3>
      </div>
    </template>
    <template #body>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Su solicitud está en revisión, le contactaremos mediante el email
        proporcionado.
      </p>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <UButton color="primary" label="Entendido" @click="onConfirm" />
      </div>
    </template>
  </UModal>
</template>
