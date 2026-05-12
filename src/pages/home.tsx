import HeroCarousel from "@/components/home/heroCarousel";
import CategoryNav from "@/components/category/categoryNav";
import RecentlyViewed from "@/components/product/recentlyViewed";
import TrustBadges from "@/components/home/trustBadges";
import {
  useProducts,
  useTopRatedProducts,
} from "@/services/product/product.query";
import ProductTypes from "@/components/home/productTypes";

const Home = () => {
  const { data: featuredProduct, isLoading: featuredLoading } = useProducts({
    limit: 5,
    page: 1,
    filter: "featured",
  });

  const { data: topRatedProducts, isLoading: topRatedLoading } =
    useTopRatedProducts();

  return (
    <>
      <HeroCarousel />
      <CategoryNav />

      {/* Featured */}
      <ProductTypes
        title="Featured Collection"
        products={featuredProduct?.data || []}
        loading={featuredLoading}
      />
      <ProductTypes
        title="Top Rated"
        products={topRatedProducts?.data?.slice(0, 4) || []}
        loading={topRatedLoading}
      />

      <RecentlyViewed />
      <TrustBadges />
    </>
  );
};

export default Home;
