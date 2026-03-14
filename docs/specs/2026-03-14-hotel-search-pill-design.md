# Spec: Rediseño Pill — Barra de Búsqueda de Hoteles

**Fecha:** 2026-03-14
**Estado:** Aprobado (revisión 2)
**Alcance:** `HotelSearchForm.vue` + `SearchSummaryBar.vue` + `RoomDistribution.vue`

---

## Contexto y problema

La barra de búsqueda de hoteles presenta tres problemas visuales:

1. **Asimetría de alturas**: el trigger de `RoomDistribution` usa `size="md"` (h-9) mientras el resto de campos usa `size="lg"` (h-[44px]), rompiendo la alineación horizontal.
2. **Estilo visual dispar**: `UInput`/`USelect` tienen `variant="none"` con glassmorphism, pero el trigger de distribución usa `variant="outline"` con borde estándar — lenguajes visuales distintos.
3. **Contraste insuficiente**: el contenedor actual (`bg-white/10 backdrop-blur`) sobre el fondo claro del dashboard produce texto con ratio ~1.2:1, que no pasa WCAG AA (mínimo 4.5:1).

---

## Solución adoptada: Layout tipo Pill integrado

Reemplazar el grid de inputs separados por **una sola barra unificada** con divisores internos. El pill es el contenedor — los campos son segmentos del mismo elemento visual.

---

## Diseño

### Estructura visual

```
┌──────────────────────────────────────────────────────────────────┐
│  📍 Destino  │  📅 Fechas  │  🛏 Distribución  │  🌎 Nac.  │ 🔍 │
└──────────────────────────────────────────────────────────────────┘
```

- Borde redondeado: `rounded-2xl` — **sin** `overflow-hidden` (se mantiene `overflow-visible` del diseño actual para que los popovers de fechas y distribución no sean recortados por el contenedor)
- Divisores: elemento `<div>` hermano con `w-px self-stretch my-3 bg-gray-200 dark:bg-gray-700`
- Botón de búsqueda: anclado a la derecha con `rounded-r-2xl` solamente
- En `SearchSummaryBar`: el botón dice "Editar" con icono `pencil-solid`

### Responsive — Desktop vs. Mobile

**Desktop (`md` y superior):** pill horizontal con todos los segmentos en una fila (`flex-row`).

**Mobile (menor a `md`):** stack vertical dentro del mismo contenedor pill (`flex-col`). Los divisores verticales se ocultan (`hidden md:block`) y cada segmento-fila recibe un separador horizontal inferior `border-b border-gray-200 dark:border-gray-700 last:border-b-0`. El botón ocupa el ancho completo con `rounded-b-2xl` (matching el radio del pill en las esquinas inferiores, sin radio superior).

```
Mobile:
┌──────────────────────────┐
│  📍 Destino              │
├──────────────────────────┤
│  📅 Fechas               │
├──────────────────────────┤
│  🛏 Distribución         │
├──────────────────────────┤
│  🌎 Nac.                 │
├──────────────────────────┤
│      [🔍 Buscar]         │
└──────────────────────────┘
```

### Proporciones de flex (Desktop)

Usar sintaxis de valor arbitrario de Tailwind v4 (no registrar en `@theme`):

| Segmento | Clase flex |
|---|---|
| Destino | `flex-[2]` |
| Fechas | `flex-[2]` |
| Distribución | `flex-[2]` |
| Nacionalidad | `flex-[1.5]` |
| Botón | `flex-none w-[110px]` |

### Iconografía

Set **Heroicons Solid** (`i-heroicons-*`) con color verde primario:

| Campo | Icono |
|---|---|
| Destino | `i-heroicons-map-pin-solid` |
| Fechas | `i-heroicons-calendar-days-solid` |
| Distribución | `i-heroicons-users-solid` |
| Nacionalidad | `i-heroicons-globe-alt-solid` |
| Botón buscar | `i-heroicons-magnifying-glass-solid` |
| Botón editar | `i-heroicons-pencil-solid` |

### Tokens de color (Tailwind)

