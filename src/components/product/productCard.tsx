import { Link, useNavigate } from "react-router";
import { CheckCircle2, Heart, Loader2, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import type { Product } from "@/services/product/product.types";
import { formatCurrency } from "@/utils/utils";
import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/authContext";
import { useWishlist } from "@/context/wishlistContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem, addingSku, items } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toggleItem, isInWishlist, moveLoading, removeLoading } =
    useWishlist();
  const primaryVariant = product.variants[0];
  const wishlisted = isInWishlist(primaryVariant.sku);
  const isWishlistLoading =
    moveLoading === primaryVariant.sku || removeLoading === primaryVariant.sku;
  const alreadyInCart = items.some((item) => item.slug === product.slug);
  const discountPercent =
    primaryVariant.original_price > 0
      ? Math.round(
          (1 -
            primaryVariant.discounted_price / primaryVariant.original_price) *
            100,
        )
      : 0;
  const productRating = product.average_rating ?? product.rating ?? 0;
  const productReviews = product.total_reviews ?? product.reviews ?? 0;

  if (!primaryVariant?.images?.[0]?.image_url) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group h-full"
    >
      <div className="h-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <Link
          to={`/product/${product.slug}?color=${primaryVariant.color}${primaryVariant.size ? `&size=${primaryVariant.size}` : ""}`}
          className="block"
        >
          <div className="relative aspect-4/5 overflow-hidden bg-muted/40">
            <img
              src={primaryVariant.images[0].image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
              loading="lazy"
            />

            <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/55 via-black/25 to-transparent" />

            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                Save {discountPercent}%
              </span>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                if (isWishlistLoading) return;
                toggleItem(primaryVariant.sku);
              }}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all cursor-pointer ${
                wishlisted
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-background/80 backdrop-blur text-foreground hover:bg-background"
              }`}
              disabled={isWishlistLoading}
              aria-label="Toggle wishlist"
            >
              {isWishlistLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart
                  className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`}
                />
              )}
            </button>

            <div className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] text-white backdrop-blur">
              <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              <span>{productRating.toFixed(1)}</span>
              <span className="text-white/75">({productReviews})</span>
            </div>

            {!primaryVariant.stock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {product.category.name}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {product.brand}
            </span>
          </div>

          <Link to={`/product/${product.slug}`}>
            <h3 className="line-clamp-2 min-h-10 text-sm sm:text-[15px] font-semibold leading-snug text-foreground transition-colors hover:text-primary">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              {primaryVariant.color}
            </span>
            {primaryVariant.size && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                Size {primaryVariant.size}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="mt-3 flex items-baseline  gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                {formatCurrency(primaryVariant.discounted_price)}
              </span>
              {primaryVariant.original_price >
                primaryVariant.discounted_price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatCurrency(primaryVariant.original_price)}
                </span>
              )}
            </div>
            <Button
              size={alreadyInCart ? "sm" : "icon"}
              variant={alreadyInCart ? "secondary" : "outline"}
              className={
                alreadyInCart
                  ? "h-8 rounded-xl px-3 text-xs sm:h-9 sm:px-3.5 sm:text-sm hover:bg-primary hover:text-primary-foreground"
                  : "h-8 w-8 sm:h-9 sm:w-9 rounded-xl hover:bg-primary hover:text-primary-foreground"
              }
              onClick={(e) => {
                e.preventDefault();
                if (alreadyInCart) return;
                if (!isAuthenticated) return navigate("/login");
                addItem(primaryVariant.sku, 1);
              }}
              disabled={
                !primaryVariant.stock || addingSku === primaryVariant.sku
              }
              aria-label={alreadyInCart ? "Go to cart" : "Add to cart"}
            >
              {addingSku === primaryVariant.sku ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : alreadyInCart ? (
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> In Cart
                </span>
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
