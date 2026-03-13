export interface BookingRow {
  id: string;
  createdAt: string;
  createdAtISO: string;
  titular: string;
  destination: string;
  checkIn: string;
  checkInISO: string;
  checkOut: string;
  agency: string;
  seller: string;
  netPrice: number;
  agencyPrice: number;
  salePrice: number;
  paymentStatus: string;
  status: string;
}

export interface SearchFilters {
  pnr: string;
  titular: string;
  destination: string;
  statuses: string[];
  paymentStatuses: string[];
  createdFrom: string;
  createdTo: string;
  checkInFrom: string;
  checkInTo: string;
  agency: string;
  seller: string;
  [key: string]: string | string[];
}

const MOCK_BOOKINGS: BookingRow[] = [
  {
    id: "TRV-987654321",
    createdAt: "02/03/2026 15:30",
    createdAtISO: "2026-03-02",
    titular: "Juan Pérez",
    destination: "Punta Cana, DO",
    checkIn: "03/03/2026",
    checkInISO: "2026-03-03",
    checkOut: "10/03/2026",
    agency: "Viajes El Corte Inglés",
    seller: "Juan Pérez Vendedor",
    netPrice: 5230.0,
    agencyPrice: 6281.41,
    salePrice: 6900.0,
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-123456789",
    createdAt: "28/02/2026 09:15",
    createdAtISO: "2026-02-28",
    titular: "María López",
    destination: "Cancún, MX",
    checkIn: "15/05/2026",
    checkInISO: "2026-05-15",
    checkOut: "22/05/2026",
    agency: "Destinia",
    seller: "María Gómez",
    netPrice: 2625.0,
    agencyPrice: 3150.0,
    salePrice: 3500.0,
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-456789123",
    createdAt: "15/01/2026 11:20",
    createdAtISO: "2026-01-15",
    titular: "Carlos Gómez",
    destination: "Miami, US",
    checkIn: "20/02/2026",
    checkInISO: "2026-02-20",
    checkOut: "25/02/2026",
    agency: "Viajes El Corte Inglés",
    seller: "Carlos López",
    netPrice: 1534.0,
    agencyPrice: 1840.5,
    salePrice: 2000.0,
    paymentStatus: "Pendiente Pago",
    status: "Vencida",
  },
  {
    id: "TRV-789123456",
    createdAt: "05/12/2025 16:45",
    createdAtISO: "2025-12-05",
    titular: "Ana Martínez",
    destination: "Orlando, US",
    checkIn: "10/01/2026",
    checkInISO: "2026-01-10",
    checkOut: "17/01/2026",
    agency: "Agencia Demo B2B",
    seller: "Ana Ruiz",
    netPrice: 3500.0,
    agencyPrice: 4200.75,
    salePrice: 4600.0,
    paymentStatus: "Pagada",
    status: "Cancelada",
  },
  {
    id: "TRV-111222333",
    createdAt: "01/03/2026 10:00",
    createdAtISO: "2026-03-01",
    titular: "Laura Fernández",
    destination: "Barcelona, ES",
    checkIn: "20/04/2026",
    checkInISO: "2026-04-20",
    checkOut: "27/04/2026",
    agency: "Destinia",
    seller: "Pedro Morales",
    netPrice: 2408.0,
    agencyPrice: 2890.0,
    salePrice: 3100.0,
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-777888999",
    createdAt: "20/02/2026 08:45",
    createdAtISO: "2026-02-20",
    titular: "Sofia Torres",
    destination: "Dubai, AE",
    checkIn: "10/06/2026",
    checkInISO: "2026-06-10",
    checkOut: "17/06/2026",
    agency: "Viajes El Corte Inglés",
    seller: "Juan Pérez Vendedor",
    netPrice: 7042.0,
    agencyPrice: 8450.25,
    salePrice: 9200.0,
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-101010101",
    createdAt: "14/02/2026 10:00",
    createdAtISO: "2026-02-14",
    titular: "Isabel Herrera",
    destination: "Los Cabos, MX",
    checkIn: "01/05/2026",
    checkInISO: "2026-05-01",
    checkOut: "08/05/2026",
    agency: "Agencia Demo B2B",
    seller: "Ana Ruiz",
    netPrice: 3150.0,
    agencyPrice: 3780.0,
    salePrice: 4100.0,
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-202020202",
    createdAt: "10/02/2026 15:30",
    createdAtISO: "2026-02-10",
    titular: "Andres Vidal",
    destination: "Cartagena, CO",
    checkIn: "12/04/2026",
    checkInISO: "2026-04-12",
    checkOut: "19/04/2026",
    agency: "Destinia",
    seller: "Pedro Morales",
    netPrice: 1750.0,
    agencyPrice: 2100.5,
    salePrice: 2300.0,
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-303030303",
    createdAt: "05/02/2026 09:45",
    createdAtISO: "2026-02-05",
    titular: "Nuria Campos",
    destination: "Tenerife, ES",
    checkIn: "25/05/2026",
    checkInISO: "2026-05-25",
    checkOut: "01/06/2026",
    agency: "Viajes El Corte Inglés",
    seller: "Carlos López",
    netPrice: 1375.0,
    agencyPrice: 1650.0,
    salePrice: 1850.0,
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-404040404",
    createdAt: "22/01/2026 11:00",
    createdAtISO: "2026-01-22",
    titular: "Fernando Blanco",
    destination: "Playa del Carmen, MX",
    checkIn: "10/03/2026",
    checkInISO: "2026-03-10",
    checkOut: "17/03/2026",
    agency: "Agencia Demo B2B",
    seller: "Ana Ruiz",
    netPrice: 3600.0,
    agencyPrice: 4320.75,
    salePrice: 4800.0,
    paymentStatus: "Pagada",
    status: "Cancelada",
  },
  {
    id: "TRV-505050505",
    createdAt: "18/01/2026 14:20",
    createdAtISO: "2026-01-18",
    titular: "Carmen Reyes",
    destination: "Maldivas",
    checkIn: "20/07/2026",
    checkInISO: "2026-07-20",
    checkOut: "30/07/2026",
    agency: "Destinia",
    seller: "María Gómez",
    netPrice: 10333.0,
    agencyPrice: 12400.0,
    salePrice: 13500.0,
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-606060606",
    createdAt: "15/01/2026 08:30",
    createdAtISO: "2026-01-15",
    titular: "Diego Fuentes",
    destination: "Nueva York, US",
    checkIn: "14/04/2026",
    checkInISO: "2026-04-14",
    checkOut: "20/04/2026",
    agency: "Viajes El Corte Inglés",
    seller: "Juan Pérez Vendedor",
    netPrice: 2667.0,
    agencyPrice: 3200.0,
    salePrice: 3500.0,
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-707070707",
    createdAt: "08/01/2026 16:00",
    createdAtISO: "2026-01-08",
    titular: "Patricia Gil",
    destination: "Lisboa, PT",
    checkIn: "03/06/2026",
    checkInISO: "2026-06-03",
    checkOut: "10/06/2026",
    agency: "Agencia Demo B2B",
    seller: "Ana Ruiz",
    netPrice: 1650.0,
    agencyPrice: 1980.0,
    salePrice: 2200.0,
    paymentStatus: "Pendiente Pago",
    status: "Confirmada",
  },
  {
    id: "TRV-808080808",
    createdAt: "03/01/2026 12:15",
    createdAtISO: "2026-01-03",
    titular: "Ricardo Mora",
    destination: "Seychelles",
    checkIn: "15/08/2026",
    checkInISO: "2026-08-15",
    checkOut: "22/08/2026",
    agency: "Destinia",
    seller: "Pedro Morales",
    netPrice: 8208.0,
    agencyPrice: 9850.0,
    salePrice: 10800.0,
    paymentStatus: "Pagada",
    status: "Confirmada",
  },
  {
    id: "TRV-909090909",
    createdAt: "28/12/2025 10:00",
    createdAtISO: "2025-12-28",
    titular: "Silvia Montoya",
    destination: "Amésterdam, NL",
    checkIn: "25/04/2026",
    checkInISO: "2026-04-25",
    checkOut: "30/04/2026",
    agency: "Viajes El Corte Inglés",
    seller: "Carlos López",
    netPrice: 2292.0,
    agencyPrice: 2750.0,
    salePrice: 3000.0,
    paymentStatus: "Pendiente Pago",
    status: "Vencida",
  },
];

