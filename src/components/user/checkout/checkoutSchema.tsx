import { z } from "zod";

export const checkoutSchema = z.object({
  first_name: z.string().trim().min(2, "First name is required"),
  last_name: z.string().trim().min(2, "Last name is required"),
  phone_number: z
    .string()
    .trim()
    .regex(/^\+\d{7,15}$/, "Enter a valid phone number"),
  phone_code: z
    .string()
    .trim()
    .regex(/^\+\d{1,4}$/, "Enter a valid phone code"),
  line1: z.string().trim().min(2, "Address is required"),
  line2: z.string().trim().max(255).optional(),
  landmark: z.string().trim().max(255).optional(),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  country: z.string().trim().min(2, "Country is required"),
  pin_code: z
    .string()
    .trim()
    .min(5, "Pincode is too short")
    .max(10, "Pincode is too long"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
