import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Ticket, Package } from "lucide-react";
import { userService } from "@/services/userService";

interface UserDetailModalProps {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
}

const UserDetailModal = ({ userId, onOpenChange }: UserDetailModalProps) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getById(userId!),
    enabled: !!userId,
  });

  return (
    <Dialog open={!!userId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">User Details</DialogTitle>
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
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-lg">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
              <Badge variant="outline" className="capitalize">{user.role}</Badge>
            </div>

            <div className="grid grid-cols-4 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-xs">Orders</p>
                <p className="font-bold text-lg">{user.orders.length}</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-xs">Spent</p>
                <p className="font-bold text-lg">${user.spent.toLocaleString()}</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-xs">Wishlist</p>
                <p className="font-bold text-lg">{user.wishlist.length}</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-muted-foreground text-xs">Cart</p>
                <p className="font-bold text-lg">{user.cart.length}</p>
              </div>
            </div>

            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="orders" className="text-xs gap-1"><Package className="h-3 w-3" /> Orders</TabsTrigger>
                <TabsTrigger value="wishlist" className="text-xs gap-1"><Heart className="h-3 w-3" /> Wishlist</TabsTrigger>
                <TabsTrigger value="cart" className="text-xs gap-1"><ShoppingCart className="h-3 w-3" /> Cart</TabsTrigger>
                <TabsTrigger value="coupons" className="text-xs gap-1"><Ticket className="h-3 w-3" /> Coupons</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-4">
                {user.orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No orders</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left">Order ID</th>
                          <th className="p-2 text-left">Date</th>
                          <th className="p-2 text-center">Status</th>
                          <th className="p-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.orders.map((o) => (
                          <tr key={o.id} className="border-b">
                            <td className="p-2 font-mono text-xs">{o.id}</td>
                            <td className="p-2 text-xs">{o.date}</td>
                            <td className="p-2 text-center">
                              <Badge variant="outline" className="text-xs capitalize">{o.status}</Badge>
                            </td>
                            <td className="p-2 text-right font-medium">${o.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="wishlist" className="mt-4">
                {user.wishlist.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No wishlist items</p>
                ) : (
                  <div className="space-y-2">
                    {user.wishlist.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover" />
                        <p className="flex-1 text-sm font-medium">{item.name}</p>
                        <p className="text-sm font-medium">${item.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cart" className="mt-4">
                {user.cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Cart is empty</p>
                ) : (
                  <div className="space-y-2">
                    {user.cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">${item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="coupons" className="mt-4">
                {user.coupons.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No coupons assigned</p>
                ) : (
                  <div className="space-y-2">
                    {user.coupons.map((c) => (
                      <div key={c.code} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Ticket className="h-4 w-4 text-primary" />
                        <span className="font-mono text-sm font-bold">{c.code}</span>
                        <Badge variant="outline" className="text-xs">
                          {c.discount_type === "PERCENTAGE" ? `${c.discount_value}%` : `$${c.discount_value}`}
                        </Badge>
                        <Badge variant={c.is_active ? "default" : "secondary"} className="text-xs ml-auto">
                          {c.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <p className="text-xs text-muted-foreground">Joined: {user.joinedAt}</p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
