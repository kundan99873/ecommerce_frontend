import { z } from "zod";

const variantSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  originalPrice: z.number({ message: "Required" }).positive("Must be positive"),
  discountedPrice: z.number({ message: "Required" }).positive("Must be positive"),
  stock: z.number().int().min(0),
  isActive: z.boolean(),
  images: z.array(z.object({
    id: z.string(),
    url: z.string(),
    isPrimary: z.boolean(),
  })).min(1, "At least 1 image required"),
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  price: z.number({ message: "Price is required" }).positive("Must be positive"),
  brand: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  inStock: z.boolean(),
  active: z.boolean(),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
}).superRefine((data, ctx) => {
  // Unique SKU check
  const skus = data.variants.map(v => v.sku.toLowerCase());
  skus.forEach((sku, i) => {
    if (skus.indexOf(sku) !== i) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Duplicate SKU", path: ["variants", i, "sku"] });
    }
  });
  // Discounted <= Original
  data.variants.forEach((v, i) => {
    if (v.discountedPrice > v.originalPrice) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must be ≤ original price", path: ["variants", i, "discountedPrice"] });
    }
  });
  // Unique color+size combo
  const combos = data.variants.map(v => `${(v.color || "").toLowerCase()}_${(v.size || "").toLowerCase()}`);
  combos.forEach((c, i) => {
    if (c !== "_" && combos.indexOf(c) !== i) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Duplicate color+size", path: ["variants", i, "color"] });
    }
  });
});

export { productSchema, variantSchema };