import { useState } from "react";
import { Tag, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cartContext";
import { useGetCoupons } from "@/services/coupon/coupon.query";
import { toast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/utils";

interface CouponInputProps {
  cartTotal: number;
}

const CouponInput = ({ cartTotal }: CouponInputProps) => {
  const {
    appliedCoupon,
    discount,
    applyCoupon,
    removeCoupon,
    applyingCouponCode,
  } = useCart();
  const { data: couponsResponse } = useGetCoupons({
    is_active: true,
    limit: 100,
  });
  const [code, setCode] = useState("");

  const couponToApply = couponsResponse?.data.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
  );
  const isApplyingCurrentCode =
    couponToApply !== undefined && applyingCouponCode === couponToApply.code;

  const handleApply = () => {
    if (!code.trim()) return;

    const coupon = couponsResponse?.data.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
    );

    if (!coupon) {
      toast({ title: "Invalid coupon", description: "Coupon code not found." });
      return;
    }

    if (coupon.min_purchase && cartTotal < coupon.min_purchase) {
      toast({
        title: "Cannot apply",
        description: `Minimum purchase of ${coupon.min_purchase} required.`,
      });
      return;
    }

    applyCoupon(coupon.code);
    setCode("");
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-success/10 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-success" />
          <div>
            <span className="text-sm font-medium">{appliedCoupon.code}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {formatCurrency(discount)}
            </span>
          </div>
        </div>
        <button
          onClick={removeCoupon}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Coupon code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === "Enter" && handleApply()}
        className="text-sm"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleApply}
        disabled={!code.trim() || isApplyingCurrentCode}
      >
        {isApplyingCurrentCode ? (
          <span className="inline-flex items-center gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Applying...
          </span>
        ) : (
          "Apply"
        )}
      </Button>
    </div>
  );
};

export default CouponInput;
