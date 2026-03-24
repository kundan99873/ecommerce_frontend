import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  applyCartCoupon,
  clearCart,
  getAllCartCoupons,
  getCartItems,
  removeCartCoupon,
  removeFromCart,
  updateCartItem,
} from "./cart.api";
import type { CartBody, CartItem } from "./cart.types";
import type { ApiResponse } from "@/api/api.types";

export const cartKeys = {
  all: ["cart"],
};
const useGetCartItems = (enabled = true) => {
  return useQuery({
    queryFn: getCartItems,
    queryKey: cartKeys.all,
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, CartBody, { previousCart: any }>({
    mutationFn: addToCart,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      const previousCart = queryClient.getQueryData(cartKeys.all);

      queryClient.setQueryData(cartKeys.all, (old: any) => {
        if (!old?.data) return old;

        const existing = old.data.items.find(
          (i: any) => i.sku === newItem.slug,
        );

        let updatedItems;

        if (existing) {
          updatedItems = old.data.items.map((i: any) =>
            i.sku === newItem.slug
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i,
          );
        } else {
          updatedItems = [
            ...old.data.items,
            {
              sku: newItem.slug,
              quantity: newItem.quantity,
              name: "Updating...",
              price: 0,
            },
          ];
        }

        return {
          ...old,
          data: {
            ...old.data,
            items: updatedItems,
            total_items: old.data.total_items + newItem.quantity,
          },
        };
      });

      return { previousCart };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.all, context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, string, { previousCart: any }>({
    mutationFn: (slug: string) => removeFromCart(slug),

    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      const previousCart = queryClient.getQueryData(cartKeys.all);

      queryClient.setQueryData(cartKeys.all, (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.filter((item: CartItem) => item.sku !== slug),
            total_items:
              old.data.total_items -
              (old.data.items.find((item: CartItem) => item.sku === slug)
                ?.quantity ?? 0),
          },
        };
      });

      return { previousCart };
    },

    onError: (_err, _slug, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.all, context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    Error,
    { slug: string; quantity: number },
    { previousCart: any }
  >({
    mutationFn: (body) => updateCartItem(body),

    onMutate: async ({ slug, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      const previousCart = queryClient.getQueryData(cartKeys.all);

      queryClient.setQueryData(cartKeys.all, (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((item: CartItem) =>
              item.sku === slug ? { ...item, quantity } : item,
            ),
          },
        };
      });

      return { previousCart };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.all, context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, void, { previousCart: any }>({
    mutationFn: () => clearCart(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });

      const previousCart = queryClient.getQueryData(cartKeys.all);

      queryClient.setQueryData(cartKeys.all, (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: [],
            total_items: 0,
            total_price: 0,
          },
        };
      });

      return { previousCart };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.all, context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

const useApplyCartCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, string>({
    mutationFn: (couponCode) => applyCartCoupon(couponCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: ["cart_coupons"] });
    },
  });
};

const useRemoveCartCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, void>({
    mutationFn: () => removeCartCoupon(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: ["cart_coupons"] });
    },
  });
};

const useGetAllCartCoupons = () => {
  return useQuery({
    queryKey: ["cart_coupons"],
    queryFn: getAllCartCoupons,
  });
};

export {
  useGetCartItems,
  useAddToCart,
  useRemoveFromCart,
  useUpdateCartItem,
  useApplyCartCoupon,
  useRemoveCartCoupon,
  useGetAllCartCoupons,
  useClearCart,
};

// import { useMutation, useQuery } from "@tanstack/react-query";
// import {
//   addToCart,
//   clearCart,
//   getCartItems,
//   removeFromCart,
//   updateCartItem,
// } from "./cart.api";
// import { queryClient } from "@/api/client";
// import type { CartBody } from "./cart.types";

// export const cartKeys = {
//   all: ["cart"],
// };
// const useGetCartItems = () => {
//   return useQuery({
//     queryFn: getCartItems,
//     queryKey: cartKeys.all,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//   });
// };

// const useAddToCart = () => {
//   return useMutation({
//     mutationFn: (body: CartBody) => addToCart(body),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
//   });
// };

// const useRemoveFromCart = () => {
//   return useMutation({
//     mutationFn: (slug: string) => removeFromCart(slug),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
//   });
// };

// const useUpdateCartItem = () => {
//   return useMutation({
//     mutationFn: (body: CartBody) => updateCartItem(body),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
//   });
// };

// const useClearCart = () => {
//   return useMutation({
//     mutationFn: () => clearCart(),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
//   });
// };

// export {
//   useGetCartItems,
//   useAddToCart,
//   useRemoveFromCart,
//   useUpdateCartItem,
//   useClearCart,
// };
