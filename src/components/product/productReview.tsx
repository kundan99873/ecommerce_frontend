import { useState } from "react";
import { Star, ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/authContext";
import { toast } from "@/hooks/useToast";

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

// Mock reviews for display
const MOCK_REVIEWS: Omit<Review, "productId">[] = [
  { orderId: "mock", rating: 5, comment: "Absolutely love this! The quality exceeded my expectations. Would definitely buy again.", userName: "Sarah M.", date: "2025-01-15", helpful: 12 },
  { orderId: "mock", rating: 4, comment: "Great product, fits perfectly. Shipping was fast too.", userName: "James T.", date: "2025-01-08", helpful: 8 },
  { orderId: "mock", rating: 5, comment: "Premium quality materials. Worth every penny.", userName: "Emily R.", date: "2024-12-20", helpful: 15 },
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

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-display font-bold mb-6">Reviews & Ratings</h2>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Summary */}
        <div className="text-center md:text-left">
          <div className="text-4xl font-bold">{avgRating.toFixed(1)}</div>
          <div className="flex justify-center md:justify-start mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-primary text-primary" : "text-border"}`} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{reviewCount + userReviews.length} reviews</p>
        </div>

        {/* Distribution */}
        <div className="md:col-span-2 space-y-1.5">
          {ratingDist.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-8 text-right text-muted-foreground">{star}★</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-6 text-xs text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write review button */}
      {isAuthenticated && !showForm && (
        <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="mb-6">
          <Star className="h-4 w-4 mr-1" /> Write a Review
        </Button>
      )}
      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground mb-6">Log in to write a review.</p>
      )}

      {/* Review form */}
      {showForm && (
        <div className="bg-card border rounded-lg p-5 mb-6 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setNewRating(s)}>
                  <Star className={`h-6 w-6 transition-colors ${s <= newRating ? "fill-primary text-primary" : "text-border hover:text-primary/50"}`} />
                </button>
              ))}
            </div>
          </div>
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." rows={3} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={submitting || !comment.trim()}>
              {submitting && <Loader2 className="h-3 w-3 animate-spin mr-1" />} Submit
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <Separator className="mb-6" />

      {/* Review list */}
      <div className="space-y-4">
        {allReviews.map((review, idx) => (
          <div key={idx} className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-primary text-primary" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{review.userName || "Anonymous"}</span>
              </div>
              {review.date && <span className="text-xs text-muted-foreground">{review.date}</span>}
            </div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>
            <button
              onClick={() => toggleHelpful(idx)}
              className={`mt-2 flex items-center gap-1 text-xs transition-colors ${
                helpfulVotes.has(idx) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              Helpful ({(review.helpful || 0) + (helpfulVotes.has(idx) ? 1 : 0)})
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductReviews;
