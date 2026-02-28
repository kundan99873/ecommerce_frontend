import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pin_code: z
    .string()
    .min(5, "Pincode is too short")
    .max(10, "Pincode is too long"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;