"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/toast";

type Review = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
};

export default function ReviewsSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetch(`/api/reviews?productId=${productId}`).then((r) => r.json()),
  });

  const addReviewMutation = useMutation({
    mutationFn: (data: { productId: string; userId: string; userName: string; rating: number; title: string; comment: string }) =>
      fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      setShowForm(false);
      setRating(5);
      setTitle("");
      setComment("");
      addToast({ title: "Review added", variant: "success" });
    },
    onError: () => {
      addToast({ title: "Failed to add review", variant: "error" });
    },
  });

  const averageRating = reviews.length > 0 ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    addReviewMutation.mutate({
      productId,
      userId: (session.user as any).id || session.user.email || "",
      userName: session.user.name || session.user.email || "",
      rating,
      title,
      comment,
    });
  };

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>
        {session && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm underline hover:no-underline"
          >
            {showForm ? "Cancel" : "Write a review"}
          </button>
        )}
      </div>

      {averageRating > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${star <= averageRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-foreground/70">{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
        </div>
      )}

      {showForm && session && (
        <form onSubmit={handleSubmit} className="mt-6 p-4 border border-black/10 dark:border-white/20 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`w-6 h-6 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              >
                <svg viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Review title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent mb-3"
            required
          />
          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent mb-3 h-24 resize-none"
            required
          />
          <button
            type="submit"
            disabled={addReviewMutation.isPending}
            className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black disabled:opacity-60"
          >
            {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="mt-6 text-foreground/70">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="mt-6 text-foreground/70">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((review: Review) => (
            <div key={review.id} className="p-4 border border-black/10 dark:border-white/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-medium">{review.title}</span>
                </div>
                <span className="text-sm text-foreground/70">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-foreground/70 mb-2">by {review.userName}</p>
              <p className="text-foreground/80">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
