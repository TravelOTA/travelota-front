import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "#imports";
import type { UserRole } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  // Rutas públicas: sin restricción
  if (!to.path.startsWith("/dashboard") && !to.path.startsWith("/print")) {
    return;
  }

  const roleCookie = useCookie<UserRole>("travelota-role");
  const role = roleCookie.value;

  // Sin cookie de rol → no autenticado → redirigir a la landing
  if (!role) {
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

  // Resto del dashboard y /print: cualquier rol autenticado puede acceder
});
