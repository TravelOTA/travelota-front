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
| Descarga de voucher B2B | ✅ | Vista Modal y generador para impresión PDF |
| Descarga de factura B2B | ✅ | Desglose de precios dinámico para impresión PDF |

---

## Dashboard — White-Label y Agencia

| Funcionalidad | Estado | Ruta / Componente |
|--------------|--------|-------------------|
| Editor de Perfil B2B | 🔧 | `/dashboard/agency` |
| Configuración de Logo | ✅ | Modal Customización White-Label |
| Configuración de Colores | ✅ | Selector HEX interactivo global |
| Reglas de Markup y Ganancia | 🔧 | `/dashboard/agency/markup` |

---

## Dashboard — Finanzas y Crédito (Wallet)

| Funcionalidad | Estado | Ruta / Componente |
|--------------|--------|-------------------|
| Estado global y límite de crédito | ✅ | `useWallet.ts` |
| Dashboard de resumen financiero B2B | ✅ | `WalletWidgets.vue` |
| Tabla de historial de transacciones | ✅ | `AgencyTransactions.vue` |
| Bloqueo por crédito insuficiente en checkout | ✅ | `CheckoutPaymentOptions.vue` |

---

## Dashboard — Cotizador B2B (Quoter)

| Funcionalidad | Estado | Ruta / Componente |
|--------------|--------|-------------------|
| Estado global del carrito de cotización | ⬜ | `useQuoter.ts` |
| Botón "Añadir a Cotización" en tarjetas de hotel | ⬜ | `ResultHotelSummary.vue` |
| Botón "Añadir a Cotización" en detalle de habitaciones | ⬜ | `HotelRooms.vue` |
| Interfaz principal del cotizador (ajuste de markup) | ⬜ | `/dashboard/quoter/index.vue` |
| Generación de vista previa para cliente final | ⬜ | `QuoterPreviewModal.vue` |

---

## Dashboard — Administración

| Funcionalidad | Estado | Ruta |
|--------------|--------|------|
| Panel de administración (KPIs globales) | 🔧 | `/dashboard/admin` |
| Gestión de agencias B2B | 🔧 | `/dashboard/admin/agencies` |
| Detalle de agencia (Info, Usuarios, Reservas) | 🔧 | `/dashboard/admin/agencies/[id]` |
| Gestión de Grupos de Agencia (Markup Base) | 🔧 | `/dashboard/admin/agency-groups` |
| Usuarios de Soporte interno | 🔧 | `/dashboard/admin/support-users` |
| Monitor global de reservas (precio neto) | 🔧 | `/dashboard/admin/bookings` |
| Perfil de mi agencia | 🔧 | `/dashboard/agency` |
| Gestión de usuarios de mi agencia | 🔧 | `/dashboard/agency/users` |

---

## Funcionalidades Transversales

| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Layout público (default) | ✅ | Header, footer, navegación |
| Layout dashboard (autenticado) | ✅ | Sidebar colapsable, header con usuario |
| Modo oscuro | ✅ | Soporte nativo via Nuxt UI |
| Diseño responsive | ✅ | Mobile-first con breakpoints lg |
| Iconografía (Lucide, Heroicons) | ✅ | Via @iconify |
| Control de menú por rol | ✅ | `USER`/`AGENCY_ADMIN`: todos los menús. `SUPER_ADMIN`/`SUPPORT`: sin "Mis Reservas" ni "Mi Agencia" |
| Roles disponibles | ✅ | `USER`, `AGENCY_ADMIN`, `SUPPORT`, `SUPER_ADMIN` (mock en `dashboard.vue`) |

---

## Pendientes Generales (Roadmap)

| Prioridad | Funcionalidad | Descripción |
|-----------|--------------|-------------|
| 🔴 Alta | Integración API | Reemplazar datos mock con llamadas a API real |
| 🔴 Alta | Autenticación | Login, JWT, protección de rutas |
| 🔴 Alta | Notificaciones | Sistema de alertas y notificaciones en tiempo real |
| 🟡 Media | Tests automatizados | Unit tests y tests E2E |
| 🟡 Media | Tests automatizados | Unit tests y tests E2E |
| 🟢 Baja | Soporte multi-idioma | i18n para internacionalización |
| 🟢 Baja | Analytics dashboard | Métricas de ventas y rendimiento para agencias |
