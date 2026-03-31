export const SUPPORTED_LOCALES = ['es', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const useAppLocale = () => {
  const { locale, setLocale } = useI18n();
  const { isAuthenticated, currentUser } = useAuth();
  const { updateProfile } = useProfile();

  const switchLocale = async (lang: SupportedLocale) => {
    await setLocale(lang);
    if (isAuthenticated.value) {
      await updateProfile({ preferred_language: lang }).catch(() => {});
      if (currentUser.value) {
        currentUser.value.preferred_language = lang;
      }
    }
  };

  return { locale, switchLocale };
};
