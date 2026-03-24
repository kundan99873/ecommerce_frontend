import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import type { Order } from "@/services/order/order.types";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  DELIVERED: "bg-success text-success-foreground",
  SHIPPED: "bg-primary text-primary-foreground",
  PROCESSING: "bg-secondary text-secondary-foreground",
  PACKED: "bg-secondary text-secondary-foreground",
  OUT_FOR_DELIVERY: "bg-primary/80 text-primary-foreground",
  CANCELLED: "bg-destructive text-destructive-foreground",
  PENDING: "bg-success text-success-foreground",
};

const statusIcons: Record<string, React.ReactNode> = {
  PROCESSING: <Clock className="h-4 w-4" />,
  PACKED: <Package className="h-4 w-4" />,
  SHIPPED: <Truck className="h-4 w-4" />,
  OUT_FOR_DELIVERY: <MapPin className="h-4 w-4" />,
  DELIVERED: <CheckCircle2 className="h-4 w-4" />,
  CANCELLED: <XCircle className="h-4 w-4" />,
  PENDING: <Clock className="h-4 w-4" />,
};

interface Props {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (orderNumber: string, status: Order["status"]) => void;
  onDownloadInvoice: (orderNumber: string) => void;
  isUpdatingStatus: boolean;
}

const OrderDetailModal = ({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
  onDownloadInvoice,
  isUpdatingStatus,
}: Props) => {
  if (!order) return null;

  const getItemPrice = (item: any) => item?.product?.price ?? item?.price ?? 0;
  const getItemName = (item: any) =>
    item?.product?.name ?? item?.name ?? "Product";
  const getItemImage = (item: any) =>
    item?.product?.image ?? item?.images?.[0]?.image_url ?? "";
  const getItemBrand = (item: any) => item?.product?.brand ?? item?.brand ?? "";
  const getItemCategory = (item: any) =>
    item?.product?.category ?? item?.category ?? "";

  const subtotal = order.items.reduce((sum, item) => {
    const quantity = item?.quantity ?? 0;
    return sum + getItemPrice(item) * quantity;
  }, 0);

  const totalItems = order.items.reduce(
    (sum, item) => sum + (item?.quantity ?? 0),
    0,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto overflow-x-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            Order {order.order_number}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {statusIcons[order.status]}
              <Badge className={statusColors[order.status]}>
                {order.status.replace(/_/g, " ").toLowerCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {order.purchase_date}
            </p>
          </div>

          <Separator />

          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-sm font-semibold">Update Status</p>
              {isUpdatingStatus && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Updating...
                </span>
              )}
            </div>
            <Select
              value={order.status}
              disabled={isUpdatingStatus}
              onValueChange={(v) =>
                onUpdateStatus(order.order_number, v as Order["status"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "PENDING",
                  "PROCESSING",
                  "PACKED",
                  "SHIPPED",
                  "OUT_FOR_DELIVERY",
                  "DELIVERED",
                  "CANCELLED",
                ].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace(/_/g, " ").toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold mb-3">Items ({totalItems})</h4>
            <div className="space-y-3 min-w-max">
              {order.items.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <img
                    src={getItemImage(item)}
                    alt={getItemName(item)}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {getItemName(item)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getItemBrand(item)} · {getItemCategory(item)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × ${getItemPrice(item)}
                    </p>
                  </div>
                  <p className="text-sm font-bold">
                    ${getItemPrice(item) * item.quantity}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <Badge variant="outline" className="text-xs">
                {order.status === "CANCELLED" ? "Refunded" : "Paid"}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${order.final_amount ?? subtotal}</span>
            </div>
          </div>

          <Button
            className="w-full"
            variant="outline"
            onClick={() => onDownloadInvoice(order.order_number)}
          >
            <Download className="h-4 w-4 mr-2" /> Download Invoice
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
