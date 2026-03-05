import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Package, Truck, CheckCircle2, XCircle, Clock, MapPin } from "lucide-react";
import type { Order } from "@/data/products";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  delivered: "bg-success text-success-foreground",
  shipped: "bg-primary text-primary-foreground",
  processing: "bg-secondary text-secondary-foreground",
  packed: "bg-secondary text-secondary-foreground",
  out_for_delivery: "bg-primary/80 text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

const statusIcons: Record<string, React.ReactNode> = {
  processing: <Clock className="h-4 w-4" />,
  packed: <Package className="h-4 w-4" />,
  shipped: <Truck className="h-4 w-4" />,
  out_for_delivery: <MapPin className="h-4 w-4" />,
  delivered: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

interface Props {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, status: Order["status"]) => void;
  onDownloadInvoice: (id: string) => void;
}

const OrderDetailModal = ({ order, open, onOpenChange, onUpdateStatus, onDownloadInvoice }: Props) => {
  if (!order) return null;

  const subtotal = order.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            Order {order.id}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Status & Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {statusIcons[order.status]}
              <Badge className={statusColors[order.status]}>{order.status.replace(/_/g, " ")}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{order.date}</p>
          </div>

          {/* Tracking Timeline */}
          {order.trackingSteps && (
            <div className="relative">
              <h4 className="text-sm font-semibold mb-4">Order Timeline</h4>
              <div className="space-y-0">
                {order.trackingSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-3 w-3 rounded-full border-2 ${
                          step.done
                            ? "bg-primary border-primary"
                            : "bg-background border-muted-foreground/30"
                        }`}
                      />
                      {i < order.trackingSteps!.length - 1 && (
                        <div
                          className={`w-0.5 h-8 ${
                            step.done ? "bg-primary" : "bg-muted-foreground/20"
                          }`}
                        />
                      )}
                    </div>
                    <div className="-mt-0.5 pb-4">
                      <p className={`text-sm font-medium ${!step.done ? "text-muted-foreground" : ""}`}>
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Update Status */}
          <div>
            <p className="text-sm font-semibold mb-2">Update Status</p>
            <Select value={order.status} onValueChange={(v) => onUpdateStatus(order.id, v as Order["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"].map((s) => (
                  <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Items ({totalItems})</h4>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.product.brand} · {item.product.category}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.product.price}</p>
                  </div>
                  <p className="text-sm font-bold">${item.product.price * item.quantity}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
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
                {order.status === "cancelled" ? "Refunded" : "Paid"}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${order.total}</span>
            </div>
          </div>

          <Button className="w-full" variant="outline" onClick={() => onDownloadInvoice(order.id)}>
            <Download className="h-4 w-4 mr-2" /> Download Invoice
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
