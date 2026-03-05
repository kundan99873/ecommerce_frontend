import { Link, useNavigate } from "react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cartContext";
import { useCoupon } from "@/context/couponContext";
import CouponInput from "./couponInput";
import CouponModal from "./couponModal";
import { formatCurrency } from "@/utils/utils";
import { useState } from "react";

const CartDrawer = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();
  const { discount, appliedCoupon } = useCoupon();
  const shipping = totalPrice >= 100 ? 0 : 9.99;
  const finalTotal = totalPrice - discount + shipping;

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    navigate("/checkout");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <ShoppingBag className="h-5 w-5 cursor-pointer" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="mt-4">
          <SheetTitle className="text-xl flex items-center gap-2 ">
            Shopping Cart ({totalItems})
            {totalItems == 0 && (
              <Button
                variant="outline"
                size="sm"
                className="ml-auto text-sm"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground">Your cart is empty</p>
            <Link to="/products">
              <Button variant="outline" className="mt-4" size="sm">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {items.map((product) => (
                <div
                  key={product.slug}
                  className="flex gap-3 p-3 bg-secondary/50 rounded-lg"
                >
                  <Link to={`/product/${product.slug}`} className="shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-16 object-cover rounded"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.slug}`}>
                      <p className="text-sm font-medium truncate hover:text-primary transition-colors">
                        {product.name}
                      </p>
                    </Link>
                    <div className="text-xs text-muted-foreground mt-0.5 space-x-2">
                      {product.size && <span>Size: {product.size}</span>}
                      {product.color && <span>Color: {product.color}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() =>
                            updateQuantity(product.sku, product.quantity - 1)
                          }
                          className="px-2 py-1 cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs">{product.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(product.sku, product.quantity + 1)
                          }
                          className="px-2 py-1"
                        >
                          <Plus className="h-3 w-3 cursor-pointer" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {formatCurrency(product.subtotal)}
                        </span>
                        <button
                          onClick={() => removeItem(product.sku)}
                          className="text-muted-foreground hover:text-destructive"
                        >
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
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : formatCurrency(shipping)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
              <Button className="w-full py-5 text-sm font-semibold tracking-wide" onClick={handleCheckout}>
                Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Add {formatCurrency(100 - totalPrice)} more for free shipping
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
