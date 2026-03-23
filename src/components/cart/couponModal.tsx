import {
  Tag,
  Sparkles,
  Clock,
  DollarSign,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cartContext";
import { useGetAllCartCoupons } from "@/services/cart/cart.query";
import type { CartAvailableCoupon } from "@/services/cart/cart.types";
import { toast } from "@/hooks/useToast";
import { useState } from "react";

interface CouponModalProps {
  cartTotal: number;
}

const CouponModal = ({ cartTotal }: CouponModalProps) => {
  const { appliedCoupon, applyCoupon, applyingCouponCode } = useCart();
  const { data: couponsResponse } = useGetAllCartCoupons();
  const couponPayload = couponsResponse?.data as
    | CartAvailableCoupon[]
    | { coupons?: CartAvailableCoupon[] }
    | undefined;
  const availableCoupons = Array.isArray(couponPayload)
    ? couponPayload
    : (couponPayload?.coupons ?? []);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getBestCoupon = (): string | null => {
    let best: { code: string; saving: number } | null = null;
    for (const c of availableCoupons) {
      if (new Date(c.end_date) < new Date()) continue;
      if (c.min_purchase && cartTotal < c.min_purchase) continue;
      const saving =
        c.discount_type === "PERCENTAGE"
          ? (cartTotal * c.discount_value) / 100
          : c.discount_value;
      if (!best || saving > best.saving) best = { code: c.code, saving };
    }
    return best?.code ?? null;
  };

  const bestCode = getBestCoupon();

  const handleApply = (coupon: CartAvailableCoupon) => {
    if (coupon.min_purchase && cartTotal < coupon.min_purchase) {
      toast({
        title: "Cannot apply",
        description: `Minimum purchase of ${coupon.min_purchase} required.`,
      });
      return;
    }

    applyCoupon(coupon.code);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({ title: "Copied!", description: `${code} copied to clipboard` });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getSaving = (c: CartAvailableCoupon) =>
    c.discount_type === "PERCENTAGE"
      ? (cartTotal * c.discount_value) / 100
      : c.discount_value;

  const isExpired = (c: CartAvailableCoupon) =>
    new Date(c.end_date) < new Date();
  const isEligible = (c: CartAvailableCoupon) =>
    !isExpired(c) && (!c.min_purchase || cartTotal >= c.min_purchase);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-primary gap-1"
        >
          <Tag className="h-3.5 w-3.5" /> View All Coupons
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" /> Available Coupons
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto py-2">
          {availableCoupons.map((coupon) => {
            const expired = isExpired(coupon);
            const eligible = isEligible(coupon);
            const isBest = coupon.code === bestCode;
            const isApplied =
              appliedCoupon?.id === coupon.id ||
              (!appliedCoupon && Boolean(coupon.is_applied));
            const isApplying = applyingCouponCode === coupon.code;

            return (
              <div
                key={coupon.code}
                className={`relative border rounded-xl overflow-hidden transition-all ${
                  expired
                    ? "opacity-50 bg-muted/50"
                    : isBest
                      ? "border-primary bg-primary/5"
                      : "bg-card"
                }`}
              >
                {isBest && !expired && (
                  <Badge className="absolute top-0 right-0 rounded-none rounded-bl-lg bg-primary text-primary-foreground text-[10px] gap-1">
                    <Sparkles className="h-3 w-3" /> Best Value
                  </Badge>
                )}

                <div
                  className={`px-4 py-2 text-center font-bold text-sm ${
                    expired
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {coupon.discount_type === "PERCENTAGE"
                    ? `${coupon.discount_value}% OFF`
                    : `$${coupon.discount_value} OFF`}
                  {eligible && !expired && (
                    <span className="ml-2 font-normal text-xs">
                      (Save ${getSaving(coupon).toFixed(2)})
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="font-mono font-bold text-sm tracking-widest bg-secondary px-3 py-1 rounded-md border border-dashed border-border">
                      {coupon.code}
                    </code>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Copy code"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {coupon.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Min:{" "}
                      {coupon.min_purchase
                        ? `$${coupon.min_purchase}`
                        : "No minimum"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {expired
                        ? "Expired"
                        : `Until ${new Date(coupon.end_date).toLocaleDateString()}`}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant={isApplied ? "secondary" : "default"}
                    disabled={expired || !eligible || isApplied || isApplying}
                    onClick={() => handleApply(coupon)}
                    className="w-full mt-3 text-xs"
                  >
                    {isApplying ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Applying...
                      </span>
                    ) : isApplied ? (
                      "Applied"
                    ) : expired ? (
                      "Expired"
                    ) : !eligible ? (
                      `Min order $${coupon.min_purchase}`
                    ) : (
                      "Apply Coupon"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CouponModal;
