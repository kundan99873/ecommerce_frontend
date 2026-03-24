import { useMemo, useState } from "react";
import { Loader2, Quote, Star, ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { ProductReview } from "@/services/product/product.types";

interface CustomerReviewsProps {
  reviewsLoading: boolean;
  reviews: ProductReview[];
  averageRating: number;
  totalReviews: number;
  ratingBreakdown?: Record<string, number>;
  isFetchingMoreReviews: boolean;
  hasMoreReviews?: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

const REVIEWER_FALLBACK_IMAGE = "/user-placeholder.svg";

const CustomerReviews = ({
  reviewsLoading,
  reviews,
  averageRating,
  totalReviews,
  ratingBreakdown,
  isFetchingMoreReviews,
  hasMoreReviews,
  loadMoreRef,
}: CustomerReviewsProps) => {
  const [helpfulVotes, setHelpfulVotes] = useState<Set<number>>(new Set());

  const resolvedTotalReviews = totalReviews || reviews.length;

  const ratingDist = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => {
        const count = Number(ratingBreakdown?.[String(star)] ?? 0);
        const pct =
          resolvedTotalReviews > 0 ? (count / resolvedTotalReviews) * 100 : 0;

        return { star, count, pct };
      }),
    [ratingBreakdown, resolvedTotalReviews],
  );

  const computedAverageRating = useMemo(() => {
    if (averageRating > 0) return averageRating;
    if (reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  }, [averageRating, reviews]);

  const toggleHelpful = (idx: number) => {
    setHelpfulVotes((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <section className="mt-16 pb-10">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold">
          Customer Reviews
        </h2>
        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {resolvedTotalReviews}
        </span>
      </div>

      {reviewsLoading ? (
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-2xl border p-8 animate-pulse bg-card">
              <div className="h-12 w-20 mx-auto rounded bg-muted" />
              <div className="mt-4 h-4 w-36 mx-auto rounded bg-muted" />
              <div className="mt-3 h-3 w-44 mx-auto rounded bg-muted" />
            </div>
            <div className="rounded-2xl border p-6 space-y-3 animate-pulse bg-card">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-3 w-full rounded bg-muted" />
              ))}
            </div>
          </div>
          <div className="md:col-span-3 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 w-28 rounded bg-muted" />
                    <div className="mt-2 h-3 w-20 rounded bg-muted" />
                  </div>
                  <div className="h-4 w-24 rounded bg-muted" />
                </div>
                <div className="mt-3 h-3 w-full rounded bg-muted" />
                <div className="mt-2 h-3 w-3/4 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {computedAverageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mt-3 gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${s <= Math.round(computedAverageRating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Based on {resolvedTotalReviews} reviews
              </p>
            </div>

            <div className="bg-card border rounded-2xl p-6 space-y-3">
              {ratingDist.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-right text-muted-foreground flex items-center justify-end gap-0.5 font-medium">
                    {star}{" "}
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  </span>
                  <div className="flex-1">
                    <Progress value={pct} className="h-2.5" />
                  </div>
                  <span className="w-14 text-xs text-muted-foreground tabular-nums text-right">
                    {count} ({Math.round(pct)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground rounded-2xl border p-6">
                No reviews yet. Be the first to review this product.
              </p>
            ) : (
              <>
                {reviews.map((review, index) => {
                  const reviewerName = review.user?.name || "Verified customer";
                  const avatarSrc =
                    review.user?.avatar_url || REVIEWER_FALLBACK_IMAGE;

                  return (
                    <div
                      key={review.id ?? index}
                      className="bg-card border rounded-2xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatarSrc}
                            alt={reviewerName}
                            className="h-10 w-10 rounded-full object-cover border"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = REVIEWER_FALLBACK_IMAGE;
                            }}
                          />
                          <div>
                            <span className="font-semibold text-sm">
                              {reviewerName}
                            </span>
                            {review.created_at ? (
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-4 w-4 ${s <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="relative pl-4 border-l-2 border-primary/10">
                        <Quote className="absolute -left-2.5 -top-1 h-4 w-4 text-primary/20 bg-card" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleHelpful(index)}
                        className={`mt-4 flex items-center gap-2 text-xs font-medium transition-all rounded-full px-3 py-1.5 ${
                          helpfulVotes.has(index)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        Helpful ({helpfulVotes.has(index) ? 1 : 0})
                      </button>
                    </div>
                  );
                })}

                <div ref={loadMoreRef} className="h-8 w-full" />

                {isFetchingMoreReviews && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading more reviews...
                  </div>
                )}

                {!hasMoreReviews && reviews.length > 0 && (
                  <p className="text-center text-xs text-muted-foreground pt-1">
                    You have reached the end of reviews.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomerReviews;
