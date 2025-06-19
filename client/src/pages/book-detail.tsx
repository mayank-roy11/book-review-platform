import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { ReviewCard } from "@/components/review-card";
import { ReviewForm } from "@/components/review-form";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { ArrowLeft, Book, Calendar, FileText } from "lucide-react";
import { useState } from "react";

export default function BookDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const bookId = parseInt(params.id as string);

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['/api/books', bookId],
    queryFn: () => api.getBook(bookId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="aspect-[3/4] w-full mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h1>
            <p className="text-gray-600 mb-4">
              The book you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => setLocation('/books')}>
              Browse Books
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/books')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Books
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover and Info */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-[3/4] overflow-hidden rounded-lg mb-6">
                  <img 
                    src={book.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533"} 
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Author</p>
                    <p className="font-semibold">{book.author}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Genre</p>
                    <Badge variant="secondary">{book.genre}</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-600">Published</p>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="font-semibold">{book.publishDate}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Pages</p>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="font-semibold">{book.pages}</span>
                      </div>
                    </div>
                  </div>
                  
                  {book.isbn && (
                    <div>
                      <p className="text-sm text-gray-600">ISBN</p>
                      <p className="font-mono text-sm">{book.isbn}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Book Details and Reviews */}
          <div className="md:col-span-2 space-y-6">
            {/* Book Header */}
            <Card>
              <CardContent className="pt-6">
                <h1 className="text-3xl md:text-4xl font-inter font-bold text-gray-900 mb-4">
                  {book.title}
                </h1>
                
                {/* Rating Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <StarRating rating={book.averageRating} size="lg" />
                        <span className="text-2xl font-bold text-gray-900">
                          {book.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Based on {book.totalReviews.toLocaleString()} reviews
                      </p>
                    </div>
                    <Button 
                      className="bg-accent hover:bg-accent/90"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      {showReviewForm ? "Cancel" : "Write Review"}
                    </Button>
                  </div>
                </div>
                
                {/* Book Description */}
                <div>
                  <h2 className="font-semibold text-lg mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Review Form */}
            {showReviewForm && (
              <ReviewForm 
                bookId={book.id} 
                onSuccess={() => setShowReviewForm(false)} 
              />
            )}
            
            {/* Reviews */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="font-semibold text-lg mb-4">
                  Reviews ({book.reviews.length})
                </h2>
                
                {book.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {book.reviews.map((review) => (
                      <div key={review.id}>
                        <ReviewCard review={review} />
                        {review !== book.reviews[book.reviews.length - 1] && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No reviews yet.</p>
                    <Button 
                      variant="outline"
                      onClick={() => setShowReviewForm(true)}
                    >
                      Be the first to review!
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
