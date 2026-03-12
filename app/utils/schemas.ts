import { z } from "zod";

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
