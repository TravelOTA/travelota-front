// https://nuxt.com/docs/api/configuration/nuxt-config
// Hot-reload test comment
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxtjs/i18n"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      // Override with NUXT_PUBLIC_API_BASE_URL env var in production
      apiBaseUrl: "",
    },
  },

  routeRules: {
    "/": { prerender: true },
  },

  i18n: {
    strategy: "no_prefix",
    defaultLocale: "es",
    locales: [
      {
        code: "es",
        name: "Español",
        files: [
          "es/common.json",
          "es/auth.json",
          "es/hotels.json",
          "es/quoter.json",
          "es/itinerary.json",
          "es/agency.json",
          "es/admin.json",
          "es/validation.json",
          "es/errors.json",
          "es/templates.json",
          "es/cart.json",
        ],
      },
      {
        code: "en",
        name: "English",
        files: [
          "en/common.json",
          "en/auth.json",
          "en/hotels.json",
          "en/quoter.json",
          "en/itinerary.json",
          "en/agency.json",
          "en/admin.json",
          "en/validation.json",
          "en/errors.json",
          "en/templates.json",
          "en/cart.json",
        ],
      },
    ],
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "travelota_locale",
      fallbackLocale: "es",
      alwaysRedirect: false,
    },
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
