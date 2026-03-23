import { Clock } from "lucide-react";
import ProductCard from "./productCard";
import { useAuth } from "@/context/authContext";
import { useRecentlyViewedProducts } from "@/services/product/product.query";

const RecentlyViewed = () => {
  const { isAuthenticated } = useAuth();
  const { data } = useRecentlyViewedProducts(isAuthenticated);
  const viewed = data?.data ?? [];

  if (viewed.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-2xl font-display font-bold">Recently Viewed</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {viewed.slice(0, 4).map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
