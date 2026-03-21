import { useCookie, useRouter, useRuntimeConfig } from "#imports";
import { computed } from "vue";

export type UserRole = "USER" | "AGENCY_ADMIN" | "SUPPORT" | "SUPER_ADMIN";

interface TokenResponse {
  access: string;
  refresh: string;
}

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

  // Dev-only role simulator (used by test buttons in LoginForm)
  const simulatedRole = useCookie<UserRole | null>("travelota-role", {
    default: () => null,
  });

  const isAuthenticated = computed(() => !!accessToken.value);

  const role = computed<UserRole>(() => simulatedRole.value ?? "USER");

  async function login(email: string, password: string): Promise<void> {
    const data = await $fetch<TokenResponse>(
      `${config.public.apiBaseUrl}/api/auth/token`,
      {
        method: "POST",
        body: { email, password },
      },
    );
    accessToken.value = data.access;
    refreshToken.value = data.refresh;

    // Fetch profile to determine role from is_staff
    const profile = await $fetch<{ is_staff: boolean }>(
      `${config.public.apiBaseUrl}/api/auth/me`,
      { headers: { Authorization: `Bearer ${data.access}` } },
    ).catch(() => null);

    if (profile?.is_staff) {
      simulatedRole.value = "SUPER_ADMIN";
    }

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
    await router.push("/");
  }

  // Dev-only: simulate a role without real credentials
  async function loginAs(targetRole: UserRole): Promise<void> {
    simulatedRole.value = targetRole;
    await router.push("/dashboard");
  }

  return {
    isAuthenticated,
    role,
    accessToken,
    login,
    logout,
    loginAs,
  };
};
