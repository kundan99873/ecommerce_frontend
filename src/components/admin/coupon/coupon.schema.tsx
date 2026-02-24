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
  })
  .refine((d) => d.end_date > d.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  });

export type CouponFormValues = z.infer<typeof couponSchema>;
