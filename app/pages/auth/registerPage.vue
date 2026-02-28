<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold sm:text-4xl">
          Register your agency
        </h1>
        <p class="mt-2 text-lg">
          Create an account to start managing hotel reservations
        </p>
        <p class="text-sm">
          Already have an account?
          <NuxtLink
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            Log in
          </NuxtLink>
        </p>
      </div>

      <!-- Registration Form -->
      <UCard>
        <UForm :schema="registerSchema" :state="state" @submit="handleRegister">
          <!-- Agency Data Section -->
          <div class="mb-8">
            <div
              class="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
            >
              <UIcon
                name="i-lucide-building-2"
                class="w-6 h-6 text-primary-500"
              />
              <h2 class="text-xl font-semibold">Agency Data</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <UFormField
                label="Commercial name"
                name="agencyCommercialName"
                required
              >
                <UInput
                  v-model="state.agencyCommercialName"
                  placeholder="e.g., SunFun Travels"
                  icon="i-lucide-store"
                  size="lg"
                />
              </UFormField>

              <UFormField
                label="Social reason"
                name="agencySocialReason"
                required
              >
                <UInput
                  v-model="state.agencySocialReason"
                  placeholder="e.g., SunFun Travels S.L."
                  icon="i-lucide-file-text"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Fiscal code" name="agencyFiscalCode" required>
                <UInput
                  v-model="state.agencyFiscalCode"
                  placeholder="e.g., B-12345678"
                  icon="i-lucide-hash"
                  size="lg"
                />
              </UFormField>

              <UFormField
                label="Address"
                name="agencyAddress"
                required
                class="lg:col-span-2"
              >
                <UInput
                  v-model="state.agencyAddress"
                  placeholder="Street, number, floor, door"
                  icon="i-lucide-map-pin"
                  size="lg"
                />
              </UFormField>

              <UFormField label="City" name="agencyCity" required>
                <UInput
                  v-model="state.agencyCity"
                  placeholder="e.g., Madrid"
                  icon="i-lucide-building"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Province/State" name="agencyProvince" required>
                <UInput
                  v-model="state.agencyProvince"
                  placeholder="e.g., Madrid"
                  icon="i-lucide-map"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Country" name="agencyCountry" required>
                <USelectMenu
                  v-model="state.agencyCountry"
                  :options="countries"
                  option-attribute="name"
                  value-attribute="code"
                  placeholder="Select country"
                  searchable
                  icon="i-lucide-globe-2"
                  size="lg"
                />
              </UFormField>
              <UFormField label="Postal code" name="agencyPostalCode" required>
                <UInput
                  v-model="state.agencyPostalCode"
                  placeholder="e.g., 28001"
                  icon="i-lucide-mail"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Telephone" name="agencyTelephone" required>
                <UInput
                  v-model="state.agencyTelephone"
                  placeholder="e.g., +34 912 345 678"
                  icon="i-lucide-phone"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Mobile phone" name="agencyMobile" optional>
                <UInput
                  v-model="state.agencyMobile"
                  placeholder="e.g., +34 612 345 678"
                  icon="i-lucide-smartphone"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Fax" name="agencyFax" optional>
                <UInput
                  v-model="state.agencyFax"
                  placeholder="e.g., +34 912 345 679"
                  icon="i-lucide-printer"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Email" name="agencyEmail" required>
                <UInput
                  v-model="state.agencyEmail"
                  type="email"
                  placeholder="agency@example.com"
                  icon="i-lucide-mail"
                  size="lg"
                />
              </UFormField>

              <UFormField
                label="Person to contact"
                name="agencyContact"
                required
              >
                <UInput
                  v-model="state.agencyContact"
                  placeholder="e.g., Maria González"
                  icon="i-lucide-user"
                  size="lg"
                />
              </UFormField>
            </div>
          </div>

          <!-- Fiscal Data Section -->
          <div class="mb-8">
            <div
              class="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-receipt"
                  class="w-6 h-6 text-primary-500"
                />
                <h2 class="text-xl font-semibold">Fiscal Data</h2>
              </div>

              <!-- Copy from Agency button -->
              <UButton
                color="primary"
                variant="soft"
                size="sm"
                :disabled="!canCopyToFiscal"
                @click="copyAgencyToFiscal"
              >
                <template #leading>
                  <UIcon name="i-lucide-copy" class="w-4 h-4" />
                </template>
                Copy from agency data
              </UButton>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <UFormField
                label="Address"
                name="fiscalAddress"
                class="lg:col-span-2"
              >
                <UInput
                  v-model="state.fiscalAddress"
                  placeholder="Street, number, floor, door"
                  icon="i-lucide-map-pin"
                  size="lg"
                />
              </UFormField>

              <UFormField label="City" name="fiscalCity">
                <UInput
                  v-model="state.fiscalCity"
                  placeholder="e.g., Madrid"
                  icon="i-lucide-building"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Province/State" name="fiscalProvince">
                <UInput
                  v-model="state.fiscalProvince"
                  placeholder="e.g., Madrid"
                  icon="i-lucide-map"
                  size="lg"
                />
              </UFormField>
              <UFormField label="Country" name="fiscalCountry">
                <USelectMenu
                  v-model="state.fiscalCountry"
                  :options="countries"
                  option-attribute="name"
                  value-attribute="code"
                  placeholder="Select country"
                  searchable
                  icon="i-lucide-globe-2"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Postal code" name="fiscalPostalCode">
                <UInput
                  v-model="state.fiscalPostalCode"
                  placeholder="e.g., 28001"
                  icon="i-lucide-mail"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Telephone" name="fiscalTelephone">
                <UInput
                  v-model="state.fiscalTelephone"
                  placeholder="e.g., +34 912 345 678"
                  icon="i-lucide-phone"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Mobile phone" name="fiscalMobile" optional>
                <UInput
                  v-model="state.fiscalMobile"
                  placeholder="e.g., +34 612 345 678"
                  icon="i-lucide-smartphone"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Fax" name="fiscalFax" optional>
                <UInput
                  v-model="state.fiscalFax"
                  placeholder="e.g., +34 912 345 679"
                  icon="i-lucide-printer"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Email" name="fiscalEmail">
                <UInput
                  v-model="state.fiscalEmail"
                  type="email"
                  placeholder="fiscal@example.com"
                  icon="i-lucide-mail"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Person to contact" name="fiscalContact">
                <UInput
                  v-model="state.fiscalContact"
                  placeholder="e.g., Juan Pérez"
                  icon="i-lucide-user"
                  size="lg"
                />
              </UFormField>
            </div>
          </div>

          <!-- Terms and submit -->
          <div class="space-y-4">
            <UCheckbox v-model="acceptTerms" name="terms" size="sm">
              <template #label>
                <span class="text-sm">
                  I confirm that all information provided is accurate and I
                  agree to the
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

            <div class="flex justify-center pt-4">
              <UButton
                type="submit"
                size="lg"
                class="px-10"
                :loading="loading"
                :disabled="loading || !acceptTerms || !isAgencyValid"
                trailing-icon="i-lucide-user-plus"
              >
                Register agency
              </UButton>
            </div>
          </div>
        </UForm>
      </UCard>

      <!-- Success message -->
      <UAlert
        v-if="success"
        :icon="'i-lucide-check-circle-2'"
        color="green"
        variant="soft"
        :title="success"
        class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md"
        @close="success = ''"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
