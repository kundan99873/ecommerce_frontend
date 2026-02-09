import { Sparkles } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "../product/productCard";

const Recommendations = () => {
  // Mock personalized recommendations based on top-rated + shuffle
  const recommended = [...products]
    .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
    .slice(0, 4);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-display font-bold">Recommended For You</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {recommended.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
};

export default Recommendations;
