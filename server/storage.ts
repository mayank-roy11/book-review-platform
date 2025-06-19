import { users, books, reviews, type User, type Book, type Review, type InsertUser, type InsertBook, type InsertReview, type BookWithReviews, type ReviewWithUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, and, count, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Books
  getBook(id: number): Promise<Book | undefined>;
  getBookWithReviews(id: number): Promise<BookWithReviews | undefined>;
  getBooks(params?: { search?: string; genre?: string; limit?: number; offset?: number }): Promise<{ books: Book[]; total: number }>;
  getFeaturedBooks(): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBookRating(bookId: number): Promise<void>;

  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  getReviewsForBook(bookId: number): Promise<ReviewWithUser[]>;
  getReviewsByUser(userId: number): Promise<ReviewWithUser[]>;
  getRecentReviews(limit?: number): Promise<ReviewWithUser[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
  likeReview(id: number): Promise<Review | undefined>;

  // Categories/Genres
  getGenres(): Promise<{ name: string; count: number }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private reviews: Map<number, Review>;
  private currentUserId: number;
  private currentBookId: number;
  private currentReviewId: number;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.reviews = new Map();
    this.currentUserId = 1;
    this.currentBookId = 1;
    this.currentReviewId = 1;
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const sampleUsers: User[] = [
      {
        id: this.currentUserId++,
        username: "john_reader",
        email: "john@example.com",
        name: "John Reader",
        bio: "Passionate about fiction and sci-fi",
        avatar: null,
        createdAt: new Date(),
      },
      {
        id: this.currentUserId++,
        username: "sarah_chen",
        email: "sarah@example.com",
        name: "Sarah Chen",
        bio: "Love contemporary literature",
        avatar: null,
        createdAt: new Date(),
      },
      {
        id: this.currentUserId++,
        username: "michael_rodriguez",
        email: "michael@example.com",
        name: "Michael Rodriguez",
        bio: "Science fiction enthusiast",
        avatar: null,
        createdAt: new Date(),
      },
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user));

    // Create sample books
    const sampleBooks: Book[] = [
      {
        id: this.currentBookId++,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
        genre: "Fiction",
        publishDate: "1960",
        pages: 376,
        isbn: "9780061120084",
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533",
        averageRating: 4.8,
        totalReviews: 2341,
        createdAt: new Date(),
      },
      {
        id: this.currentBookId++,
        title: "The Martian",
        author: "Andy Weir",
        description: "Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. Now, he's sure he'll be the first person to die there.",
        genre: "Science Fiction",
        publishDate: "2011",
        pages: 369,
        isbn: "9780553418026",
        coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533",
        averageRating: 4.6,
        totalReviews: 1892,
        createdAt: new Date(),
      },
      {
        id: this.currentBookId++,
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        description: "The riveting first-person narrative of a young man who grows to be the most notorious magician his world has ever seen.",
        genre: "Fantasy",
        publishDate: "2007",
        pages: 662,
        isbn: "9780756404079",
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533",
        averageRating: 4.7,
        totalReviews: 3156,
        createdAt: new Date(),
      },
      {
        id: this.currentBookId++,
        title: "Where the Crawdads Sing",
        author: "Delia Owens",
        description: "A coming-of-age story that will break your heart and put it back together again.",
        genre: "Contemporary Fiction",
        publishDate: "2018",
        pages: 384,
        isbn: "9780735219090",
        coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533",
        averageRating: 4.5,
        totalReviews: 4203,
        createdAt: new Date(),
      },
      {
        id: this.currentBookId++,
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        description: "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.",
        genre: "Historical Fiction",
        publishDate: "2017",
        pages: 400,
        isbn: "9781501161933",
        coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533",
        averageRating: 4.9,
        totalReviews: 5678,
        createdAt: new Date(),
      },
      {
        id: this.currentBookId++,
        title: "Project Hail Mary",
        author: "Andy Weir",
        description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
        genre: "Science Fiction",
        publishDate: "2021",
        pages: 496,
        isbn: "9780593135204",
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533",
        averageRating: 4.8,
        totalReviews: 2987,
        createdAt: new Date(),
      },
    ];

    sampleBooks.forEach(book => this.books.set(book.id, book));

    // Create sample reviews
    const sampleReviews: Review[] = [
      {
        id: this.currentReviewId++,
        bookId: 5, // The Seven Husbands of Evelyn Hugo
        userId: 2, // Sarah Chen
        rating: 5,
        content: "This book absolutely captivated me from start to finish. Taylor Jenkins Reid has crafted a masterpiece that explores love, ambition, and the price of fame. Evelyn Hugo is a complex and fascinating character.",
        likes: 24,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: this.currentReviewId++,
        bookId: 6, // Project Hail Mary
        userId: 3, // Michael Rodriguez
        rating: 4,
        content: "Andy Weir does it again! This sci-fi thriller had me on the edge of my seat. The scientific accuracy combined with humor makes it incredibly engaging. A must-read for science fiction fans.",
        likes: 18,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        id: this.currentReviewId++,
        bookId: 1, // To Kill a Mockingbird
        userId: 1, // John Reader
        rating: 5,
        content: "A timeless classic that remains as relevant today as when it was first published. Harper Lee's storytelling is masterful, and the themes of justice and morality are powerfully presented.",
        likes: 42,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
    ];

    sampleReviews.forEach(review => this.reviews.set(review.id, review));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Book methods
  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async getBookWithReviews(id: number): Promise<BookWithReviews | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;

    const bookReviews = Array.from(this.reviews.values())
      .filter(review => review.bookId === id)
      .map(review => {
        const user = this.users.get(review.userId);
        return {
          ...review,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : { id: 0, name: 'Unknown User', avatar: null }
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      ...book,
      reviews: bookReviews,
    };
  }

  async getBooks(params: { search?: string; genre?: string; limit?: number; offset?: number } = {}): Promise<{ books: Book[]; total: number }> {
    let filteredBooks = Array.from(this.books.values());

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.description.toLowerCase().includes(searchLower)
      );
    }

    if (params.genre) {
      filteredBooks = filteredBooks.filter(book =>
        book.genre.toLowerCase() === params.genre!.toLowerCase()
      );
    }

    const total = filteredBooks.length;
    const offset = params.offset || 0;
    const limit = params.limit || 12;

    filteredBooks = filteredBooks
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(offset, offset + limit);

    return { books: filteredBooks, total };
  }

  async getFeaturedBooks(): Promise<Book[]> {
    return Array.from(this.books.values())
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 4);
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.currentBookId++;
    const book: Book = {
      ...insertBook,
      id,
      averageRating: 0,
      totalReviews: 0,
      createdAt: new Date(),
    };
    this.books.set(id, book);
    return book;
  }

  async updateBookRating(bookId: number): Promise<void> {
    const book = this.books.get(bookId);
    if (!book) return;

    const bookReviews = Array.from(this.reviews.values()).filter(review => review.bookId === bookId);
    const totalReviews = bookReviews.length;
    const averageRating = totalReviews > 0 
      ? bookReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const updatedBook = {
      ...book,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
    };

    this.books.set(bookId, updatedBook);
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsForBook(bookId: number): Promise<ReviewWithUser[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.bookId === bookId)
      .map(review => {
        const user = this.users.get(review.userId);
        const book = this.books.get(review.bookId);
        return {
          ...review,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : { id: 0, name: 'Unknown User', avatar: null },
          book: book ? { id: book.id, title: book.title } : { id: 0, title: 'Unknown Book' }
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getReviewsByUser(userId: number): Promise<ReviewWithUser[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.userId === userId)
      .map(review => {
        const user = this.users.get(review.userId);
        const book = this.books.get(review.bookId);
        return {
          ...review,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : { id: 0, name: 'Unknown User', avatar: null },
          book: book ? { id: book.id, title: book.title } : { id: 0, title: 'Unknown Book' }
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecentReviews(limit: number = 6): Promise<ReviewWithUser[]> {
    return Array.from(this.reviews.values())
      .map(review => {
        const user = this.users.get(review.userId);
        const book = this.books.get(review.bookId);
        return {
          ...review,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : { id: 0, name: 'Unknown User', avatar: null },
          book: book ? { id: book.id, title: book.title } : { id: 0, title: 'Unknown Book' }
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = {
      ...insertReview,
      id,
      likes: 0,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    
    // Update book rating
    await this.updateBookRating(insertReview.bookId);
    
    return review;
  }

  async updateReview(id: number, reviewUpdate: Partial<InsertReview>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;

    const updatedReview = { ...review, ...reviewUpdate };
    this.reviews.set(id, updatedReview);
    
    // Update book rating
    await this.updateBookRating(review.bookId);
    
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    const review = this.reviews.get(id);
    if (!review) return false;

    this.reviews.delete(id);
    
    // Update book rating
    await this.updateBookRating(review.bookId);
    
    return true;
  }

  async likeReview(id: number): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;

    const updatedReview = { ...review, likes: review.likes + 1 };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async getGenres(): Promise<{ name: string; count: number }[]> {
    const genreCounts: Record<string, number> = {};
    
    Array.from(this.books.values()).forEach(book => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });

    return Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        bio: insertUser.bio || null,
        avatar: insertUser.avatar || null,
      })
      .returning();
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...userUpdate,
        bio: userUpdate.bio || null,
        avatar: userUpdate.avatar || null,
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getBook(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book || undefined;
  }

  async getBookWithReviews(id: number): Promise<BookWithReviews | undefined> {
    const book = await this.getBook(id);
    if (!book) return undefined;

    const bookReviews = await db
      .select({
        id: reviews.id,
        bookId: reviews.bookId,
        userId: reviews.userId,
        rating: reviews.rating,
        content: reviews.content,
        likes: reviews.likes,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.bookId, id))
      .orderBy(desc(reviews.createdAt));

    return {
      ...book,
      reviews: bookReviews,
    };
  }

  async getBooks(params: { search?: string; genre?: string; limit?: number; offset?: number } = {}): Promise<{ books: Book[]; total: number }> {
    let query = db.select().from(books);
    let countQuery = db.select({ count: count() }).from(books);

    const conditions = [];
    if (params.search) {
      const searchCondition = ilike(books.title, `%${params.search}%`);
      conditions.push(searchCondition);
    }
    if (params.genre) {
      conditions.push(eq(books.genre, params.genre));
    }

    if (conditions.length > 0) {
      const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereCondition);
      countQuery = countQuery.where(whereCondition);
    }

    const [{ count: total }] = await countQuery;
    const booksResult = await query
      .orderBy(desc(books.averageRating))
      .limit(params.limit || 12)
      .offset(params.offset || 0);

    return { books: booksResult, total };
  }

  async getFeaturedBooks(): Promise<Book[]> {
    return await db
      .select()
      .from(books)
      .orderBy(desc(books.averageRating))
      .limit(4);
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const [book] = await db
      .insert(books)
      .values({
        ...insertBook,
        isbn: insertBook.isbn || null,
        coverUrl: insertBook.coverUrl || null,
      })
      .returning();
    return book;
  }

  async updateBookRating(bookId: number): Promise<void> {
    const result = await db
      .select({
        avgRating: sql<number>`AVG(${reviews.rating})`,
        totalReviews: count(reviews.id),
      })
      .from(reviews)
      .where(eq(reviews.bookId, bookId));

    const { avgRating, totalReviews } = result[0] || { avgRating: 0, totalReviews: 0 };

    await db
      .update(books)
      .set({
        averageRating: avgRating ? Math.round(avgRating * 10) / 10 : 0,
        totalReviews: totalReviews || 0,
      })
      .where(eq(books.id, bookId));
  }

  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }

  async getReviewsForBook(bookId: number): Promise<ReviewWithUser[]> {
    return await db
      .select({
        id: reviews.id,
        bookId: reviews.bookId,
        userId: reviews.userId,
        rating: reviews.rating,
        content: reviews.content,
        likes: reviews.likes,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
        book: {
          id: books.id,
          title: books.title,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(books, eq(reviews.bookId, books.id))
      .where(eq(reviews.bookId, bookId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByUser(userId: number): Promise<ReviewWithUser[]> {
    return await db
      .select({
        id: reviews.id,
        bookId: reviews.bookId,
        userId: reviews.userId,
        rating: reviews.rating,
        content: reviews.content,
        likes: reviews.likes,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
        book: {
          id: books.id,
          title: books.title,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(books, eq(reviews.bookId, books.id))
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async getRecentReviews(limit: number = 6): Promise<ReviewWithUser[]> {
    return await db
      .select({
        id: reviews.id,
        bookId: reviews.bookId,
        userId: reviews.userId,
        rating: reviews.rating,
        content: reviews.content,
        likes: reviews.likes,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
        book: {
          id: books.id,
          title: books.title,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(books, eq(reviews.bookId, books.id))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    
    await this.updateBookRating(insertReview.bookId);
    return review;
  }

  async updateReview(id: number, reviewUpdate: Partial<InsertReview>): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set(reviewUpdate)
      .where(eq(reviews.id, id))
      .returning();
    
    if (review) {
      await this.updateBookRating(review.bookId);
    }
    
    return review || undefined;
  }

  async deleteReview(id: number): Promise<boolean> {
    const review = await this.getReview(id);
    if (!review) return false;

    await db.delete(reviews).where(eq(reviews.id, id));
    await this.updateBookRating(review.bookId);
    return true;
  }

  async likeReview(id: number): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set({ likes: sql`${reviews.likes} + 1` })
      .where(eq(reviews.id, id))
      .returning();
    
    return review || undefined;
  }

  async getGenres(): Promise<{ name: string; count: number }[]> {
    const result = await db
      .select({
        name: books.genre,
        count: count(books.id),
      })
      .from(books)
      .groupBy(books.genre)
      .orderBy(desc(count(books.id)));

    return result;
  }
}

export const storage = new DatabaseStorage();
