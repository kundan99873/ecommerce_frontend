import { Link } from "react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cartContext";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40" />
          <h1 className="text-2xl font-display font-bold mt-4">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">Looks like you haven't added anything yet.</p>
          <Link to="/products">
            <Button className="mt-6">Start Shopping</Button>
          </Link>
        </div>
      </>
    );
  }

  const shipping = totalPrice >= 100 ? 0 : 9.99;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity, size, color }) => (
              <div key={product.id} className="flex gap-4 p-4 bg-card rounded-lg border">
                <Link to={`/product/${product.id}`} className="shrink-0">
                  <img src={product.image} alt={product.name} className="h-28 w-24 object-cover rounded" />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/product/${product.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                      {product.name}
                    </Link>
                    <div className="text-xs text-muted-foreground mt-0.5 space-x-2">
                      {size && <span>Size: {size}</span>}
                      {color && <span>Color: {color}</span>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2 py-1">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2 py-1">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">${product.price * quantity}</span>
                      <button onClick={() => removeItem(product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border rounded-lg p-6 h-fit sticky top-24">
            <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${(totalPrice + shipping).toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full mt-6 py-6 text-sm font-semibold tracking-wide">
                Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Add ${(100 - totalPrice).toFixed(2)} more for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
