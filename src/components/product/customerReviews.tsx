import { Loader2, Star } from "lucide-react";
import type { ProductReview } from "@/services/product/product.types";

interface CustomerReviewsProps {
  reviewsLoading: boolean;
  reviews: ProductReview[];
  isFetchingMoreReviews: boolean;
  hasMoreReviews?: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

const REVIEWER_FALLBACK_IMAGE = "/user-placeholder.svg";

const CustomerReviews = ({
  reviewsLoading,
  reviews,
  isFetchingMoreReviews,
  hasMoreReviews,
  loadMoreRef,
}: CustomerReviewsProps) => {
  return (
    <section className="pb-10">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Customer Reviews</h2>

      {reviewsLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse">
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
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No reviews yet. Be the first to review this product.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => {
            const reviewerName = review.user?.name || "Verified customer";
            const avatarSrc =
              review.user?.avatar_url || REVIEWER_FALLBACK_IMAGE;

            return (
              <div key={review.id ?? index} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-2">
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
                      <p className="text-sm font-medium">{reviewerName}</p>
                      {review.created_at ? (
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  {review.comment}
                </p>
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
        </div>
      )}
    </section>
  );
};

export default CustomerReviews;
