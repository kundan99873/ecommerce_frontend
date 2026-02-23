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
import type { HeroSlide } from "@/services/slides/heroSlides.types";
import { Textarea } from "@/components/ui/textarea";

const heroSliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  cta: z.string(),
  link: z.string(),
});

export type heroSliderFormValues = z.infer<typeof heroSliderSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: HeroSlide | null;
  onSubmit: (values: heroSliderFormValues) => void;
  isLoading?: boolean;
}

const heroSliderFormModal = ({
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
    useForm<heroSliderFormValues>({
      resolver: zodResolver(heroSliderSchema),
      defaultValues: {
        title: "",
        description: "",
        image: undefined,
        cta: "",
        link: "",
      },
    });

  useEffect(() => {
    if (open && defaultValues) {
      reset({
        title: defaultValues.title,
        description: defaultValues.description || "",
        image: defaultValues.image_url || undefined,
        cta: defaultValues.cta || "",
        link: defaultValues.link || "",
      });
      setImagePreview(defaultValues.image_url || null);
    } else if (open) {
      reset({
        title: "",
        description: "",
        image: undefined,
        cta: "",
        link: "",
      });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit heroSlider" : "Add heroSlider"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="title"
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Label>Title *</Label>
                <Input
                  {...field}
                  placeholder="HeroSlider title"
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
            name="description"
            render={({ field }) => (
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                  {...field}
                  placeholder="HeroSlider description..."
                  rows={2}
                />
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={control}
              name="cta"
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label>CTA *</Label>
                  <Input
                    {...field}
                    placeholder="HeroSlider CTA"
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
              name="link"
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label>Link *</Label>
                  <Input
                    {...field}
                    placeholder="HeroSlider link"
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

          <Controller
            control={control}
            name="image"
            render={() => (
              <div className="space-y-2">
                <Label>HeroSlider Image</Label>
                {imagePreview ? (
                  <div className="relative flex justify-center">
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
                      className="absolute -top-1 right-1/3 bg-destructive text-destructive-foreground rounded-full p-0.5"
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
              {isEdit ? "Save" : "Add heroSlider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default heroSliderFormModal;
