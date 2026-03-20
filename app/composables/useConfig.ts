import { useState, useI18n } from "#imports";
import { computed } from "vue";
import type { PaymentMethod as PaymentMethodKey } from "#shared/types/payment";

export interface PaymentMethodConfig {
  key: PaymentMethodKey;
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

export function useConfig() {
  const { t } = useI18n();

  const countries = useState<string[]>("config-countries", () => COUNTRIES);
  const destinations = useState<string[]>(
    "config-destinations",
    () => DESTINATIONS,
  );
  const nationalities = useState<string[]>(
    "config-nationalities",
    () => NATIONALITIES,
  );
  const paymentMethods = computed<PaymentMethodConfig[]>(() => [
    {
      key: "card",
      label: t("hotels.paymentMethods.card.label"),
      description: t("hotels.paymentMethods.card.description"),
      icon: "i-heroicons-credit-card",
    },
    {
      key: "transfer",
      label: t("hotels.paymentMethods.transfer.label"),
      description: t("hotels.paymentMethods.transfer.description"),
      icon: "i-heroicons-building-library",
    },
    {
      key: "agency_credit",
      label: t("hotels.paymentMethods.agencyCredit.label"),
      description: t("hotels.paymentMethods.agencyCredit.description"),
      icon: "i-heroicons-banknotes",
    },
  ]);

  return {
    countries,
    destinations,
    nationalities,
    paymentMethods,
  };
}
