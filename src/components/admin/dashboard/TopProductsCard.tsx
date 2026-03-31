import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/utils";

interface Product {
  id: string;
  name: string;
  image: string;
  reviews: number;
  price: number;
}

interface TopProductsCardProps {
  loading: boolean;
  products: Product[];
}

export const TopProductsCard = ({
  loading,
  products,
}: TopProductsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Top Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))
          : products.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-5">
                  #{i + 1}
                </span>
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.reviews} reviews
                  </p>
                </div>
                <p className="text-sm font-bold">{formatCurrency(p.price)}</p>
              </div>
            ))}
      </CardContent>
    </Card>
  );
};
