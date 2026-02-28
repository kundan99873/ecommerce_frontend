import { useState } from "react";
import { Tag, Check, X, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { useCoupon } from "@/context/couponContext";
import { toast } from "@/hooks/useToast";
import type { ProductCoupon } from "@/services/product/product.types";
import { formatCurrency } from "@/utils/utils";

interface ProductCouponProps {
  price: number;
  availableCoupons: ProductCoupon[];
}

const ProductCoupon = ({ price, availableCoupons }: ProductCouponProps) => {
  // const { availableCoupons } = useCoupon();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{
    valid: boolean;
    discountedPrice: number;
    message: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCheck = () => {
    if (!code.trim()) return;
    const coupon = availableCoupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase(),
    );
    if (!coupon) {
      setResult({
        valid: false,
        discountedPrice: price,
        message: "Invalid coupon code",
      });
      return;
    }
    if (new Date(coupon.end_date) < new Date()) {
      setResult({
        valid: false,
        discountedPrice: price,
        message: "This coupon has expired",
      });
      return;
    }
    if (coupon.min_purchase && price < coupon.min_purchase) {
      setResult({
        valid: false,
        discountedPrice: price,
        message: `Min order $${coupon.min_purchase} required`,
      });
      return;
    }
    const disc =
      coupon.discount_type === "PERCENTAGE"
        ? (price * coupon.discount_value) / 100
        : coupon.discount_value;

    console.log({ price, disc });
    const discounted = Math.max(0, price - disc);
    setResult({
      valid: true,
      discountedPrice: discounted,
      message: `You save ${formatCurrency(disc)} with ${coupon.code}`,
    });
  };

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setCode(couponCode);
    setResult(null);
    toast({
      title: "Copied!",
      description: `${couponCode} copied & applied to input`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Show top 2 eligible coupons as quick suggestions
  // const suggestions = availableCoupons
  //   .filter((c) => new Date(c.expiresAt) >= new Date())
  //   .slice(0, 2);

  return (
    <div className="mt-5 space-y-3 bg-card border rounded-xl p-4">
      <div className="flex items-center gap-2 text-sm">
        <Tag className="h-4 w-4 text-primary" />
        <span className="font-semibold">Have a coupon?</span>
      </div>

      {/* Quick coupon suggestions */}
      {availableCoupons?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableCoupons.map((c) => (
            <button
              key={c.code}
              onClick={() => handleCopy(c.code)}
              className="flex items-center gap-1.5 text-xs border border-dashed border-primary/40 bg-primary/5 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition-colors group"
            >
              <code className="font-mono font-bold tracking-wider text-primary">
                {c.code}
              </code>
              <span className="text-muted-foreground">
                {c.discount_type === "PERCENTAGE"
                  ? `${c.discount_value}%`
                  : `${formatCurrency(c.discount_value)}`}{" "}
                off
              </span>
              {copiedCode === c.code ? (
                <Check className="h-3 w-3 text-primary" />
              ) : (
                <Copy className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setResult(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          className="text-sm font-mono tracking-wider"
        />
        <Button
          variant="default"
          size="sm"
          onClick={handleCheck}
          disabled={!code.trim()}
        >
          Apply
        </Button>
      </div>

      {result && (
        <div
          className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2.5 ${
            result.valid
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {result.valid ? (
            <Check className="h-4 w-4 shrink-0" />
          ) : (
            <X className="h-4 w-4 shrink-0" />
          )}
          <span className="flex-1">{result.message}</span>
          {result.valid && (
            <span className="font-bold text-sm">
              {formatCurrency(result.discountedPrice)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCoupon;
