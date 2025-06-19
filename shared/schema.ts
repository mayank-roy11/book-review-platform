import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  genre: text("genre").notNull(),
  publishDate: text("publish_date").notNull(),
  pages: integer("pages").notNull(),
  isbn: text("isbn"),
  coverUrl: text("cover_url"),
  averageRating: real("average_rating").default(0).notNull(),
  totalReviews: integer("total_reviews").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  averageRating: true,
  totalReviews: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  likes: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Extended types for API responses
export type BookWithReviews = Book & {
  reviews: (Review & { user: Pick<User, 'id' | 'name' | 'avatar'> })[];
};

export type ReviewWithUser = Review & {
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  book: Pick<Book, 'id' | 'title'>;
};
