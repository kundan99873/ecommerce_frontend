import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Trash2, GripVertical, Upload, X, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

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

interface VariantSectionProps {
  variant: Variant;
  index: number;
  errors: Record<string, string>;
  canRemove: boolean;
  onUpdate: (id: string, field: keyof Variant, value: any) => void;
  onRemove: (id: string) => void;
  onFilesAdd: (variantId: string, files: FileList | File[]) => void;
  onImageRemove: (variantId: string, imageId: string) => void;
  onSetPrimary: (variantId: string, imageId: string) => void;
}

const VariantSection = ({
  variant,
  index,
  errors,
  canRemove,
  onUpdate,
  onRemove,
  onFilesAdd,
  onImageRemove,
  onSetPrimary,
}: VariantSectionProps) => {
  const prefix = `variant_${index}`;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length)
      onFilesAdd(variant.id, e.dataTransfer.files);
  };
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onFilesAdd(variant.id, e.target.files);
    e.target.value = "";
  };

  return (
    <div className="border rounded-xl p-4 space-y-4 bg-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">Variant {index + 1}</h3>
          {variant.isActive ? (
            <Badge variant="outline" className="text-xs">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Inactive
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={variant.isActive}
            onCheckedChange={(c) => onUpdate(variant.id, "isActive", c)}
          />
          {canRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onRemove(variant.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {errors[`${prefix}_combo`] && (
        <p className="text-xs text-destructive">{errors[`${prefix}_combo`]}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Color</Label>
          <Input
            value={variant.color}
            onChange={(e) => onUpdate(variant.id, "color", e.target.value)}
            placeholder="e.g. Navy"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Size</Label>
          <Input
            value={variant.size}
            onChange={(e) => onUpdate(variant.id, "size", e.target.value)}
            placeholder="e.g. M"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">SKU *</Label>
          <Input
            value={variant.sku}
            onChange={(e) => onUpdate(variant.id, "sku", e.target.value)}
            placeholder="e.g. SKU-001"
            className={errors[`${prefix}_sku`] ? "border-destructive" : ""}
          />
          {errors[`${prefix}_sku`] && (
            <p className="text-xs text-destructive">
              {errors[`${prefix}_sku`]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Original Price *</Label>
          <Input
            type="number"
            min={0}
            value={variant.originalPrice || ""}
            onChange={(e) =>
              onUpdate(variant.id, "originalPrice", +e.target.value)
            }
            placeholder="0.00"
            className={
              errors[`${prefix}_originalPrice`] ? "border-destructive" : ""
            }
          />
          {errors[`${prefix}_originalPrice`] && (
            <p className="text-xs text-destructive">
              {errors[`${prefix}_originalPrice`]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Discounted Price *</Label>
          <Input
            type="number"
            min={0}
            value={variant.discountedPrice || ""}
            onChange={(e) =>
              onUpdate(variant.id, "discountedPrice", +e.target.value)
            }
            placeholder="0.00"
            className={
              errors[`${prefix}_discountedPrice`] ? "border-destructive" : ""
            }
          />
          {errors[`${prefix}_discountedPrice`] && (
            <p className="text-xs text-destructive">
              {errors[`${prefix}_discountedPrice`]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Stock *</Label>
          <Input
            type="number"
            min={0}
            value={variant.stock || ""}
            onChange={(e) => onUpdate(variant.id, "stock", +e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-xs">Variant Images *</Label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : errors[`${prefix}_images`]
                ? "border-destructive"
                : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag & drop images or{" "}
            <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG, WEBP • Max 5MB each
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
        {errors[`${prefix}_images`] && (
          <p className="text-xs text-destructive">
            {errors[`${prefix}_images`]}
          </p>
        )}

        {variant.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {variant.images.map((img) => (
              <div key={img.id} className="relative group">
                <div
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${img.isPrimary ? "border-primary" : "border-transparent"}`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                {img.isPrimary && (
                  <Badge className="absolute -top-2 -left-1 text-[10px] px-1.5 py-0 h-4 bg-primary">
                    Primary
                  </Badge>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                  {!img.isPrimary && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetPrimary(variant.id, img.id);
                      }}
                      className="p-1 bg-background rounded-md hover:bg-primary/20"
                      title="Set as primary"
                    >
                      <Star className="h-3.5 w-3.5 text-foreground" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageRemove(variant.id, img.id);
                    }}
                    className="p-1 bg-background rounded-md hover:bg-destructive/20"
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantSection;
