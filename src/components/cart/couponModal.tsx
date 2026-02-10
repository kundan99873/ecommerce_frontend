import { Tag, Sparkles, Clock, DollarSign, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCoupon, type Coupon } from "@/context/couponContext";
import { toast } from "@/hooks/useToast";
import { useState } from "react";

interface CouponModalProps {
  cartTotal: number;
}

const CouponModal = ({ cartTotal }: CouponModalProps) => {
  const { availableCoupons, appliedCoupon, applyCoupon } = useCoupon();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
      toast({ title: "Cannot apply", description: result.message });
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({ title: "Copied!", description: `${code} copied to clipboard` });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getSaving = (c: Coupon) =>
    c.type === "percentage" ? (cartTotal * c.value) / 100 : c.value;

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
                className={`relative border rounded-xl overflow-hidden transition-all ${
                  expired ? "opacity-50 bg-muted/50" : isBest ? "border-primary bg-primary/5" : "bg-card"
                }`}
              >
                {isBest && !expired && (
                  <Badge className="absolute top-0 right-0 rounded-none rounded-bl-lg bg-primary text-primary-foreground text-[10px] gap-1">
                    <Sparkles className="h-3 w-3" /> Best Value
                  </Badge>
                )}

                {/* Discount highlight bar */}
                <div className={`px-4 py-2 text-center font-bold text-sm ${
                  expired ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                }`}>
                  {coupon.type === "percentage" ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                  {eligible && !expired && (
                    <span className="ml-2 font-normal text-xs">(Save ${getSaving(coupon).toFixed(2)})</span>
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
                  <p className="text-sm text-muted-foreground">{coupon.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> Min: ${coupon.minOrder}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {expired ? "Expired" : `Until ${new Date(coupon.expiresAt).toLocaleDateString()}`}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={isApplied ? "secondary" : "default"}
                    disabled={expired || !eligible || isApplied}
                    onClick={() => handleApply(coupon)}
                    className="w-full mt-3 text-xs"
                  >
                    {isApplied ? "✓ Applied" : expired ? "Expired" : !eligible ? `Min order $${coupon.minOrder}` : "Apply Coupon"}
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
