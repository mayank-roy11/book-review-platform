<img width="1500" height="1500" alt="Screenshot 2025-08-15 023240" src="https://github.com/user-attachments/assets/1391e1be-5c89-45f0-beab-bf7d878e18ca" />
<img width="1500" height="1500" alt="Screenshot 2025-08-15 023139" src="https://github.com/user-attachments/assets/6cf40170-2b58-4da1-91f4-0d01fa2fbb9f" />
<img width="1500" height="1500" alt="Screenshot 2025-08-15 023139" src="https://github.com/user-attachments/assets/6cf40170-2b58-4da1-91f4-0d01fa2fbb9f" />
<img width="1500" height="1500" alt="Screenshot 2025-08-15 023443" src="https://github.com/user-attachments/assets/74947437-2af1-4ed5-b7ce-6f6f1cabbbce" />
<img width="1500" height="1500" alt="Screenshot 2025-08-15 023103" src="https://github.com/user-attachments/assets/5cb63504-8109-4c51-a8fd-50df98772cd7" />


# 📚 BookVerse – Full-Stack Book Review Platform

BookVerse is a dynamic full-stack web application that allows users to discover, review, and rate their favorite books. Built using modern technologies like React, Express, TypeScript, and PostgreSQL (via Drizzle ORM), it emphasizes clean code architecture, intuitive UI/UX, and scalable database design.

---

## 🚀 Features

* 🔍 **Browse Books** – Search and filter by genre, title, or author
* 📖 **Book Details** – See book descriptions, average ratings, and user reviews
* ✍️ **Review Books** – Write, edit, and delete reviews with 5-star ratings
* 👤 **User Profiles** – Manage user data and view review history
* 📱 **Responsive UI** – Works across desktop and mobile seamlessly

---

## 🛠️ Tech Stack

### 🔷 Frontend

* React 18 + TypeScript
* Wouter (Minimal client-side routing)
* TanStack Query (Data fetching & caching)
* Tailwind CSS + shadcn/ui (UI design system)
* Vite (Fast development server)

### 🔶 Backend

* Node.js + Express (REST API)
* TypeScript for type safety
* Drizzle ORM (PostgreSQL schema + migrations)
* Zod for validation
* Memory storage (default) or PostgreSQL (production)

---

## 🧑‍💻 Getting Started

### 📦 Prerequisites

* Node.js v18+
* npm or yarn

### 📁 Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/your-username/bookverse.git
cd bookverse

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open `http://localhost:5000` in your browser 🚀

---

## 🔄 Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Starts full-stack dev server         |
| `npm run build`   | Builds production frontend           |
| `npm start`       | Starts backend in production mode    |
| `npm run db:push` | Push schema to PostgreSQL (optional) |

---

## 🌐 API Endpoints

### 📚 Books

* `GET /api/books` – List all books with filters
* `GET /api/books/featured` – Featured books
* `GET /api/books/:id` – Book details + reviews
* `POST /api/books` – Add new book

### ✍️ Reviews

* `GET /api/reviews` – Reviews by user or book
* `POST /api/reviews` – Submit review
* `PUT /api/reviews/:id` – Edit review
* `DELETE /api/reviews/:id` – Delete review
* `POST /api/reviews/:id/like` – Like a review

### 👤 Users

* `GET /api/users/:id` – Get user profile
* `PUT /api/users/:id` – Update profile
* `POST /api/users` – Create new user

### 🎭 Genres

* `GET /api/genres` – All genres with book count

---

## 🗄️ Optional: PostgreSQL Setup

To switch from in-memory storage to PostgreSQL:

1. Provision a database (locally or on Neon/Render)
2. Add a `.env` file with:

   ```env
   DATABASE_URL=your_postgres_connection_string
   ```
3. Push the schema:

   ```bash
   npm run db:push
   ```
4. Seed data (optional):

   ```bash
   npx tsx scripts/seed.ts
   ```

---

## 📜 Deployment (Optional)

Deploy with [Vercel](https://vercel.com/) or [Render](https://render.com/):

* Frontend: Deploy the `client/` directory via Vercel
* Backend: Deploy Express server with environment variables on Render
* Live demo: Add your link here when deployed

---

## 📄 Documentation

* Code is modular and organized into `client/`, `server/`, `shared/`, and `scripts/`
* Fully typed using TypeScript
* REST API follows standard resource-based conventions
* See `/shared/schema.ts` and `server/routes/` for schema + route logic

---

## 🤝 Contributing

```bash
# Fork and clone
git clone https://github.com/your-username/bookverse.git

# Create a branch
git checkout -b feature/my-feature

# Make changes & commit
git commit -m "Add: my feature"

# Push & create PR
git push origin feature/my-feature
```

---

## ⚖️ License

This project is licensed under the [MIT License](./LICENSE).

---

Let me know if you'd like me to create this as a Markdown file (`README.md`) for you or generate a deployable version for Vercel/Render.
