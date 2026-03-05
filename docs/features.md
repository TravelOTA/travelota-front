# ✅ Funcionalidades — Estado Actual

## Leyenda

| Icono | Estado |
|-------|--------|
| ✅ | Implementado |
| 🔧 | Implementado con datos mock (pendiente integración API) |
| ⬜ | Pendiente |

---

## Páginas Públicas

| Funcionalidad | Estado | Ruta |
|--------------|--------|------|
| Landing page | ✅ | `/` |
| Registro de agencias | 🔧 | `/register` |
| Sobre nosotros | ✅ | `/about` |
| Términos y condiciones | ✅ | `/terms` |
| Política de privacidad | ✅ | `/privacy` |

---

## Dashboard — Buscar y Reservar

| Funcionalidad | Estado | Ruta / Componente |
|--------------|--------|-------------------|
| Home dashboard (buscador + ofertas destacadas) | 🔧 | `/dashboard` |
| Formulario de búsqueda de hoteles | 🔧 | `HotelSearchForm.vue` |
| Distribución de habitaciones (modal) | ✅ | `RoomDistribution.vue` |
| Resultados de búsqueda con filtros laterales | 🔧 | `/dashboard/hotels/results` |
| Filtros avanzados (estrellas, precio, servicios, régimen) | 🔧 | `FiltersSidebar.vue` |
| Mapa de resultados (Leaflet) | 🔧 | `HotelMap.vue` |
| Barra resumen de búsqueda | ✅ | `SearchSummaryBar.vue` |
| Detalle de hotel (galería, info, habitaciones) | 🔧 | `/dashboard/hotels/[id]` |
| Proceso de checkout completo | 🔧 | `/dashboard/hotels/checkout` |
| Formulario de titular | 🔧 | `CheckoutTitularForm.vue` |
| Datos de pasajeros | 🔧 | `CheckoutPassengers.vue` |
| Política de cancelación (tabla de costes) | ✅ | `CheckoutCancellationPolicy.vue` |
| Selección de método de pago (reutilizable) | ✅ | `PaymentMethodSelector.vue` |
| Opciones de pago en checkout (4 métodos) | 🔧 | `CheckoutPaymentOptions.vue` |
| Sidebar resumen de reserva | ✅ | `CheckoutSidebarSummary.vue` |

---

## Dashboard — Gestión de Reservas

| Funcionalidad | Estado | Ruta / Componente |
|--------------|--------|-------------------|
| Buscador de reservas con 6 filtros | 🔧 | `/dashboard/bookings` |
| Tabla de resultados con stats | 🔧 | `BookingSearchFilters.vue` |
| Detalle de reserva multi-estado | 🔧 | `/dashboard/hotels/booking/[id]` |
| Banner dinámico de estado (5 variantes) | ✅ | `BookingStatusHero.vue` |
| Componente de cancelación (tabla + modal) | 🔧 | `BookingCancellation.vue` |
| Componente de pago individual | 🔧 | `BookingPayment.vue` |
| Pago masivo de reservas pendientes | 🔧 | `BookingMassPayment.vue` |
| Selección masiva de reservas pendientes | ✅ | integrado en `bookings/index.vue` |
| Descarga de voucher (PDF) | ⬜ | — |
| Descarga de factura (PDF) | ⬜ | — |

---

## Dashboard — Administración

| Funcionalidad | Estado | Ruta |
|--------------|--------|------|
| Panel de administración | 🔧 | `/dashboard/admin` |
| Gestión de agencias | 🔧 | `/dashboard/admin/agencies` |
| Perfil de agencia | 🔧 | `/dashboard/agency` |
| Configuración de markup/comisiones | 🔧 | `/dashboard/agency/markup` |
| Gestión de usuarios | 🔧 | `/dashboard/agency/users` |

---

## Funcionalidades Transversales

| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Layout público (default) | ✅ | Header, footer, navegación |
| Layout dashboard (autenticado) | ✅ | Sidebar colapsable, header con usuario |
| Modo oscuro | ✅ | Soporte nativo via Nuxt UI |
| Diseño responsive | ✅ | Mobile-first con breakpoints lg |
| Iconografía (Lucide, Heroicons) | ✅ | Via @iconify |

---

## Pendientes Generales (Roadmap)

| Prioridad | Funcionalidad | Descripción |
|-----------|--------------|-------------|
| 🔴 Alta | Integración API | Reemplazar datos mock con llamadas a API real |
| 🔴 Alta | Autenticación | Login, JWT, protección de rutas |
| 🔴 Alta | Generación de PDFs | Voucher (sin precio) y Factura (con precio) |
| 🟡 Media | Notificaciones | Sistema de alertas y notificaciones en tiempo real |
| 🟡 Media | Historial de pagos | Registro de transacciones realizadas |
| 🟡 Media | Tests automatizados | Unit tests y tests E2E |
| 🟢 Baja | Soporte multi-idioma | i18n para internacionalización |
| 🟢 Baja | Analytics dashboard | Métricas de ventas y rendimiento para agencias |
