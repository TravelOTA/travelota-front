import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "#imports";
import type { UserRole } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  // Rutas públicas: sin restricción
  if (!to.path.startsWith("/dashboard") && !to.path.startsWith("/print")) {
    return;
  }

  const accessToken = useCookie<string | null>("travelota-token");
  const realRole = useCookie<UserRole | null>("travelota-real-role");
  const simulatedRole = useCookie<UserRole | null>("travelota-role");

  // Autenticado si hay token JWT real o rol simulado (dev)
  const isAuthenticated = !!accessToken.value || !!simulatedRole.value;

  // simulatedRole tiene prioridad en dev; en prod siempre será null
  const role: UserRole | null = simulatedRole.value ?? realRole.value ?? null;

  if (!isAuthenticated) {
    return navigateTo("/");
  }

  // Rutas de admin: solo SUPER_ADMIN y SUPPORT
  if (to.path.startsWith("/dashboard/admin")) {
    if (role !== "SUPER_ADMIN" && role !== "SUPPORT") {
      return navigateTo("/dashboard");
    }
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
