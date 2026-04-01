import { Sparkles } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "../product/productCard";
import type { Product as ApiProduct } from "@/services/product/product.types";

const Recommendations = () => {
  // Mock personalized recommendations based on top-rated + shuffle
  const recommended = [...products]
    .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
    .slice(0, 4);

  const mappedRecommended: ApiProduct[] = recommended.map((p) => ({
    id: p.id,
    name: p.name,
    slug: `mock-${p.id}`,
    description: p.description,
    brand: p.brand,
    category: {
      name: p.category,
      slug: p.category.toLowerCase(),
    },
    is_active: true,
    average_rating: p.rating,
    total_reviews: p.reviews,
    variants: [
      {
        id: p.id,
        sku: `MOCK-${p.id}`,
        color: p.colors?.[0] ?? "Default",
        size: p.sizes?.[0] ?? "One Size",
        original_price: p.originalPrice ?? p.price,
        discounted_price: p.price,
        stock: p.inStock ? (p.stock ?? 10) : 0,
        is_active: true,
        images: [{ image_url: p.image, is_primary: true }],
      },
    ],
  }));

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-display font-bold">Recommended For You</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {mappedRecommended.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
};

export default Recommendations;
