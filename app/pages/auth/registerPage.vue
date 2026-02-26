<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <UCard class="max-w-md w-full">
      <template #header>
        <h2
          class="text-center text-3xl font-bold text-gray-900 dark:text-white"
        >
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or
          <NuxtLink
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            log in to existing account
          </NuxtLink>
        </p>
      </template>

      <UForm :schema="registerSchema" :state="state" @submit="handleRegister">
        <UFormGroup label="Full Name" name="fullName" required class="mb-4">
          <UInput
            v-model="state.fullName"
            placeholder="John Doe"
            icon="i-lucide-user"
            autocomplete="name"
          />
        </UFormGroup>

        <UFormGroup label="Email" name="email" required class="mb-4">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            icon="i-lucide-mail"
            autocomplete="email"
          />
        </UFormGroup>

        <UFormGroup label="Phone Number" name="phone" class="mb-4">
          <UInput
            v-model="state.phone"
            type="tel"
            placeholder="+1 234 567 8900"
            icon="i-lucide-phone"
            autocomplete="tel"
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password" required class="mb-4">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            autocomplete="new-password"
          />
        </UFormGroup>

        <UFormGroup
          label="Confirm Password"
          name="confirmPassword"
          required
          class="mb-4"
        >
          <UInput
            v-model="state.confirmPassword"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            autocomplete="new-password"
          />
        </UFormGroup>

        <UCheckbox v-model="acceptTerms" name="terms" class="mb-4">
          <template #label>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              I agree to the
              <NuxtLink
                to="/terms"
                class="font-medium text-primary-600 hover:text-primary-500"
                >Terms and Conditions</NuxtLink
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

        <UButton
          type="submit"
          block
          :loading="loading"
          :disabled="loading || !acceptTerms"
          trailing-icon="i-lucide-user-plus"
        >
          Create Account
        </UButton>
      </UForm>

      <!-- Success message -->
      <UAlert
        v-if="success"
        :icon="'i-lucide-check-circle'"
        color="green"
        variant="solid"
        :title="success"
        class="mt-4"
        @close="success = ''"
      />
    </UCard>
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
