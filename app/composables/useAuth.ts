import { useCookie, useRouter, useRuntimeConfig, useState } from '#imports';
import { computed } from 'vue';

export type UserRole = 'USER' | 'AGENCY_ADMIN' | 'SUPPORT' | 'SUPER_ADMIN';

interface TokenResponse {
  access: string;
  refresh: string;
}

export interface CurrentUser {
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  preferred_language: string;
  is_staff: boolean;
  role: UserRole;
}

const REMEMBER_ME_MAX_AGE = 60 * 60 * 12; // 12 hours

export const useAuth = () => {
  const config = useRuntimeConfig();
  const router = useRouter();

  const accessToken = useCookie<string | null>('travelota-token', {
    default: () => null,
    secure: true,
    sameSite: 'lax',
  });
  const refreshToken = useCookie<string | null>('travelota-refresh', {
    default: () => null,
    secure: true,
    sameSite: 'lax',
  });

  // Persists role across SSR/page reloads without an extra API call.
  // Set by loadProfile() after login.
  const storedRole = useCookie<UserRole | null>('travelota-real-role', {
    default: () => null,
    secure: true,
    sameSite: 'lax',
  });

  const currentUser = useState<CurrentUser | null>(
    'auth:currentUser',
    () => null,
  );

  const isAuthenticated = computed(() => !!accessToken.value);

  const role = computed<UserRole>(() => storedRole.value ?? 'USER');

  async function loadProfile(): Promise<void> {
    if (!accessToken.value) return;
    const profile = await $fetch<CurrentUser>(
      `${config.public.apiBaseUrl}/api/auth/me`,
      { headers: { Authorization: `Bearer ${accessToken.value}` } },
    ).catch(() => null);
    if (profile) {
      currentUser.value = profile;
      storedRole.value = profile.role;
    }
  }

  async function login(
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<void> {
    const data = await $fetch<TokenResponse>(
      `${config.public.apiBaseUrl}/api/auth/token`,
      { method: 'POST', body: { email, password } },
    );

    accessToken.value = data.access;
    refreshToken.value = data.refresh;

    if (rememberMe) {
      const opts = {
        default: () => null as string | null,
        secure: true,
        sameSite: 'lax' as const,
        maxAge: REMEMBER_ME_MAX_AGE,
      };
      useCookie<string | null>('travelota-token', opts).value = data.access;
      useCookie<string | null>('travelota-refresh', opts).value = data.refresh;
    }

    await loadProfile();
    await router.push('/dashboard');
  }

  async function logout(): Promise<void> {
    if (refreshToken.value) {
      await $fetch(`${config.public.apiBaseUrl}/api/auth/logout`, {
        method: 'POST',
        body: { refresh: refreshToken.value },
        headers: accessToken.value
          ? { Authorization: `Bearer ${accessToken.value}` }
          : {},
      }).catch(() => {});
    }
    accessToken.value = null;
    refreshToken.value = null;
    storedRole.value = null;
    currentUser.value = null;
    await router.push('/');
  }

  return {
    isAuthenticated,
    role,
    accessToken,
    currentUser,
    loadProfile,
    login,
    logout,
  };
};
