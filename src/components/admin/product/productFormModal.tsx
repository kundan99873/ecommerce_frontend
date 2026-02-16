import { useEffect, useState, useRef, DragEvent, ChangeEvent } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/data/products";
import { Loader2, Plus, Trash2, Upload, X, Star } from "lucide-react";

// ─── Types ───

interface VariantImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

const variantSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  originalPrice: z.number({ invalid_type_error: "Required" }).positive("Must be positive"),
  discountedPrice: z.number({ invalid_type_error: "Required" }).positive("Must be positive"),
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
  price: z.number({ invalid_type_error: "Price is required" }).positive("Must be positive"),
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

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: ProductFormValues & { id?: number };
  onSubmit: (values: ProductFormValues) => void;
  isLoading?: boolean;
}

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ProductFormModal = ({ open, onOpenChange, defaultValues, onSubmit, isLoading }: ProductFormModalProps) => {
  const isEdit = !!defaultValues?.id;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", slug: "", price: 0, brand: "", category: "", description: "",
      image: "", inStock: true, active: true,
      variants: [{ color: "", size: "", sku: "", originalPrice: 0, discountedPrice: 0, stock: 0, isActive: true, images: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "variants" });
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (open && defaultValues) {
      form.reset({
        name: defaultValues.name || "",
        slug: defaultValues.slug || generateSlug(defaultValues.name || ""),
        price: defaultValues.price || 0,
        brand: defaultValues.brand || "",
        category: defaultValues.category || "",
        description: defaultValues.description || "",
        image: defaultValues.image || "",
        inStock: defaultValues.inStock ?? true,
        active: defaultValues.active ?? true,
        variants: defaultValues.variants?.length
          ? defaultValues.variants
          : [{ color: "", size: "", sku: "", originalPrice: 0, discountedPrice: 0, stock: 0, isActive: true, images: [] }],
      });
      setSlugEdited(true);
    } else if (open) {
      form.reset({
        name: "", slug: "", price: 0, brand: "", category: "", description: "",
        image: "", inStock: true, active: true,
        variants: [{ color: "", size: "", sku: "", originalPrice: 0, discountedPrice: 0, stock: 0, isActive: true, images: [] }],
      });
      setSlugEdited(false);
    }
  }, [open, defaultValues]);

  const watchName = form.watch("name");
  useEffect(() => {
    if (!slugEdited && watchName) {
      form.setValue("slug", generateSlug(watchName));
    }
  }, [watchName, slugEdited]);

  const handleSubmit = form.handleSubmit((values) => onSubmit(values));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Controller control={form.control} name="name" render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label>Name *</Label>
                  <Input {...field} placeholder="Product name" className={fieldState.error ? "border-destructive" : ""} />
                  {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                </div>
              )} />
              <Controller control={form.control} name="slug" render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label>Slug *</Label>
                  <Input {...field} onChange={(e) => { setSlugEdited(true); field.onChange(e); }} placeholder="auto-generated" className={fieldState.error ? "border-destructive" : ""} />
                  {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                </div>
              )} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Controller control={form.control} name="price" render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label>Base Price *</Label>
                  <Input type="number" step="0.01" value={field.value || ""} onChange={(e) => field.onChange(+e.target.value)} className={fieldState.error ? "border-destructive" : ""} />
                  {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                </div>
              )} />
              <Controller control={form.control} name="brand" render={({ field }) => (
                <div className="space-y-1">
                  <Label>Brand</Label>
                  <Input {...field} placeholder="Brand name" />
                </div>
              )} />
              <Controller control={form.control} name="category" render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label>Category *</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={fieldState.error ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "All").map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                </div>
              )} />
            </div>
            <Controller control={form.control} name="description" render={({ field }) => (
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea {...field} placeholder="Product description..." rows={2} />
              </div>
            )} />
            <Controller control={form.control} name="image" render={({ field }) => (
              <div className="space-y-1">
                <Label>Main Image URL</Label>
                <Input {...field} placeholder="https://..." />
                {field.value && <img src={field.value} alt="preview" className="h-16 w-16 rounded-lg object-cover mt-1" />}
              </div>
            )} />
            <div className="flex items-center gap-6">
              <Controller control={form.control} name="inStock" render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  <Label>In Stock</Label>
                </div>
              )} />
              <Controller control={form.control} name="active" render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  <Label>Active</Label>
                </div>
              )} />
            </div>
          </div>

          <Separator />

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Variants</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ color: "", size: "", sku: "", originalPrice: 0, discountedPrice: 0, stock: 0, isActive: true, images: [] })}>
                <Plus className="h-4 w-4 mr-1" /> Add Variant
              </Button>
            </div>
            {form.formState.errors.variants?.root && (
              <p className="text-xs text-destructive">{form.formState.errors.variants.root.message}</p>
            )}
            {fields.map((f, idx) => (
              <VariantField key={f.id} control={form.control} index={idx} canRemove={fields.length > 1} onRemove={() => remove(idx)} setValue={form.setValue} watch={form.watch} errors={form.formState.errors} />
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
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

// ─── Variant Field Component ───

interface VariantFieldProps {
  control: any;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  setValue: any;
  watch: any;
  errors: any;
}

const VariantField = ({ control, index, canRemove, onRemove, setValue, watch, errors }: VariantFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const images: VariantImage[] = watch(`variants.${index}.images`) || [];
  const variantErrors = errors?.variants?.[index];

  const processFiles = (files: FileList | File[]) => {
    const valid = Array.from(files).filter(f => ACCEPTED_TYPES.includes(f.type) && f.size <= 5 * 1024 * 1024);
    if (!valid.length) return;
    const newImgs: VariantImage[] = valid.map(f => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(f),
      isPrimary: false,
    }));
    const current = images;
    if (current.length === 0 && newImgs.length > 0) newImgs[0].isPrimary = true;
    setValue(`variants.${index}.images`, [...current, ...newImgs], { shouldValidate: true });
  };

  const removeImage = (imgId: string) => {
    let imgs = images.filter(i => i.id !== imgId);
    if (imgs.length > 0 && !imgs.some(i => i.isPrimary)) imgs[0].isPrimary = true;
    setValue(`variants.${index}.images`, imgs, { shouldValidate: true });
  };

  const setPrimary = (imgId: string) => {
    setValue(`variants.${index}.images`, images.map(i => ({ ...i, isPrimary: i.id === imgId })), { shouldValidate: true });
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  return (
    <div className="border rounded-xl p-4 space-y-3 bg-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">Variant {index + 1}</h4>
          <Controller control={control} name={`variants.${index}.isActive`} render={({ field }) => (
            <Badge variant={field.value ? "outline" : "secondary"} className="text-xs">{field.value ? "Active" : "Inactive"}</Badge>
          )} />
        </div>
        <div className="flex items-center gap-2">
          <Controller control={control} name={`variants.${index}.isActive`} render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )} />
          {canRemove && (
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Controller control={control} name={`variants.${index}.color`} render={({ field, fieldState }) => (
          <div className="space-y-1">
            <Label className="text-xs">Color</Label>
            <Input {...field} placeholder="e.g. Navy" className={fieldState.error ? "border-destructive" : ""} />
            {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />
        <Controller control={control} name={`variants.${index}.size`} render={({ field }) => (
          <div className="space-y-1">
            <Label className="text-xs">Size</Label>
            <Input {...field} placeholder="e.g. M" />
          </div>
        )} />
        <Controller control={control} name={`variants.${index}.sku`} render={({ field, fieldState }) => (
          <div className="space-y-1">
            <Label className="text-xs">SKU *</Label>
            <Input {...field} placeholder="e.g. SKU-001" className={fieldState.error ? "border-destructive" : ""} />
            {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Controller control={control} name={`variants.${index}.originalPrice`} render={({ field, fieldState }) => (
          <div className="space-y-1">
            <Label className="text-xs">Original Price *</Label>
            <Input type="number" min={0} value={field.value || ""} onChange={e => field.onChange(+e.target.value)} className={fieldState.error ? "border-destructive" : ""} />
            {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />
        <Controller control={control} name={`variants.${index}.discountedPrice`} render={({ field, fieldState }) => (
          <div className="space-y-1">
            <Label className="text-xs">Discounted Price *</Label>
            <Input type="number" min={0} value={field.value || ""} onChange={e => field.onChange(+e.target.value)} className={fieldState.error ? "border-destructive" : ""} />
            {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
          </div>
        )} />
        <Controller control={control} name={`variants.${index}.stock`} render={({ field }) => (
          <div className="space-y-1">
            <Label className="text-xs">Stock *</Label>
            <Input type="number" min={0} value={field.value || ""} onChange={e => field.onChange(+e.target.value)} />
          </div>
        )} />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-xs">Variant Images *</Label>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : variantErrors?.images ? "border-destructive" : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">Drag & drop or <span className="text-primary font-medium">browse</span></p>
          <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden" onChange={(e: ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) processFiles(e.target.files); e.target.value = ""; }} />
        </div>
        {variantErrors?.images && <p className="text-xs text-destructive">{variantErrors.images.message}</p>}

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                <img src={img.url} alt="" className={`h-16 w-16 rounded-lg object-cover border-2 ${img.isPrimary ? "border-primary" : "border-transparent"}`} />
                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(img.id); }} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-3 w-3" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); setPrimary(img.id); }} className={`absolute bottom-0.5 left-0.5 p-0.5 rounded-full ${img.isPrimary ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"} transition-opacity`}>
                  <Star className={`h-3 w-3 ${img.isPrimary ? "fill-primary" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFormModal;
