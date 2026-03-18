<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <UFooter
    class="pt-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
  >
    <div
      class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm"
    >
      <div>
        <h3
          class="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider"
        >
          {{ t("footer.contactTitle") }}
        </h3>
        <p class="font-semibold text-primary mb-2">{{ t("footer.headOffice").toUpperCase() }}</p>
        <address class="not-italic text-gray-500 dark:text-gray-400 space-y-2">
          <p><strong>TravelOTA</strong></p>
          <p>Calle Falsa 123</p>
          <p>28000 Madrid, España</p>
          <p>Teléfono: +34 912 345 678</p>
          <p>Email: info@travelota.com</p>
        </address>
      </div>

      <div>
        <h3
          class="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider"
        >
          {{ t("footer.scheduleTitle") }}
        </h3>
        <div class="text-gray-500 dark:text-gray-400 space-y-2">
          <p><strong>{{ t("footer.weekdays") }}:</strong><br />09.00 - 22.00 CET</p>
          <p><strong>{{ t("footer.saturday") }}:</strong><br />10.00 - 14.00 CET</p>
        </div>
      </div>

      <div>
        <h3
          class="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider"
        >
          {{ t("footer.followUs") }}
        </h3>
        <div class="flex gap-4">
          <UButton
            icon="i-simple-icons-linkedin"
            color="neutral"
            variant="ghost"
            aria-label="LinkedIn"
          />
          <UButton
            icon="i-simple-icons-x"
            color="neutral"
            variant="ghost"
            aria-label="X (Twitter)"
          />
          <UButton
            icon="i-simple-icons-facebook"
            color="neutral"
            variant="ghost"
            aria-label="Facebook"
          />
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-800 mt-8">
      <div
        class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400"
      >
        <div class="flex flex-col gap-1">
          <p>{{ t("footer.rights", { year: new Date().getFullYear() }) }}</p>
          <div class="flex gap-4">
            <NuxtLink to="/privacy" class="hover:text-primary transition-colors">{{ t("footer.privacyPolicy") }}</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-primary transition-colors">{{ t("footer.termsOfUse") }}</NuxtLink>
          </div>
        </div>
        <div class="flex items-center gap-4 mt-4 md:mt-0 opacity-70">
          <span class="font-bold text-lg">TravelOTA</span>
          <span class="font-bold text-lg">TravelOTA DMC</span>
        </div>
      </div>
    </div>
  </UFooter>
</template>
