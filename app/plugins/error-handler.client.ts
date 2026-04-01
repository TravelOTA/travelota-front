export default defineNuxtPlugin((nuxtApp) => {
  const translate = nuxtApp.$i18n.t;
  const toast = useToast();
  const auth = useAuth();

  const handleResponseError: Parameters<
    typeof $fetch.create
  >[0]['onResponseError'] = async ({ response, request }) => {
    const status = response.status;
    const url = typeof request === 'string' ? request : request.toString();

    if (status === 401) {
      // Credentials error on login — let LoginForm handle it locally
      if (url.includes('/api/auth/login')) return;

      toast.add({
        title: translate('errors.unauthorized'),
        color: 'warning',
        icon: 'i-heroicons-exclamation-triangle',
      });
      await auth.logout();
      await navigateTo('/');
      return;
    }

    if (status === 403) {
      toast.add({
        title: translate('errors.forbidden'),
        color: 'warning',
        icon: 'i-heroicons-lock-closed',
      });
      return;
    }

    if (status === 422) {
      toast.add({
        title: translate('errors.unprocessable'),
        color: 'warning',
        icon: 'i-heroicons-exclamation-circle',
      });
      // Rethrow so components can access validation payload if needed
      return;
    }

    if (status >= 500) {
      toast.add({
        title: translate('errors.serverError'),
        color: 'error',
        icon: 'i-heroicons-server',
      });
      return;
    }
  };

  globalThis.$fetch = $fetch.create({
    onResponseError: handleResponseError,
  });
});
