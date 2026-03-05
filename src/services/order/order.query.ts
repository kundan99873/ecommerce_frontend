import { useMutation, useQuery } from "@tanstack/react-query";
import { addOrderApi, getOrdersApi } from "./order.api";
import type { ApiResponse } from "@/api/api.types";
import type { AddOrderBody, OrderResponse } from "./order.types";
import { queryClient } from "@/api/client";

export const orderQueryKeys = {
  all: ["order"],
};

const useAddOrder = () => {
  return useMutation<ApiResponse, Error, AddOrderBody>({
    mutationFn: addOrderApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all }),
  });
};

const useGetOrders = () => {
  return useQuery<OrderResponse>({
    queryFn: getOrdersApi,
    queryKey: orderQueryKeys.all,
  });
};

export { useAddOrder, useGetOrders };
