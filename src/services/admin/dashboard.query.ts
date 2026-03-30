import { useQuery } from "@tanstack/react-query";
import {
  getAdminDashboardHomeApi,
  getAdminLowStockProductsApi,
  getAdminOrderStatusSummaryApi,
  getAdminRecentOrdersApi,
  getAdminRevenueTimelineApi,
  getAdminSalesByCategoryApi,
} from "./dashboard.api";
import type {
  AdminDashboardHomeResponse,
  AdminLowStockProductsResponse,
  AdminOrderStatusSummaryResponse,
  AdminRecentOrdersResponse,
  AdminRevenueTimelineResponse,
  AdminSalesByCategoryResponse,
  GetAdminLowStockProductsQuery,
  GetAdminDashboardHomeQuery,
  GetAdminOrderStatusSummaryQuery,
  GetAdminRecentOrdersQuery,
  GetAdminRevenueTimelineQuery,
  SalesByCategoryQuery,
} from "./dashboard.types";

export const adminDashboardQueryKeys = {
  all: ["admin", "dashboard"],
  home: ["admin", "dashboard", "home"],
  revenue: ["admin", "dashboard", "revenue"],
  salesByCategory: ["admin", "dashboard", "sales-by-category"],
  orderStatus: ["admin", "dashboard", "order-status"],
  recentOrders: ["admin", "dashboard", "recent-orders"],
  lowStock: ["admin", "dashboard", "low-stock"],
};

const useGetAdminDashboardHome = (params?: GetAdminDashboardHomeQuery) => {
  return useQuery<AdminDashboardHomeResponse>({
    queryKey: [...adminDashboardQueryKeys.home, params],
    queryFn: () => getAdminDashboardHomeApi(params),
  });
};

const useGetAdminRevenueTimeline = (params?: GetAdminRevenueTimelineQuery) => {
  return useQuery<AdminRevenueTimelineResponse>({
    queryKey: [...adminDashboardQueryKeys.revenue, params],
    queryFn: () => getAdminRevenueTimelineApi(params),
  });
};

const useGetAdminSalesByCategory = (params?: SalesByCategoryQuery) => {
  return useQuery<AdminSalesByCategoryResponse>({
    queryKey: [...adminDashboardQueryKeys.salesByCategory, params],
    queryFn: () => getAdminSalesByCategoryApi(params),
  });
};

const useGetAdminOrderStatusSummary = (
  params?: GetAdminOrderStatusSummaryQuery,
) => {
  return useQuery<AdminOrderStatusSummaryResponse>({
    queryKey: [...adminDashboardQueryKeys.orderStatus, params],
    queryFn: () => getAdminOrderStatusSummaryApi(params),
  });
};

const useGetAdminRecentOrders = (params?: GetAdminRecentOrdersQuery) => {
  return useQuery<AdminRecentOrdersResponse>({
    queryKey: [...adminDashboardQueryKeys.recentOrders, params],
    queryFn: () => getAdminRecentOrdersApi(params),
  });
};

const useGetAdminLowStockProducts = (
  params?: GetAdminLowStockProductsQuery,
) => {
  return useQuery<AdminLowStockProductsResponse>({
    queryKey: [...adminDashboardQueryKeys.lowStock, params],
    queryFn: () => getAdminLowStockProductsApi(params),
  });
};

export {
  useGetAdminDashboardHome,
  useGetAdminRevenueTimeline,
  useGetAdminSalesByCategory,
  useGetAdminOrderStatusSummary,
  useGetAdminRecentOrders,
  useGetAdminLowStockProducts,
};
