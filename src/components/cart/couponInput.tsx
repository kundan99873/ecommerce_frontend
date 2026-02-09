import { useState } from "react";
import { Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCoupon } from "@/context/couponContext";
import { toast } from "@/hooks/useToast";

interface CouponInputProps {
  cartTotal: number;
}

const CouponInput = ({ cartTotal }: CouponInputProps) => {
  const { appliedCoupon, discount, applyCoupon, removeCoupon } = useCoupon();
  const [code, setCode] = useState("");

  const handleApply = () => {
    if (!code.trim()) return;
    const result = applyCoupon(code, cartTotal);
    if (result.success) {
      toast({ title: "Coupon applied!", description: result.message });
      setCode("");
    } else {
      toast({ title: "Invalid coupon", description: result.message });
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-success/10 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-success" />
          <div>
            <span className="text-sm font-medium">{appliedCoupon.code}</span>
            <span className="text-xs text-muted-foreground ml-2">-${discount.toFixed(2)}</span>
          </div>
        </div>
        <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive">
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
      <Button variant="outline" size="sm" onClick={handleApply} disabled={!code.trim()}>
        Apply
      </Button>
    </div>
  );
};

export default CouponInput;
