import { z } from "zod";

export const hotelManualMetadataSchema = z.object({
  type: z.literal("hotel"),
  hotelName: z.string().min(1),
  destination: z.string().min(1),
  checkin: z.string().min(1), // ISO date YYYY-MM-DD
  checkout: z.string().min(1), // ISO date YYYY-MM-DD
  roomType: z.string().min(1),
  regime: z.enum(["SA", "AD", "MP", "PC", "TI"]),
});

export const transferMetadataSchema = z.object({
  type: z.literal("transfer"),
  origin: z.string().min(1),
  destination: z.string().min(1),
  pickupDatetime: z.string().min(1), // ISO datetime
  vehicleType: z.enum(["sedan", "van", "bus", "other"]),
  passengerCapacity: z.number().int().min(1),
});

export const flightMetadataSchema = z.object({
  type: z.literal("flight"),
  origin: z.string().min(1),
  destination: z.string().min(1),
  departureDatetime: z.string().min(1), // ISO datetime
  arrivalDatetime: z.string().min(1), // ISO datetime
  flightNumber: z.string().min(1),
  airline: z.string().min(1),
  cabin: z.enum(["economy", "business", "first"]),
});

export const excursionMetadataSchema = z.object({
  type: z.literal("excursion"),
  activityName: z.string().min(1),
  location: z.string().min(1),
  datetime: z.string().min(1), // ISO datetime
  duration: z.string().min(1),
  includesTransport: z.boolean(),
});

export const extraMetadataSchema = z.object({
  type: z.literal("extra"),
  name: z.string().min(1),
  description: z.string().min(1),
  managementDate: z.string().optional(),
});

export const itineraryOptionMetadataSchema = z.discriminatedUnion("type", [
  hotelManualMetadataSchema,
  transferMetadataSchema,
  flightMetadataSchema,
  excursionMetadataSchema,
  extraMetadataSchema,
]);

export type HotelManualMetadata = z.infer<typeof hotelManualMetadataSchema>;
export type TransferMetadata = z.infer<typeof transferMetadataSchema>;
export type FlightMetadata = z.infer<typeof flightMetadataSchema>;
export type ExcursionMetadata = z.infer<typeof excursionMetadataSchema>;
export type ExtraMetadata = z.infer<typeof extraMetadataSchema>;
export type ItineraryOptionMetadata = z.infer<
  typeof itineraryOptionMetadataSchema
>;
