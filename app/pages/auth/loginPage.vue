<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <UCard class="max-w-md w-full">
      <template #header>
        <div class="text-center">
          <h2 class="text-3xl font-bold">Welcome</h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <NuxtLink
              to="/register"
              class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Sign up
            </NuxtLink>
          </p>
        </div>
      </template>

      <div class="space-y-6">
        <UForm
          :schema="loginSchema"
          :state="state"
          class="space-y-5"
          @submit="handleLogin"
        >
          <UFormGroup label="Email" name="email" required>
            <UInput
              v-model="state.email"
              type="email"
              placeholder="you@example.com"
              icon="i-lucide-mail"
              autocomplete="email"
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password" required>
            <UInput
              v-model="state.password"
              type="password"
              placeholder="••••••••"
              icon="i-lucide-lock"
              autocomplete="current-password"
              size="lg"
            />
          </UFormGroup>

          <div class="flex items-center justify-between">
            <UCheckbox v-model="rememberMe" label="Remember me" size="sm" />

            <NuxtLink
              to="/forgot-password"
              class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <div class="pt-2 flex justify-center">
            <UButton
              type="submit"
              :loading="loading"
              :disabled="loading"
              size="lg"
              class="px-8"
              trailing-icon="i-lucide-log-in"
            >
              Log in
            </UButton>
          </div>
        </UForm>
      </div>

      <template #footer>
        <p class="text-center text-xs">
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
      variant="soft"
      :title="error"
      class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md"
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
