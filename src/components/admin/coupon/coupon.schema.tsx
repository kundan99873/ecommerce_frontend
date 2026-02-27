import { z } from "zod";

export const couponSchema = z
  .object({
    code: z
      .string()
      .min(1, "Code is required")
      .transform((v) => v.toUpperCase()),
    description: z.string().optional(),
    discount_type: z.enum(["PERCENTAGE", "FIXED"]),
    discount_value: z
      .number({ message: "Required" })
      .positive("Must be positive"),
    start_date: z.date({ message: "Start date is required" }),
    end_date: z.date({ message: "End date is required" }),
    max_uses: z.number().nullable().optional(),
    min_purchase: z.number().nullable().optional(),
    is_active: z.boolean(),
    is_global: z.boolean(),
    product_ids: z.array(z.number()).optional(),
  })
  .refine((d) => d.end_date > d.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  })
  .refine((d) => {
    if (d.discount_type === "PERCENTAGE") {
      return d.discount_value > 0 && d.discount_value <= 100;
    }
    return d.discount_value > 0;
  }, "Invalid discount value")
  .refine((d) => {
    if (d.is_global) {
      return !d.product_ids || d.product_ids.length === 0;
    }
    return true;
  }, "Global coupons cannot have specific products")
  .refine((d) => {
    if (!d.is_global) {
      return d.product_ids && d.product_ids.length > 0;
    }
    return true;
  }, "Non-global coupons must have at least one product");

export type CouponFormValues = z.infer<typeof couponSchema>;
