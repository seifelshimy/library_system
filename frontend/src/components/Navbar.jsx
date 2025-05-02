import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-library-burgundy text-white py-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-y-2">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            BookWell Library
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="relative w-full max-w-md my-2 md:my-0"
        >
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-white" />
          <Input
            placeholder="Search books..."
            className="pl-8 bg-white/20 border border-white/30 text-white placeholder-white/60 focus-visible:ring-white/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Dashboard
            </Button>
          </Link>
          <Link to="/books">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Books
            </Button>
          </Link>
          <Link to="/add-book">
            <Button variant="secondary" className="bg-white text-library-burgundy hover:bg-library-beige">
              Add Book
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
