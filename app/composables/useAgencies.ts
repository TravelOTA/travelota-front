import { useState, computed } from "#imports";
import type { RegisterInput } from "~/utils/schemas";
import type { AgencyGroup } from "~/composables/useAgencyGroups";
import type { ICreditLine } from '#shared/types/wallet';

export interface AdminAgencyUser {
  id: string;
  name: string;
  email: string;
  role: "Admin Agencia" | "Vendedor";
  status: "Activo" | "Inactivo";
  lastLogin: string;
}

export interface AdminAgency {
  id: string;
  name: string;
  rut: string;
  direccionRegistrada: string;
  web: string;
  nombreContacto: string;
  country: string;
  /** Corporate registration email — read-only, only editable by SuperAdmin */
  email: string;
  /** Corporate registration phone — read-only, only editable by SuperAdmin */
  phone: string;
  /** Public contact email shown to clients — editable via whitelabel config */
  publicEmail: string;
  /** Public contact phone shown to clients — editable via whitelabel config */
  publicPhone: string;
  agencyGroup: string | null;
  markup: number;
  bookingsCount: number;
  registeredAt: string;
  status: "Activa" | "Pendiente" | "Bloqueada" | "Denegada";
  users: AdminAgencyUser[];
  logo: string;
  colorPrimario: string;
  credit_line?: ICreditLine;
}

const MOCK_AGENCIES: AdminAgency[] = [
  {
    id: "AG-1001",
    name: "Viajes El Corte Inglés",
    rut: "A28010615",
    direccionRegistrada: "Calle de Hermosilla 112, 28009 Madrid",
    web: "https://www.elcorteingles.es/viajes",
    nombreContacto: "María Gómez",
    country: "España",
    email: "b2b@elcorteingles.es",
    phone: "+34 91 418 88 00",
    publicEmail: "atencion@elcorteingles.es",
    publicPhone: "+34 900 100 100",
    agencyGroup: "Grupo VIP",
    markup: 12,
    bookingsCount: 312,
    registeredAt: "2024-03-15",
    status: "Activa",
    logo: "",
    colorPrimario: "teal",
    credit_line: {
      limit: 10000,
      used: 3200,
      available: 6800,
      debt: 3200,
      status: 'active',
    },
    users: [
      {
        id: "1",
        name: "Juan Pérez",
        email: "juan@elcorteingles.es",
        role: "Vendedor",
        status: "Activo",
        lastLogin: "2026-03-05",
      },
      {
        id: "2",
        name: "María Gómez",
        email: "maria@elcorteingles.es",
        role: "Admin Agencia",
        status: "Activo",
        lastLogin: "2026-03-04",
      },
      {
        id: "3",
        name: "Carlos López",
        email: "carlos@elcorteingles.es",
        role: "Vendedor",
        status: "Inactivo",
        lastLogin: "2026-02-10",
      },
    ],
  },
  {
    id: "AG-1002",
    name: "Destinia",
    rut: "B86361884",
    direccionRegistrada: "Calle de Alcalá 40, 28014 Madrid",
    web: "https://www.destinia.com",
    nombreContacto: "Pedro Morales",
    country: "España",
    email: "b2b@destinia.com",
    phone: "+34 91 123 45 67",
    publicEmail: "clientes@destinia.com",
    publicPhone: "+34 91 123 45 67",
    agencyGroup: "Grupo Mayorista",
    markup: 10,
    bookingsCount: 187,
    registeredAt: "2024-06-01",
    status: "Activa",
    logo: "",
    colorPrimario: "blue",
    users: [
      {
        id: "1",
        name: "Pedro Morales",
        email: "pedro@destinia.com",
        role: "Admin Agencia",
        status: "Activo",
        lastLogin: "2026-03-05",
      },
      {
        id: "2",
        name: "María Gómez",
        email: "mgomez@destinia.com",
        role: "Vendedor",
        status: "Activo",
        lastLogin: "2026-03-03",
      },
    ],
  },
  {
    id: "AG-1003",
    name: "Agencia Demo B2B",
    rut: "RFC123456MX0",
    direccionRegistrada: "Av. Insurgentes Sur 1602, Ciudad de México",
    web: "",
    nombreContacto: "Ana Ruiz",
    country: "México",
    email: "contacto@agenciademo.mx",
    phone: "+52 55 1234 5678",
    publicEmail: "",
    publicPhone: "",
    agencyGroup: null,
    markup: 0,
    bookingsCount: 0,
    registeredAt: "2026-02-28",
    status: "Pendiente",
    logo: "",
    colorPrimario: "green",
    users: [],
  },
  {
    id: "AG-1004",
    name: "Viajes Barceló",
    rut: "A07001851",
    direccionRegistrada: "Passeig de Gràcia 75, 08008 Barcelona",
    web: "https://www.barcelo.com",
    nombreContacto: "Javier Serrano",
    country: "España",
    email: "b2b@barcelo.com",
    phone: "+34 971 78 91 00",
    publicEmail: "reservas@barcelo.com",
    publicPhone: "+34 900 200 200",
    agencyGroup: "Grupo VIP",
    markup: 11,
    bookingsCount: 534,
    registeredAt: "2023-11-10",
    status: "Activa",
    logo: "",
    colorPrimario: "indigo",
    users: [
      {
        id: "1",
        name: "Javier Serrano",
        email: "javier@barcelo.com",
        role: "Admin Agencia",
        status: "Activo",
        lastLogin: "2026-03-05",
      },
      {
        id: "2",
        name: "Nuria Campos",
        email: "nuria@barcelo.com",
        role: "Vendedor",
        status: "Activo",
        lastLogin: "2026-03-04",
      },
    ],
  },
  {
    id: "AG-1005",
    name: "TurMundo Colombia",
    rut: "900123456-1",
    direccionRegistrada: "Carrera 7 #71-21, Bogotá D.C.",
    web: "https://www.turmundo.co",
    nombreContacto: "Catalina Ríos",
    country: "Colombia",
    email: "ventas@turmundo.co",
    phone: "+57 1 745 3210",
    publicEmail: "ventas@turmundo.co",
    publicPhone: "+57 1 745 3210",
    agencyGroup: "Grupo Estándar",
    markup: 14,
    bookingsCount: 91,
    registeredAt: "2025-01-20",
    status: "Bloqueada",
    logo: "",
    colorPrimario: "orange",
    users: [],
  },
  {
    id: "AG-1006",
    name: "Global Travel Agency",
    rut: "30-71234567-9",
    direccionRegistrada: "Av. Corrientes 1234, Buenos Aires",
    web: "",
    nombreContacto: "Ricardo Vega",
    country: "Argentina",
    email: "info@globaltravel.ar",
    phone: "+54 11 4567 8901",
    publicEmail: "",
    publicPhone: "",
    agencyGroup: null,
    markup: 0,
    bookingsCount: 0,
    registeredAt: "2026-03-01",
    status: "Pendiente",
    logo: "",
    colorPrimario: "green",
    users: [],
  },
];

