import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "./star-rating";
import type { Book } from "@shared/schema";
import { useLocation } from "wouter";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setLocation(`/books/${book.id}`);
    }
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
          <img 
            src={book.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533"} 
            alt={`${book.title} cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <h3 className="font-inter font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 mb-3">{book.author}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StarRating rating={book.averageRating} size="sm" />
              <span className="text-sm text-gray-600">{book.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500">
              {book.totalReviews.toLocaleString()} reviews
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
