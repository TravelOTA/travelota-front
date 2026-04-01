import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#imports';
import type { UserRole } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/dashboard') && !to.path.startsWith('/print')) {
    return;
  }

  const accessToken = useCookie<string | null>('travelota-token');
  const storedRole = useCookie<UserRole | null>('travelota-real-role');

  const isAuthenticated = !!accessToken.value;
  const role: UserRole | null = storedRole.value ?? null;

  if (!isAuthenticated) {
    return navigateTo('/');
  }

  if (to.path.startsWith('/dashboard/admin')) {
    if (role !== 'SUPER_ADMIN' && role !== 'SUPPORT') {
      return navigateTo('/dashboard');
    }
    if (role === 'SUPPORT') {
      const allowedForSupport = [
        '/dashboard/admin/bookings',
        '/dashboard/admin/templates',
      ];
      const isAllowed = allowedForSupport.some((allowed) =>
        to.path.startsWith(allowed),
      );
      if (!isAllowed) {
        return navigateTo('/dashboard/admin/bookings');
      }
    }
    return;
  }

  if (to.path.startsWith('/dashboard/agency')) {
    if (role !== 'AGENCY_ADMIN') {
      return navigateTo('/dashboard');
    }
    return;
  }
});
