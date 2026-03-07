# Alternativas de Flujo para el Cotizador B2B

## Opción 1: Cotización Directa (Modelo Modal / One-Click)
En lugar de un "carrito de compras" donde agregas múltiples hoteles para armar un paquete, cada hotel se cotiza por separado en el momento.
- **Flujo:** El agente hace clic en "Cotizar" en una habitación. Inmediatamente se abre un Modal interactivo (Pop-up) en la misma pantalla.
- **Acción:** En ese modal, el agente ve el precio neto, ingresa su % de ganancia (markup) y hace clic en "Descargar PDF" o "Copiar Enlace".
- **Pros:** Es el flujo más rápido. El agente no tiene que salir de los resultados de búsqueda ni ir a otra página.
- **Contras:** No permite armar "paquetes" multicategoría (ej: 2 hoteles diferentes en la misma cotización).

## Opción 2: Generador de Enlaces de Marca Blanca (Link Sharing)
En lugar de generar un PDF, el sistema genera una URL única.
- **Flujo:** El agente selecciona hoteles (con checkboxes o botón cotizar) y genera un Link.
- **Acción:** El sistema pide el Markup general y genera una URL (ej: `travelota.com/quote/abc123`).
- **Vista Cliente:** El cliente final abre la URL y ve los hoteles seleccionados bajo el diseño web de la Agencia (White-label), con fotos en alta calidad, mapas interactivos y el precio final ya calculado.
- **Pros:** Experiencia 100% digital, moderna e interactiva para el cliente final (mucho mejor que un PDF estático). Se puede trackear si el cliente abrió el link.
- **Contras:** Requiere programar una vista pública especial "fuera" del dashboard protegido, leyendo datos de la DB.

## Opción 3: Cotizador Inyectado en el Checkout (Modelo Propuesta de Reserva)
El flujo de cotización se vuelve parte del flujo de reservación real.
- **Flujo:** El agente hace el proceso de reservación normal, llega a la pantalla de Checkout (`/checkout`).
- **Acción:** En lugar de poner "Pagar y Reservar", hay un botón paralelo que dice "Guardar como Cotización / Propuesta".
- **Comportamiento:** El inventario NO se bloquea, pero todos los datos reales (fechas, ocupación, precio) se guardan en el sistema bajo la pestaña "Mis Cotizaciones". Desde esa tabla se descarga el PDF.
- **Pros:** Reutiliza toda la lógica de reserva. Es muy fácil convertir una Cotización en una Reserva real con un solo clic posterior (ya que los datos de la fecha y cuartos están amarrados).
- **Contras:** Es un flujo más lento si el agente solo quería mandar un precio rápido, ya que requiere simular que está comprando.

## Opción 4: Creador de Itinerarios (Modelo Avanzado)
Un flujo tipo "Crea tu Viaje" pensado en Tour Operadores.
- **Flujo:** El agente entra a `/dashboard/quoter` (pantalla vacía inicialmente).
- **Acción:** Tiene un buscador interno. Busca y agrega Hotel A (Días 1-4), añade un Traslado (Día 1), y añade un Tour (Día 2).
- **Pros:** Ideal para paquetes dinámicos y vacaciones largas.
- **Contras:** Mucho más complejo de construir en código, requiere arrastrar/soltar elementos y gestionar una línea de tiempo (timeline).
