# Spec: Rediseño Pill — Barra de Búsqueda de Hoteles

**Fecha:** 2026-03-14
**Estado:** Aprobado
**Alcance:** `HotelSearchForm.vue` + `SearchSummaryBar.vue`

---

## Contexto y problema

La barra de búsqueda de hoteles presenta tres problemas visuales:

1. **Asimetría de alturas**: el trigger de `RoomDistribution` usa `size="md"` (h-9) mientras el resto de campos usa `size="lg"` (h-[44px]), rompiendo la alineación horizontal.
2. **Estilo visual dispar**: `UInput`/`USelect` tienen `variant="none"` con glassmorphism, pero el trigger de distribución usa `variant="outline"` con borde estándar — lenguajes visuales distintos.
3. **Contraste insuficiente**: el contenedor actual (`bg-white/10 backdrop-blur`) sobre el fondo claro del dashboard produce texto con ratio ~1.2:1, que no pasa WCAG AA (mínimo 4.5:1).

---

## Solución adoptada: Layout tipo Pill integrado

Reemplazar el grid de inputs separados por **una sola barra unificada** con divisores verticales internos. El pill es el contenedor — los campos son segmentos del mismo elemento visual.

---

## Diseño

### Estructura visual

```
┌──────────────────────────────────────────────────────────────────┐
│  📍 Destino  │  📅 Fechas  │  🛏 Distribución  │  🌎 Nac.  │ 🔍 │
└──────────────────────────────────────────────────────────────────┘
```

- Borde redondeado: `rounded-2xl` (14px)
- Divisores: pseudo-elemento `::before` al 18%–82% de altura del campo
- Botón de búsqueda: anclado a la derecha, con `rounded-r-2xl` solamente
- En `SearchSummaryBar`: el botón dice "Editar" con icono `pencil-solid`

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
| Separador vertical | `gray-200` | `gray-700` | `bg-gray-200 dark:bg-gray-700` |
| Label de campo | `gray-500` | `gray-400` | `text-gray-500 dark:text-gray-400` |
| Valor de campo | `gray-900` | `gray-50` | `text-gray-900 dark:text-gray-50` |
| Placeholder | `gray-400` | `gray-500` | `text-gray-400 dark:text-gray-500` |
| Hover campo | `green-50` | `green-950` | `hover:bg-green-50 dark:hover:bg-green-950` |
| Icono | `green-700` | `green-600` | `text-green-700 dark:text-green-600` |
| Botón background | `green-700` | `green-700` | `bg-green-700 hover:bg-green-800` |
| Focus ring | `green-600` | `green-500` | `focus-within:ring-2 focus-within:ring-green-600` |
| Border-bottom `SearchSummaryBar` | `green-700` | `green-600` | `border-b-4 border-green-700 dark:border-green-600` |

### Ratios de contraste WCAG

| Par | Ratio | Nivel |
|---|---|---|
| Label `gray-500` / `white` | 4.6:1 | ✅ AA |
| Valor `gray-900` / `white` | 18.1:1 | ✅ AAA |
| Label `gray-400` / `gray-800` | 4.8:1 | ✅ AA |
| Valor `gray-50` / `gray-800` | 17.5:1 | ✅ AAA |
| Botón `white` / `green-700` | 5.4:1 | ✅ AA |

---

## Comportamiento responsive

### Desktop (`md` y superior)
- Pill horizontal: 4 campos + botón en una sola fila
- Proporciones de flex: Destino `flex-2`, Fechas `flex-2`, Distribución `flex-2`, Nac. `flex-1.5`, Botón `flex-none w-[100px]`

### Mobile (menor a `md`)
- Stack vertical: cada campo ocupa el ancho completo dentro del pill
- Cada campo-fila tiene `flex-row` con icono + label/valor alineados
- Botón al final, ancho completo (`w-full rounded-xl`)
- El pill mantiene `rounded-2xl` con `p-1` interno y `gap-1` entre filas

---

## Archivos a modificar

### 1. `app/components/b2b/hotel/HotelSearchForm.vue`

- Eliminar `grid grid-cols-12` y reemplazar por estructura pill unificada
- Quitar clases `bg-white/10 backdrop-blur-xl border-white/20` del contenedor
- Cada campo envuelto en un `<div class="pill-segment">` con hover y divisor
- El `RoomDistribution` trigger adopta el mismo estilo que los otros segmentos — el componente hijo no cambia su lógica, solo el trigger button se estiliza desde el padre mediante props/slots o reemplazando el trigger
- Mantener toda la lógica Vue existente (v-model, emits, dateRange, rooms)

### 2. `app/components/b2b/hotel/SearchSummaryBar.vue`

- Reemplazar el layout `flex flex-col sm:flex-row` del modo resumen por la barra pill
- El modo edición (`isEditing = true`) sigue mostrando `HotelSearchForm` completo (sin cambio)
- El botón "Editar" reemplaza al botón "Buscar" en el segmento derecho
- Mantener el sticky container y `border-b-4 border-primary-500`

### 3. `app/components/b2b/hotel/RoomDistribution.vue`

- No requiere cambios en lógica
- El `UButton` trigger puede necesitar ajuste de clases para heredar el estilo pill desde el padre, o se extrae el trigger al componente padre y se pasa el contenido como slot

---

## Restricciones y consideraciones

- **No se usa Pinia**: el estado permanece en los composables existentes (`useHotelSearch`)
- **No se agregan dependencias**: solo Tailwind CSS v4 y Heroicons (ya disponibles via Iconify)
- **Compatibilidad dark mode**: todas las clases usan el patrón `dark:` nativo de Tailwind — no se modifica `app.config.ts` ni el tema
- **El glassmorphism se elimina** del formulario del dashboard ya que no existe un hero oscuro que lo sustente — solo se conservaría si en el futuro se agrega un hero con fondo oscuro
- **Accesibilidad**: cada segmento del pill debe tener `role` o ser un `<button>`/`<label>` semánticamente correcto; el formulario mantiene `@submit.prevent`

---

## Criterios de aceptación

- [ ] En desktop, los 4 campos y el botón están visualmente alineados en una sola fila sin asimetría de altura
- [ ] En mobile, los campos se apilan verticalmente dentro del mismo contenedor pill
- [ ] En modo claro, el contraste de texto supera 4.5:1 en todos los campos
- [ ] En modo oscuro, el contraste de texto supera 4.5:1 en todos los campos
- [ ] El hover en cada segmento muestra `green-50` (light) / `green-950` (dark)
- [ ] El focus ring aparece correctamente al tabular entre campos
- [ ] `SearchSummaryBar` en modo resumen usa el mismo pill con botón "Editar"
- [ ] `SearchSummaryBar` en modo edición sigue mostrando el formulario completo
- [ ] La lógica de búsqueda, fechas, distribución y nacionalidad funciona igual que antes
- [ ] No hay regresiones visuales en otros componentes del dashboard
