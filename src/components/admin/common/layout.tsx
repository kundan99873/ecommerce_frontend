import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  BarChart3,
  ArrowLeft,
  LogOut,
  Ticket,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { Moon, Sun } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: Tags, label: "Categories" },
  { to: "/admin/hero-sliders", icon: Tags, label: "Hero Sliders" },
  { to: "/admin/coupon", icon: Ticket, label: "Coupons" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

const AdminLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh md:h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card h-full">
        <div className="p-6 border-b">
          <Link
            to="/admin"
            className="font-display text-2xl font-bold tracking-tight text-foreground"
          >
            <img
              src="/logo.png"
              alt="ShopBazzar"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 max-h-screen">
          {navItems.map((item) => {
            const active =
              location.pathname === item.to ||
              (item.to !== "/admin" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex min-h-dvh flex-col h-full min-w-0">
        <header className="md:hidden flex items-center justify-between border-b border-border/60 px-3 h-14 bg-card/90 backdrop-blur-md">
          <Link to="/admin" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="ShopBazzar"
              className="h-8 w-auto object-contain"
            />
            <span className="text-sm font-semibold tracking-wide">Admin</span>
          </Link>

          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetTrigger asChild>
              <button
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Open admin navigation"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[88vw] max-w-sm border-l border-border/60 bg-background/95 px-5 py-6 backdrop-blur-xl"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="font-display text-2xl">
                  Admin Panel
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-6 space-y-2">
                {navItems.map((item) => {
                  const active =
                    location.pathname === item.to ||
                    (item.to !== "/admin" &&
                      location.pathname.startsWith(item.to));

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border/60 bg-card/60 text-foreground hover:border-border hover:bg-accent"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 space-y-2 border-t border-border/60 pt-4">
                <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {user?.name?.charAt(0) || "A"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>

                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground"
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>

                <Link
                  to="/"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Store
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMobileSidebarOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 min-w-0 overflow-auto p-4 sm:p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
