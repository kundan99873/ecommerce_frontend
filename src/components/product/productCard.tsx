import { Link } from "react-router";
import type { Product } from "@/data/products";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/context/cartContext";
import { useWishlist } from "@/context/wishlistContext";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleItem(product);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all cursor-pointer ${
              wishlisted
                ? "bg-destructive text-destructive-foreground"
                : "bg-background/70 backdrop-blur-sm text-foreground hover:bg-background"
            }`}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>
          {!product.inStock && (
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
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-medium text-foreground leading-tight hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">
            {product.category}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-foreground">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 shrink-0 mt-1 hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          disabled={!product.inStock}
        >

          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
