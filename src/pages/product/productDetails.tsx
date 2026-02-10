import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { Star, Minus, Plus, ArrowLeft, Truck, RotateCcw, Shield, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/context/cartContext";
import ProductCard from "@/components/product/productCard";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/useToast";
import { motion, AnimatePresence } from "motion/react";
import { trackProductView } from "@/components/product/recentlyViewed";
import PincodeCheck from "@/components/product/pinCodeCheck";
import ProductCoupon from "@/components/product/productCoupon";
import ProductReviews from "@/components/product/productReview";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [activeImage, setActiveImage] = useState(0);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (product) trackProductView(product.id);
  }, [product]);

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
    setSelectedSize(undefined);
    setSelectedColor(undefined);
  }, [id]);

  if (!product) {
    return (
      <>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display">Product not found</h1>
          <Link to="/products" className="text-primary mt-4 inline-block">Back to shop</Link>
        </div>
      </>
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const isOutOfStock = !product.inStock || product.stock === 0;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image carousel */}
          <div className="space-y-3">
            <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-secondary">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={`${product.name} - Image ${activeImage + 1}`}
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {isOutOfStock && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <Badge variant="destructive" className="text-sm px-4 py-2">Out of Stock</Badge>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      idx === activeImage ? "border-primary ring-1 ring-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-1">{product.name}</h1>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
              )}
              {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
            </div>

            <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

            {product.sizes && (
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-sm rounded border transition-colors ${
                        selectedSize === s ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 text-sm rounded border transition-colors ${
                        selectedColor === c ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center border rounded">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground" disabled={isOutOfStock}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-muted-foreground hover:text-foreground" disabled={isOutOfStock}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {isOutOfStock ? (
                <Button
                  variant="outline"
                  className="flex-1 py-6 text-sm font-semibold tracking-wide gap-2"
                  onClick={() => toast({ title: "We'll notify you!", description: "You'll get an email when this item is back in stock." })}
                >
                  <Bell className="h-4 w-4" /> Notify Me When Available
                </Button>
              ) : (
                <Button
                  className="flex-1 py-6 text-sm font-semibold tracking-wide"
                  onClick={() => addItem(product, quantity, selectedSize, selectedColor)}
                >
                  Add to Cart — ${product.price * quantity}
                </Button>
              )}
            </div>

            {/* Coupon check */}
            {!isOutOfStock && <ProductCoupon price={product.price * quantity} />}

            {/* Zipcode delivery check */}
            <div className="mt-6 pt-6 border-t">
              <PincodeCheck />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders $100+" },
                { icon: RotateCcw, label: "Easy Returns", sub: "30 days" },
                { icon: Shield, label: "Secure", sub: "Checkout" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon className="h-5 w-5 mx-auto text-muted-foreground" />
                  <p className="text-xs font-medium mt-1">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ProductReviews productId={product.id} rating={product.rating} reviewCount={product.reviews} />

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-display font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
