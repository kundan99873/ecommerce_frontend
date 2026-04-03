import { useMemo, useState } from "react";
import {
  Award,
  Loader2,
  MessageSquare,
  Quote,
  Star,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
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

const AVATAR_COLORS = [
  "from-rose-500 to-pink-500",
  "from-violet-500 to-purple-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
];

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
        const fallbackCount = reviews.filter(
          (review) => review.rating === star,
        ).length;
        const count = Number(ratingBreakdown?.[String(star)] ?? fallbackCount);
        const pct =
          resolvedTotalReviews > 0 ? (count / resolvedTotalReviews) * 100 : 0;

        return { star, count, pct };
      }),
    [ratingBreakdown, resolvedTotalReviews, reviews],
  );

  const computedAverageRating = useMemo(() => {
    if (averageRating > 0) return averageRating;
    if (reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  }, [averageRating, reviews]);

  const recommendationPercent =
    resolvedTotalReviews > 0
      ? Math.round(
          (reviews.filter((review) => review.rating >= 4).length /
            resolvedTotalReviews) *
            100,
        )
      : 0;

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

  const getRatingTag = (rating: number) => {
    if (rating >= 5) {
      return {
        label: "Excellent",
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      };
    }

    if (rating >= 4) {
      return {
        label: "Great",
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      };
    }

    if (rating >= 3) {
      return {
        label: "Good",
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };
    }

    return {
      label: "Average",
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    };
  };

  return (
    <motion.section
      className="mt-0 pb-0"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold">
              Customer Reviews
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {resolvedTotalReviews} verified reviews
            </p>
          </div>
        </div>
      </div>

      {reviewsLoading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border bg-card p-5"
              >
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="mt-4 h-9 w-16 rounded bg-muted" />
                <div className="mt-3 h-3 w-20 rounded bg-muted" />
              </div>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-12">
            <div className="space-y-4 md:col-span-4">
              <div className="animate-pulse rounded-2xl border bg-card p-6">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="h-3 w-full rounded bg-muted" />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 md:col-span-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border bg-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-28 rounded bg-muted" />
                    <div className="h-4 w-20 rounded bg-muted" />
                  </div>
                  <div className="mt-3 h-3 w-full rounded bg-muted" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <motion.div
              className="relative overflow-hidden rounded-2xl border bg-card p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-primary/5" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Overall Rating
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  {computedAverageRating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">/5</span>
              </div>
              <div className="mt-2 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= Math.round(computedAverageRating) ? "fill-primary text-primary" : "text-muted-foreground/20"}`}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-2xl border bg-card p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
            >
              <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-emerald-500/5" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Reviews
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  {resolvedTotalReviews}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Active feedback</span>
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-2xl border bg-card p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-amber-500/5" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recommend
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  {recommendationPercent}%
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs font-medium text-muted-foreground">
                  Would buy again
                </span>
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-2xl border bg-card p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.26 }}
            >
              <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-violet-500/5" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                5-Star Reviews
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  {ratingDist.find((item) => item.star === 5)?.count ?? 0}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  {Math.round(
                    ratingDist.find((item) => item.star === 5)?.pct ?? 0,
                  )}
                  %
                </span>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-8 md:grid-cols-12">
            <div className="space-y-5 md:col-span-4">
              <motion.div
                className="space-y-4 rounded-2xl border bg-card p-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Rating Breakdown
                </h3>
                {ratingDist.map(({ star, count, pct }) => (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <span className="flex w-12 shrink-0 items-center justify-end gap-1 text-right font-medium text-muted-foreground">
                      {star}
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    </span>
                    <div className="flex-1">
                      <Progress value={pct} className="h-2.5" />
                    </div>
                    <span className="w-12 shrink-0 text-xs tabular-nums text-muted-foreground">
                      {count}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="space-y-5 md:col-span-8">
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  No reviews yet. Be the first to review this product.
                </div>
              ) : (
                <>
                  {reviews.map((review, index) => {
                    const reviewerName =
                      review.user?.name?.trim() || "Verified customer";
                    const avatarSrc = review.user?.avatar_url;
                    const tag = getRatingTag(review.rating);

                    return (
                      <motion.div
                        key={review.id ?? index}
                        className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.06 }}
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {avatarSrc ? (
                              <img
                                src={avatarSrc}
                                alt={reviewerName}
                                className="h-11 w-11 rounded-full border object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = REVIEWER_FALLBACK_IMAGE;
                                }}
                              />
                            ) : (
                              <div
                                className={`flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} text-sm font-bold text-white`}
                              >
                                {reviewerName.charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">
                                  {reviewerName}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="h-5 rounded-full px-2 py-0 text-[10px] font-normal"
                                >
                                  Verified
                                </Badge>
                              </div>
                              {review.created_at ? (
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {new Date(
                                    review.created_at,
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${tag.color}`}
                          >
                            {tag.label}
                          </span>
                        </div>

                        <div className="mb-3 flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/15"}`}
                            />
                          ))}
                        </div>

                        <div className="relative ml-1 border-l-2 border-primary/15 pl-4">
                          <Quote className="absolute -left-3 -top-1 h-5 w-5 rounded-full bg-card p-0.5 text-primary/15" />
                          <p className="text-xs italic leading-relaxed text-foreground/80 md:text-sm">
                            {review.comment}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
                          <button
                            onClick={() => toggleHelpful(index)}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                              helpfulVotes.has(index)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <ThumbsUp
                              className={`h-3.5 w-3.5 ${helpfulVotes.has(index) ? "fill-primary" : ""}`}
                            />
                            Helpful ({helpfulVotes.has(index) ? 1 : 0})
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}

                  <div ref={loadMoreRef} className="h-8 w-full" />

                  {isFetchingMoreReviews && (
                    <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more reviews...
                    </div>
                  )}

                  {!hasMoreReviews && reviews.length > 0 && (
                    <p className="pt-1 text-center text-xs text-muted-foreground">
                      You have reached the end of reviews.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </motion.section>
  );
};

export default CustomerReviews;
