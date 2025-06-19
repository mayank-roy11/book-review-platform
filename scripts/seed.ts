import { db } from "../server/db";
import { users, books, reviews } from "@shared/schema";
import { sql } from "drizzle-orm"; 

async function seed() {
  console.log("🌱 Seeding database...");

  
  await db.execute(sql`TRUNCATE TABLE reviews, books, users RESTART IDENTITY CASCADE`);

  // Insert sample users
  await db.insert(users).values([
    {
      id: 1,
      username: "Mayank_Roy",
      email: "Roy@example.com",
      name: "Mayank Roy",
      bio: "Passionate about fiction and sci-fi",
      avatar: null,
      createdAt: new Date(),
    },
    {
      id: 2,
      username: "Anushka_tripathi",
      email: "anu@example.com",
      name: "Anushka Tripathi",
      bio: "Love contemporary literature",
      avatar: null,
      createdAt: new Date(),
    },
    {
      id: 3,
      username: "Ravi_Verma",
      email: "ravi@example.com",
      name: "Ravi Verma",
      bio: "Fantasy fan and aspiring writer",
      avatar: null,
      createdAt: new Date(),
    },
  ]);

  // Insert sample books
  await db.insert(books).values([
    {
      id: 1,
      title: "The Martian",
      author: "Andy Weir",
      description: "A sci-fi survival story on Mars.",
      genre: "Science Fiction",
      publishDate: "2011",
      pages: 369,
      isbn: "9780553418026",
      coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      averageRating: 4.6,
      totalReviews: 1,
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      description: "A beautifully written fantasy about a gifted young man.",
      genre: "Fantasy",
      publishDate: "2007",
      pages: 662,
      isbn: "9780756404079",
      coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
      averageRating: 4.7,
      totalReviews: 1,
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      description: "A guide to building good habits and breaking bad ones.",
      genre: "Self Help",
      publishDate: "2018",
      pages: 320,
      isbn: "9780735211292",
      coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
      averageRating: 4.8,
      totalReviews: 1,
      createdAt: new Date(),
    }
  ]);

  // Insert sample reviews
  await db.insert(reviews).values([
    {
      id: 1,
      bookId: 1,
      userId: 1,
      rating: 5,
      content: "Amazing sci-fi book!",
      likes: 10,
      createdAt: new Date(),
    },
    {
      id: 2,
      bookId: 1,
      userId: 2,
      rating: 4,
      content: "Great read, though some of the science parts dragged for me.",
      likes: 6,
      createdAt: new Date(),
    },
    {
      id: 3,
      bookId: 2,
      userId: 3,
      rating: 5,
      content: "Incredible storytelling and world-building. Kvothe is unforgettable.",
      likes: 8,
      createdAt: new Date(),
    },
    {
      id: 4,
      bookId: 3,
      userId: 2,
      rating: 5,
      content: "This book changed the way I approach goals. Super practical and insightful.",
      likes: 9,
      createdAt: new Date(),
    }
  ]);

  console.log("Seeding complete.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
