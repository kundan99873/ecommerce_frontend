import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/wishlistContext";
import { useCart } from "@/context/cartContext";
import { motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <>
        <div className="container mx-auto px-4 py-20 text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground/40" />
          <h1 className="text-2xl font-display font-bold mt-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mt-2">Save items you love for later.</p>
          <Link to="/products">
            <Button className="mt-6">Browse Products</Button>
          </Link>
        </div>
      </>
    ); 
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Wishlist ({items.length})</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-secondary">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    {product.originalPrice && (
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">Sale</span>
                    )}
                  </div>
                </Link>
                <div className="mt-3">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-medium hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => {
                        addItem(product);
                        removeItem(product.id);
                      }}
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" /> Move to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => removeItem(product.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
