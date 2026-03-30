export interface DashboardDateRange {
  from: string;
  to: string;
}

export interface DashboardSummary {
  total_revenue: number;
  total_orders: number;
  total_users: number;
  total_products: number;
  avg_order_value: number;
  conversion_rate: number;
  active_customers: number;
}

export interface DashboardGrowthVsPreviousPeriod {
  total_revenue: number | null;
  total_orders: number | null;
  total_users: number | null;
  total_products: number | null;
  avg_order_value: number | null;
  conversion_rate: number | null;
  active_customers: number | null;
}

export interface AdminDashboardHomeData {
  filter: DashboardDateRange;
  comparison_period: DashboardDateRange;
  summary: DashboardSummary;
  growth_vs_previous_period: DashboardGrowthVsPreviousPeriod;
}

export interface AdminDashboardHomeResponse {
  success: boolean;
  message: string;
  data: AdminDashboardHomeData;
}

export interface GetAdminDashboardHomeQuery {
  from?: string;
  to?: string;
}

export type RevenueGroupBy = "day" | "week" | "month";

export interface AdminRevenueTimelinePoint {
  key: string;
  label: string;
  revenue: number;
}

export interface AdminRevenueTimelineData {
  group_by: RevenueGroupBy;
  from: string;
  to: string;
  total_revenue: number;
  series: AdminRevenueTimelinePoint[];
}

export interface AdminRevenueTimelineResponse {
  success: boolean;
  message: string;
  data: AdminRevenueTimelineData;
}

export interface GetAdminRevenueTimelineQuery {
  group_by?: RevenueGroupBy;
  from?: string;
  to?: string;
}

export interface SalesByCategoryItem {
  category_id: number;
  name: string;
  revenue: number;
  units_sold: number;
  percentage: number;
}

export interface AdminSalesByCategoryData {
  from: string;
  to: string;
  total_revenue: number;
  categories: SalesByCategoryItem[];
}

export interface AdminSalesByCategoryResponse {
  success: boolean;
  message: string;
  data: AdminSalesByCategoryData;
}

export interface SalesByCategoryQuery {
  from?: string;
  to?: string;
}

export interface OrderStatusSummaryItem {
  status: string;
  label: string;
  count: number;
  percentage: number;
}

export interface AdminOrderStatusSummaryData {
  from: string;
  to: string;
  total_orders: number;
  statuses: OrderStatusSummaryItem[];
}

export interface AdminOrderStatusSummaryResponse {
  success: boolean;
  message: string;
  data: AdminOrderStatusSummaryData;
}

export interface GetAdminOrderStatusSummaryQuery {
  from?: string;
  to?: string;
}

export interface AdminRecentOrder {
  order_number: string;
  order_date: string;
  status: string;
  payment_status: string;
  final_amount: number;
}

export interface AdminRecentOrdersData {
  from: string;
  to: string;
  limit: number;
  total: number;
  orders: AdminRecentOrder[];
}

export interface AdminRecentOrdersResponse {
  success: boolean;
  message: string;
  data: AdminRecentOrdersData;
}

export interface GetAdminRecentOrdersQuery {
  from?: string;
  to?: string;
  limit?: number;
}

export interface AdminLowStockProduct {
  product_variant_id: number;
  product_id: number;
  name: string;
  slug: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  stock_status: "out_of_stock" | "low_stock";
  image_url: string;
}

export interface AdminLowStockProductsData {
  threshold: number;
  limit: number;
  stock_type: string;
  total: number;
  products: AdminLowStockProduct[];
}

export interface AdminLowStockProductsResponse {
  success: boolean;
  message: string;
  data: AdminLowStockProductsData;
}

export interface GetAdminLowStockProductsQuery {
  limit?: number;
  threshold?: number;
  stock_type?: "all" | "low_stock" | "out_of_stock";
}
