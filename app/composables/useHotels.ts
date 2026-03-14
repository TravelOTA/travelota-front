import { useState } from "#imports";

export interface HotelRoomOffer {
  name: string;
  regimen: string;
  cancellation: string;
  price: number;
  onRequest?: boolean;
}

export interface Hotel {
  id: number;
  name: string;
  stars: number;
  location: string;
  coordinates: [number, number];
  image: string;
  bestPrice: number;
  rooms: HotelRoomOffer[];
}

export interface HotelFilterState {
  hotelName: string;
  priceMin: number;
  priceMax: number;
  categories: string[];
  regimes: string[];
  hideNR: boolean;
  hideOR: boolean;
}

const hotelImages = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

const MOCK_HOTELS: Hotel[] = [
  {
    id: 1,
    name: "Serenade Punta Cana Beach & Spa Resort",
    stars: 5,
    location: "Punta Cana, DO",
    coordinates: [18.6631, -68.397],
    image: hotelImages[0],
    bestPrice: 1041.33,
    rooms: [
      {
        name: "Luxury tropical garden view",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1041.33,
      },
      {
        name: "Luxury master suite",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1228.82,
      },
    ],
  },
  {
    id: 2,
    name: "JOIA Bavaro BY IBEROSTAR",
    stars: 5,
    location: "Punta Cana, DO",
    coordinates: [18.705, -68.423],
    image: hotelImages[1],
    bestPrice: 2454.66,
    rooms: [
      {
        name: "Suite Premium",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 2454.66,
      },
      {
        name: "Suite Deluxe",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 2749.2,
        onRequest: true,
      },
    ],
  },
  {
    id: 3,
    name: "Iberostar WAVES DOMINICANA",
    stars: 5,
    location: "Playa Bavaro, DO",
    coordinates: [18.7035, -68.4215],
    image: hotelImages[2],
    bestPrice: 1118.76,
    rooms: [
      {
        name: "Premium vista tropical",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1118.76,
      },
      {
        name: "Premium cerca de la playa",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 1171.68,
        onRequest: true,
      },
    ],
  },
  {
    id: 4,
    name: "Grand Palladium Palace Resort",
    stars: 5,
    location: "Punta Cana, DO",
    coordinates: [18.686, -68.411],
    image: hotelImages[3],
    bestPrice: 1350.0,
    rooms: [
      {
        name: "Junior Suite",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 1350.0,
      },
      {
        name: "Suite familiar",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1580.5,
      },
    ],
  },
  {
    id: 5,
    name: "Barceló Bávaro Beach",
    stars: 5,
    location: "Playa Bavaro, DO",
    coordinates: [18.6655, -68.3955],
    image: hotelImages[4],
    bestPrice: 985.4,
    rooms: [
      {
        name: "Superior",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 985.4,
      },
      {
        name: "Premium",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 1120.0,
      },
    ],
  },
  {
    id: 6,
    name: "Riu Palace Punta Cana",
    stars: 5,
    location: "Punta Cana, DO",
    coordinates: [18.724, -68.435],
    image: hotelImages[0],
    bestPrice: 1425.9,
    rooms: [
      {
        name: "Doble estándar",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 1425.9,
      },
      {
        name: "Junior Suite",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 1650.0,
      },
    ],
  },
  {
    id: 7,
    name: "Meliá Caribe Beach Resort",
    stars: 5,
    location: "Playa Bavaro, DO",
    coordinates: [18.667, -68.399],
    image: hotelImages[1],
    bestPrice: 1289.0,
    rooms: [
      {
        name: "The Level Suite",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 1289.0,
      },
    ],
  },
  {
    id: 8,
    name: "Secrets Royal Beach",
    stars: 5,
    location: "Punta Cana, DO",
    coordinates: [18.675, -68.405],
    image: hotelImages[2],
    bestPrice: 2100.5,
    rooms: [
      {
        name: "Junior Suite Tropical",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 2100.5,
      },
      {
        name: "Preferred Club Suite",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 2450.0,
      },
    ],
  },
  {
    id: 9,
    name: "Hotel Whala Bávaro",
    stars: 3,
    location: "Playa Bavaro, DO",
    coordinates: [18.68, -68.41],
    image: hotelImages[3],
    bestPrice: 420.0,
    rooms: [
      {
        name: "Habitación estándar",
        regimen: "SA",
        cancellation: "No reembolsable",
        price: 420.0,
      },
      {
        name: "Habitación superior",
        regimen: "CP",
        cancellation: "Gastos de cancelación",
        price: 510.75,
      },
    ],
  },
  {
    id: 10,
    name: "Occidental Punta Cana",
    stars: 4,
    location: "Punta Cana, DO",
    coordinates: [18.685, -68.42],
    image: hotelImages[4],
    bestPrice: 780.25,
    rooms: [
      {
        name: "Doble estándar",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 780.25,
      },
      {
        name: "Suite",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 920.0,
      },
    ],
  },
  {
    id: 11,
    name: "Hard Rock Hotel & Casino Punta Cana",
    stars: 5,
    location: "Punta Cana, DO",
    coordinates: [18.73, -68.46],
    image: hotelImages[0],
    bestPrice: 2800.0,
    rooms: [
      {
        name: "Rock Royalty Suite",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 3200.0,
      },
      {
        name: "Islander Junior Suite",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 2800.0,
      },
    ],
  },
  {
    id: 12,
    name: "Majestic Elegance Punta Cana",
    stars: 5,
    location: "Playa Bavaro, DO",
    coordinates: [18.72, -68.445],
    image: hotelImages[1],
    bestPrice: 1550.75,
    rooms: [
      {
        name: "Elegance Club Suite",
        regimen: "TI",
        cancellation: "No reembolsable",
        price: 1550.75,
      },
    ],
  },
  {
    id: 13,
    name: "Bahia Principe Grand Bavaro",
    stars: 4,
    location: "Punta Cana, DO",
    coordinates: [18.718, -68.44],
    image: hotelImages[2],
    bestPrice: 850.5,
    rooms: [
      {
        name: "Superior Junior Suite",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 850.5,
      },
    ],
  },
  {
    id: 14,
    name: "Sanctuary Cap Cana",
    stars: 5,
    location: "Cap Cana, DO",
    coordinates: [18.52, -68.39],
    image: hotelImages[3],
    bestPrice: 3500.0,
    rooms: [
      {
        name: "Monarch Villa",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 4200.0,
      },
      {
        name: "Castle Suite",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 3500.0,
      },
    ],
  },
  {
    id: 15,
    name: "Nickelodeon Hotels & Resorts",
    stars: 5,
    location: "Uvero Alto, DO",
    coordinates: [18.81, -68.58],
    image: hotelImages[4],
    bestPrice: 2100.25,
    rooms: [
      {
        name: "Pad Suite",
        regimen: "TI",
        cancellation: "Gastos de cancelación",
        price: 2100.25,
      },
      {
        name: "Pineapple Villa",
        regimen: "TI",
        cancellation: "Cancelación gratuita",
        price: 5500.0,
      },
    ],
  },
];

