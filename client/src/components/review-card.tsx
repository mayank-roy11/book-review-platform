import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "./star-rating";
import { ThumbsUp, Reply } from "lucide-react";
import type { ReviewWithUser } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: ReviewWithUser;
  showBookTitle?: boolean;
}

export function ReviewCard({ review, showBookTitle = false }: ReviewCardProps) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => api.likeReview(review.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books', review.bookId] });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMutation.mutate();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {review.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                {showBookTitle && (
                  <p className="text-sm text-gray-600">reviewed "{review.book.title}"</p>
                )}
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>
            
            <p className="text-gray-700 mb-3 leading-relaxed">{review.content}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  className="hover:text-primary transition-colors"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {review.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-primary transition-colors"
                >
                  <Reply className="w-4 h-4 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
