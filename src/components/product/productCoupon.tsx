import { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCoupon } from "@/context/couponContext";

interface ProductCouponProps {
  price: number;
}

const ProductCoupon = ({ price }: ProductCouponProps) => {
  const { availableCoupons } = useCoupon();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{ valid: boolean; discountedPrice: number; message: string } | null>(null);

  const handleCheck = () => {
    if (!code.trim()) return;
    const coupon = availableCoupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      setResult({ valid: false, discountedPrice: price, message: "Invalid coupon code" });
      return;
    }
    if (new Date(coupon.expiresAt) < new Date()) {
      setResult({ valid: false, discountedPrice: price, message: "This coupon has expired" });
      return;
    }
    if (price < coupon.minOrder) {
      setResult({ valid: false, discountedPrice: price, message: `Min order $${coupon.minOrder} required` });
      return;
    }
    const disc = coupon.type === "percentage" ? (price * coupon.value) / 100 : coupon.value;
    const discounted = Math.max(0, price - disc);
    setResult({ valid: true, discountedPrice: discounted, message: `You save $${disc.toFixed(2)} with ${coupon.code}` });
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Have a coupon?</span>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Enter code"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setResult(null); }}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          className="text-sm"
        />
        <Button variant="outline" size="sm" onClick={handleCheck} disabled={!code.trim()}>
          Check
        </Button>
      </div>
      {result && (
        <div className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${
          result.valid ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        }`}>
          {result.valid ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
          <span>{result.message}</span>
          {result.valid && (
            <span className="ml-auto font-semibold">Price: ${result.discountedPrice.toFixed(2)}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCoupon;
