import { useState } from "react";
import { Tag, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cartContext";
import { useGetAllCartCoupons } from "@/services/cart/cart.query";
import { toast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/utils";
import { useAuth } from "@/context/authContext";
import type { CartAvailableCoupon } from "@/services/cart/cart.types";

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
    isApplyingCoupon,
    isRemovingCoupon,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { data: couponsResponse } = useGetAllCartCoupons(isAuthenticated);
  const couponPayload = couponsResponse?.data as
    | CartAvailableCoupon[]
    | { coupons?: CartAvailableCoupon[] }
    | undefined;
  const coupons = Array.isArray(couponPayload)
    ? couponPayload
    : (couponPayload?.coupons ?? []);
  const [code, setCode] = useState("");

  const couponToApply = coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
  );
  const isApplyingCurrentCode =
    couponToApply !== undefined && applyingCouponCode === couponToApply.code;

  const handleApply = () => {
    if (!code.trim()) return;

    const coupon = coupons.find(
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={removeCoupon}
          disabled={isRemovingCoupon}
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
        >
          {isRemovingCoupon ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
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
        disabled={!code.trim() || isApplyingCurrentCode || isApplyingCoupon}
      >
        {isApplyingCurrentCode || isApplyingCoupon ? (
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
