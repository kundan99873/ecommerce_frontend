import { mockUsers, type AdminUser } from "@/data/adminData";
import { orders } from "@/data/products";

export interface UserDetail extends Omit<AdminUser, "orders"> {
  orderCount: number;
  orders: {
    id: string;
    date: string;
    status: string;
    total: number;
    itemCount: number;
  }[];
  wishlist: { id: number; name: string; price: number; image: string }[];
  cart: { id: number; name: string; price: number; quantity: number; image: string }[];
  coupons: { code: string; discount_type: string; discount_value: number; is_active: boolean }[];
}

export const userService = {
  getById: async (id: string): Promise<UserDetail> => {
    await new Promise((r) => setTimeout(r, 300));
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error("User not found");

    return {
      orderCount: user.orders,
      ...user,
      orders: orders.slice(0, Math.min(user.orders, 4)).map((o) => ({
        id: o.id,
        date: o.date,
        status: o.status,
        total: o.total,
        itemCount: o.items.reduce((s, i) => s + i.quantity, 0),
      })),
      wishlist: [
        { id: 1, name: "Cashmere Blend Overcoat", price: 289, image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=100&h=100&fit=crop" },
        { id: 5, name: "Gold Chain Necklace", price: 95, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop" },
      ],
      cart: [
        { id: 3, name: "Merino Wool Sweater", price: 128, quantity: 2, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop" },
      ],
      coupons: [
        { code: "WELCOME10", discount_type: "PERCENTAGE", discount_value: 10, is_active: true },
        { code: "FLAT20", discount_type: "FIXED", discount_value: 20, is_active: true },
      ],
    };
  },
};
