import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  interactive = false,
  onRatingChange 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className="flex">
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i + 1 <= rating;
        const halfFilled = i + 0.5 === rating;
        
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(i + 1)}
            className={cn(
              sizeClasses[size],
              "text-yellow-400",
              interactive && "hover:scale-110 transition-transform cursor-pointer",
              !interactive && "cursor-default"
            )}
          >
            <Star 
              className={cn(
                "w-full h-full",
                filled ? "fill-current" : halfFilled ? "fill-current opacity-50" : "fill-none"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
