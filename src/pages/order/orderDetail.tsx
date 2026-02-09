import { useParams, Link } from "react-router";
import { ArrowLeft, Check, Circle, Package, MapPin, CreditCard, Star, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { orders } from "@/data/products";
import { toast } from "@/hooks/useToast";
import { motion } from "framer-motion";

interface Review {
  productId: number;
  orderId: string;
  rating: number;
  comment: string;
}

const getReviews = (): Review[] => JSON.parse(localStorage.getItem("lumiere_reviews") || "[]");
const saveReview = (review: Review) => {
  const reviews = getReviews();
  reviews.push(review);
  localStorage.setItem("lumiere_reviews", JSON.stringify(reviews));
};

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
  const order = orders.find((o) => o.id === id);
  const [reviewingProduct, setReviewingProduct] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const existingReviews = getReviews();

  if (!order) {
    return (
      <>
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/40" />
          <h1 className="text-2xl font-display font-bold mt-4">Order not found</h1>
          <Link to="/orders" className="text-primary text-sm mt-3 inline-block">Back to orders</Link>
        </div>
      </>
    );
  }

  const handleSubmitReview = async (productId: number) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    saveReview({ productId, orderId: order.id, rating, comment });
    setReviewingProduct(null);
    setRating(5);
    setComment("");
    setSubmitting(false);
    toast({ title: "Review submitted!", description: "Thank you for your feedback." });
  };

  const shipping = order.total >= 100 ? 0 : 9.99;
  const subtotal = order.items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to orders
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-display font-bold">{order.id}</h1>
              <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <Badge className={`${statusColors[order.status]} capitalize`}>{order.status.replace("_", " ")}</Badge>
          </div>

          {/* Tracking */}
          {order.trackingSteps && order.status !== "cancelled" && (
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="font-display font-bold mb-4">Order Tracking</h2>
              <div className="flex items-center">
                {order.trackingSteps.map((step, i) => (
                  <div key={step.label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                        {step.done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 text-center">{step.label}</span>
                      {step.date && <span className="text-[10px] text-muted-foreground">{step.date}</span>}
                    </div>
                    {i < order.trackingSteps!.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${step.done ? "bg-success" : "bg-muted"}`} />
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
              {order.items.map(({ product, quantity }) => {
                const hasReview = existingReviews.some((r) => r.productId === product.id && r.orderId === order.id);
                const canReview = order.status === "delivered" && !hasReview;

                return (
                  <div key={product.id} className="bg-card border rounded-lg p-4">
                    <div className="flex gap-3">
                      <Link to={`/product/${product.id}`}>
                        <img src={product.image} alt={product.name} className="h-20 w-16 object-cover rounded" />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/product/${product.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                          {product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">Qty: {quantity} · ${product.price} each</p>
                        <p className="text-sm font-semibold mt-1">${product.price * quantity}</p>

                        {canReview && (
                          <Button variant="outline" size="sm" className="mt-2 text-xs" onClick={() => setReviewingProduct(product.id)}>
                            <Star className="h-3 w-3 mr-1" /> Write Review
                          </Button>
                        )}
                        {hasReview && (
                          <p className="text-xs text-success mt-2">✓ Review submitted</p>
                        )}
                      </div>
                    </div>

                    {reviewingProduct === product.id && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-2">Rating</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button key={s} onClick={() => setRating(s)}>
                                <Star className={`h-5 w-5 ${s <= rating ? "fill-primary text-primary" : "text-border"}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Comment</p>
                          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." rows={3} />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSubmitReview(product.id)} disabled={submitting}>
                            {submitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                            Submit Review
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setReviewingProduct(null)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary sidebar */}
            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-5">
                <h2 className="font-display font-bold text-lg mb-3">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
                  <Separator />
                  <div className="flex justify-between font-semibold"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-2"><MapPin className="h-4 w-4" /> Shipping</h3>
                <p className="text-sm text-muted-foreground">123 Main Street, New York, NY 10001</p>
              </div>

              <div className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-2"><CreditCard className="h-4 w-4" /> Payment</h3>
                <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default OrderDetail;