export function useAgencies() {
  const agencies = useState<AdminAgency[]>("agencies", () => MOCK_AGENCIES);

  const agencyStats = computed(() => ({
    total: agencies.value.length,
    active: agencies.value.filter((a) => a.status === "Activa").length,
    pending: agencies.value.filter((a) => a.status === "Pendiente").length,
    blocked: agencies.value.filter((a) => a.status === "Bloqueada").length,
    denied: agencies.value.filter((a) => a.status === "Denegada").length,
  }));

  function getAgencyById(id: string): AdminAgency | undefined {
    return agencies.value.find((a) => a.id === id);
  }

  function registerAgency(data: RegisterInput): void {
    agencies.value.push({
      id: crypto.randomUUID(),
      name: data.nombreComercial,
      rut: data.nif,
      direccionRegistrada: data.direccionRegistrada,
      web: data.web ?? "",
      nombreContacto: data.nombreContacto,
      country: data.pais,
      email: data.email,
      phone: data.telefono,
      publicEmail: "",
      publicPhone: "",
      agencyGroup: null,
      markup: 0,
      bookingsCount: 0,
      registeredAt: new Date().toISOString(),
      status: "Pendiente",
      logo: "",
      colorPrimario: "teal",
      users: [],
    });
  }

  function approveAgency(id: string, group: AgencyGroup): void {
    const agency = agencies.value.find((a) => a.id === id);
    if (!agency) return;
    agency.status = "Activa";
    agency.agencyGroup = group.name;
    agency.markup = group.baseMarkup;
    agency.publicEmail = agency.email;
    agency.publicPhone = agency.phone;
    agency.users.push({
      id: crypto.randomUUID(),
      name: agency.nombreContacto,
      email: agency.email,
      role: "Admin Agencia",
      status: "Activo",
      lastLogin: "—",
    });
  }

  function denyAgency(id: string): void {
    const agency = agencies.value.find((a) => a.id === id);
    if (agency) agency.status = "Denegada";
  }

  function deleteAgency(id: string): void {
    agencies.value = agencies.value.filter((a) => a.id !== id);
  }

  function toggleBlock(id: string) {
    const agency = agencies.value.find((a) => a.id === id);
    if (agency) {
      agency.status = agency.status === "Bloqueada" ? "Activa" : "Bloqueada";
    }
  }

  function addAgency(
    data: Omit<
      AdminAgency,
      | "id"
      | "bookingsCount"
      | "status"
      | "users"
      | "rut"
      | "direccionRegistrada"
      | "web"
      | "nombreContacto"
      | "logo"
      | "colorPrimario"
      | "publicEmail"
      | "publicPhone"
    >,
  ) {
    agencies.value.push({
      id: `AG-${1000 + agencies.value.length + 1}`,
      bookingsCount: 0,
      status: "Pendiente",
      users: [],
      rut: "",
      direccionRegistrada: "",
      web: "",
      nombreContacto: "",
      logo: "",
      colorPrimario: "teal",
      publicEmail: "",
      publicPhone: "",
      ...data,
    });
  }

  function updateUserStatus(
    agencyId: string,
    userId: string,
    status: "Activo" | "Inactivo",
  ): void {
    const agency = agencies.value.find((a) => a.id === agencyId);
    if (!agency) return;
    const user = agency.users.find((u) => u.id === userId);
    if (user) user.status = status;
  }

  function updateAgency(
    id: string,
    data: Partial<
      Pick<
        AdminAgency,
        "name" | "country" | "email" | "phone" | "agencyGroup" | "markup"
      >
    >,
  ) {
    const agency = agencies.value.find((a) => a.id === id);
    if (agency) Object.assign(agency, data);
  }

  function updateWhitelabel(
    id: string,
    data: Partial<
      Pick<
        AdminAgency,
        "logo" | "colorPrimario" | "publicEmail" | "publicPhone"
      >
    >,
  ) {
    const agency = agencies.value.find((a) => a.id === id);
    if (agency) Object.assign(agency, data);
  }

  return {
    agencies,
    agencyStats,
    getAgencyById,
    registerAgency,
    approveAgency,
    denyAgency,
    deleteAgency,
    toggleBlock,
    addAgency,
    updateAgency,
    updateWhitelabel,
    updateUserStatus,
  };
}
