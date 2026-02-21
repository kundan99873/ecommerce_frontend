import type z from "zod";
import type { productSchema } from "./product.schema";
import type { Product } from "@/services/product/product.types";

export interface VariantImage {
  id: string | number;
  url: string;
  file: File;
  isPrimary: boolean;
}

export interface VariantFieldProps {
  control: any;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  setValue: any;
  watch: any;
  errors: any;
}

export type ProductFormValues = z.infer<typeof productSchema>;

export interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Product;
  onSubmit: (values: FormData) => void;
  isLoading?: boolean;
}