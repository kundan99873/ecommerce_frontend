import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Percent, DollarSign, Globe, Tag, Hash, ShoppingCart } from "lucide-react";
import type { AdminCoupon } from "@/services/couponService";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface Props {
  coupon: AdminCoupon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CouponDetailModal = ({ coupon, open, onOpenChange }: Props) => {
  if (!coupon) return null;

  const isExpired = new Date(coupon.end_date) < new Date();
  const isUpcoming = new Date(coupon.start_date) > new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Coupon Details</DialogTitle>
        </DialogHeader>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Code & Status */}
          <div className="bg-muted/50 rounded-xl p-5 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border-2 border-dashed border-primary/40">
              <Tag className="h-4 w-4 text-primary" />
              <span className="font-mono font-bold text-xl tracking-wider">{coupon.code}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant={coupon.is_active ? "default" : "secondary"}>
                {coupon.is_active ? "Active" : "Inactive"}
              </Badge>
              {isExpired && <Badge variant="destructive">Expired</Badge>}
              {isUpcoming && <Badge variant="outline">Upcoming</Badge>}
              {coupon.is_global && (
                <Badge variant="outline" className="gap-1">
                  <Globe className="h-3 w-3" /> Global
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {coupon.description && (
            <p className="text-sm text-muted-foreground text-center">{coupon.description}</p>
          )}

          <Separator />

          {/* Discount Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {coupon.discount_type === "PERCENTAGE" ? (
                  <Percent className="h-4 w-4 text-primary" />
                ) : (
                  <DollarSign className="h-4 w-4 text-primary" />
                )}
                <p className="text-xs text-muted-foreground">Discount</p>
              </div>
              <p className="text-2xl font-bold">
                {coupon.discount_type === "PERCENTAGE" ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{coupon.discount_type}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">Min Purchase</p>
              </div>
              <p className="text-2xl font-bold">
                {coupon.min_purchase ? `$${coupon.min_purchase}` : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Minimum order value</p>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Validity Period</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="font-medium">{format(new Date(coupon.start_date), "MMM d, yyyy")}</p>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="font-medium">{format(new Date(coupon.end_date), "MMM d, yyyy")}</p>
              </div>
            </div>
          </div>

          {/* Usage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Hash className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs text-muted-foreground">Max Uses</p>
              </div>
              <p className="text-lg font-bold">{coupon.max_uses ?? "Unlimited"}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Scope</p>
              <p className="text-lg font-bold">{coupon.is_global ? "All Products" : "Selected"}</p>
            </div>
          </div>

          {/* Meta */}
          <Separator />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Created: {format(new Date(coupon.created_at), "MMM d, yyyy")}</span>
            <span>Updated: {format(new Date(coupon.updated_at), "MMM d, yyyy")}</span>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CouponDetailModal;
