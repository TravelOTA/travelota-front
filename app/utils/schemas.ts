import { z } from 'zod';

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
  markupPercentage: z.number().default(0),
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
  type: z.enum(['hotel', 'flight', 'transfer', 'activity']),
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

type T = (key: string, params?: Record<string, unknown>) => string;

export const createLoginSchema = (t: T) =>
  z.object({
    email: z.string().email(t('validation.emailInvalid')),
    password: z.string().min(6, t('validation.passwordMinLength', { min: 6 })),
    rememberMe: z.boolean().optional(),
  });

export const createRegisterSchema = (t: T) =>
  z.object({
    nombreComercial: z.string().min(2, t('validation.commercialNameRequired')),
    direccionRegistrada: z.string().min(2, t('validation.addressRequired')),
    nif: z.string().min(5, t('validation.nifInvalid')),
    telefono: z.string().min(9, t('validation.phoneInvalid')),
    email: z.string().email(t('validation.emailInvalid')),
    web: z
      .string()
      .url(t('validation.urlInvalid'))
      .optional()
      .or(z.literal('')),
    pais: z.string().min(1, t('validation.countryRequired')),
    nombreContacto: z.string().min(2, t('validation.contactNameRequired')),
    aceptaPrivacidad: z.boolean().refine((val) => val === true, {
      message: t('validation.privacyRequired'),
    }),
  });

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;

export const createCardSchema = (t: T) =>
  z.object({
    number: z
      .string()
      .min(1, t('validation.cardNumberRequired'))
      .regex(/^\d{16}$/, t('validation.cardNumberInvalid')),
    expiry: z
      .string()
      .min(1, t('validation.cardExpiryRequired'))
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, t('validation.cardExpiryInvalid')),
    cvv: z
      .string()
      .min(1, t('validation.cardCvvRequired'))
      .regex(/^\d{3,4}$/, t('validation.cardCvvInvalid')),
  });

export type CardInput = z.infer<ReturnType<typeof createCardSchema>>;