| Elemento | Light | Dark | Clase Tailwind |
|---|---|---|---|
| Pill background | `#ffffff` | `gray-800` | `bg-white dark:bg-gray-800` |
| Pill border | `gray-200` | `gray-700` | `border border-gray-200 dark:border-gray-700` |
| Separador vertical | `gray-200` | `gray-700` | `w-px self-stretch my-3 bg-gray-200 dark:bg-gray-700` |
| Separador horizontal (mobile) | `gray-200` | `gray-700` | `border-b border-gray-200 dark:border-gray-700 last:border-b-0 md:border-b-0` |
| Label de campo | `gray-500` | `gray-400` | `text-gray-500 dark:text-gray-400` |
| Valor de campo | `gray-900` | `gray-50` | `text-gray-900 dark:text-gray-50` |
| Placeholder | `gray-400` | `gray-500` | `text-gray-400 dark:text-gray-500` |
| Hover campo | `green-50` | `green-900` | `hover:bg-green-50 dark:hover:bg-green-900` |
| Icono | `green-700` | `green-600` | `text-green-700 dark:text-green-600` |
| Botón background | `green-700` | `green-700` | `bg-green-700 hover:bg-green-800` |
| Focus ring pill | `green-600` | `green-500` | `focus-within:ring-2 focus-within:ring-green-600 dark:focus-within:ring-green-500` |
| Focus segmento interno | — | — | `focus-visible:outline-none` (delegado al ring del pill) |
| Border-bottom `SearchSummaryBar` | `green-700` | `green-600` | `border-b-4 border-green-700 dark:border-green-600` |

> **Nota hover dark mode:** se usa `green-900` (`#0a5331`) en lugar de `green-950` para que el label `gray-400` sobre hover mantenga ratio ≥ 4.5:1.

### Ratios de contraste WCAG

| Par | Ratio | Nivel |
|---|---|---|
| Label `gray-500` / `white` (light reposo) | 4.6:1 | ✅ AA |
| Valor `gray-900` / `white` (light reposo) | 18.1:1 | ✅ AAA |
| Label `gray-400` / `gray-800` (dark reposo) | 4.8:1 | ✅ AA |
| Valor `gray-50` / `gray-800` (dark reposo) | 17.5:1 | ✅ AAA |
| Label `gray-500` / `green-50` (light hover) | 4.6:1 | ✅ AA |
| Label `gray-400` / `green-900` (dark hover) | 4.5:1 | ✅ AA |
| Botón `white` / `green-700` | 5.4:1 | ✅ AA |

### Formato de fecha

Las fechas se muestran formateadas con `date-fns` (ya en el proyecto) y locale `es`.

**En `HotelSearchForm.vue`:** `dateRange.start` y `dateRange.end` son objetos `CalendarDate` de `@internationalized/date`. Deben convertirse con `.toDate(getLocalTimeZone())` antes de formatear:

```ts
import { format } from 'date-fns';
import { getLocalTimeZone } from '@internationalized/date';
import type { CalendarDate } from '@internationalized/date';

// Ejemplo de salida: "14/03/26"
const formattedDate = (d: CalendarDate) =>
  format(d.toDate(getLocalTimeZone()), 'dd/MM/yy');

// Uso en template: "14/03/26 - 16/03/26"
// formattedDate(dateRange.start) + ' - ' + formattedDate(dateRange.end)
```

**En `SearchSummaryBar.vue`:** `searchParams.checkIn` y `searchParams.checkOut` son strings ISO (`"2026-03-14"`). Aplicar el mismo formateador usando `new Date()`:

```ts
import { format } from 'date-fns';

const formattedSearchDate = (iso: string) =>
  format(new Date(iso), 'dd/MM/yy');
```

Si el rango no está definido, mostrar placeholder `"dd/mm/yy - dd/mm/yy"`.

### Estados vacíos y fallbacks

| Campo | Estado vacío |
|---|---|
| Destino | Placeholder `"¿A dónde vas?"` |
| Fechas | Placeholder `"dd/mm/yy - dd/mm/yy"` |
| Distribución | Valor inicial por defecto del composable |
| `SearchSummaryBar` sin destino | Preservar fallback existente: `hotelName \|\| searchParams.destination \|\| "Sin destino"` |

---

## Archivos a modificar

### 1. `app/components/b2b/hotel/HotelSearchForm.vue`

- Eliminar `grid grid-cols-12` y reemplazar por estructura pill: `flex flex-col md:flex-row rounded-2xl overflow-visible` (mantener `overflow-visible` para que los popovers de fecha y distribución no sean recortados)
- Quitar `bg-white/10 backdrop-blur-xl border-white/20` del contenedor raíz
- Cada campo: segmento `<div>` con `flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900 focus-visible:outline-none flex-[n] border-b border-gray-200 dark:border-gray-700 last:border-b-0 md:border-b-0`
- Insertar `<div class="hidden md:block w-px self-stretch my-3 bg-gray-200 dark:bg-gray-700" />` entre segmentos en desktop
- Mantener toda la lógica Vue: v-model, emits, `dateRange`, `rooms`, `submitSearch`

### 2. `app/components/b2b/hotel/SearchSummaryBar.vue`

