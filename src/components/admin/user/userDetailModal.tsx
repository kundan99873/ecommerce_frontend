import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Ticket, Package, MapPin } from "lucide-react";
import { useGetUserByUserIdForAdmin } from "@/services/user/user.query";
import { formatCurrency } from "@/utils/utils";

interface UserDetailModalProps {
  userId: number | null;
  onOpenChange: (open: boolean) => void;
}

const UserDetailModal = ({ userId, onOpenChange }: UserDetailModalProps) => {
  const { data, isLoading } = useGetUserByUserIdForAdmin(userId);
  const user: any = data?.data ?? (data as any)?.user ?? (data as any)?.result;
  const personalInfo = user?.personal_info ?? {
    name: user?.name,
    email: user?.email,
    avatar_url: user?.avatar_url,
    role: user?.role,
    status: user?.status,
    phone_code: user?.phone_code,
    phone_number: user?.phone_number,
  };
  const orders = user?.order_details ?? user?.orders ?? [];
  const wishlist = user?.wishlist_details ?? user?.wishlist ?? [];
  const cart = user?.cart_details ?? user?.cart ?? [];
  const coupons = user?.coupons ?? [];
  const addresses = user?.addresses ?? [];
  const totalCartItems = cart.reduce(
    (sum: number, item: any) => sum + Number(item.quantity ?? 0),
    0,
  );
  const totalCartAmount = cart.reduce(
    (sum: number, item: any) =>
      sum + Number(item.subtotal ?? (item.price ?? 0) * (item.quantity ?? 0)),
    0,
  );
  const summary = user?.summary ?? {
    total_orders: user?.total_orders ?? orders.length,
    total_spend: user?.total_spend ?? user?.total_spent ?? 0,
    total_wishlist_items: user?.total_wishlist_items ?? wishlist.length,
    total_addresses: user?.total_addresses ?? addresses.length,
  };
  const displayName =
    personalInfo?.name ||
    [personalInfo?.first_name, personalInfo?.last_name]
      .filter(Boolean)
      .join(" ") ||
    personalInfo?.email ||
    "User";

  return (
    <Dialog open={!!userId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">User Details</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed profile, order, cart, wishlist, coupon, and address data
            for the selected user.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                {displayName.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <p className="font-medium text-lg">{displayName}</p>
                <p className="text-sm text-muted-foreground">
                  {personalInfo?.email || "-"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {personalInfo?.phone_code || ""}{" "}
                  {personalInfo?.phone_number || ""}
                </p>
              </div>
              <Badge
                variant={
                  String(personalInfo.status).toLowerCase() === "active"
                    ? "default"
                    : "destructive"
                }
              >
                {personalInfo.status}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {personalInfo.role}
              </Badge>
            </div>

            <div className="grid grid-cols-4 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-xs">Orders</p>
                <p className="font-bold text-lg">
                  {summary?.total_orders ?? orders.length}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-xs">Spent</p>
                <p className="font-bold text-lg">
                  {formatCurrency(summary?.total_spend ?? 0)}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-xs">Wishlist</p>
                <p className="font-bold text-lg">
                  {summary?.total_wishlist_items ?? wishlist.length}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-xs">Addresses</p>
                <p className="font-bold text-lg">
                  {summary?.total_addresses ?? addresses.length}
                </p>
              </div>
            </div>

            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="orders" className="text-xs gap-1">
                  <Package className="h-3 w-3" /> Orders
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="text-xs gap-1">
                  <Heart className="h-3 w-3" /> Wishlist
                </TabsTrigger>
                <TabsTrigger value="cart" className="text-xs gap-1">
                  <ShoppingCart className="h-3 w-3" /> Cart
                </TabsTrigger>
                <TabsTrigger value="coupons" className="text-xs gap-1">
                  <Ticket className="h-3 w-3" /> Coupons
                </TabsTrigger>
                <TabsTrigger value="addresses" className="text-xs gap-1">
                  <MapPin className="h-3 w-3" /> Addresses
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-4">
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No orders
                  </p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((o: any) => (
                      <div key={o.order_number} className="rounded-lg border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-mono text-muted-foreground">
                            {o.order_number}
                          </p>
                          <Badge variant="outline" className="text-xs capitalize">
                            {o.status}
                          </Badge>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                          <p className="text-muted-foreground">
                            {o.purchase_date
                              ? new Date(o.purchase_date).toLocaleString()
                              : "-"}
                          </p>
                          <p className="font-semibold">
                            {formatCurrency(o.final_amount ?? o.total_amount ?? 0)}
                          </p>
                        </div>

                        {Array.isArray(o.items) && o.items.length > 0 && (
                          <div className="mt-3 space-y-2 border-t pt-3">
                            {o.items.map((item: any, idx: number) => {
                              const itemImage = item?.images?.[0]?.image_url;
                              const qty = Number(item.quantity ?? 0);
                              const lineTotal = Number(item.price ?? 0) * qty;

                              return (
                                <div
                                  key={`${o.order_number}-${item.slug ?? item.name ?? idx}`}
                                  className="flex items-center gap-3 rounded-md bg-muted/30 p-2"
                                >
                                  {itemImage ? (
                                    <img
                                      src={itemImage}
                                      alt={item.name}
                                      className="h-10 w-10 rounded object-cover"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded bg-muted" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {qty}
                                      {item.color ? ` • ${item.color}` : ""}
                                      {item.size ? ` • ${item.size}` : ""}
                                    </p>
                                  </div>
                                  <p className="text-sm font-medium">
                                    {formatCurrency(lineTotal)}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="wishlist" className="mt-4">
                {wishlist.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No wishlist items
                  </p>
                ) : (
                  <div className="space-y-2">
                    {wishlist.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                      >
                        <img
                          src={item.variants?.[0]?.images?.[0]?.image_url}
                          alt={item.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <p className="flex-1 text-sm font-medium">
                          {item.name}
                        </p>
                        <p className="text-sm font-medium">
                          {formatCurrency(
                            item.variants?.[0]?.discounted_price ?? 0,
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cart" className="mt-4">
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Cart is empty
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                      <p>
                        Items: <span className="font-semibold">{totalCartItems}</span>
                      </p>
                      <p>
                        Total: <span className="font-semibold">{formatCurrency(totalCartAmount)}</span>
                      </p>
                    </div>

                    {cart.map((item: any) => (
                      <div
                        key={item.sku ?? item.id}
                        className="flex items-center gap-3 rounded-lg bg-muted/30 p-2"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                            {item.color ? ` • ${item.color}` : ""}
                            {item.size ? ` • ${item.size}` : ""}
                          </p>
                          <p className="text-xs text-muted-foreground">SKU: {item.sku ?? "-"}</p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatCurrency(item.subtotal ?? item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="coupons" className="mt-4">
                {coupons.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No coupons assigned
                  </p>
                ) : (
                  <div className="space-y-2">
                    {coupons.map((c: any) => (
                      <div
                        key={c.code}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <Ticket className="h-4 w-4 text-primary" />
                        <span className="font-mono text-sm font-bold">
                          {c.code}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {c.discount_type === "PERCENTAGE"
                            ? `${c.discount_value}%`
                            : formatCurrency(c.discount_value)}
                        </Badge>
                        <Badge
                          variant={c.is_active ? "default" : "secondary"}
                          className="text-xs ml-auto"
                        >
                          {c.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="addresses" className="mt-4">
                {addresses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No addresses available
                  </p>
                ) : (
                  <div className="space-y-2">
                    {addresses.map((addr: any) => (
                      <div
                        key={addr.id}
                        className="rounded-lg border p-3 text-sm"
                      >
                        <p className="font-medium">
                          {addr.first_name} {addr.last_name}
                        </p>
                        <p className="text-muted-foreground">
                          {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city},{" "}
                          {addr.state}, {addr.pin_code}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No user details available for this record.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
