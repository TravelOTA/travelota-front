# Role-Based Login Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Transform the static login page into a functional testing component that grants mocked role-based sessions (USER, AGENCY_ADMIN, SUPPORT, SUPER_ADMIN) and dynamically updates the dashboard navigation based on this cookie.

**Architecture:** We will implement an auth composable leveraging Nuxt's `useCookie` to persist the chosen role across page navigations. We will add 4 NuxtUI template buttons to the existing `index.vue` form that instantly log the user in as that role. Finally, the main `dashboard.vue` layout will become reactive to this cookie instead of a hardcoded string.

**Tech Stack:** Vue 3, Nuxt 3 (useCookie, useState, useRouter), NuxtUI, TailwindCSS.

---

### Task 1: Create Auth Composable State

**Files:**
- Create: `app/composables/useAuth.ts`

**Step 1: Write implementation for `useAuth`**

```typescript
// app/composables/useAuth.ts
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
```

**Step 2: Commit**

```bash
git add app/composables/useAuth.ts
git commit -m "feat(auth): create useAuth composable to mock role-based sessions"
```

---

### Task 2: Implement Magic Login Buttons in Index Page

**Files:**
- Modify: `app/pages/index.vue`

**Step 1: Import composable and replace dummy logic**

```vue
<!-- Modify the script setup in app/pages/index.vue -->
<script setup>
import { reactive } from "vue";
import { useAuth } from "~/composables/useAuth";

const { loginAs } = useAuth();
// ... keep existing code
```

**Step 2: Add Magic Buttons below the form**

```vue
<!-- Insert inside the `UCard` right below the <form> closing tag in app/pages/index.vue -->
              </form>

              <div class="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                <p class="text-xs text-center text-gray-500 font-bold uppercase tracking-wider mb-4">
                  Simulador de Roles de Prueba
                </p>
                <div class="grid grid-cols-2 gap-2">
                  <UButton
                    color="gray"
                    variant="soft"
                    size="sm"
                    icon="i-lucide-user"
                    class="justify-center text-xs"
                    @click="loginAs('USER')"
                  >
                    Usuario
                  </UButton>
                  <UButton
                    color="blue"
                    variant="soft"
                    size="sm"
                    icon="i-lucide-building"
                    class="justify-center text-xs"
                    @click="loginAs('AGENCY_ADMIN')"
                  >
                    Admin Agencia
                  </UButton>
                  <UButton
                    color="amber"
                    variant="soft"
                    size="sm"
                    icon="i-lucide-life-buoy"
                    class="justify-center text-xs"
                    @click="loginAs('SUPPORT')"
                  >
                    Soporte
                  </UButton>
                  <UButton
                    color="red"
                    variant="soft"
                    size="sm"
                    icon="i-lucide-shield-alert"
                    class="justify-center text-xs"
                    @click="loginAs('SUPER_ADMIN')"
                  >
                    Super Admin
                  </UButton>
                </div>
              </div>

              <template #footer>
```

**Step 3: Commit**

```bash
git add app/pages/index.vue
git commit -m "feat(auth): add magic login buttons to mock different user roles"
```

---

### Task 3: Make Dashboard Layout Reactive to Auth State

**Files:**
- Modify: `app/layouts/dashboard.vue`

**Step 1: Replace hardcoded ref with auth state and configure logout**

```vue
<!-- In app/layouts/dashboard.vue script section -->
<script setup lang="ts">
import AddToItineraryModal from "~/components/b2b/quoter/AddToItineraryModal.vue";
import { useAuth } from "~/composables/useAuth";

// ... existing code ...

// Replace `const userRole = ref("SUPER_ADMIN");` with:
const { role: userRole, logout } = useAuth();

// ... keep `isInternalRole` and `userLinks` computations exactly as they are ...
```

**Step 2: Wire the Logout button**

```vue
<!-- In app/layouts/dashboard.vue template section, find the logout UButton -->
            <UButton
              icon="i-heroicons-arrow-right-on-rectangle"
              color="error"
              variant="ghost"
              @click="logout"
              class="ml-1"
            />
```

**Step 3: Commit**

```bash
git add app/layouts/dashboard.vue
git commit -m "feat(layout): make dashboard reactive to useAuth role cookie"
```
