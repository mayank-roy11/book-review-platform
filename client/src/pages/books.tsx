import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookCard } from "@/components/book-card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Search, Filter } from "lucide-react";
import { useApp } from "@/contexts/app-context";

export default function Books() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const { searchQuery } = useApp();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  
  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const searchParam = params.get('search') || searchQuery || '';
    const genreParam = params.get('genre') || '';
    const pageParam = parseInt(params.get('page') || '1');
    
    setLocalSearch(searchParam);
    setSelectedGenre(genreParam);
    setCurrentPage(pageParam);
  }, [searchString, searchQuery]);

  const { data: booksData, isLoading } = useQuery({
    queryKey: ['/api/books', { search: localSearch, genre: selectedGenre, page: currentPage }],
    queryFn: () => api.getBooks({ 
      search: localSearch || undefined, 
      genre: selectedGenre || undefined, 
      page: currentPage 
    }),
  });

  const { data: genres } = useQuery({
    queryKey: ['/api/genres'],
    queryFn: () => api.getGenres(),
  });

  const updateURL = (search: string, genre: string, page: number = 1) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (genre) params.set('genre', genre);
    if (page > 1) params.set('page', page.toString());
    
    const queryString = params.toString();
    setLocation(`/books${queryString ? `?${queryString}` : ''}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateURL(localSearch, selectedGenre, 1);
  };

  const handleGenreChange = (genre: string) => {
    const actualGenre = genre === "all" ? "" : genre;
    setSelectedGenre(actualGenre);
    setCurrentPage(1);
    updateURL(localSearch, actualGenre, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(localSearch, selectedGenre, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setLocalSearch("");
    setSelectedGenre("");
    setCurrentPage(1);
    setLocation('/books');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-inter font-bold text-gray-900 mb-4">Browse Books</h1>
          <p className="text-xl text-gray-600">Discover your next great read from our collection</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search books, authors..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
            
            <div className="flex gap-2">
              <Select value={selectedGenre} onValueChange={handleGenreChange}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres?.map((genre) => (
                    <SelectItem key={genre.name} value={genre.name}>
                      {genre.name} ({genre.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {(localSearch || selectedGenre) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {booksData?.total ? (
                  <>
                    Showing {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, booksData.total)} of {booksData.total} books
                  </>
                ) : (
                  'No books found'
                )}
              </p>
            </div>

            {/* Books Grid */}
            {booksData?.books.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {booksData.books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {booksData && booksData.totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, booksData.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                {booksData.totalPages > 5 && currentPage < booksData.totalPages - 2 && (
                  <>
                    <span className="px-2 py-2">...</span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(booksData.totalPages)}
                    >
                      {booksData.totalPages}
                    </Button>
                  </>
                )}
                
                <Button
                  variant="outline"
                  disabled={currentPage === booksData.totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
