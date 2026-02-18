import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Loader2, Upload, X } from "lucide-react";
import type { Category } from "@/data/adminData";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.instanceof(File).optional().or(z.undefined()),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Category | null;
  onSubmit: (values: CategoryFormValues) => void;
  isLoading?: boolean;
}

const CategoryFormModal = ({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isLoading,
}: Props) => {
  const isEdit = !!defaultValues?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue } =
    useForm<CategoryFormValues>({
      resolver: zodResolver(categorySchema),
      defaultValues: { name: "", image: undefined },
    });

  useEffect(() => {
    if (open && defaultValues) {
      reset({
        name: defaultValues.name,
        image: defaultValues.image || undefined,
      });
      setImagePreview(defaultValues.image || null);
    } else if (open) {
      reset({ name: "", image: undefined });
      setImagePreview(null);
    }
  }, [open, defaultValues]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setValue("image", file);
    e.target.value = "";
  };

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Label>Name *</Label>
                <Input
                  {...field}
                  placeholder="Category name"
                  className={fieldState.error ? "border-destructive" : ""}
                />
                {fieldState.error && (
                  <p className="text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
                {field.value && (
                  <p className="text-xs text-muted-foreground">
                    Slug: /{slugify(field.value)}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="image"
            render={() => (
              <div className="space-y-2">
                <Label>Category Image</Label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setValue("image", undefined);
                      }}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">
                      Click to upload image
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>
            )}
          />

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
              {isEdit ? "Save" : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormModal;
