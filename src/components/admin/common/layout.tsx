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
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { Moon, Sun } from "lucide-react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: Tags, label: "Categories" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

const AdminLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card h-full">
        <div className="p-6 border-b">
          <Link
            to="/"
            className="font-display text-xl font-bold text-foreground"
          >
            SHOPNOW
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
      <div className="flex-1 flex flex-col h-full">
        <header className="md:hidden flex items-center justify-between border-b px-4 h-14 bg-card">
          <Link to="/" className="font-display text-lg font-bold">
            LUMIÈRE
          </Link>
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`p-2 rounded-lg ${location.pathname === item.to ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                <item.icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
