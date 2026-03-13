import { z } from "zod";

// --- Domain schemas ---

export const agencySchema = z.object({
  name: z.string(),
  rut: z.string(),
  country: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  logo: z.string().optional(),
  primaryColor: z.string(),
  registeredAt: z.string(),
  status: z.string(),
  usersCount: z.number(),
  bookingsCount: z.number(),
  nextSettlement: z.string(),
});

export type Agency = z.infer<typeof agencySchema>;

const itineraryOptionSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  name: z.string(),
  image: z.string(),
  description: z.string(),
  netPrice: z.number(),
  isSelected: z.boolean().optional(),
});

const itineraryBlockSchema = z.object({
  id: z.string(),
  type: z.enum(["hotel", "flight", "transfer", "activity"]),
  title: z.string(),
  date: z.string(),
  options: z.array(itineraryOptionSchema),
});

export const itinerarySchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  clientName: z.string(),
  rooms: z.array(
    z.object({
      adults: z.number(),
      children: z.array(z.object({ age: z.number() })),
    }),
  ),
  origin: z.string(),
  markupPercentage: z.number(),
  blocks: z.array(itineraryBlockSchema),
});

export type ItineraryPayload = z.infer<typeof itinerarySchema>;

// --- Auth schemas ---

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  nombreComercial: z.string().min(2, "Nombre comercial requerido"),
  razonSocial: z.string().min(2, "Razón social requerida"),
  nif: z.string().min(5, "NIF/CIF inválido"),
  telefono: z.string().min(9, "Teléfono inválido"),
  email: z.string().email("Email inválido"),
  web: z.string().url("URL inválida").optional().or(z.literal("")),
  pais: z.string().min(1, "Selecciona un país"),
  nombreContacto: z.string().min(2, "Nombre de contacto requerido"),
  aceptaPrivacidad: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la política de privacidad",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
