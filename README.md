# BookVerse - Book Review Platform

A full-stack book review platform built with React and Express, where users can browse books, read reviews, and share their thoughts about their favorite reads.

## Features

- **Browse Books**: Search and filter through a collection of books by genre, author, or title
- **Book Details**: View detailed information about books including ratings and reviews
- **Write Reviews**: Share your thoughts and rate books on a 5-star scale
- **User Profiles**: Manage your profile and view your review history
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for routing
- **TanStack Query** for state management
- **shadcn/ui** + **Tailwind CSS** for styling
- **Vite** for development and build

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **Zod** for data validation
- **Drizzle ORM** (configured for PostgreSQL)
- **In-memory storage** for development

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bookverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000` to view the application.

## Available Scripts

- `npm run dev` - Start development server (both frontend and backend)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes (when using PostgreSQL)

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities and API client
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # App entry point
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── package.json
```

## API Endpoints

### Books
- `GET /api/books` - Get all books (with pagination and filters)
- `GET /api/books/featured` - Get featured books
- `GET /api/books/:id` - Get specific book with reviews
- `POST /api/books` - Create new book

### Reviews
- `GET /api/reviews` - Get reviews (by book or user)
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/like` - Like a review

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users` - Create new user

### Genres
- `GET /api/genres` - Get all genres with book counts

## Database Setup (Optional)

The application uses in-memory storage by default. To use PostgreSQL:

1. **Set up PostgreSQL database**
2. **Add environment variable**
   ```bash
   DATABASE_URL=your_postgresql_connection_string
   ```
3. **Push schema to database**
   ```bash
   npm run db:push
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.