import { Tag, Sparkles, Clock, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCoupon, type Coupon } from "@/context/couponContext";
import { toast } from "@/hooks/useToast";

interface CouponModalProps {
  cartTotal: number;
}

const CouponModal = ({ cartTotal }: CouponModalProps) => {
  const { availableCoupons, appliedCoupon, applyCoupon } = useCoupon();

  const getBestCoupon = (): string | null => {
    let best: { code: string; saving: number } | null = null;
    for (const c of availableCoupons) {
      if (new Date(c.expiresAt) < new Date() || cartTotal < c.minOrder) continue;
      const saving = c.type === "percentage" ? (cartTotal * c.value) / 100 : c.value;
      if (!best || saving > best.saving) best = { code: c.code, saving };
    }
    return best?.code ?? null;
  };

  const bestCode = getBestCoupon();

  const handleApply = (coupon: Coupon) => {
    const result = applyCoupon(coupon.code, cartTotal);
    if (result.success) {
      toast({ title: "Coupon applied!", description: result.message });
    } else {
      toast({ title: "Cannot apply", description: result.message});
    }
  };

  const isExpired = (c: Coupon) => new Date(c.expiresAt) < new Date();
  const isEligible = (c: Coupon) => !isExpired(c) && cartTotal >= c.minOrder;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
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
            const isApplied = appliedCoupon?.code === coupon.code;

            return (
              <div
                key={coupon.code}
                className={`relative border rounded-lg p-4 transition-all ${
                  expired ? "opacity-50 bg-muted/50" : isBest ? "border-primary bg-primary/5" : "bg-card"
                }`}
              >
                {isBest && !expired && (
                  <Badge className="absolute -top-2 right-3 bg-primary text-primary-foreground text-[10px] gap-1">
                    <Sparkles className="h-3 w-3" /> Best Value
                  </Badge>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold text-sm tracking-wider bg-secondary px-2 py-0.5 rounded">
                        {coupon.code}
                      </code>
                      <Badge variant="outline" className="text-[10px]">
                        {coupon.type === "percentage" ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5">{coupon.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> Min: ${coupon.minOrder}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {expired ? "Expired" : `Until ${new Date(coupon.expiresAt).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isApplied ? "secondary" : "default"}
                    disabled={expired || !eligible || isApplied}
                    onClick={() => handleApply(coupon)}
                    className="shrink-0 text-xs"
                  >
                    {isApplied ? "Applied" : expired ? "Expired" : !eligible ? `Need $${coupon.minOrder}` : "Apply"}
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
