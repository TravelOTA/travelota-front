<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <UCard class="max-w-md w-full">
      <template #header>
        <div class="text-center">
          <h2 class="text-3xl font-bold">Create an account</h2>
          <p class="mt-2 text-sm">
            Already have an account?
            <NuxtLink
              to="/login"
              class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Log in
            </NuxtLink>
          </p>
        </div>
      </template>

      <div class="space-y-6">
        <UForm
          :schema="registerSchema"
          :state="state"
          class="space-y-4"
          @submit="handleRegister"
        >
          <UFormGroup label="Full Name" name="fullName" required>
            <UInput
              v-model="state.fullName"
              placeholder="John Doe"
              icon="i-lucide-user"
              autocomplete="name"
              size="lg"
            />
          </UFormGroup>

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

          <UFormGroup label="Phone Number" name="phone">
            <UInput
              v-model="state.phone"
              type="tel"
              placeholder="+1 234 567 8900"
              icon="i-lucide-phone"
              autocomplete="tel"
              size="lg"
            />
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Password" name="password" required>
              <UInput
                v-model="state.password"
                type="password"
                placeholder="••••••••"
                icon="i-lucide-lock"
                autocomplete="new-password"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup
              label="Confirm Password"
              name="confirmPassword"
              required
            >
              <UInput
                v-model="state.confirmPassword"
                type="password"
                placeholder="••••••••"
                icon="i-lucide-lock"
                autocomplete="new-password"
                size="lg"
              />
            </UFormGroup>
          </div>

          <UCheckbox v-model="acceptTerms" name="terms" size="sm" class="pt-2">
            <template #label>
              <span class="text-sm">
                I agree to the
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
              </span>
            </template>
          </UCheckbox>

          <div class="pt-4 flex justify-center">
            <UButton
              type="submit"
              :loading="loading"
              :disabled="loading || !acceptTerms"
              size="lg"
              class="px-8"
              trailing-icon="i-lucide-user-plus"
            >
              Create account
            </UButton>
          </div>
        </UForm>
      </div>
    </UCard>

    <!-- Success message -->
    <UAlert
      v-if="success"
      :icon="'i-lucide-check-circle'"
      color="green"
      variant="soft"
      :title="success"
      class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md"
      @close="success = ''"
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
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const acceptTerms = ref(false);
const loading = ref(false);
const success = ref("");

// Validation schema
/* const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }); */

const handleRegister = async () => {
  loading.value = true;
  success.value = "";

  // register logic
};
</script>
