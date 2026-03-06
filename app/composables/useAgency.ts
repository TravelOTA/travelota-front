import { ref } from "vue";

// Global mock state for the Agency B2B Branding
const globalAgency = ref({
  name: "Viajes El Corte Inglés",
  rut: "B-12345678",
  country: "España",
  email: "b2b@elcorteingles.es",
  phone: "+34 91 418 88 00",
  address: "Hermosilla 112, Madrid, España",
  logo: "https://ui-avatars.com/api/?name=V+C&color=0284c7&background=e0f2fe",
  primaryColor: "sky",
  registeredAt: "2024-03-15",
  status: "Activa",
  usersCount: 8,
  bookingsCount: 312,
  nextSettlement: "2026-04-01",
});

export const useAgency = () => {
  const updateAgency = (newData: Partial<typeof globalAgency.value>) => {
    globalAgency.value = { ...globalAgency.value, ...newData };
  };

  return {
    agency: globalAgency,
    updateAgency,
  };
};
