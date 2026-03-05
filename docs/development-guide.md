# 🛠️ Guía de Desarrollo

## Requisitos Previos

- **Node.js** >= 20.x
- **pnpm** 10.29+ (gestor de paquetes)

---

## Setup Inicial

```bash
# Clonar el repositorio
git clone <repo-url>
cd travelota-front

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El servidor se levanta en `http://localhost:3000` (o el siguiente puerto disponible).

---

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | Build de producción |
| `pnpm preview` | Preview del build de producción |
| `pnpm lint` | Ejecutar ESLint |
| `pnpm lint:fix` | Corregir errores de lint automáticamente |
| `pnpm format` | Verificar formato con Prettier |
| `pnpm format:fix` | Corregir formato automáticamente |
| `pnpm typecheck` | Verificar tipos TypeScript |

También existe un script `scripts/start.sh` que automatiza la instalación y el arranque del proyecto.

---

## Convenciones de Código

### Nombres de Archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Páginas | `kebab-case.vue` | `checkout.vue`, `results.vue` |
| Páginas dinámicas | `[param].vue` | `[id].vue` |
| Componentes | `PascalCase.vue` | `BookingStatusHero.vue` |
| Layouts | `kebab-case.vue` | `dashboard.vue` |

### Prefijos de Componentes

| Prefijo | Uso |
|---------|-----|
| `Checkout*` | Componentes del proceso de checkout |
| `Booking*` | Componentes de gestión de reservas |
| `Hotel*` | Componentes de detalle de hotel |
| `Result*` | Componentes de resultados de búsqueda |

### Estructura de un Componente Vue

```vue
<script setup lang="ts">
// 1. Imports
// 2. Props y Emits
// 3. Estado reactivo (ref, reactive)
// 4. Computados (computed)
// 5. Funciones/Handlers
</script>

<template>
  <!-- Markup con Nuxt UI + Tailwind CSS -->
</template>
```

---

## Flujo de Desarrollo

### Agregar una nueva página

1. Crear el archivo `.vue` dentro de `app/pages/` — Nuxt genera la ruta automáticamente
2. Asignar el layout correspondiente:
   ```ts
   definePageMeta({ layout: "dashboard" }); // o "default"
   ```
3. Crear componentes necesarios en `app/components/b2b/hotel/`

### Agregar un nuevo componente reutilizable

1. Crearlo en `app/components/b2b/hotel/checkout/` (o la subcarpeta apropiada)
2. Usar `defineProps` y `defineEmits` con tipos TypeScript
3. Documentar las props con JSDoc si son complejas
4. Importar explícitamente donde se use (auto-import de Nuxt también es opción)

### Integrar con API real (futuro)

1. Crear composable en `app/composables/` (ej: `useBookings.ts`)
2. Reemplazar datos mock en la página/componente por el composable
3. El composable debe exponer: `data`, `loading`, `error`, y funciones de mutación
4. Patrón recomendado: `useFetch` o `useAsyncData` de Nuxt

---

## Calidad de Código

### Pre-commit Hooks (Husky)

El proyecto tiene configurado Husky con lint-staged. Al hacer `git commit`:

1. **ESLint** verifica y corrige archivos `.js`, `.ts`, `.vue`
2. **Prettier** formatea los archivos automáticamente

### Control de tipos

```bash
pnpm typecheck
```

Ejecuta `nuxt typecheck` para verificar tipos TypeScript en todo el proyecto.

---

## Dependencias Clave

| Paquete | Versión | Uso |
|---------|---------|-----|
| `nuxt` | 4.3.1 | Framework principal |
| `@nuxt/ui` | 4.4.0 | Biblioteca de componentes UI |
| `tailwindcss` | 4.1.18 | Framework CSS utilitario |
| `leaflet` | 1.9.4 | Mapas interactivos |
| `@vue-leaflet/vue-leaflet` | 0.10.1 | Wrapper Vue para Leaflet |
| `@vuepic/vue-datepicker` | 12.1.0 | Selector de fechas |
| `@iconify-json/lucide` | 1.2.90 | Set de iconos Lucide |
| `@iconify-json/simple-icons` | 1.2.70 | Iconos de marcas |