// import { z } from "zod";

definePageMeta({
  layout: "default",
});

// Form state
const state = reactive({
  // Agency Data
  agencyCommercialName: "",
  agencySocialReason: "",
  agencyFiscalCode: "",
  agencyAddress: "",
  agencyCity: "",
  agencyProvince: "",
  agencyCountry: "",
  agencyPostalCode: "",
  agencyTelephone: "",
  agencyMobile: "",
  agencyFax: "",
  agencyEmail: "",
  agencyContact: "",

  // Fiscal Data
  fiscalAddress: "",
  fiscalCity: "",
  fiscalProvince: "",
  fiscalCountry: "",
  fiscalPostalCode: "",
  fiscalTelephone: "",
  fiscalMobile: "",
  fiscalFax: "",
  fiscalEmail: "",
  fiscalContact: "",
});

const acceptTerms = ref(false);
const loading = ref(false);
const success = ref("");

// Validation schema
/* const registerSchema = z.object({
  // Agency Data - required
  agencyCommercialName: z.string().min(2, "Commercial name is required"),
  agencySocialReason: z.string().min(2, "Social reason is required"),
  agencyFiscalCode: z.string().min(3, "Fiscal code is required"),
  agencyAddress: z.string().min(5, "Address is required"),
  agencyCity: z.string().min(2, "City is required"),
  agencyProvince: z.string().min(2, "Province/State is required"),
  agencyCountry: z.string().min(2, "Country is required"),
  agencyPostalCode: z.string().min(3, "Postal code is required"),
  agencyTelephone: z.string().min(5, "Telephone is required"),
  agencyEmail: z.string().email("Valid email is required"),
  agencyContact: z.string().min(2, "Contact person is required"),

  // Agency Data - optional
  agencyMobile: z.string().optional(),
  agencyFax: z.string().optional(),

  // Fiscal Data - all optional
  fiscalAddress: z.string().optional(),
  fiscalCity: z.string().optional(),
  fiscalProvince: z.string().optional(),
  fiscalCountry: z.string().optional(),
  fiscalPostalCode: z.string().optional(),
  fiscalTelephone: z.string().optional(),
  fiscalMobile: z.string().optional(),
  fiscalFax: z.string().optional(),
  fiscalEmail: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  fiscalContact: z.string().optional(),
}); */

