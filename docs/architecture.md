# 🏗️ Arquitectura del Proyecto

## Estructura de Carpetas

```
travelota-front/
├── app/
│   ├── app.vue                          # Entry point de la aplicación
│   ├── app.config.ts                    # Configuración de la app (tema, colores)
│   ├── assets/css/                      # Estilos globales (main.css)
│   ├── layouts/
│   │   ├── default.vue                  # Layout público (landing, registro)
│   │   └── dashboard.vue               # Layout autenticado (sidebar, header)
│   ├── pages/                           # Rutas auto-generadas por Nuxt
│   │   ├── index.vue                    # Landing page pública
│   │   ├── register.vue                 # Registro de agencias
│   │   ├── about.vue                    # Información corporativa
│   │   ├── terms.vue                    # Términos y condiciones
│   │   ├── privacy.vue                  # Política de privacidad
│   │   └── dashboard/                   # Área autenticada B2B
│   │       ├── index.vue                # Home del dashboard (buscador + ofertas)
│   │       ├── agency.vue               # Perfil de la agencia
│   │       ├── admin/
│   │       │   ├── index.vue            # Panel de administración
│   │       │   └── agencies.vue         # Gestión de agencias
│   │       ├── agency/
│   │       │   ├── markup.vue           # Configuración de markup/comisiones
│   │       │   └── users.vue            # Gestión de usuarios de la agencia
│   │       ├── hotels/
│   │       │   ├── results.vue          # Resultados de búsqueda
│   │       │   ├── [id].vue             # Detalle del hotel
│   │       │   ├── checkout.vue         # Proceso de checkout
│   │       │   └── booking/
│   │       │       └── [id].vue         # Detalle de reserva (multi-estado)
│   │       └── bookings/
│   │           └── index.vue            # Buscador y listado de reservas
│   └── components/
│       ├── AppLogo.vue                  # Logo de la aplicación
│       ├── TemplateMenu.vue             # Menú de navegación
│       └── b2b/hotel/                   # Componentes del módulo hotelero
│           ├── Búsqueda y Resultados
│           │   ├── HotelSearchForm.vue
│           │   ├── FiltersSidebar.vue
│           │   ├── ResultCard.vue
│           │   ├── ResultHotelSummary.vue
│           │   ├── ResultRoomList.vue
│           │   ├── RoomDistribution.vue
│           │   ├── SearchSummaryBar.vue
│           │   └── HotelMap.vue
│           ├── detail/                  # Detalle del hotel
│           │   ├── HotelGallery.vue
│           │   ├── HotelHeader.vue
│           │   ├── HotelInfo.vue
│           │   ├── HotelPriceBox.vue
│           │   └── HotelRooms.vue
│           └── checkout/               # Checkout y gestión de reservas
│               ├── CheckoutAgencyInfo.vue
│               ├── CheckoutCancellationPolicy.vue
│               ├── CheckoutComments.vue
│               ├── CheckoutHotelSummary.vue
│               ├── CheckoutImportantInfo.vue
│               ├── CheckoutPassengers.vue
│               ├── CheckoutPaymentOptions.vue
│               ├── CheckoutReservationDetails.vue
│               ├── CheckoutSidebarSummary.vue
│               ├── CheckoutTitularForm.vue
│               ├── PaymentMethodSelector.vue   ← Reutilizable
│               ├── BookingStatusHero.vue
│               ├── BookingCancellation.vue
│               ├── BookingPayment.vue
│               ├── BookingMassPayment.vue
│               └── BookingSearchFilters.vue
├── public/                              # Assets estáticos
├── scripts/                             # Scripts de utilidad (start.sh)
├── nuxt.config.ts                       # Configuración de Nuxt
├── package.json
└── tsconfig.json
```

## Layouts

### `default.vue`
Layout público para páginas sin autenticación (landing, registro, términos). Incluye header con logo, menú de navegación y footer corporativo.

### `dashboard.vue`
Layout para el área autenticada B2B. Incluye sidebar colapsable con navegación del dashboard, header con breadcrumbs/usuario, y área de contenido principal.

---

## Flujo de Datos

Actualmente el proyecto utiliza **datos mock** hardcodeados en los componentes. La arquitectura está preparada para conectarse a una API REST:

```
Componente (UI) → Composable/Store → API Service → Backend
```

### Patrón de Estado en Reservas

Las reservas manejan 4 estados (`status`) y 2 estados de pago (`paymentStatus`):

| Status | PaymentStatus | Descripción |
|--------|--------------|-------------|
| `Confirmada` | `Pagada` | Reserva activa y pagada |
| `Confirmada` | `Pendiente Pago` | Reserva activa, requiere pago |
| `Cancelada` | `Pagada` / `Pendiente Pago` | Reserva cancelada |
| `Vencida` | `Pendiente Pago` | Fecha límite de pago expirada |

### Patrón de Navegación - Origen de Acceso

La página de detalle de reserva (`booking/[id].vue`) detecta el origen de acceso mediante query param:

- `?from=confirmation` → Viene del checkout, muestra "¡Reserva Confirmada Exitosamente!"
- Sin query param → Viene del listado, muestra el estado actual de la reserva

---

## Componentes Reutilizables

### `PaymentMethodSelector.vue`
Componente central de selección de método de pago. Garantiza consistencia visual en todos los flujos de pago.

**Props:**
- `v-model` — Método seleccionado (`credit_card`, `bank_transfer`, `credit`, `pay_later`)
- `show-pay-later` — Muestra opción "Reservar y no Pagar Ahora" (solo en checkout)
- `total-price`, `payment-deadline`, `cancellation-deadline` — Info contextual para pay-later

**Uso en:**
- `CheckoutPaymentOptions.vue` → Con `show-pay-later` (4 opciones)
- `BookingPayment.vue` → Sin pay-later (3 opciones)
- `BookingMassPayment.vue` → Sin pay-later (3 opciones)
