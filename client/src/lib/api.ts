import { apiRequest } from "./queryClient";
import type { Book, Review, User, InsertReview, BookWithReviews, ReviewWithUser } from "@shared/schema";

export const api = {
  // Books
  getBooks: (params?: { search?: string; genre?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.genre) searchParams.append('genre', params.genre);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return fetch(`/api/books?${searchParams}`).then(res => res.json()) as Promise<{
      books: Book[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>;
  },

  getFeaturedBooks: () => 
    fetch('/api/books/featured').then(res => res.json()) as Promise<Book[]>,

  getBook: (id: number) => 
    fetch(`/api/books/${id}`).then(res => res.json()) as Promise<BookWithReviews>,

  // Reviews
  getReviews: (params?: { bookId?: number; userId?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.bookId) searchParams.append('bookId', params.bookId.toString());
    if (params?.userId) searchParams.append('userId', params.userId.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return fetch(`/api/reviews?${searchParams}`).then(res => res.json()) as Promise<ReviewWithUser[]>;
  },

  createReview: (review: InsertReview) =>
    apiRequest('POST', '/api/reviews', review).then(res => res.json()) as Promise<Review>,

  updateReview: (id: number, review: Partial<InsertReview>) =>
    apiRequest('PUT', `/api/reviews/${id}`, review).then(res => res.json()) as Promise<Review>,

  deleteReview: (id: number) =>
    apiRequest('DELETE', `/api/reviews/${id}`).then(res => res.json()),

  likeReview: (id: number) =>
    apiRequest('POST', `/api/reviews/${id}/like`).then(res => res.json()) as Promise<Review>,

  // Users
  getUser: (id: number) =>
    fetch(`/api/users/${id}`).then(res => res.json()) as Promise<User>,

  updateUser: (id: number, user: Partial<User>) =>
    apiRequest('PUT', `/api/users/${id}`, user).then(res => res.json()) as Promise<User>,

  // Genres
  getGenres: () =>
    fetch('/api/genres').then(res => res.json()) as Promise<{ name: string; count: number }[]>,
};
