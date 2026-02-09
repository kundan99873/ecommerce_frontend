import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/useToast";

interface ImageUploadProps {
  onUpload: (dataUrl: string) => void;
  currentImage?: string;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

const ImageUpload = ({ onUpload, currentImage }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload JPG, PNG, or WebP." });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast({ title: "File too large", description: "Max file size is 2MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      onUpload(url);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clear = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
        dragging ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {preview ? (
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img src={preview} alt="Image preview" className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
            <button
              type="button"
              onClick={clear}
              className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Click the X to remove or drag a new image</p>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} className="flex flex-col items-center gap-2 w-full">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium flex items-center gap-1">
              <Upload className="h-4 w-4" /> Upload Photo
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Drag & drop or click to browse</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WebP · Max 2MB</p>
          </div>
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
