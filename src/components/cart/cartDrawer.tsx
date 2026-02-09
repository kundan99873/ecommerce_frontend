import { Link } from "react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cartContext";
import { useCoupon } from "@/context/couponContext";
import CouponInput from "./couponInput";
import CouponModal from "./couponModal";


const CartDrawer = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { discount, appliedCoupon } = useCoupon();
  const shipping = totalPrice >= 100 ? 0 : 9.99;
  const finalTotal = totalPrice - discount + shipping;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Shopping Cart ({totalItems})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground">Your cart is empty</p>
            <Link to="/products">
              <Button variant="outline" className="mt-4" size="sm">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {items.map(({ product, quantity, size, color }) => (
                <div key={product.id} className="flex gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Link to={`/product/${product.id}`} className="shrink-0">
                    <img src={product.image} alt={product.name} className="h-20 w-16 object-cover rounded" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.id}`}>
                      <p className="text-sm font-medium truncate hover:text-primary transition-colors">{product.name}</p>
                    </Link>
                    <div className="text-xs text-muted-foreground mt-0.5 space-x-2">
                      {size && <span>Size: {size}</span>}
                      {color && <span>Color: {color}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded">
                        <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2 py-1">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs">{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2 py-1">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">${product.price * quantity}</span>
                        <button onClick={() => removeItem(product.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <CouponInput cartTotal={totalPrice} />
              <CouponModal cartTotal={totalPrice} />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="block">
                <Button className="w-full py-5 text-sm font-semibold tracking-wide">
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Add ${(100 - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
