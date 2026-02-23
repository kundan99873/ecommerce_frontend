import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import type { VariantFieldProps, VariantImage } from "./product.types";
import { Controller } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star, Trash2, Upload, X } from "lucide-react";

const VariantField = ({
  control,
  index,
  canRemove,
  onRemove,
  setValue,
  watch,
  errors,
}: VariantFieldProps) => {
  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const images: VariantImage[] = watch(`variants.${index}.images`) || [];
  const variantErrors = errors?.variants?.[index];

  const processFiles = (files: FileList | File[]) => {
    const valid = Array.from(files).filter(
      (f) => ACCEPTED_TYPES.includes(f.type) && f.size <= 5 * 1024 * 1024,
    );
    if (!valid.length) return;
    const newImgs: VariantImage[] = valid.map((f) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(f),
      file: f,
      isPrimary: false,
    }));
    const current = images;
    if (current.length === 0 && newImgs.length > 0) newImgs[0].isPrimary = true;

    console.log({ current, newImgs });
    setValue(`variants.${index}.images`, [...current, ...newImgs], {
      shouldValidate: true,
    });
  };

  const removeImage = (imgId: string | number) => {
    const variant = watch(`variants.${index}`);
    const updatedImages = (variant.images || []).filter(
      (i: any) => String(i.id) !== String(imgId),
    );
    if (updatedImages.length && !updatedImages.some((i: any) => i.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }
    setValue(`variants.${index}.images`, updatedImages, {
      shouldValidate: true,
    });
    const removed = variant.removed_image_ids || [];
    if (!removed.includes(imgId) && typeof imgId === "number") {
      setValue(`variants.${index}.removed_image_ids`, [...removed, imgId], {
        shouldValidate: true,
      });
    }
  };

  const setPrimary = (imgId: string | number) => {
    setValue(
      `variants.${index}.images`,
      images.map((i) => ({ ...i, isPrimary: i.id === imgId })),
      { shouldValidate: true },
    );
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  return (
    <div className="border rounded-xl p-4 space-y-3 bg-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">Variant {index + 1}</h4>
          <Controller
            control={control}
            name={`variants.${index}.isActive`}
            render={({ field }) => (
              <Badge
                variant={field.value ? "outline" : "secondary"}
                className="text-xs"
              >
                {field.value ? "Active" : "Inactive"}
              </Badge>
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name={`variants.${index}.isActive`}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Controller
          control={control}
          name={`variants.${index}.color`}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <Label className="text-xs">Color</Label>
              <Input
                {...field}
                placeholder="e.g. Navy"
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
        <Controller
          control={control}
          name={`variants.${index}.size`}
          render={({ field }) => (
            <div className="space-y-1">
              <Label className="text-xs">Size</Label>
              <Input {...field} placeholder="e.g. M" />
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Controller
          control={control}
          name={`variants.${index}.originalPrice`}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <Label className="text-xs">Original Price *</Label>
              <Input
                type="number"
                min={0}
                value={field.value || ""}
                onChange={(e) => field.onChange(+e.target.value)}
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
        <Controller
          control={control}
          name={`variants.${index}.discountedPrice`}
          render={({ field, fieldState }) => (
            <div className="space-y-1">
              <Label className="text-xs">Discounted Price *</Label>
              <Input
                type="number"
                min={0}
                value={field.value || ""}
                onChange={(e) => field.onChange(+e.target.value)}
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
        <Controller
          control={control}
          name={`variants.${index}.stock`}
          render={({ field }) => (
            <div className="space-y-1">
              <Label className="text-xs">Stock *</Label>
              <Input
                type="number"
                min={0}
                value={field.value || ""}
                onChange={(e) => field.onChange(+e.target.value)}
              />
            </div>
          )}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-xs">Variant Images *</Label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : variantErrors?.images
                ? "border-destructive"
                : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">
            Drag & drop or{" "}
            <span className="text-primary font-medium">browse</span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.length) processFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {variantErrors?.images && (
          <p className="text-xs text-destructive">
            {variantErrors.images.message}
          </p>
        )}

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.url}
                  alt=""
                  className={`h-16 w-16 rounded-lg object-cover border-2 ${img.isPrimary ? "border-primary" : "border-transparent"}`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrimary(img.id);
                  }}
                  className={`absolute bottom-0.5 left-0.5 p-0.5 rounded-full ${img.isPrimary ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"} transition-opacity`}
                >
                  <Star
                    className={`h-3 w-3 ${img.isPrimary ? "fill-primary" : ""}`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantField;
