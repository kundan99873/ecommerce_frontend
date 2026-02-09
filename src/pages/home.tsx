import { Link } from "react-router";
import { ArrowRight, TrendingUp } from "lucide-react";
import { products } from "@/data/products";
import HeroCarousel from "@/components/home/heroCarousel";
import CategoryNav from "@/components/category/categoryNav";
import ProductCard from "@/components/product/productCard";
import FlashDeals from "@/components/home/flashDeals";
import RecentlyViewed from "@/components/product/recentlyViewed";
import TrustBadges from "@/components/home/trustBadges";

const Home = () => {
  const featured = products.slice(0, 4);
  const trending = products.filter((p) => p.rating >= 4.7).slice(0, 4);

  return (
    <>
      <HeroCarousel />
      <CategoryNav />

      {/* Featured */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            Featured
          </h2>
          <Link
            to="/products"
            className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <FlashDeals />

      {/* Trending */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            Trending Now
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {trending.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="container mx-auto px-4 pb-16">
        <div className="bg-secondary rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Free Shipping
            </h2>
            <p className="text-muted-foreground mt-2">
              On all orders over $100. No code needed.
            </p>
          </div>
          <Link to="/products">
            <button className="border border-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-3 rounded-lg font-semibold text-sm transition-colors">
              Start Shopping
            </button>
          </Link>
        </div>
      </section>

      <TrustBadges />
      <RecentlyViewed />

      {/* <Newsletter /> */}
    </>
  );
};

export default Home;
