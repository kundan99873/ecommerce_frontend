import { useParams, Link } from "react-router";
import { ArrowLeft, Check, Circle, Package, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { useGetOrderById } from "@/services/order/order.query";
import { formatCurrency, trackingFor } from "@/utils/utils";
import AddReviewToOrderProduct from "./AddReviewToOrderProduct";
import dayjs from "dayjs";
import OrderDetailSkeleton from "./orderDetailSkeleton";

const statusColors: Record<string, string> = {
  delivered: "bg-success text-success-foreground",
  shipped: "bg-primary text-primary-foreground",
  processing: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
  packed: "bg-accent text-accent-foreground",
  out_for_delivery: "bg-primary text-primary-foreground",
};

const OrderDetail = () => {
  const { id } = useParams();
  const [reviewingProduct, setReviewingProduct] = useState<string | null>(null);

  const { data, isFetching } = useGetOrderById(id!);
  const orderData = data?.data;

  if (isFetching) return <OrderDetailSkeleton />;

  if (!orderData) {
    return (
      <>
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/40" />
          <h1 className="text-2xl font-display font-bold mt-4">
            Order not found
          </h1>
          <Link to="/orders" className="text-primary text-sm mt-3 inline-block">
            Back to orders
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to orders
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-display font-bold">
                {orderData.order_number}
              </h1>
              <p className="text-sm text-muted-foreground">
                Placed on{" "}
                {dayjs(orderData.purchase_date).format("MMMM D, YYYY")}
              </p>
            </div>
            <Badge className={`${statusColors[orderData.status]} capitalize`}>
              {orderData.status.replace("_", " ")}
            </Badge>
          </div>

          {/* Tracking */}
          {trackingFor(orderData.status) &&
            orderData.status !== "CANCELLED" && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Order Tracking</h3>
                <div className="flex items-center gap-0">
                  {trackingFor(orderData.status).map((step, i) => (
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
                      {i < trackingFor(orderData.status)!.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1 ${step.done ? "bg-primary" : "bg-muted"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="grid md:grid-cols-3 gap-6">
            {/* Items */}
            <div className="md:col-span-2 space-y-3">
              <h2 className="font-display font-bold text-lg">Items</h2>
              {orderData?.items.map((product) => {
                const reviewFlag = (product as { review?: unknown }).review;
                const isReviewSubmitted =
                  reviewFlag === true ||
                  reviewFlag === "true" ||
                  reviewFlag === 1;

                return (
                  <div
                    key={product.slug}
                    className="bg-card border rounded-lg p-4"
                  >
                    <div className="flex gap-3">
                      <Link to={`/product/${product.slug}`}>
                        <img
                          src={product.images[0].image_url}
                          alt={product.name}
                          className="h-20 w-16 object-cover rounded"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link
                          to={`/product/${product.slug}`}
                          className="font-medium text-sm hover:text-primary transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Qty: {product.quantity} · ${product.price} each
                        </p>
                        <p className="text-sm font-semibold mt-1">
                          ${product.price * product.quantity}
                        </p>

                        {isReviewSubmitted ? (
                          <p className="text-xs text-success mt-2">
                            ✓ Review submitted
                          </p>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 text-xs"
                            onClick={() => setReviewingProduct(product.slug)}
                          >
                            <Star className="h-3 w-3 mr-1" /> Write Review
                          </Button>
                        )}
                      </div>
                    </div>
                    {reviewingProduct === product.slug && (
                      <AddReviewToOrderProduct
                        product={product}
                        reviewingProduct={reviewingProduct}
                        setReviewingProduct={setReviewingProduct}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {/* Summary sidebar */}
            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-5">
                <h2 className="font-display font-bold text-lg mb-3">
                  Order Summary
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(orderData?.total_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span>{formatCurrency(orderData?.discount_amount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(orderData?.final_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" /> Shipping
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {orderData?.address.first_name} {orderData?.address.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {orderData?.address.line1}
                </p>
                <p className="text-sm text-muted-foreground">
                  {orderData?.address.line2}
                </p>
                <p className="text-sm text-muted-foreground">
                  {orderData?.address.city}, {orderData?.address.state}{" "}
                  {orderData?.address.pin_code}
                </p>
              </div>

              {/* <div className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4" /> Payment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visa ending in 4242
                </p>
              </div> */}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default OrderDetail;
