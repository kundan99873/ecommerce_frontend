import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { toast } from "@/hooks/useToast";
import {
  useAddToCart,
  useApplyCartCoupon,
  useClearCart,
  useGetCartItems,
  useRemoveCartCoupon,
  useRemoveFromCart,
  useUpdateCartItem,
} from "@/services/cart/cart.query";
import type { CartCoupon, CartItem } from "@/services/cart/cart.types";

interface CartContextType {
  items: CartItem[];
  addItem: (slug: string, quantity?: number, coupon_id?: number) => void;
  applyCoupon: (couponId: number) => void;
  removeCoupon: () => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  appliedCoupon: CartCoupon | null;
  discount: number;
  loading: boolean;
  addingSku: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const {
    data: cartData,
    isLoading: cartLoading,
    isFetching,
  } = useGetCartItems();
  useEffect(() => {
    if (cartData?.success) {
      setItems(cartData.data.items);
    }
  }, [cartData]);

  const addToCart = useAddToCart();
  const applyCartCoupon = useApplyCartCoupon();
  const removeCartCoupon = useRemoveCartCoupon();
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();
  const clearCartItem = useClearCart();

  const addItem = useCallback(
    (slug: string, quantity = 1, coupon_id?: number) => {
      addToCart.mutateAsync(
        {
          slug,
          quantity,
          ...(coupon_id !== undefined ? { coupon_id } : {}),
        },
        {
          onSuccess: (data) => {
            console.log({ data });
            toast({
              title: "Added to cart",
              description: `Product has been added to your cart.`,
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to add product to cart: ${error.message}`,
            });
          },
        },
      );
    },
    [addToCart],
  );

  const applyCoupon = useCallback(
    (couponId: number) => {
      applyCartCoupon.mutate(couponId, {
        onSuccess: () => {
          toast({
            title: "Coupon applied",
            description: "Coupon has been applied to your cart.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to apply coupon: ${error.message}`,
          });
        },
      });
    },
    [applyCartCoupon],
  );

  const removeCoupon = useCallback(() => {
    removeCartCoupon.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Coupon removed",
          description: "You can now add another coupon.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to remove coupon: ${error.message}`,
        });
      },
    });
  }, [removeCartCoupon]);

  const addingSku =
    addToCart.isPending && addToCart.variables
      ? addToCart.variables.slug
      : null;

  const removeItem = useCallback(
    (slug: string) => {
      removeFromCart.mutate(slug, {
        onSuccess: () => {
          toast({
            title: "Removed from cart",
            // description: `${item.product.name} has been removed from your cart.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to remove product from cart: ${error.message}`,
          });
        },
      });
    },
    [removeFromCart],
  );

  const updateQuantity = useCallback(
    (slug: string, quantity: number) => {
      const item = items.find((i) => i.sku === slug);
      if (!item) return;
      updateCartItem.mutate(
        { slug, quantity },
        {
          onSuccess: () => {
            toast({
              title: "Cart updated",
              description: `Quantity for ${item.name} has been updated.`,
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to update cart item: ${error.message}`,
            });
          },
        },
      );
    },
    [items, updateCartItem],
  );

  const clearCart = useCallback(() => {
    clearCartItem.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to clear cart: ${error.message}`,
        });
      },
    });
  }, [clearCartItem]);

  const totalItems = cartData?.data.total_items || 0;
  const totalPrice = cartData?.data.total_price || 0;
  const appliedCoupon = cartData?.data.used_coupon ?? null;

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;

    const rawDiscount =
      appliedCoupon.discount_type === "PERCENTAGE"
        ? (totalPrice * appliedCoupon.discount_value) / 100
        : appliedCoupon.discount_value;

    if (appliedCoupon.max_discount) {
      return Math.min(rawDiscount, appliedCoupon.max_discount, totalPrice);
    }

    return Math.min(rawDiscount, totalPrice);
  }, [appliedCoupon, totalPrice]);

  const loading = useMemo(
    () =>
      cartLoading ||
      isFetching ||
      addToCart.isPending ||
      applyCartCoupon.isPending ||
      removeCartCoupon.isPending ||
      removeFromCart.isPending ||
      updateCartItem.isPending ||
      clearCartItem.isPending,
    [
      cartLoading,
      isFetching,
      addToCart.isPending,
      applyCartCoupon.isPending,
      removeCartCoupon.isPending,
      removeFromCart.isPending,
      updateCartItem.isPending,
      clearCartItem.isPending,
    ],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        applyCoupon,
        removeCoupon,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        appliedCoupon,
        discount,
        loading,
        addingSku,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