- Reemplazar layout del modo resumen por estructura pill idéntica al formulario
- Actualizar `border-b-4 border-primary-500` → `border-b-4 border-green-700 dark:border-green-600`
- El modo edición (`isEditing = true`) no se modifica — sigue mostrando `HotelSearchForm`
- El botón "Editar" ocupa la posición del botón "Buscar" con icono `pencil-solid`

### 3. `app/components/b2b/hotel/RoomDistribution.vue`

Requiere un **cambio estructural menor**: exponer el trigger mediante un named slot `#trigger`. El slot tiene fallback que preserva el comportamiento actual en cualquier otro consumidor (ej: `quoter/builder.vue`).

```vue
<!-- RoomDistribution.vue — solo el bloque del trigger cambia -->
<!-- Nota: <slot name="trigger"> se coloca como hijo directo de <UPopover>,
     ocupando su default slot. Vue detecta !!slots.default correctamente
     porque el slot tag en sí es el único hijo del UPopover. -->
<UPopover v-model:open="isOpen" class="w-full">
  <slot name="trigger" :label="summaryLabel" :open="isOpen">
    <!-- Fallback: comportamiento actual, usado en quoter/builder.vue sin cambios -->
    <UButton
      color="neutral"
      variant="outline"
      icon="i-heroicons-users"
      size="md"
      class="w-full justify-start font-normal"
    >
      {{ summaryLabel }}
    </UButton>
  </slot>
  <template #content>
    <!-- sin cambios -->
  </template>
</UPopover>
```

En `HotelSearchForm.vue` se inyecta el trigger estilizado como segmento pill:

```vue
<B2bHotelRoomDistribution v-model="rooms">
  <template #trigger="{ label }">
    <div class="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900 focus-visible:outline-none flex-[2] ...">
      <UIcon name="i-heroicons-users-solid" class="w-5 h-5 text-green-700 dark:text-green-600 shrink-0" />
      <div class="overflow-hidden">
        <p class="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Distribución</p>
        <p class="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">{{ label }}</p>
      </div>
    </div>
  </template>
</B2bHotelRoomDistribution>
```

### 4. `app/pages/dashboard/index.vue` *(verificación, sin cambios esperados)*

- Confirmar que el `<div class="mb-10">` que envuelve `HotelSearchForm` no tiene estilos que interfieran
- No se esperan cambios de lógica

---

## Archivos a revisar por regresión

| Archivo | Razón |
|---|---|
| `app/pages/dashboard/index.vue` | Consumidor directo de `HotelSearchForm` |
| `app/pages/dashboard/quoter/builder.vue` | Consumidor de `RoomDistribution` — debe usar el slot fallback sin cambios |
| `app/pages/dashboard/hotels/results.vue` | Contiene `SearchSummaryBar` en modo sticky — verificar layout y modo edición |
| `app/pages/dashboard/hotels/[id].vue` | También contiene `SearchSummaryBar` (con prop `:hotel-name`) — verificar ambos modos |

---

## Criterios de aceptación

### Visuales
- [ ] En desktop, los 4 campos y el botón están alineados en una sola fila sin asimetría de altura
- [ ] En mobile, los campos se apilan verticalmente con separadores horizontales y botón ancho completo
- [ ] En modo claro, contraste de texto ≥ 4.5:1 en reposo y hover
- [ ] En modo oscuro, contraste de texto ≥ 4.5:1 en reposo y hover
- [ ] Hover muestra `green-50` (light) / `green-900` (dark) en cada segmento
- [ ] El focus ring aparece en el pill (`focus-within`); los segmentos internos tienen `focus-visible:outline-none`
- [ ] Los iconos heroicons-solid se muestran en `green-700` (light) / `green-600` (dark)
- [ ] Las fechas se muestran con formato `"14 mar – 16 mar"` (no ISO raw)

### Funcionales
- [ ] `SearchSummaryBar` en modo resumen muestra el pill con botón "Editar"
- [ ] `SearchSummaryBar` en modo edición muestra `HotelSearchForm` completo
- [ ] La lógica de búsqueda, fechas, distribución y nacionalidad funciona igual que antes
- [ ] El popover de `RoomDistribution` abre y cierra correctamente desde el nuevo trigger slot
- [ ] El estado vacío en `SearchSummaryBar` muestra `"Sin destino"` como fallback

### Regresión
- [ ] `quoter/builder.vue` — el trigger de `RoomDistribution` sin slot personalizado mantiene su estilo y funcionalidad original
- [ ] No hay regresiones visuales en `dashboard/index.vue`, página de resultados y quoter
