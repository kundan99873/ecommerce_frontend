import { useState } from "react";
import { Link } from "react-router";
import { Package, ChevronRight, ChevronDown, Check, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { orders } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";

const statusColors: Record<string, string> = {
  delivered: "bg-success text-success-foreground",
  shipped: "bg-primary text-primary-foreground",
  processing: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
  packed: "bg-accent text-accent-foreground",
  out_for_delivery: "bg-primary text-primary-foreground",
};

const Orders = () => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/40" />
            <h2 className="text-xl font-display mt-4">No orders yet</h2>
            <p className="text-muted-foreground mt-1">Start shopping to see your orders here.</p>
            <Link to="/products" className="text-primary text-sm mt-3 inline-block">Browse products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                layout
                className="bg-card border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div>
                    <p className="font-semibold text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${statusColors[order.status]} capitalize text-xs`}>
                      {order.status.replace("_", " ")}
                    </Badge>
                    <span className="font-semibold">${order.total}</span>
                    {expandedOrder === order.id ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t pt-4">
                        {/* Order tracking */}
                        {order.trackingSteps && order.status !== "cancelled" && (
                          <div className="mb-6">
                            <h3 className="text-sm font-semibold mb-3">Order Tracking</h3>
                            <div className="flex items-center gap-0">
                              {order.trackingSteps.map((step, i) => (
                                <div key={step.label} className="flex items-center flex-1 last:flex-none">
                                  <div className="flex flex-col items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                      step.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                                    }`}>
                                      {step.done ? <Check className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground mt-1 text-center whitespace-nowrap">{step.label}</span>
                                  </div>
                                  {i < order.trackingSteps!.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-1 ${step.done ? "bg-success" : "bg-muted"}`} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Items */}
                        <div className="space-y-3">
                          {order.items.map(({ product, quantity }) => (
                            <Link
                              key={product.id}
                              to={`/product/${product.id}`}
                              className="flex items-center gap-3 group"
                            >
                              <img src={product.image} alt={product.name} className="h-14 w-12 object-cover rounded" />
                              <div className="flex-1">
                                <p className="text-sm font-medium group-hover:text-primary transition-colors">{product.name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {quantity} · ${product.price}</p>
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
