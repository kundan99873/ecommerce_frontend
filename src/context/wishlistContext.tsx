import React, { createContext, useContext, useCallback, useMemo } from "react";
import { toast } from "@/hooks/useToast";
import {
  useAddToWishlist,
  useGetWishlist,
  useRemoveFromWishlist,
} from "@/services/wishlist/wishlist.query";
import type { Product } from "@/services/product/product.types";
import { useAuth } from "@/context/authContext";

interface WishlistContextType {
  items: Product[];
  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  toggleItem: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
  loading: boolean;
  moveLoading: string | null;
  removeLoading: string | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isFetching } = useGetWishlist(isAuthenticated);

  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const items = isAuthenticated ? (data?.data ?? []) : [];

  const addItem = useCallback(
    (slug: string) => {
      addMutation.mutate(slug, {
        onSuccess: () => {
          toast({ title: "Added to wishlist" });
        },
        onError: () => {
          toast({ title: "Failed to add to wishlist" });
        },
      });
    },
    [addMutation],
  );

  const removeItem = useCallback(
    (slug: string) => {
      removeMutation.mutate(slug, {
        onSuccess: () => {
          toast({ title: "Removed from wishlist" });
        },
        onError: () => {
          toast({ title: "Failed to remove" });
        },
      });
    },
    [removeMutation],
  );

  const toggleItem = useCallback(
    (slug: string) => {
      const exists = items.some((item) => item.variants[0].sku === slug);

      if (exists) {
        removeItem(slug);
      } else {
        addItem(slug);
      }
    },
    [items, addItem, removeItem],
  );

  const isInWishlist = useCallback(
    (slug: string) => items.some((item) => item.variants[0].sku === slug),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      toggleItem,
      isInWishlist,
      loading: isAuthenticated ? isLoading || isFetching : false,
      moveLoading:
        addMutation.isPending && addMutation.variables
          ? addMutation.variables
          : null,
      removeLoading:
        removeMutation.isPending && removeMutation.variables
          ? removeMutation.variables
          : null,
    }),
    [
      items,
      addItem,
      removeItem,
      toggleItem,
      isInWishlist,
      isAuthenticated,
      isLoading,
      isFetching,
      addMutation.isPending,
      removeMutation.isPending,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
};

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useEffect,
// } from "react";
// import type { Product } from "@/data/products";
// import { toast } from "@/hooks/useToast";

// interface WishlistContextType {
//   items: Product[];
//   addItem: (product: Product) => void;
//   removeItem: (productId: number) => void;
//   toggleItem: (product: Product) => void;
//   isInWishlist: (productId: number) => boolean;
// }

// const WishlistContext = createContext<WishlistContextType | undefined>(
//   undefined,
// );

// export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [items, setItems] = useState<Product[]>(() => {
//     try {
//       const saved = localStorage.getItem("lumiere-wishlist");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   useEffect(() => {
//     localStorage.setItem("lumiere-wishlist", JSON.stringify(items));
//   }, [items]);

//   const addItem = useCallback((product: Product) => {
//     setItems((prev) => {
//       if (prev.find((p) => p.id === product.id)) return prev;
//       return [...prev, product];
//     });
//     toast({
//       title: "Added to wishlist",
//       description: `${product.name} saved.`,
//     });
//   }, []);

//   const removeItem = useCallback((productId: number) => {
//     setItems((prev) => prev.filter((p) => p.id !== productId));
//   }, []);

//   const toggleItem = useCallback((product: Product) => {
//     setItems((prev) => {
//       const exists = prev.find((p) => p.id === product.id);
//       if (exists) {
//         toast({ title: "Removed from wishlist" });
//         return prev.filter((p) => p.id !== product.id);
//       }
//       toast({
//         title: "Added to wishlist",
//         description: `${product.name} saved.`,
//       });
//       return [...prev, product];
//     });
//   }, []);

//   const isInWishlist = useCallback(
//     (productId: number) => items.some((p) => p.id === productId),
//     [items],
//   );

//   return (
//     <WishlistContext.Provider
//       value={{ items, addItem, removeItem, toggleItem, isInWishlist }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => {
//   const ctx = useContext(WishlistContext);
//   if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
//   return ctx;
// };
