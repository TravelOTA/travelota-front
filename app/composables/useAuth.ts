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
}

const REMEMBER_ME_MAX_AGE = 60 * 60 * 12; // 12 horas

function roleFromProfile(profile: CurrentUser): UserRole {
  // Cuando el backend exponga un campo `role` explícito, usarlo aquí.
  // Por ahora: is_staff=true → SUPER_ADMIN, resto → USER.
  return profile.is_staff ? 'SUPER_ADMIN' : 'USER';
}

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

  // Rol derivado de JWT real — se setea en loadProfile(), se limpia en logout()
  const realRole = useCookie<UserRole | null>('travelota-real-role', {
    default: () => null,
    secure: true,
    sameSite: 'lax',
  });

  // Dev-only: simulador de roles (botones de test en LoginForm)
  const simulatedRole = useCookie<UserRole | null>('travelota-role', {
    default: () => null,
  });

  const currentUser = useState<CurrentUser | null>(
    'auth:currentUser',
    () => null,
  );

  const isAuthenticated = computed(() => !!accessToken.value);

  // simulatedRole tiene prioridad solo en dev; en prod siempre será null
  const role = computed<UserRole>(
    () => simulatedRole.value ?? realRole.value ?? 'USER',
  );

  async function loadProfile(): Promise<void> {
    if (!accessToken.value) return;
    const profile = await $fetch<CurrentUser>(
      `${config.public.apiBaseUrl}/api/auth/me`,
      { headers: { Authorization: `Bearer ${accessToken.value}` } },
    ).catch(() => null);
    if (profile) {
      currentUser.value = profile;
      realRole.value = roleFromProfile(profile);
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

    // Setear en la ref original garantiza que loadProfile() lee el valor correcto
    accessToken.value = data.access;
    refreshToken.value = data.refresh;

    // Si rememberMe, re-setear con maxAge para persistir la cookie más allá de la sesión
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
    realRole.value = null;
    simulatedRole.value = null;
    currentUser.value = null;
    await router.push('/');
  }

  // Dev-only: simular rol sin credenciales reales
  async function loginAs(targetRole: UserRole): Promise<void> {
    simulatedRole.value = targetRole;
    await router.push('/dashboard');
  }

  return {
    isAuthenticated,
    role,
    accessToken,
    currentUser,
    loadProfile,
    login,
    logout,
    loginAs,
  };
};