// Check if agency data is valid (at least the required fields)
const isAgencyValid = computed(() => {
  return (
    state.agencyCommercialName &&
    state.agencySocialReason &&
    state.agencyFiscalCode &&
    state.agencyAddress &&
    state.agencyCity &&
    state.agencyProvince &&
    state.agencyCountry &&
    state.agencyPostalCode &&
    state.agencyTelephone &&
    state.agencyEmail &&
    state.agencyContact
  );
});

// Check if we can copy from agency to fiscal
const canCopyToFiscal = computed(() => {
  return (
    state.agencyAddress ||
    state.agencyCity ||
    state.agencyProvince ||
    state.agencyCountry ||
    state.agencyPostalCode ||
    state.agencyTelephone ||
    state.agencyMobile ||
    state.agencyFax ||
    state.agencyEmail ||
    state.agencyContact
  );
});

// Copy agency data to fiscal data
const copyAgencyToFiscal = () => {
  state.fiscalAddress = state.agencyAddress;
  state.fiscalCity = state.agencyCity;
  state.fiscalProvince = state.agencyProvince;
  state.fiscalCountry = state.agencyCountry;
  state.fiscalPostalCode = state.agencyPostalCode;
  state.fiscalTelephone = state.agencyTelephone;
  state.fiscalMobile = state.agencyMobile;
  state.fiscalFax = state.agencyFax;
  state.fiscalEmail = state.agencyEmail;
  state.fiscalContact = state.agencyContact;
};

// Countries list (same as before)
const countries = ref(
  [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "ES", name: "Spain" },
    { code: "FR", name: "France" },
    { code: "IT", name: "Italy" },
    { code: "DE", name: "Germany" },
    { code: "PT", name: "Portugal" },
    // ... add more countries as needed
  ].sort((a, b) => a.name.localeCompare(b.name)),
);
// Handle registration
const handleRegister = async () => {
  loading.value = true;
  success.value = "";

  // register logic
};
</script>
