import { useState } from "#imports";

export interface PaymentMethod {
  key: string;
  label: string;
  description: string;
  icon: string;
}

const COUNTRIES = [
  "Argentina",
  "Chile",
  "Colombia",
  "España",
  "Estados Unidos",
  "México",
  "Perú",
];

const DESTINATIONS = [
  "Punta Cana, República Dominicana",
  "Playa Bavaro, República Dominicana",
  "Cap Cana, República Dominicana",
  "Uvero Alto, República Dominicana",
  "Santo Domingo, República Dominicana",
  "Cancún, México",
  "Riviera Maya, México",
  "Madrid, España",
  "Barcelona, España",
  "Miami, Estados Unidos",
  "Orlando, Estados Unidos",
  "Nueva York, Estados Unidos",
];

const NATIONALITIES = [
  "Alemania",
  "Argentina",
  "Bolivia",
  "Brasil",
  "Canadá",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "España",
  "Estados Unidos",
  "Francia",
  "Guatemala",
  "Honduras",
  "Italia",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "Portugal",
  "Puerto Rico",
  "Reino Unido",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
];

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    key: "credit_card",
    label: "Pago con tarjeta",
    description: "El importe será cargado inmediatamente en tu tarjeta.",
    icon: "i-heroicons-credit-card",
  },
  {
    key: "bank_transfer",
    label: "Transferencia bancaria",
    description:
      "Se generarán los datos bancarios para realizar la transferencia.",
    icon: "i-heroicons-building-library",
  },
  {
    key: "credit",
    label: "Crédito de agencia",
    description:
      "Se descontará del saldo disponible en tu línea de crédito con TravelOTA.",
    icon: "i-heroicons-banknotes",
  },
];

export function useConfig() {
  const countries = useState<string[]>("config-countries", () => COUNTRIES);
  const destinations = useState<string[]>(
    "config-destinations",
    () => DESTINATIONS,
  );
  const nationalities = useState<string[]>(
    "config-nationalities",
    () => NATIONALITIES,
  );
  const paymentMethods = useState<PaymentMethod[]>(
    "config-payment-methods",
    () => PAYMENT_METHODS,
  );

  return {
    countries,
    destinations,
    nationalities,
    paymentMethods,
  };
}