export function useBookings() {
  const bookings = useState<BookingRow[]>("bookings", () => MOCK_BOOKINGS);

  const agencyOptions = computed(() => [
    ...new Set(bookings.value.map((b) => b.agency)),
  ]);

  const sellerOptions = computed(() => [
    ...new Set(bookings.value.map((b) => b.seller)),
  ]);

  function getBookingById(id: string): BookingRow | undefined {
    return bookings.value.find((b) => b.id === id);
  }

  function filterBookings(filters: SearchFilters): BookingRow[] {
    let results = [...bookings.value];

    if (filters.pnr) {
      const q = filters.pnr.toLowerCase();
      results = results.filter((b) => b.id.toLowerCase().includes(q));
    }
    if (filters.titular) {
      const q = filters.titular.toLowerCase();
      results = results.filter((b) => b.titular.toLowerCase().includes(q));
    }
    if (filters.destination) {
      const q = filters.destination.toLowerCase();
      results = results.filter((b) => b.destination.toLowerCase().includes(q));
    }
    if (filters.statuses && filters.statuses.length > 0) {
      results = results.filter((b) => filters.statuses.includes(b.status));
    }
    if (filters.paymentStatuses && filters.paymentStatuses.length > 0) {
      results = results.filter((b) =>
        filters.paymentStatuses.includes(b.paymentStatus),
      );
    }
    if (filters.createdFrom) {
      results = results.filter((b) => b.createdAtISO >= filters.createdFrom);
    }
    if (filters.createdTo) {
      results = results.filter((b) => b.createdAtISO <= filters.createdTo);
    }
    if (filters.checkInFrom) {
      results = results.filter((b) => b.checkInISO >= filters.checkInFrom);
    }
    if (filters.checkInTo) {
      results = results.filter((b) => b.checkInISO <= filters.checkInTo);
    }
    if (filters.agency && filters.agency !== "Todas") {
      results = results.filter((b) => b.agency === filters.agency);
    }
    if (filters.seller && filters.seller !== "Todos") {
      results = results.filter((b) => b.seller === filters.seller);
    }

    return results;
  }

  return {
    bookings,
    agencyOptions,
    sellerOptions,
    getBookingById,
    filterBookings,
  };
}
