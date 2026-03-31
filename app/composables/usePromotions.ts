export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  destination: string;
  badge?: string;
  badgeColor?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "error"
    | "neutral";
}

// Mock data — Super Admin would configure these via admin panel
const mockPromotions: Promotion[] = [
  {
    id: "promo-1",
    title: "Resorts en Punta Cana",
    subtitle: "Todo Incluido • Reservas hasta fin de mes",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    destination: "Punta Cana",
    badge: "-20%",
    badgeColor: "error",
  },
  {
    id: "promo-2",
    title: "Escapadas Mágicas Madrid",
    subtitle: "Hoteles céntricos 4 estrellas en Gran Vía",
    image:
      "https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    destination: "Madrid",
  },
  {
    id: "promo-3",
    title: "Lujo B2B en Dubai",
    subtitle: "Condiciones especiales para agencias TOP",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    destination: "Dubai",
    badge: "NUEVO",
    badgeColor: "primary",
  },
];

export const usePromotions = () => {
  const promotions = useState<Promotion[]>("promotions", () => mockPromotions);

  return { promotions };
};
