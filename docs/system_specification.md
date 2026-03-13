# Especificación del Sistema: Usuarios, Roles y Agencias - TravelOTA

Este documento detalla la estructura, permisos y operaciones del sistema TravelOTA, basado en los requerimientos de gestión B2B.

## 1. Campos Comunes para los Usuarios
Todos los usuarios del sistema comparten un conjunto base de atributos para su identificación y gestión:

- **Identificación Personal**:
  - Nombre completo.
  - Apellidos.
  - Email (identificador único para login).
  - Teléfono de contacto.
- **Seguridad**:
  - Contraseña (encriptada).
  - Estado de la cuenta (Activo, Inactivo, Bloqueado).
  - Último acceso.
- **Contexto**:
  - Rol asignado.
  - Idioma preferido (ES/EN).
  - Agencia asociada (ID de la agencia, nulo para personal interno).

---

## 2. Permisos y Roles
El sistema opera bajo un modelo RBAC (Role-Based Access Control) con los siguientes niveles:

| Rol | Descripción | Permisos Principales |
| :--- | :--- | :--- |
| **USER** | Agente de viajes estándar. | Búsqueda de hoteles, creación de cotizaciones, gestión de sus propias reservas. |
| **AGENCY_ADMIN** | Administrador de la agencia. | Todo lo anterior + Gestión de usuarios de su agencia, edición de perfil de agencia (branding), visualización de márgenes y liquidaciones. |
| **SUPPORT** | Personal de TravelOTA (Staff). | Visualización de todas las reservas del sistema, soporte técnico, gestión de plantillas B2B. |
| **SUPER_ADMIN** | Administrador de plataforma. | Gestión total: aprobación de agencias, gestión de personal staff, configuración global del sistema, acceso a logs. |

---

## 3. Diferencias entre Usuarios de Plataforma y de Agencia

- **Usuarios de Plataforma (Staff)**:
  - Pertenecen directamente a TravelOTA.
  - No realizan reservas para clientes finales.
  - Su misión es dar soporte, aprobar nuevas agencias y gestionar el inventario/precios base.
- **Usuarios de Agencia (B2B)**:
  - Pertenecen a una entidad externa (una Agencia de Viajes cliente).
  - Realizan la operación comercial (reservar para viajeros).
  - Tienen acceso a su propio monedero/límite de crédito y branding personalizado.

---

## 4. Operaciones de Usuarios
- **Creación**: Los usuarios de agencia son creados por su `AGENCY_ADMIN`. Los usuarios Staff son creados por `SUPER_ADMIN`.
- **Edición**: Cada usuario puede editar su propio perfil (nombre, teléfono).
- **Manejo de Perfil**: Acceso a preferencias y foto de perfil.
- **Seguridad de contraseña**:
  - **Cambio**: El usuario puede cambiar su contraseña desde su perfil si recuerda la actual.
  - **Reset**: En caso de olvido, se envía un email con un link de recuperación temporal. El `AGENCY_ADMIN` o `SUPPORT` también pueden disparar un reset manual.

---

## 5. Operaciones de Agencia

### Registro y Aprobación
1. **Auto-registro**: Las agencias inician el proceso mediante un formulario de registro público (NIF, Razón Social, Contacto).
2. **Estado Pendiente**: La agencia entra en un estado de "Revisión".
3. **Aprobación**: Un `SUPER_ADMIN` verifica la documentación y activa la agencia, asignándole un límite de crédito inicial.

### Gestión de Usuarios de Agencia
- El `AGENCY_ADMIN` es el encargado de crear los accesos para sus empleados.
- Puede activar/desactivar usuarios según la rotación de su personal.
- Define si el usuario tiene permiso para emitir pagos o solo para cotizar.

### Configuración de Agencia (Tenant/Branding)
Cada agencia funciona como un "tenant" con su propia configuración visual:
- **Logo**: Aparece en el dashboard y en los documentos PDF generados.
- **Color Primario**: La interfaz del dashboard se adapta al color corporativo de la agencia.
- **Márgenes/Markup**: Configuración base de comisión por defecto para sus ventas.
- **Datos Fiscales**: Dirección, NIF y datos de contacto que aparecen en facturas proforma e itinerarios.
