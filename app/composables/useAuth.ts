import { useCookie, useRouter, useRuntimeConfig, useState } from "#imports";
import { computed } from "vue";

export type UserRole = "USER" | "AGENCY_ADMIN" | "SUPPORT" | "SUPER_ADMIN";

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

export const useAuth = () => {
  const config = useRuntimeConfig();
  const router = useRouter();

  const accessToken = useCookie<string | null>("travelota-token", {
    default: () => null,
    secure: true,
    sameSite: "lax",
  });
  const refreshToken = useCookie<string | null>("travelota-refresh", {
    default: () => null,
    secure: true,
    sameSite: "lax",
  });

  // Dev-only role simulator (usado por botones de test en LoginForm)
  const simulatedRole = useCookie<UserRole | null>("travelota-role", {
    default: () => null,
  });

  const currentUser = useState<CurrentUser | null>("auth:currentUser", () => null);

  const isAuthenticated = computed(() => !!accessToken.value);
  const role = computed<UserRole>(() => simulatedRole.value ?? "USER");

  async function loadProfile(): Promise<void> {
    if (!accessToken.value) return;
    const profile = await $fetch<CurrentUser>(
      `${config.public.apiBaseUrl}/api/auth/me`,
      { headers: { Authorization: `Bearer ${accessToken.value}` } },
    ).catch(() => null);
    if (profile) {
      currentUser.value = profile;
      if (profile.is_staff && !simulatedRole.value) {
        simulatedRole.value = "SUPER_ADMIN";
      }
    }
  }

  async function login(email: string, password: string, rememberMe = false): Promise<void> {
    const data = await $fetch<TokenResponse>(
      `${config.public.apiBaseUrl}/api/auth/token`,
      { method: "POST", body: { email, password } },
    );

    const cookieOptions = {
      default: () => null as string | null,
      secure: true,
      sameSite: "lax" as const,
      ...(rememberMe && { maxAge: REMEMBER_ME_MAX_AGE }),
    };

    useCookie<string | null>("travelota-token", cookieOptions).value = data.access;
    useCookie<string | null>("travelota-refresh", cookieOptions).value = data.refresh;

    await loadProfile();
    await router.push("/dashboard");
  }

  async function logout(): Promise<void> {
    if (refreshToken.value) {
      await $fetch(`${config.public.apiBaseUrl}/api/auth/logout`, {
        method: "POST",
        body: { refresh: refreshToken.value },
        headers: accessToken.value
          ? { Authorization: `Bearer ${accessToken.value}` }
          : {},
      }).catch(() => {});
    }
    accessToken.value = null;
    refreshToken.value = null;
    simulatedRole.value = null;
    currentUser.value = null;
    await router.push("/");
  }

  // Dev-only: simular rol sin credenciales reales
  async function loginAs(targetRole: UserRole): Promise<void> {
    simulatedRole.value = targetRole;
    await router.push("/dashboard");
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
