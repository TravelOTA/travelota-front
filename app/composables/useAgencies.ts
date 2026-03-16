import { useState, computed } from "#imports";
import type { RegisterInput } from "~/utils/schemas";

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
  razonSocial: string;
  web: string;
  nombreContacto: string;
  country: string;
  email: string;
  phone: string;
  agencyGroup: string | null;
  markup: number;
  bookingsCount: number;
  registeredAt: string;
  status: "Activa" | "Pendiente" | "Bloqueada" | "Denegada";
  users: AdminAgencyUser[];
}

export interface AgencyGroup {
  id: string;
  name: string;
  description: string;
  baseMarkup: number;
  agenciesCount: number;
}

const MOCK_AGENCIES: AdminAgency[] = [
  {
    id: "AG-1001",
    name: "Viajes El Corte Inglés",
    rut: "A28010615",
    razonSocial: "El Corte Inglés Viajes S.A.",
    web: "https://www.elcorteingles.es/viajes",
    nombreContacto: "María Gómez",
    country: "España",
    email: "b2b@elcorteingles.es",
    phone: "+34 91 418 88 00",
    agencyGroup: "Grupo VIP",
    markup: 12,
    bookingsCount: 312,
    registeredAt: "2024-03-15",
    status: "Activa",
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
    razonSocial: "Destinia.com S.L.",
    web: "https://www.destinia.com",
    nombreContacto: "Pedro Morales",
    country: "España",
    email: "b2b@destinia.com",
    phone: "+34 91 123 45 67",
    agencyGroup: "Grupo Mayorista",
    markup: 10,
    bookingsCount: 187,
    registeredAt: "2024-06-01",
    status: "Activa",
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
    razonSocial: "Agencia Demo B2B S. de R.L.",
    web: "",
    nombreContacto: "Ana Ruiz",
    country: "México",
    email: "contacto@agenciademo.mx",
    phone: "+52 55 1234 5678",
    agencyGroup: null,
    markup: 0,
    bookingsCount: 0,
    registeredAt: "2026-02-28",
    status: "Pendiente",
    users: [],
  },
  {
    id: "AG-1004",
    name: "Viajes Barceló",
    rut: "A07001851",
    razonSocial: "Barceló Viajes S.A.",
    web: "https://www.barcelo.com",
    nombreContacto: "Javier Serrano",
    country: "España",
    email: "b2b@barcelo.com",
    phone: "+34 971 78 91 00",
    agencyGroup: "Grupo VIP",
    markup: 11,
    bookingsCount: 534,
    registeredAt: "2023-11-10",
    status: "Activa",
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
    razonSocial: "TurMundo Colombia S.A.S.",
    web: "https://www.turmundo.co",
    nombreContacto: "Catalina Ríos",
    country: "Colombia",
    email: "ventas@turmundo.co",
    phone: "+57 1 745 3210",
    agencyGroup: "Grupo Estándar",
    markup: 14,
    bookingsCount: 91,
    registeredAt: "2025-01-20",
    status: "Bloqueada",
    users: [],
  },
  {
    id: "AG-1006",
    name: "Global Travel Agency",
    rut: "30-71234567-9",
    razonSocial: "Global Travel Agency S.R.L.",
    web: "",
    nombreContacto: "Ricardo Vega",
    country: "Argentina",
    email: "info@globaltravel.ar",
    phone: "+54 11 4567 8901",
    agencyGroup: null,
    markup: 0,
    bookingsCount: 0,
    registeredAt: "2026-03-01",
    status: "Pendiente",
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
      razonSocial: data.razonSocial,
      web: data.web ?? "",
      nombreContacto: data.nombreContacto,
      country: data.pais,
      email: data.email,
      phone: data.telefono,
      agencyGroup: null,
      markup: 0,
      bookingsCount: 0,
      registeredAt: new Date().toISOString(),
      status: "Pendiente",
      users: [],
    });
  }

  function approveAgency(id: string, group?: AgencyGroup): void {
    const agency = agencies.value.find((a) => a.id === id);
    if (!agency) return;
    agency.status = "Activa";
    if (group) {
      agency.agencyGroup = group.name;
      agency.markup = group.baseMarkup;
      agency.users.push({
        id: crypto.randomUUID(),
        name: agency.nombreContacto,
        email: agency.email,
        role: "Admin Agencia",
        status: "Activo",
        lastLogin: "—",
      });
    }
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
      | "razonSocial"
      | "web"
      | "nombreContacto"
    >,
  ) {
    agencies.value.push({
      id: `AG-${1000 + agencies.value.length + 1}`,
      bookingsCount: 0,
      status: "Pendiente",
      users: [],
      rut: "",
      razonSocial: "",
      web: "",
      nombreContacto: "",
      ...data,
    });
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
  };
}
