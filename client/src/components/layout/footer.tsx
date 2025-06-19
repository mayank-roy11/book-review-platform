import { Link } from "wouter";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-inter font-bold mb-4">BookVerse</h3>
            <p className="text-gray-300 mb-4">
              Your digital library for discovering, reviewing, and sharing great books with a community of passionate readers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Discover</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/books" className="hover:text-white transition-colors">Browse Books</Link></li>
              <li><Link href="/books?genre=Fiction" className="hover:text-white transition-colors">Top Rated</Link></li>
              <li><Link href="/books" className="hover:text-white transition-colors">New Releases</Link></li>
              <li><Link href="/books" className="hover:text-white transition-colors">Bestsellers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Discussions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reading Lists</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Book Clubs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {currentYear} BookVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
