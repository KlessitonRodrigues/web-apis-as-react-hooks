import { z } from "zod";

const userSchema = {
  id: z.string().default(""),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .default(""),
  phone2: z.string().default(""),
  addressStreet: z
    .string()
    .min(2, "Street must be at least 2 characters")
    .default(""),
  addressCity: z
    .string()
    .min(2, "City must be at least 2 characters")
    .default(""),
  addressState: z
    .string()
    .min(2, "State must be at least 2 characters")
    .default(""),
  addressZip: z
    .string()
    .min(5, "Zip code must be at least 5 digits")
    .default(""),
};

export const createUserSchema = z.object({
  phone: userSchema.phone,
  phone2: userSchema.phone2,
  addressStreet: userSchema.addressStreet,
  addressCity: userSchema.addressCity,
  addressState: userSchema.addressState,
  addressZip: userSchema.addressZip,
});
