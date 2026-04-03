import { useParams, Link, useSearchParams } from "react-router";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Minus,
  Plus,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Heart,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/context/cartContext";
import { useWishlist } from "@/context/wishlistContext";
import {
  useGetProduct,
  useInfiniteProductReviews,
  useSimilarProducts,
  useTrackProductView,
} from "@/services/product/product.query";
import { skipToken } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/utils";
import ProductDetailSkeleton from "@/pages/product/productDetailSkeleton";
import PincodeCheck from "@/components/product/pinCodeCheck";
import ProductCoupon from "@/components/product/productCoupon";
import CustomerReviews from "@/components/product/customer-reviews";
import ProductCard from "@/components/product/productCard";
import ProductCardSkeleton from "@/components/product/productCardSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductReview } from "@/services/product/product.types";

const ProductDetail = () => {
  const { id: slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { addItem, loading, items } = useCart();
  const { toggleItem, isInWishlist, moveLoading, removeLoading } =
    useWishlist();
  const { mutate: trackProductView } = useTrackProductView();
  const trackedSlugRef = useRef<string | null>(null);

  const { data, isLoading } = useGetProduct((slug as string) ?? skipToken);

  const product = data?.data;
  const { data: similarProductsData, isLoading: similarProductsLoading } =
    useSimilarProducts(product?.slug ?? "", 6, !!product?.slug);
  const similarProducts =
    similarProductsData?.data?.filter((item) => item.slug !== product?.slug) ??
    [];
  const reviewsLoadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data: reviewsData,
    fetchNextPage: fetchNextReviews,
    hasNextPage: hasMoreReviews,
    isFetchingNextPage: isFetchingMoreReviews,
    isLoading: reviewsLoading,
  } = useInfiniteProductReviews(product?.slug ?? "", 10, !!product?.slug);

  const urlColor = searchParams.get("color");
  const urlSize = searchParams.get("size");

  const selectedVariant = useMemo(() => {
    if (!product?.variants) return null;

    if (urlColor && urlSize) {
      const match = product.variants.find(
        (v: any) => v.color === urlColor && v.size === urlSize,
      );
      if (match) return match;
    }

    return product.selected_variant ?? product.variants[0];
  }, [product, urlColor, urlSize]);

  useEffect(() => {
    if (product?.slug) {
      if (trackedSlugRef.current === product.slug) return;
      trackedSlugRef.current = product.slug;
      trackProductView(product.slug);
    }
  }, [product?.slug, trackProductView]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    if (!reviewsLoadMoreRef.current || !hasMoreReviews) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreReviews) {
          fetchNextReviews();
        }
      },
      { threshold: 1 },
    );

    observer.observe(reviewsLoadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextReviews, hasMoreReviews]);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedCouponCode, setSelectedCouponCode] = useState<
    string | undefined
  >(undefined);
  /* Reset quantity & image when variant changes */
  useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
    setSelectedCouponCode(undefined);
  }, [selectedVariant?.sku]);

  const colors = useMemo(() => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v: any) => v.color))];
  }, [product?.variants]);

  const sizes = useMemo(() => {
    if (!product?.variants || !selectedVariant) return [];
    return product.variants
      .filter((v: any) => v.color === selectedVariant.color)
      .map((v: any) => v.size);
  }, [product?.variants, selectedVariant]);

  const images = selectedVariant?.images || [];
  const isOutOfStock = selectedVariant?.stock === 0;
  const alreadyInCart = selectedVariant
    ? items.some((item) => item.sku === selectedVariant.sku)
    : false;
  const wishlisted = selectedVariant
    ? isInWishlist(selectedVariant.sku)
    : false;
  const isWishlistLoading = selectedVariant
    ? moveLoading === selectedVariant.sku ||
      removeLoading === selectedVariant.sku
    : false;

  const updateUrl = useCallback(
    (color: string, size: string) => {
      setSearchParams({ color, size });
    },
    [setSearchParams],
  );

  const handleColorSelect = (color: string) => {
    const variant = product?.variants.find((v: any) => v.color === color);
    if (!variant) return;
    updateUrl(variant.color, variant.size);
  };

  const handleSizeSelect = (size: string) => {
    if (!selectedVariant) return;

    const variant = product?.variants.find(
      (v: any) => v.size === size && v.color === selectedVariant.color,
    );
    if (!variant) return;
    updateUrl(variant.color, variant.size);
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product || !selectedVariant) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/products" className="text-primary mt-4 inline-block">
          Back to shop
        </Link>
      </div>
    );
  }

  const fallbackProductReviews =
    product.product_reviews ??
    ((product as any).reviews_list as ProductReview[] | undefined) ??
    [];

  const paginatedReviews =
    reviewsData?.pages.flatMap((page) => page.data ?? []) ?? [];
  const firstReviewsPage = reviewsData?.pages?.[0];

  const productReviews =
    reviewsData?.pages.length && reviewsData.pages.length > 0
      ? paginatedReviews
      : fallbackProductReviews;

  const totalReviews =
    firstReviewsPage?.totalReviews ??
    firstReviewsPage?.totalCounts ??
    product.reviews ??
    productReviews.length;
  const averageRating =
    typeof firstReviewsPage?.averageRating === "number" &&
    firstReviewsPage.averageRating > 0
      ? firstReviewsPage.averageRating
      : productReviews.length > 0
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
          productReviews.length
        : (product.rating ?? 0);
  const hasReviews = totalReviews > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div className="space-y-4 md:max-w-md lg:max-w-lg mx-auto w-full lg:sticky lg:top-32 self-start">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedVariant.sku + activeImage}
                src={images[activeImage]?.image_url}
                alt={product.name}
                className="h-full w-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* INFO */}
        <div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {product.category.name}
              </p>
              <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
              {hasReviews && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= Math.round(averageRating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <span>{averageRating.toFixed(1)}</span>
                  <span>({totalReviews} reviews)</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (isWishlistLoading) return;
                toggleItem(selectedVariant.sku);
              }}
              className={`p-2 rounded-full ${
                wishlisted ? "bg-destructive text-white" : "bg-background"
              }`}
              disabled={isWishlistLoading}
            >
              {isWishlistLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart
                  className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`}
                />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-bold">
              {formatCurrency(selectedVariant.discounted_price)}
            </span>
            {selectedVariant.original_price >
              selectedVariant.discounted_price && (
              <span className="line-through text-muted-foreground">
                {formatCurrency(selectedVariant.original_price)}
              </span>
            )}
          </div>

          {/* COLOR */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Color</p>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color: string) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`px-4 py-2 rounded border text-sm ${
                    selectedVariant.color === color
                      ? "bg-foreground text-background"
                      : "border-border"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* SIZE */}
          {selectedVariant.size && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size: string) => {
                  const variant = product.variants.find(
                    (v: any) =>
                      v.size === size && v.color === selectedVariant.color,
                  );
                  const disabled = variant?.stock === 0;

                  return (
                    <button
                      key={size}
                      disabled={disabled}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 rounded border text-sm ${
                        selectedVariant.size === size
                          ? "bg-foreground text-background"
                          : "border-border"
                      } ${disabled && "opacity-40 cursor-not-allowed"}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(selectedVariant.stock, q + 1))
                }
                className="px-3 py-2 cursor-pointer "
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              disabled={isOutOfStock || loading || alreadyInCart}
              className="flex-1"
              onClick={() =>
                addItem(selectedVariant.sku, quantity, selectedCouponCode)
              }
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : alreadyInCart ? (
                "Already in your cart"
              ) : (
                "Add to Cart"
              )}
            </Button>
          </div>

          {alreadyInCart && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" /> This variant is already in
              your cart.
            </p>
          )}

          {!isOutOfStock && !alreadyInCart && (
            <ProductCoupon
              price={selectedVariant.discounted_price * quantity}
              availableCoupons={product.coupons}
              onCouponSelect={setSelectedCouponCode}
            />
          )}

          <div className="mt-6 pt-6 border-t">
            <PincodeCheck productSlug={product?.slug} />
          </div>
        </div>
      </div>

      <section className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList variant="line" className="mb-6 w-full justify-start gap-6">
            <TabsTrigger value="description" className="px-0 text-base">
              Description
            </TabsTrigger>
            <TabsTrigger value="reviews" className="px-0 text-base">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="shipping" className="px-0 text-base">
              Shipping Policy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <div className="rounded-xl border bg-card p-6 md:p-8">
              <h3 className="text-2xl font-display font-bold text-foreground">
                Product Description
              </h3>
              <p className="mt-4 text-lg text-foreground/90">
                {product.description}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            {hasReviews ? (
              <div className="rounded-xl border bg-card p-6 md:p-8">
                <CustomerReviews
                  reviewsLoading={reviewsLoading}
                  reviews={productReviews}
                  averageRating={averageRating}
                  totalReviews={totalReviews}
                  ratingBreakdown={firstReviewsPage?.ratingBreakdown}
                  isFetchingMoreReviews={isFetchingMoreReviews}
                  hasMoreReviews={hasMoreReviews}
                  loadMoreRef={reviewsLoadMoreRef}
                />
              </div>
            ) : (
              <div className="rounded-xl border bg-card p-6 md:p-8">
                <h3 className="text-2xl font-display font-bold text-foreground">
                  Customer Reviews
                </h3>
                <p className="mt-4 text-muted-foreground">
                  No reviews yet for this product.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="shipping">
            <div className="rounded-xl border bg-card p-6 md:p-8">
              <h3 className="text-2xl font-display font-bold text-foreground">
                Shipping Policy
              </h3>
              <p className="mt-4 text-foreground/90">
                Orders are processed within 24-48 hours and usually delivered in
                3-7 business days depending on your location. You will receive
                tracking details as soon as your order is shipped.
              </p>
              <p className="mt-3 text-foreground/90">
                If your area is serviceable, expedited delivery options may be
                available at checkout. For damaged or delayed deliveries, please
                contact our support team for priority assistance.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-display font-bold">Related Products</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {similarProductsLoading
            ? Array(4)
                .fill(undefined)
                .map((_, index) => <ProductCardSkeleton key={index} />)
            : similarProducts
                .slice(0, 6)
                .map((item, index) => (
                  <ProductCard key={item.slug} product={item} index={index} />
                ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
