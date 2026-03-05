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
  useClearCart,
  useGetCartItems,
  useRemoveFromCart,
  useUpdateCartItem,
} from "@/services/cart/cart.query";
import type { CartItem } from "@/services/cart/cart.types";

interface CartContextType {
  items: CartItem[];
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
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
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();
  const clearCartItem = useClearCart();

  const addItem = useCallback(
    (slug: string, quantity = 1) => {
      addToCart.mutateAsync(
        { slug, quantity },
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
      console.log({ item, items, slug });
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

  const loading = useMemo(
    () =>
      cartLoading ||
      isFetching ||
      addToCart.isPending ||
      removeFromCart.isPending ||
      updateCartItem.isPending ||
      clearCartItem.isPending,
    [
      cartLoading,
      isFetching,
      addToCart.isPending,
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
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
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
