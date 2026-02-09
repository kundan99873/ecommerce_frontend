import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "../product/productCard";

const FlashDeals = () => {
  const saleProducts = products.filter((p) => p.originalPrice);

  const getTimeLeft = () => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const diff = end.getTime() - now.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s };
  };

  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (saleProducts.length === 0) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-destructive text-destructive-foreground p-2 rounded-lg">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Flash Deals</h2>
            <p className="text-sm text-muted-foreground">Limited time offers</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono">
          <span className="text-muted-foreground">Ends in</span>
          {[
            { label: "HRS", val: pad(time.h) },
            { label: "MIN", val: pad(time.m) },
            { label: "SEC", val: pad(time.s) },
          ].map(({ label, val }, i) => (
            <span key={label} className="flex items-center gap-1">
              {i > 0 && <span className="text-muted-foreground">:</span>}
              <span className="bg-foreground text-background px-2 py-1 rounded font-bold text-base">{val}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {saleProducts.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
};

export default FlashDeals;
