import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus } from "lucide-react";
import VariantField from "./varientField";
import { productSchema } from "./product.schema";
import { useGetCategory } from "@/services/category/category.query";
import type { ProductFormModalProps, ProductFormValues } from "./product.types";

const ProductFormModal = ({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isLoading,
}: ProductFormModalProps) => {
  const isEdit = !!defaultValues?.slug;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brand: "",
      category: "",
      description: "",
      inStock: true,
      active: true,
      variants: [
        {
          color: "",
          size: "",
          originalPrice: 0,
          discountedPrice: 0,
          stock: 0,
          isActive: true,
          images: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const { data: categoryData } = useGetCategory();

  useEffect(() => {
    if (open && defaultValues) {
      form.reset({
        name: defaultValues.name || "",
        brand: defaultValues.brand || "",
        category: defaultValues.category?.slug || "",
        description: defaultValues.description || "",
        inStock: true,
        active: true,
        variants: defaultValues.variants?.length
          ? defaultValues.variants.map((v: any) => ({
              color: v.color || "",
              size: v.size || "",
              originalPrice: v.original_price || 0,
              discountedPrice: v.discounted_price || 0,
              stock: v.stock || 0,
              isActive: v.isActive ?? true,
              id: v.id,
              images:
                v.images?.map((img: any, idx: number) => ({
                  id: img.id || idx,
                  url: img.image_url || img.url || "",
                  isPrimary: img.isPrimary ?? false,
                })) || [],
            }))
          : [
              {
                color: "",
                size: "",
                originalPrice: 0,
                discountedPrice: 0,
                stock: 0,
                isActive: true,
                images: [],
              },
            ],
      });
      // setSlugEdited(true);
    } else if (open) {
      form.reset({
        name: "",
        brand: "",
        category: "",
        description: "",
        inStock: true,
        active: true,
        variants: [
          {
            color: "",
            size: "",
            originalPrice: 0,
            discountedPrice: 0,
            stock: 0,
            isActive: true,
            images: [],
          },
        ],
      });
    }
  }, [open, defaultValues]);

  const handleSubmit = form.handleSubmit((values) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("brand", values.brand || "");
    formData.append("category", values.category);
    formData.append("description", values.description || "");
    formData.append("inStock", String(values.inStock));
    formData.append("active", String(values.active));

    const variantsWithoutImages = values.variants.map((v) => ({
      color: v.color,
      size: v.size,
      id: v.id,
      original_price: v.originalPrice,
      discounted_price: v.discountedPrice,
      stock: v.stock,
      isActive: v.isActive,
      primary_image_index: v.images.findIndex((img) => img.isPrimary) ?? 0,
      ...(isEdit && { removed_image_ids: v.removed_image_ids || null }),
    }));

    formData.append("variants", JSON.stringify(variantsWithoutImages));

    values.variants.forEach((variant, index) => {
      console.log({ variant });
      variant.images?.forEach((img) => {
        if (img instanceof File) {
          formData.append(`variants[${index}]`, img);
        } else if ((img as any).file) {
          formData.append(`variants[${index}]`, (img as any).file);
        }
      });
    });

    onSubmit(formData);
  });

  // console.log({err: form.formState.errors})

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h3>
            <div className="grid gap-4">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <Label>Name *</Label>
                    <Input
                      {...field}
                      placeholder="Product name"
                      className={fieldState.error ? "border-destructive" : ""}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <div className="space-y-1">
                    <Label>Brand</Label>
                    <Input {...field} placeholder="Brand name" />
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <Label>Category *</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={
                          fieldState.error
                            ? "border-destructive w-full"
                            : " w-full"
                        }
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryData?.data.map((c) => (
                          <SelectItem key={c.slug} value={c.slug}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea
                    {...field}
                    placeholder="Product description..."
                    rows={2}
                  />
                </div>
              )}
            />
            <div className="flex items-center gap-6">
              <Controller
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label>In Stock</Label>
                  </div>
                )}
              />
              <Controller
                control={form.control}
                name="active"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label>Active</Label>
                  </div>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Variants
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    color: "",
                    size: "",
                    originalPrice: 0,
                    discountedPrice: 0,
                    stock: 0,
                    isActive: true,
                    images: [],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add Variant
              </Button>
            </div>
            {form.formState.errors.variants?.root && (
              <p className="text-xs text-destructive">
                {form.formState.errors.variants.root.message}
              </p>
            )}
            {fields.map((f, idx) => (
              <VariantField
                key={f.id}
                control={form.control}
                index={idx}
                canRemove={fields.length > 1}
                onRemove={() => remove(idx)}
                setValue={form.setValue}
                watch={form.watch}
                errors={form.formState.errors}
              />
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
