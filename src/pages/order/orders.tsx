import { useState, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  Package,
  ChevronRight,
  ChevronDown,
  Check,
  Circle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { orders } from "@/data/products";
import { motion, AnimatePresence } from "motion/react";
import { useGetOrders } from "@/services/order/order.query";
import { formatCurrency } from "@/utils/utils";
import type { Order } from "@/services/order/order.types";

const statusColors: Record<Order["status"], string> = {
  DELIVERED: "bg-success text-success-foreground",
  SHIPPED: "bg-primary text-primary-foreground",
  PROCESSING: "bg-secondary text-secondary-foreground",
  CANCELLED: "bg-destructive text-destructive-foreground",
  PACKED: "bg-accent text-accent-foreground",
  OUT_FOR_DELIVERY: "bg-primary text-primary-foreground",
  RETURN_REQUESTED: "bg-destructive text-destructive-foreground",
  RETURNED: "bg-destructive text-destructive-foreground",
  PENDING: "bg-muted text-muted-foreground",
};

const Orders = () => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data: ordersData, isFetching } = useGetOrders();
  console.log({ ordersData, isFetching });
  const navigate = useNavigate();

  const trackingFor = (status: Order["status"]) => {
    const steps: string[] = [
      "PENDING",
      "PAID",
      "CANCELLED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ];
    const statusIndex: Record<string, number> = {
      PENDING: 0,
      PACKED: 1,
      CANCELLED: -1,
      SHIPPED: 3,
      OUT_FOR_DELIVERY: 4,
      DELIVERED: 5,
    };
    const idx = statusIndex[status] ?? -1;
    return steps.map((label, i) => ({
      label,
      date: i <= idx ? "2025-02-0" + (i + 1) : "",
      done: i <= idx,
    }));
  };

  const handleOrderClick = (
    e: MouseEvent<HTMLParagraphElement>,
    orderId: string,
  ) => {
    e.stopPropagation();
    navigate(`/order/${orderId}`);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/40" />
            <h2 className="text-xl font-display mt-4">No orders yet</h2>
            <p className="text-muted-foreground mt-1">
              Start shopping to see your orders here.
            </p>
            <Link
              to="/products"
              className="text-primary text-sm mt-3 inline-block"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersData?.data?.map((order) => (
              <motion.div
                key={order.order_number}
                layout
                className="bg-card border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.order_number
                        ? null
                        : order.order_number,
                    )
                  }
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer"
                >
                  <div>
                    <p
                      className="font-semibold text-sm"
                      onClick={(e) => handleOrderClick(e, order.order_number)}
                    >
                      {order.order_number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.purchase_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`${statusColors[order.status]} capitalize text-xs`}
                    >
                      {order.status.replace("_", " ")}
                    </Badge>
                    <span className="font-semibold">
                      {formatCurrency(order.total_amount)}
                    </span>
                    {expandedOrder === order.order_number ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedOrder === order.order_number && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t pt-4">
                        {/* Order tracking */}
                        {trackingFor(order.status) &&
                          order.status !== "CANCELLED" && (
                            <div className="mb-6">
                              <h3 className="text-sm font-semibold mb-3">
                                Order Tracking
                              </h3>
                              <div className="flex items-center gap-0">
                                {trackingFor(order.status).map((step, i) => (
                                  <div
                                    key={step.label}
                                    className="flex items-center flex-1 last:flex-none"
                                  >
                                    <div className="flex flex-col items-center relative">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                          step.done
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                      >
                                        {step.done ? (
                                          <Check className="h-3 w-3" />
                                        ) : (
                                          <Circle className="h-3 w-3" />
                                        )}
                                      </div>
                                      <span className="absolute -bottom-5 text-[10px] text-muted-foreground mt-1 text-center whitespace-nowrap">
                                        {step.label}
                                      </span>
                                    </div>
                                    {i <
                                      trackingFor(order.status)!.length - 1 && (
                                      <div
                                        className={`flex-1 h-0.5 mx-1 ${step.done ? "bg-primary" : "bg-muted"}`}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Items */}
                        <div className="space-y-3">
                          {order.items.map((product) => (
                            <Link
                              key={product.slug}
                              to={`/product/${product.slug}?color=${product.color}${product.size ? `&size=${product.size}` : ""}`}
                              className="flex items-center gap-3 group"
                            >
                              <img
                                src={product.images[0]?.image_url}
                                alt={product.name}
                                className="h-14 w-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium group-hover:text-primary transition-colors">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Color: {product.color}{" "}
                                  {product.size && `· Size: ${product.size}`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {product.quantity} ·{" "}
                                  {formatCurrency(product.price)}
                                </p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
