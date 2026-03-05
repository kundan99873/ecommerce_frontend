import { useState } from "react";
import { Star, ThumbsUp, Loader2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/authContext";
import { toast } from "@/hooks/useToast";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface Review {
  productId: number;
  orderId: string;
  rating: number;
  comment: string;
  userName?: string;
  date?: string;
  helpful?: number;
}

const getReviews = (): Review[] => JSON.parse(localStorage.getItem("lumiere_reviews") || "[]");

const MOCK_REVIEWS: Omit<Review, "productId">[] = [
  { orderId: "mock", rating: 5, comment: "Absolutely love this! The quality exceeded my expectations. Would definitely buy again.", userName: "Sarah M.", date: "2025-01-15", helpful: 12 },
  { orderId: "mock", rating: 4, comment: "Great product, fits perfectly. Shipping was fast too.", userName: "James T.", date: "2025-01-08", helpful: 8 },
  { orderId: "mock", rating: 5, comment: "Premium quality materials. Worth every penny.", userName: "Emily R.", date: "2024-12-20", helpful: 15 },
  { orderId: "mock", rating: 3, comment: "Good but could be better. Sizing runs a bit large.", userName: "Michael D.", date: "2024-12-10", helpful: 4 },
];

interface ProductReviewsProps {
  productId: number;
  rating: number;
  reviewCount: number;
}

const ProductReviews = ({ productId, rating, reviewCount }: ProductReviewsProps) => {
  const { isAuthenticated, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Set<number>>(new Set());
  const [hoverRating, setHoverRating] = useState(0);

  const userReviews = getReviews().filter((r) => r.productId === productId);
  const allReviews = [
    ...userReviews.map((r) => ({ ...r, userName: user?.name || "You", date: new Date().toISOString().split("T")[0], helpful: 0 })),
    ...MOCK_REVIEWS.map((r, i) => ({ ...r, productId, id: i })),
  ];

  const avgRating = allReviews.length > 0
    ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    : rating;

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
    pct: allReviews.length > 0 ? (allReviews.filter((r) => r.rating === star).length / allReviews.length) * 100 : 0,
  }));

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const reviews = getReviews();
    reviews.push({ productId, orderId: "direct", rating: newRating, comment, userName: user?.name });
    localStorage.setItem("lumiere_reviews", JSON.stringify(reviews));
    setShowForm(false);
    setComment("");
    setNewRating(5);
    setSubmitting(false);
    toast({ title: "Review submitted!", description: "Thank you for your feedback." });
  };

  const toggleHelpful = (idx: number) => {
    setHelpfulVotes((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <motion.section
      className="mt-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold">Customer Reviews</h2>
        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{reviewCount + userReviews.length}</span>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* LEFT: Rating summary */}
        <div className="md:col-span-2 space-y-4">
          <motion.div
            className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 text-center"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {avgRating.toFixed(1)}
            </div>
            <div className="flex justify-center mt-3 gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-5 w-5 ${s <= Math.round(avgRating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">Based on {reviewCount + userReviews.length} reviews</p>
          </motion.div>

          {/* Star breakdown */}
          <div className="bg-card border rounded-2xl p-6 space-y-3">
            {ratingDist.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3 text-sm group cursor-default">
                <span className="w-8 text-right text-muted-foreground flex items-center justify-end gap-0.5 font-medium">
                  {star} <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                </span>
                <div className="flex-1">
                  <Progress value={pct} className="h-2.5" />
                </div>
                <span className="w-10 text-xs text-muted-foreground tabular-nums">{count} ({Math.round(pct)}%)</span>
              </div>
            ))}
          </div>

          {/* Write review button */}
          {isAuthenticated && !showForm && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full gap-2 h-12 text-sm font-semibold" onClick={() => setShowForm(true)}>
                <Star className="h-4 w-4" /> Write a Review
              </Button>
            </motion.div>
          )}
          {!isAuthenticated && (
            <div className="bg-muted/50 border border-dashed rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Log in to write a review.</p>
            </div>
          )}
        </div>

        {/* RIGHT: Reviews list + form */}
        <div className="md:col-span-3 space-y-4">
          {/* Review form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                className="bg-card border-2 border-primary/20 rounded-2xl p-6 space-y-5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p className="text-sm font-semibold mb-3">Your Rating</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => setNewRating(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <Star className={`h-8 w-8 transition-all duration-150 ${
                            s <= (hoverRating || newRating) ? "fill-primary text-primary scale-110" : "text-muted-foreground/30 hover:text-primary/50"
                          }`} />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">{ratingLabels[hoverRating || newRating]}</span>
                  </div>
                </div>
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience with this product..." rows={4} className="resize-none" />
                <div className="flex gap-2">
                  <Button onClick={handleSubmit} disabled={submitting || !comment.trim()} className="gap-1">
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Submit Review
                  </Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review list */}
          {allReviews.map((review, idx) => (
            <motion.div
              key={idx}
              className="bg-card border rounded-2xl p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary">
                    {(review.userName || "A").charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-sm">{review.userName || "Anonymous"}</span>
                    {review.date && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`} />
                  ))}
                </div>
              </div>

              <div className="relative pl-4 border-l-2 border-primary/10">
                <Quote className="absolute -left-2.5 -top-1 h-4 w-4 text-primary/20 bg-card" />
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>

              <button
                onClick={() => toggleHelpful(idx)}
                className={`mt-4 flex items-center gap-2 text-xs font-medium transition-all rounded-full px-3 py-1.5 ${
                  helpfulVotes.has(idx) 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                Helpful ({(review.helpful || 0) + (helpfulVotes.has(idx) ? 1 : 0)})
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ProductReviews;
