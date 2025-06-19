# Book Review Platform

## Overview

This is a full-stack book review platform built with React, Express, and PostgreSQL. The application allows users to browse books, read reviews, and write their own reviews. It features a modern UI built with shadcn/ui components and uses Drizzle ORM for database management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Development**: tsx for TypeScript execution in development
- **Production Build**: esbuild for server bundling

### Database Layer
- **Database**: PostgreSQL (configured for Neon/serverless)
- **ORM**: Drizzle ORM with schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Connection**: @neondatabase/serverless for database connectivity

## Key Components

### Database Schema
The application uses three main entities:
- **Users**: User profiles with authentication data
- **Books**: Book catalog with metadata and ratings
- **Reviews**: User reviews with ratings and content

### API Structure
- `/api/books` - Book catalog endpoints with search and filtering
- `/api/reviews` - Review management endpoints
- `/api/users` - User profile management
- `/api/genres` - Book genre categorization

### Frontend Pages
- **Home**: Featured books and recent reviews
- **Books**: Searchable book catalog with filtering
- **Book Detail**: Individual book pages with reviews
- **Profile**: User profile management and review history

### UI Components
- **BookCard**: Reusable book display component
- **ReviewCard**: Review display with user information
- **StarRating**: Interactive and display rating component
- **ReviewForm**: Form for creating new reviews

## Data Flow

1. **Client Requests**: React components use React Query hooks to fetch data
2. **API Layer**: Express routes handle HTTP requests and validate data
3. **Database Access**: Storage layer abstracts database operations
4. **Response**: JSON responses sent back to client
5. **State Updates**: React Query automatically updates component state

The application currently uses an in-memory storage implementation for development, designed to be easily replaced with a PostgreSQL implementation.

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Framework**: Radix UI primitives, class-variance-authority for styling
- **Database**: Drizzle ORM, Neon serverless PostgreSQL
- **Validation**: Zod for schema validation
- **Utilities**: date-fns for date formatting, clsx for conditional styling

### Development Tools
- **Build Tools**: Vite, esbuild, TypeScript
- **Replit Integration**: Custom Vite plugins for Replit environment
- **Code Quality**: TypeScript for type safety

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Development Server**: Vite dev server with HMR
- **Port Configuration**: Local port 5000, external port 80

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server to `dist/index.js`
- **Deployment**: Replit autoscale deployment target
- **Database**: Configured for DATABASE_URL environment variable

### Build Commands
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server startup
- `npm run db:push`: Push database schema changes

## Changelog

```
Changelog:
- June 19, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```