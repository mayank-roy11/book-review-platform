import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookSchema, insertReviewSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Books routes
  app.get("/api/books", async (req, res) => {
    try {
      const { search, genre, page = "1", limit = "12" } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const result = await storage.getBooks({
        search: search as string,
        genre: genre as string,
        limit: parseInt(limit as string),
        offset,
      });
      
      res.json({
        books: result.books,
        total: result.total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(result.total / parseInt(limit as string)),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  app.get("/api/books/featured", async (req, res) => {
    try {
      const books = await storage.getFeaturedBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured books" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const bookId = parseInt(req.params.id);
      const book = await storage.getBookWithReviews(bookId);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch book" });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      const validatedData = insertBookSchema.parse(req.body);
      const book = await storage.createBook(validatedData);
      res.status(201).json(book);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid book data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create book" });
    }
  });

  // Reviews routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const { bookId, userId, limit = "10" } = req.query;
      
      let reviews;
      if (bookId) {
        reviews = await storage.getReviewsForBook(parseInt(bookId as string));
      } else if (userId) {
        reviews = await storage.getReviewsByUser(parseInt(userId as string));
      } else {
        reviews = await storage.getRecentReviews(parseInt(limit as string));
      }
      
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.put("/api/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const validatedData = insertReviewSchema.partial().parse(req.body);
      const review = await storage.updateReview(reviewId, validatedData);
      
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const success = await storage.deleteReview(reviewId);
      
      if (!success) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  app.post("/api/reviews/:id/like", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const review = await storage.likeReview(reviewId);
      
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: "Failed to like review" });
    }
  });

  // Users routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(userId, validatedData);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(validatedData.username) || 
                          await storage.getUserByEmail(validatedData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Genres route
  app.get("/api/genres", async (req, res) => {
    try {
      const genres = await storage.getGenres();
      res.json(genres);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch genres" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
