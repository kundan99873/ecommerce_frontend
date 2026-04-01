import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Package,
  Tag,
  Palette,
  Ruler,
  Hash,
  Boxes,
  ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/services/product/product.types";
import { formatCurrency } from "@/utils/utils";

interface Props {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetailModal = ({ product, open, onOpenChange }: Props) => {
  if (!product) return null;

  const variants = product.variants ?? [];
  const totalStock = variants.reduce(
    (sum, variant) => sum + (variant.stock || 0),
    0,
  );
  const allImages = variants.flatMap((variant) => variant.images ?? []);
  const uniqueSizes = Array.from(
    new Set(variants.map((variant) => variant.size)),
  ).filter(Boolean);
  const uniqueColors = Array.from(
    new Set(variants.map((variant) => variant.color)),
  ).filter(Boolean);
  const avgRating = product.average_rating ?? product.rating ?? 0;
  const totalReviews = product.total_reviews ?? product.reviews ?? 0;
  const firstImage = allImages[0]?.image_url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 bg-linear-to-b from-background via-background to-muted/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-primary/15 text-primary grid place-items-center">
              <Package className="h-4 w-4" />
            </span>
            Product Details
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row gap-5 rounded-2xl border bg-linear-to-br from-muted/50 to-background p-4">
            <div className="shrink-0">
              {firstImage ? (
                <img
                  src={firstImage}
                  alt={product.name}
                  className="h-44 w-36 rounded-xl object-cover border shadow-md"
                />
              ) : (
                <div className="h-44 w-36 rounded-xl border bg-muted/30 flex items-center justify-center shadow-sm">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-bold leading-tight">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {product.brand}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">
                    {avgRating || "N/A"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({totalReviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <Badge
                  variant={product.is_active ? "default" : "secondary"}
                  className="rounded-full px-3"
                >
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge
                  variant={totalStock > 0 ? "outline" : "destructive"}
                  className="rounded-full px-3"
                >
                  {totalStock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full px-3 bg-background"
                >
                  {product.category?.name}
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3">
                  /{product.category?.slug}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                {product.description}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-background/80 backdrop-blur rounded-xl p-3 border shadow-sm transition-transform hover:-translate-y-0.5">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Hash className="h-3.5 w-3.5" /> Product ID
              </p>
              <p className="text-sm font-mono font-bold">#{product.id}</p>
            </div>
            <div className="bg-background/80 backdrop-blur rounded-xl p-3 border shadow-sm transition-transform hover:-translate-y-0.5">
              <p className="text-xs text-muted-foreground">Slug</p>
              <p className="text-sm font-medium truncate" title={product.slug}>
                {product.slug}
              </p>
            </div>
            <div className="bg-background/80 backdrop-blur rounded-xl p-3 border shadow-sm transition-transform hover:-translate-y-0.5">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Boxes className="h-3.5 w-3.5" /> Variants
              </p>
              <p className="text-sm font-bold">{variants.length}</p>
            </div>
            <div className="bg-background/80 backdrop-blur rounded-xl p-3 border shadow-sm transition-transform hover:-translate-y-0.5">
              <p className="text-xs text-muted-foreground">Total Stock</p>
              <p className="text-sm font-bold">{totalStock}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Ruler className="h-4 w-4 text-primary" /> Available Sizes
              </h4>
              <div className="flex flex-wrap gap-2">
                {uniqueSizes.length > 0 ? (
                  uniqueSizes.map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1.5 text-xs font-medium rounded-full border bg-primary/5 text-primary"
                    >
                      {size}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No sizes
                  </span>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" /> Available Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {uniqueColors.length > 0 ? (
                  uniqueColors.map((color) => (
                    <span
                      key={color}
                      className="px-3 py-1.5 text-xs font-medium rounded-full border bg-primary/5 text-primary"
                    >
                      {color}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No colors
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Variant Details
            </h4>

            {variants.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No variants available
              </p>
            ) : (
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <motion.div
                    key={variant.id}
                    className="rounded-2xl border p-4 bg-linear-to-br from-background to-muted/30 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold">
                          Variant #{index + 1}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {variant.sku}
                        </p>
                      </div>
                      <Badge
                        variant={variant.stock > 0 ? "outline" : "destructive"}
                        className="rounded-full"
                      >
                        {variant.stock > 0
                          ? `${variant.stock} in stock`
                          : "Out of stock"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3 text-sm">
                      <div className="bg-background rounded-xl border p-2.5 shadow-xs">
                        <p className="text-xs text-muted-foreground">Color</p>
                        <p className="font-medium">{variant.color}</p>
                      </div>
                      <div className="bg-background rounded-xl border p-2.5 shadow-xs">
                        <p className="text-xs text-muted-foreground">Size</p>
                        <p className="font-medium">{variant.size}</p>
                      </div>
                      <div className="bg-background rounded-xl border p-2.5 shadow-xs">
                        <p className="text-xs text-muted-foreground">
                          Original
                        </p>
                        <p className="font-medium">
                          {formatCurrency(variant.original_price)}
                        </p>
                      </div>
                      <div className="bg-background rounded-xl border p-2.5 shadow-xs">
                        <p className="text-xs text-muted-foreground">
                          Discounted
                        </p>
                        <p className="font-medium">
                          {formatCurrency(variant.discounted_price)}
                        </p>
                      </div>
                      <div className="bg-background rounded-xl border p-2.5 shadow-xs">
                        <p className="text-xs text-muted-foreground">
                          Variant ID
                        </p>
                        <p className="font-mono font-medium">#{variant.id}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Images
                      </p>
                      {variant.images?.length ? (
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {variant.images.map((img) => (
                            <motion.img
                              key={img.id ?? img.image_url}
                              src={img.image_url}
                              alt={`${product.name} ${variant.color} ${variant.size}`}
                              className="rounded-xl object-cover aspect-square border shadow-sm"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No images
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" /> Review Summary
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/80 backdrop-blur rounded-xl p-3 border shadow-sm">
                <p className="text-xs text-muted-foreground">Average Rating</p>
                <p className="text-lg font-bold">{avgRating || "N/A"}</p>
              </div>
              <div className="bg-background/80 backdrop-blur rounded-xl p-3 border shadow-sm">
                <p className="text-xs text-muted-foreground">Total Reviews</p>
                <p className="text-lg font-bold">{totalReviews}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
