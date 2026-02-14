import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/useToast";
import { categories } from "@/data/products";
import VariantSection from "./varientSection";

interface VariantImage {
  id: string;
  url: string;
  file?: File;
  isPrimary: boolean;
}

interface Variant {
  id: string;
  color: string;
  size: string;
  sku: string;
  originalPrice: number;
  discountedPrice: number;
  stock: number;
  isActive: boolean;
  images: VariantImage[];
}

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  isActive: boolean;
}

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const createVariant = (): Variant => ({
  id: crypto.randomUUID(),
  color: "",
  size: "",
  sku: "",
  originalPrice: 0,
  discountedPrice: 0,
  stock: 0,
  isActive: true,
  images: [],
});

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductForm>({
    name: "",
    slug: "",
    description: "",
    brand: "",
    category: "",
    isActive: true,
  });
  const [slugEdited, setSlugEdited] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([createVariant()]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Product field handlers
  const updateProduct = (field: keyof ProductForm, value: string | boolean) => {
    setProduct((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !slugEdited) {
        next.slug = generateSlug(value as string);
      }
      return next;
    });
  };

  // Variant handlers
  const updateVariant = (id: string, field: keyof Variant, value: any) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
  };

  const addVariant = () => setVariants((prev) => [...prev, createVariant()]);

  const removeVariant = (id: string) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  // Image handling
  const processFiles = (variantId: string, files: FileList | File[]) => {
    const fileArr = Array.from(files);
    const valid = fileArr.filter((f) => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        toast({
          title: `${f.name} rejected`,
          description: "Only JPG, PNG, WEBP allowed.",
        });
        return false;
      }
      if (f.size > MAX_FILE_SIZE) {
        toast({
          title: `${f.name} rejected`,
          description: "Max file size is 5MB.",
        });
        return false;
      }
      return true;
    });

    if (!valid.length) return;

    const newImages: VariantImage[] = valid.map((f) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(f),
      file: f,
      isPrimary: false,
    }));

    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v;
        const existing = v.images;
        // If no images yet, make first one primary
        if (existing.length === 0 && newImages.length > 0) {
          newImages[0].isPrimary = true;
        }
        return { ...v, images: [...existing, ...newImages] };
      }),
    );
  };

  const removeImage = (variantId: string, imageId: string) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v;
        let imgs = v.images.filter((img) => img.id !== imageId);
        // If removed image was primary, assign new primary
        if (imgs.length > 0 && !imgs.some((i) => i.isPrimary)) {
          imgs[0].isPrimary = true;
        }
        return { ...v, images: imgs };
      }),
    );
  };

  const setPrimaryImage = (variantId: string, imageId: string) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v;
        return {
          ...v,
          images: v.images.map((img) => ({
            ...img,
            isPrimary: img.id === imageId,
          })),
        };
      }),
    );
  };

  // Validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!product.name.trim()) errs.name = "Product name is required";
    if (!product.slug.trim()) errs.slug = "Slug is required";
    if (!product.category) errs.category = "Category is required";

    if (variants.length === 0) {
      errs.variants = "At least one variant is required";
    }

    const skuSet = new Set<string>();
    const comboSet = new Set<string>();

    variants.forEach((v, i) => {
      const prefix = `variant_${i}`;
      if (!v.sku.trim()) errs[`${prefix}_sku`] = "SKU is required";
      else if (skuSet.has(v.sku)) errs[`${prefix}_sku`] = "Duplicate SKU";
      else skuSet.add(v.sku);

      if (v.originalPrice <= 0) errs[`${prefix}_originalPrice`] = "Required";
      if (v.discountedPrice <= 0)
        errs[`${prefix}_discountedPrice`] = "Required";
      if (v.discountedPrice > v.originalPrice)
        errs[`${prefix}_discountedPrice`] = "Must be ≤ original price";

      const combo = `${v.color.toLowerCase()}_${v.size.toLowerCase()}`;
      if ((v.color || v.size) && comboSet.has(combo)) {
        errs[`${prefix}_combo`] = "Duplicate color + size combination";
      }
      comboSet.add(combo);

      if (v.images.length === 0)
        errs[`${prefix}_images`] = "At least 1 image required";
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast({
        title: "Validation errors",
        description: "Please fix the highlighted fields.",
      });
      return;
    }

    // Mock save
    toast({
      title: "Product created!",
      description: `${product.name} with ${variants.length} variant(s) saved.`,
    });
    navigate("/admin/products");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold">Add Product</h1>
            <p className="text-sm text-muted-foreground">
              Create a new product with variants
            </p>
          </div>
          <Button onClick={handleSubmit}>Save Product</Button>
        </div>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Product Name *</Label>
                <Input
                  value={product.name}
                  onChange={(e) => updateProduct("name", e.target.value)}
                  placeholder="e.g. Cashmere Blend Overcoat"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Slug *</Label>
                <Input
                  value={product.slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    updateProduct("slug", e.target.value);
                  }}
                  placeholder="auto-generated-slug"
                  className={errors.slug ? "border-destructive" : ""}
                />
                {errors.slug && (
                  <p className="text-xs text-destructive">{errors.slug}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select
                  value={product.category}
                  onValueChange={(v) => updateProduct("category", v)}
                >
                  <SelectTrigger
                    className={errors.category ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Brand</Label>
                <Input
                  value={product.brand}
                  onChange={(e) => updateProduct("brand", e.target.value)}
                  placeholder="e.g. Lumière"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={product.description}
                onChange={(e) => updateProduct("description", e.target.value)}
                placeholder="Product description..."
                rows={3}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={product.isActive}
                onCheckedChange={(c) => updateProduct("isActive", c)}
              />
              <Label>Active</Label>
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-display">Variants</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                At least one variant is required
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={addVariant}>
              <Plus className="h-4 w-4 mr-1" /> Add Variant
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.variants && (
              <p className="text-sm text-destructive">{errors.variants}</p>
            )}

            {variants.map((variant, idx) => (
              <VariantSection
                key={variant.id}
                variant={variant}
                index={idx}
                errors={errors}
                canRemove={variants.length > 1}
                onUpdate={updateVariant}
                onRemove={removeVariant}
                onFilesAdd={processFiles}
                onImageRemove={removeImage}
                onSetPrimary={setPrimaryImage}
              />
            ))}
          </CardContent>
        </Card>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Product</Button>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
