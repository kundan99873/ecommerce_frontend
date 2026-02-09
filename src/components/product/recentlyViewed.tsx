import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { products, type Product } from "@/data/products";
import ProductCard from "./productCard";

const STORAGE_KEY = "lumiere_recently_viewed";
const MAX_ITEMS = 8;

export const trackProductView = (productId: number) => {
  const ids: number[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const updated = [productId, ...ids.filter((id) => id !== productId)].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

const RecentlyViewed = () => {
  const [viewed, setViewed] = useState<Product[]>([]);

  useEffect(() => {
    const ids: number[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
    setViewed(items);
  }, []);

  if (viewed.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-2xl font-display font-bold">Recently Viewed</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {viewed.slice(0, 4).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
