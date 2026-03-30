import { api } from "@/api/api";
import { cleanQueryParams } from "@/utils/utils";
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

const getAdminDashboardHomeApi = async (
  params?: GetAdminDashboardHomeQuery,
) => {
  const response = await api.get<AdminDashboardHomeResponse>(
    "/admin/dashboard/home",
    {
      params: cleanQueryParams(params ?? {}),
    },
  );
  return response.data;
};

const getAdminRevenueTimelineApi = async (
  params?: GetAdminRevenueTimelineQuery,
) => {
  const response = await api.get<AdminRevenueTimelineResponse>(
    "/admin/dashboard/revenue",
    {
      params: cleanQueryParams(params ?? {}),
    },
  );
  return response.data;
};

const getAdminSalesByCategoryApi = async (params?: SalesByCategoryQuery) => {
  const response = await api.get<AdminSalesByCategoryResponse>(
    "/admin/dashboard/sales-by-category",
    {
      params: cleanQueryParams(params ?? {}),
    },
  );
  return response.data;
};

const getAdminOrderStatusSummaryApi = async (
  params?: GetAdminOrderStatusSummaryQuery,
) => {
  const response = await api.get<AdminOrderStatusSummaryResponse>(
    "/admin/dashboard/order-status",
    {
      params: cleanQueryParams(params ?? {}),
    },
  );
  return response.data;
};

const getAdminRecentOrdersApi = async (params?: GetAdminRecentOrdersQuery) => {
  const response = await api.get<AdminRecentOrdersResponse>(
    "/admin/dashboard/recent-orders",
    {
      params: cleanQueryParams(params ?? {}),
    },
  );
  return response.data;
};

const getAdminLowStockProductsApi = async (
  params?: GetAdminLowStockProductsQuery,
) => {
  const response = await api.get<AdminLowStockProductsResponse>(
    "/admin/dashboard/low-stock",
    {
      params: cleanQueryParams(params ?? {}),
    },
  );
  return response.data;
};

export {
  getAdminDashboardHomeApi,
  getAdminRevenueTimelineApi,
  getAdminSalesByCategoryApi,
  getAdminOrderStatusSummaryApi,
  getAdminRecentOrdersApi,
  getAdminLowStockProductsApi,
};
