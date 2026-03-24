import { api } from "@/api/api";
import type { AddOrderBody, UpdateOrderStatusBody } from "./order.types";

const addOrderApi = async (data: AddOrderBody) => {
  const response = await api.post("/order", data);
  return response.data;
};

const getOrdersApi = async () => {
  const response = await api.get("/order");
  return response.data;
};

const getOrderByIdApi = async (id: string) => {
  const response = await api.get(`/order/${id}`);
  return response.data;
};

const getAllOrdersApi = async () => {
  const response = await api.get("/order/all");
  return response.data;
};

const updateOrderStatusApi = async (
  orderNumber: string,
  data: UpdateOrderStatusBody,
) => {
  const response = await api.patch(`/order/${orderNumber}/status`, data);
  return response.data;
};

export {
  addOrderApi,
  getOrdersApi,
  getOrderByIdApi,
  getAllOrdersApi,
  updateOrderStatusApi,
};