export function useHotels() {
  const hotels = useState<Hotel[]>("hotels", () => MOCK_HOTELS);

  function getHotelById(id: number | string): Hotel | undefined {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    return hotels.value.find((h) => h.id === numericId);
  }

  function filterHotels(filters: HotelFilterState): Hotel[] {
    return hotels.value
      .filter((h) => {
        // Name search
        if (
          filters.hotelName &&
          !h.name.toLowerCase().includes(filters.hotelName.toLowerCase())
        )
          return false;
        // Price range
        if (h.bestPrice < filters.priceMin || h.bestPrice > filters.priceMax)
          return false;
        // Category (stars)
        if (
          filters.categories.length > 0 &&
          !filters.categories.includes(String(h.stars))
        )
          return false;
        // Regime
        if (filters.regimes.length > 0) {
          const hotelRegimes = h.rooms.map((r) => r.regimen);
          if (!filters.regimes.some((reg) => hotelRegimes.includes(reg)))
            return false;
        }

        // Non-Refundable filtering
        if (filters.hideNR) {
          const hasRefundableRooms = h.rooms.some(
            (r) =>
              !String(r.cancellation || "")
                .toLowerCase()
                .includes("no reembolsable"),
          );
          if (!hasRefundableRooms) return false;
        }

        // On Request filtering
        if (filters.hideOR) {
          const hasInstantRooms = h.rooms.some((r) => !r.onRequest);
          if (!hasInstantRooms) return false;
        }

        return true;
      })
      .map((h) => {
        let filteredRooms = h.rooms;

        // Strip NR rooms
        if (filters.hideNR) {
          filteredRooms = filteredRooms.filter(
            (r) =>
              !String(r.cancellation || "")
                .toLowerCase()
                .includes("no reembolsable"),
          );
        }
        // Strip OR rooms
        if (filters.hideOR) {
          filteredRooms = filteredRooms.filter((r) => !r.onRequest);
        }

        return {
          ...h,
          rooms: filteredRooms,
        };
      });
  }

  return {
    hotels,
    getHotelById,
    filterHotels,
  };
}
