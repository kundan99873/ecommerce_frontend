import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Package, Tag, Palette, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/services/product/product.types";

interface Props {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetailModal = ({ product, open, onOpenChange }: Props) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Product Details</DialogTitle>
        </DialogHeader>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Hero section */}
          <div className="flex gap-5">
            <div className="shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-32 rounded-xl object-cover border"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={product.active ? "default" : "secondary"}>
                  {product.active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant={product.inStock ? "outline" : "destructive"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
                <Badge variant="outline">{product.category}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" /> Pricing
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Current Price</p>
                <p className="text-xl font-bold">${product.price}</p>
              </div>
              {product.originalPrice && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Original Price</p>
                  <p className="text-xl font-bold line-through text-muted-foreground">${product.originalPrice}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Description
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Variants */}
          {(product.sizes?.length || product.colors?.length) && (
            <>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-primary" /> Available Sizes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="px-3 py-1.5 text-xs font-medium rounded-md border bg-muted/50"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Palette className="h-4 w-4 text-primary" /> Available Colors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <span
                          key={color}
                          className="px-3 py-1.5 text-xs font-medium rounded-md border bg-muted/50"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Gallery */}
          {product.images && product.images.length > 1 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-3">Gallery</h4>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, i) => (
                    <motion.img
                      key={i}
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="rounded-lg object-cover aspect-square border"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Meta */}
          <Separator />
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Product ID</p>
              <p className="text-sm font-mono font-bold">#{product.id}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Stock</p>
              <p className="text-sm font-bold">{product.stock ?? (product.inStock ? "Available" : "0")}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-sm font-bold">{product.category}</p>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
