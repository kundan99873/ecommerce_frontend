import { products, orders } from "./products";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "blocked";
  joinedAt: string;
  orders: number;
  spent: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  createdAt: string;
  image?: string;
}

export const mockCategories: Category[] = [
  { id: "cat_1", name: "Clothing", slug: "clothing", productCount: products.filter(p => p.category === "Clothing").length, createdAt: "2024-01-15" },
  { id: "cat_2", name: "Shoes", slug: "shoes", productCount: products.filter(p => p.category === "Shoes").length, createdAt: "2024-01-15" },
  { id: "cat_3", name: "Bags", slug: "bags", productCount: products.filter(p => p.category === "Bags").length, createdAt: "2024-01-15" },
  { id: "cat_4", name: "Accessories", slug: "accessories", productCount: products.filter(p => p.category === "Accessories").length, createdAt: "2024-02-01" },
  { id: "cat_5", name: "Jewelry", slug: "jewelry", productCount: products.filter(p => p.category === "Jewelry").length, createdAt: "2024-03-10" },
];

export const mockUsers: AdminUser[] = [
  { id: "usr_1", name: "Alex Johnson", email: "demo@lumiere.com", role: "admin", status: "active", joinedAt: "2024-06-15", orders: 4, spent: 1077 },
  { id: "usr_2", name: "Sarah Chen", email: "sarah@example.com", role: "user", status: "active", joinedAt: "2024-07-20", orders: 8, spent: 2340 },
  { id: "usr_3", name: "Marcus Rivera", email: "marcus@example.com", role: "user", status: "active", joinedAt: "2024-08-05", orders: 3, spent: 890 },
  { id: "usr_4", name: "Emma Watson", email: "emma@example.com", role: "user", status: "blocked", joinedAt: "2024-09-12", orders: 1, spent: 165 },
  { id: "usr_5", name: "David Kim", email: "david@example.com", role: "user", status: "active", joinedAt: "2024-10-01", orders: 12, spent: 4520 },
  { id: "usr_6", name: "Olivia Brown", email: "olivia@example.com", role: "user", status: "active", joinedAt: "2024-11-18", orders: 6, spent: 1890 },
  { id: "usr_7", name: "James Wilson", email: "james@example.com", role: "admin", status: "active", joinedAt: "2024-06-20", orders: 2, spent: 450 },
];

export const monthlyRevenue = [
  { month: "Jul", revenue: 12400 },
  { month: "Aug", revenue: 18200 },
  { month: "Sep", revenue: 15800 },
  { month: "Oct", revenue: 22100 },
  { month: "Nov", revenue: 28900 },
  { month: "Dec", revenue: 35200 },
  { month: "Jan", revenue: 24600 },
  { month: "Feb", revenue: 19800 },
];

export const salesByCategory = [
  { category: "Clothing", sales: 42 },
  { category: "Shoes", sales: 28 },
  { category: "Bags", sales: 18 },
  { category: "Accessories", sales: 15 },
  { category: "Jewelry", sales: 12 },
];

export const getDashboardStats = () => ({
  totalRevenue: mockUsers.reduce((s, u) => s + u.spent, 0),
  totalOrders: mockUsers.reduce((s, u) => s + u.orders, 0),
  totalUsers: mockUsers.length,
  totalProducts: products.length,
  lowStockProducts: products.filter(p => !p.inStock),
  recentOrders: orders.slice(0, 5),
  topProducts: [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 5),
});
