import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@shared/schema";

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize with a default user for demo purposes
  useEffect(() => {
    setCurrentUser({
      id: 1,
      username: "john_reader",
      email: "john@example.com",
      name: "John Reader",
      bio: "Passionate about fiction and sci-fi",
      avatar: null,
      createdAt: new Date(),
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
