import { Link, useLocation } from "react-router";
import {
  Heart,
  User,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  LogIn,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/context/wishlistContext";
import { useTheme } from "@/context/themeContext";
import { useAuth } from "@/context/authContext";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartDrawer from "../cart/cartDrawer";
import SearchModal from "./searchModal";

const Navbar = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { items: wishlistItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    ...(isAuthenticated
      ? [
          { to: "/orders", label: "Orders" },
          { to: "/wishlist", label: "Wishlist" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-3 sm:h-16 sm:px-4 lg:px-13">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground sm:text-2xl"
        >
          <img
            src="/logo.png"
            alt="ShopBazzar"
            className="h-8 w-auto object-contain sm:h-10 md:h-12"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === l.to
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
          {isAuthenticated && (
            <Link
              to="/wishlist"
              className="relative hidden md:block text-muted-foreground hover:text-foreground transition-colors"
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
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
                <Link
                  to="/admin"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Admin Panel"
                >
                  <Shield className="h-5 w-5" />
                </Link>
              )}
              <Link
                to="/profile"
                className="hidden md:block text-muted-foreground hover:text-foreground transition-colors"
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt=""
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="hidden md:block text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          )}
          <CartDrawer />

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Open navigation menu"
              >
                {mobileNavOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[88vw] max-w-sm border-l border-border/60 bg-background/95 px-5 py-6 backdrop-blur-xl"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="font-display text-2xl">Menu</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  Navigate the store and account shortcuts.
                </p>
              </SheetHeader>

              <div className="mt-6 space-y-2">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border/60 bg-card/60 text-foreground hover:border-border hover:bg-accent"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}

                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-medium text-primary transition-colors hover:border-border hover:bg-accent"
                  >
                    <span>Sign In</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-medium transition-colors hover:border-border hover:bg-accent"
                    >
                      <span>Wishlist</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-medium transition-colors hover:border-border hover:bg-accent"
                    >
                      <span>Profile</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileNavOpen(false)}
                        className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-medium transition-colors hover:border-border hover:bg-accent"
                      >
                        <span>Admin Panel</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Navbar;
