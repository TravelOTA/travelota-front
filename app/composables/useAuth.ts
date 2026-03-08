import { useCookie } from "nuxt/app";
import { useRouter } from "vue-router";

export type UserRole = "USER" | "AGENCY_ADMIN" | "SUPPORT" | "SUPER_ADMIN";

export const useAuth = () => {
  // Use a cookie to persist the role across SSR and reloads
  const role = useCookie<UserRole>("travelota-role", {
    default: () => "USER",
    watch: true,
  });

  const router = useRouter();

  const loginAs = async (targetRole: UserRole) => {
    role.value = targetRole;
    await router.push("/dashboard");
  };

  const logout = async () => {
    role.value = "USER";
    await router.push("/");
  };

  return {
    role,
    loginAs,
    logout,
  };
};
