import { z } from "zod";

export const checkoutSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string(),
  phone_code: z.string(),
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pin_code: z
    .string()
    .min(5, "Pincode is too short")
    .max(10, "Pincode is too long"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;