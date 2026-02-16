import { Link, useLocation } from "react-router";
import { Heart, User, Search, Menu, X, Moon, Sun, LogIn, Shield } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/context/wishlistContext";
import { useTheme } from "@/context/themeContext";
import { useAuth } from "@/context/authContext";
import { Badge } from "@/components/ui/badge";
import CartDrawer from "../cart/cartDrawer";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items: wishlistItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    ...(isAuthenticated ? [
      { to: "/orders", label: "Orders" },
      { to: "/wishlist", label: "Wishlist" },
    ] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
          LUMIÈRE
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-5 w-5" />
          </Link>
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          {isAuthenticated && (
            <Link to="/wishlist" className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                  {wishlistItems.length}
                </Badge>
              )}
            </Link>
          )}
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors" title="Admin Panel">
                  <Shield className="h-5 w-5" />
                </Link>
              )}
              <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Link>
            </>
          ) : (
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              <LogIn className="h-5 w-5" />
            </Link>
          )}
          <CartDrawer />
          <button
            className="md:hidden text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t bg-background px-4 py-4 space-y-3 animate-fade-in">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-primary">
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
