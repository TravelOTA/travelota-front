import { useState, computed } from "#imports";

export interface AdminAgencyUser {
  id: number;
  name: string;
  email: string;
  role: "Admin Agencia" | "Vendedor";
  status: "Activo" | "Inactivo";
  lastLogin: string;
}

export interface AdminAgency {
  id: string;
  name: string;
  country: string;
  email: string;
  phone: string;
  agencyGroup: string;
  markup: number;
  bookingsCount: number;
  registeredAt: string;
  status: "Activa" | "Pendiente" | "Bloqueada";
  users: AdminAgencyUser[];
}

const MOCK_AGENCIES: AdminAgency[] = [
  {
    id: "AG-1001",
    name: "Viajes El Corte Inglés",
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
        id: 1,
        name: "Juan Pérez",
        email: "juan@elcorteingles.es",
        role: "Vendedor",
        status: "Activo",
        lastLogin: "2026-03-05",
      },
      {
        id: 2,
        name: "María Gómez",
        email: "maria@elcorteingles.es",
        role: "Admin Agencia",
        status: "Activo",
        lastLogin: "2026-03-04",
      },
      {
        id: 3,
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
        id: 1,
        name: "Pedro Morales",
        email: "pedro@destinia.com",
        role: "Admin Agencia",
        status: "Activo",
        lastLogin: "2026-03-05",
      },
      {
        id: 2,
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
    country: "México",
    email: "contacto@agenciademo.mx",
    phone: "+52 55 1234 5678",
    agencyGroup: "Grupo Estándar",
    markup: 15,
    bookingsCount: 0,
    registeredAt: "2026-02-28",
    status: "Pendiente",
    users: [
      {
        id: 1,
        name: "Ana Ruiz",
        email: "ana@agenciademo.mx",
        role: "Admin Agencia",
        status: "Activo",
        lastLogin: "—",
      },
    ],
  },
  {
    id: "AG-1004",
    name: "Viajes Barceló",
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
        id: 1,
        name: "Javier Serrano",
        email: "javier@barcelo.com",
        role: "Admin Agencia",
        status: "Activo",
        lastLogin: "2026-03-05",
      },
      {
        id: 2,
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
    country: "Argentina",
    email: "info@globaltravel.ar",
    phone: "+54 11 4567 8901",
    agencyGroup: "Grupo Estándar",
    markup: 13,
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
  }));

  function getAgencyById(id: string): AdminAgency | undefined {
    return agencies.value.find((a) => a.id === id);
  }

  function approveAgency(id: string) {
    const agency = agencies.value.find((a) => a.id === id);
    if (agency) agency.status = "Activa";
  }

  function toggleBlock(id: string) {
    const agency = agencies.value.find((a) => a.id === id);
    if (agency) {
      agency.status = agency.status === "Bloqueada" ? "Activa" : "Bloqueada";
    }
  }

  function addAgency(
    data: Omit<AdminAgency, "id" | "bookingsCount" | "status" | "users">,
  ) {
    agencies.value.push({
      id: `AG-${1000 + agencies.value.length + 1}`,
      bookingsCount: 0,
      status: "Pendiente",
      users: [],
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
    approveAgency,
    toggleBlock,
    addAgency,
    updateAgency,
  };
}
