import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookCard } from "@/components/book-card";
import { ReviewCard } from "@/components/review-card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLocation } from "wouter";
import { 
  Book, 
  Search, 
  Heart, 
  Rocket, 
  UserCircle, 
  Lightbulb 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: featuredBooks, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/books/featured'],
    queryFn: () => api.getFeaturedBooks(),
  });

  const { data: recentReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: () => api.getReviews({ limit: 4 }),
  });

  const { data: genres } = useQuery({
    queryKey: ['/api/genres'],
    queryFn: () => api.getGenres(),
  });

  const categoryIcons = {
    'Fiction': Book,
    'Mystery': Search,
    'Romance': Heart,
    'Science Fiction': Rocket,
    'Biography': UserCircle,
    'Self-Help': Lightbulb,
  };

  const handleCategoryClick = (genre: string) => {
    setLocation(`/books?genre=${encodeURIComponent(genre)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-inter font-bold mb-6">
              Discover Your Next <br />Great Read
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Join thousands of readers sharing reviews, discovering books, and building their digital libraries
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg font-semibold"
                onClick={() => setLocation('/books')}
              >
                Explore Books
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg font-semibold"
              >
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-gray-900 mb-4">Featured Books</h2>
            <p className="text-xl text-gray-600">Handpicked recommendations from our community</p>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredBooks?.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Book Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-inter font-bold text-center text-gray-900 mb-12">Browse by Genre</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {genres?.slice(0, 6).map((genre) => {
              const IconComponent = categoryIcons[genre.name as keyof typeof categoryIcons] || Book;
              
              return (
                <Card 
                  key={genre.name}
                  className="text-center group cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:bg-primary hover:text-white"
                  onClick={() => handleCategoryClick(genre.name)}
                >
                  <CardContent className="p-6">
                    <IconComponent className="w-8 h-8 mx-auto mb-4 text-primary group-hover:text-white" />
                    <h3 className="font-semibold mb-1">{genre.name}</h3>
                    <p className="text-sm text-gray-500 group-hover:text-orange-100">
                      {genre.count.toLocaleString()} books
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-gray-900 mb-4">Latest Reviews</h2>
            <p className="text-xl text-gray-600">See what our community is reading and discussing</p>
          </div>

          {reviewsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex space-x-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {recentReviews?.slice(0, 4).map((review) => (
                <ReviewCard key={review.id} review={review} showBookTitle />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold"
              onClick={() => setLocation('/reviews')}
            >
              View All Reviews
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
