import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "#imports";
import type { UserRole } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  // Rutas públicas: sin restricción
  if (!to.path.startsWith("/dashboard") && !to.path.startsWith("/print")) {
    return;
  }

  const accessToken = useCookie<string | null>("travelota-token");
  const roleCookie = useCookie<UserRole | null>("travelota-role");

  const isAuthenticated = !!accessToken.value || !!roleCookie.value;
  const role = roleCookie.value;

  // Sin token ni rol → no autenticado → redirigir a la landing
  if (!isAuthenticated) {
    return navigateTo("/");
  }

  // Rutas de admin: solo SUPER_ADMIN y SUPPORT
  if (to.path.startsWith("/dashboard/admin")) {
    if (role !== "SUPER_ADMIN" && role !== "SUPPORT") {
      return navigateTo("/dashboard");
    }
    // SUPPORT tiene acceso restringido dentro de admin
    if (role === "SUPPORT") {
      const allowedForSupport = [
        "/dashboard/admin/bookings",
        "/dashboard/admin/templates",
      ];
      const isAllowed = allowedForSupport.some((allowed) =>
        to.path.startsWith(allowed),
      );
      if (!isAllowed) {
        return navigateTo("/dashboard/admin/bookings");
      }
    }
    return;
  }

  // Rutas de agencia: solo AGENCY_ADMIN
  if (to.path.startsWith("/dashboard/agency")) {
    if (role !== "AGENCY_ADMIN") {
      return navigateTo("/dashboard");
    }
    return;
  }

  // Resto del dashboard y /print: cualquier usuario autenticado puede acceder
});
