import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "./star-rating";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useApp } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import type { InsertReview } from "@shared/schema";

interface ReviewFormProps {
  bookId: number;
  onSuccess?: () => void;
}

export function ReviewForm({ bookId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const { currentUser } = useApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: (review: InsertReview) => api.createReview(review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books', bookId] });
      toast({
        title: "Review submitted!",
        description: "Your review has been added successfully.",
      });
      setRating(0);
      setContent("");
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Please rate the book",
        description: "You must provide a rating between 1 and 5 stars.",
        variant: "destructive",
      });
      return;
    }

    if (content.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write at least 10 characters for your review.",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      bookId,
      userId: currentUser.id,
      rating,
      content: content.trim(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <StarRating 
              rating={rating} 
              interactive 
              onRatingChange={setRating}
              size="lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about this book..."
              rows={4}
              className="resize-none"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={createReviewMutation.isPending}
            className="w-full bg-accent hover:bg-accent/90"
          >
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
