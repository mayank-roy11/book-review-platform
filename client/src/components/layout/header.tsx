import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, User, BookOpen, MessageSquare } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import { cn } from "@/lib/utils";

export function Header() {
  const [location] = useLocation();
  const { currentUser, searchQuery, setSearchQuery } = useApp();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
    if (location !== "/books") {
      window.location.href = `/books?search=${encodeURIComponent(localSearchQuery)}`;
    }
  };

  const navItems = [
    { href: "/books", label: "Browse", icon: BookOpen },
    { href: "/reviews", label: "Reviews", icon: MessageSquare },
    { href: "/profile", label: "My Profile", icon: User },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-inter font-bold text-primary">BookVerse</h1>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Search books, authors, reviews..."
              />
            </form>
          </div>

          {/* Navigation & User Menu */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1 text-gray-700 hover:text-primary font-medium transition-colors",
                    location === item.href && "text-primary"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block font-medium">{currentUser.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
