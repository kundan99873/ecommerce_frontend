import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/useToast";
import { useAddReviewToProduct } from "@/services/product/product.query";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";

export default function AddReviewToOrderProduct({
  product,
  reviewingProduct,
  setReviewingProduct,
}: {
  product: any;
  reviewingProduct: string | null;
  setReviewingProduct: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const addReview = useAddReviewToProduct();

  const handleSubmitReview = async () => {
    const response = await addReview.mutateAsync({
      slug: product.slug,
      rating,
      comment,
    });

    if (response.success) {
      setReviewingProduct(null);
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    } else {
      toast({
        title: "Error submitting review",
        description:
          response.message || "Something went wrong. Please try again.",
      });
    }
  };
  return (
    <div>
      {reviewingProduct === product.slug && (
        <div className="mt-4 pt-4 border-t space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)}>
                  <Star
                    className={`h-5 w-5 ${s <= rating ? "fill-primary text-primary" : "text-border"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Comment</p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubmitReview}
              disabled={addReview.isPending}
            >
              {addReview.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : null}
              Submit Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewingProduct(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
