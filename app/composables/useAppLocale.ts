const SUPPORTED_LOCALES = ["es", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const useAppLocale = () => {
  const { locale, setLocale } = useI18n();

  const switchLocale = async (lang: SupportedLocale) => {
    await setLocale(lang);
    // TODO: persistir en UserAccount.preferred_language via API (spec: auth-integration)
  };

  return { locale, switchLocale };
};
