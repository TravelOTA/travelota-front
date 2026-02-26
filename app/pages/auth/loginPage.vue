<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <UCard class="max-w-md w-full">
      <template #header>
        <h2
          class="text-center text-3xl font-bold text-gray-900 dark:text-white"
        >
          Log in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or
          <NuxtLink
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            create a new account
          </NuxtLink>
        </p>
      </template>

      <UForm :schema="loginSchema" :state="state" @submit="handleLogin">
        <UFormGroup label="Email" name="email" required class="mb-4">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            icon="i-lucide-mail"
            autocomplete="email"
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password" required class="mb-4">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            autocomplete="current-password"
          />
        </UFormGroup>

        <div class="flex items-center justify-between mb-4">
          <UCheckbox v-model="rememberMe" label="Remember me" />

          <NuxtLink
            to="/forgot-password"
            class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Forgot your password?
          </NuxtLink>
        </div>

        <UButton
          type="submit"
          block
          :loading="loading"
          :disabled="loading"
          trailing-icon="i-lucide-log-in"
        >
          Log in
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          By signing in, you agree to our
          <NuxtLink
            to="/terms"
            class="font-medium text-primary-600 hover:text-primary-500"
            >Terms</NuxtLink
          >
          and
          <NuxtLink
            to="/privacy"
            class="font-medium text-primary-600 hover:text-primary-500"
            >Privacy Policy</NuxtLink
          >
        </p>
      </template>
    </UCard>

    <!-- Error alert -->
    <UAlert
      v-if="error"
      :icon="'i-lucide-alert-circle'"
      color="red"
      variant="solid"
      :title="error"
      class="mt-4 fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md"
      @close="error = ''"
    />
  </div>
</template>

<script setup>
// import { z } from "zod";

definePageMeta({
  layout: "default",
});

// Form state
const state = reactive({
  email: "",
  password: "",
});

const rememberMe = ref(false);
const loading = ref(false);
const error = ref("");

// Validation schema
/* const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}); */

const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  // login logic
};
</script>
