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
  const { toggleItem, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.variants[0].sku);
  const alreadyInCart = items.some((item) => item.slug === product.slug);

  if (!product?.variants?.[0]?.images?.[0]?.image_url) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group"
    >
      <Link
        to={`/product/${product.slug}?color=${product.variants[0].color}${product.variants[0].size ? `&size=${product.variants[0].size}` : ""}`}
        className="block"
      >
        <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-secondary">
          <img
            src={product.variants[0].images[0].image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* {product.originalPrice && ( */}
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
            -
            {Math.round(
              (1 -
                product.variants[0].discounted_price /
                  product.variants[0].original_price) *
                100,
            )}
            %
          </span>
          {/* )} */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleItem(product.variants[0].sku);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all cursor-pointer ${
              wishlisted
                ? "bg-destructive text-destructive-foreground"
                : "bg-background/70 backdrop-blur-sm text-foreground hover:bg-background"
            }`}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>
          {!product.variants[0].stock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-sm font-semibold text-foreground">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-foreground leading-tight hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">
            {product.category.name}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>{(product.rating ?? 0).toFixed(1)}</span>
            <span>({product.reviews ?? 0} reviews)</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(product.variants[0].discounted_price)}
            </span>
            {product.variants[0].original_price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.variants[0].original_price)}
              </span>
            )}
          </div>
        </div>
        {alreadyInCart ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success mt-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> In Cart
          </span>
        ) : (
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 shrink-0 mt-1 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={(e) => {
              e.preventDefault();
              if (!isAuthenticated) return navigate("/login");
              addItem(product.variants[0].sku, 1);
            }}
            disabled={
              !product.variants[0].stock ||
              addingSku === product.variants[0].sku
            }
          >
            {addingSku === product.variants[0].sku ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
