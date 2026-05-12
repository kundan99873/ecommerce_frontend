import { useAuth } from "@/context/authContext";
import { useRecentlyViewedProducts } from "@/services/product/product.query";
import ProductTypes from "../home/productTypes";

const RecentlyViewed = () => {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useRecentlyViewedProducts(isAuthenticated);
  const viewed = data?.data ?? [];

  if (viewed.length < 1) return null;

  return (
    <ProductTypes
      title="Recently Viewed"
      products={viewed?.slice(0, 4) || []}
      loading={isLoading}
    />
  );
};

export default RecentlyViewed;
