import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  product_id: string;
  product_variant_id: string;
  name: string;
  image_url: string;
  stock: number;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
}

interface LowStockAlertsCardProps {
  loading: boolean;
  products: Product[];
}

export const LowStockAlertsCard = ({
  loading,
  products,
}: LowStockAlertsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" /> Low Stock
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : products.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            All products are in stock!
          </p>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={`${p.product_variant_id}-${p.product_id}`}
                className="flex items-center gap-3 py-2 border-b last:border-0"
              >
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-destructive font-medium">
                    {p.stock_status === "out_of_stock"
                      ? "Out of Stock"
                      : `Low Stock (${p.stock})`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
