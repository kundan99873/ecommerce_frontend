import { useMemo, useState } from "react";
import {
  OverviewSection,
  SecondaryStats,
  DashboardFilters,
  RevenueChart,
  TopProductsCard,
  VisitorsConversionsChart,
  SalesByCategoryChart,
  OrderStatusCard,
  RecentOrdersCard,
  LowStockAlertsCard,
  TopCustomersCard,
} from "@/components/admin/dashboard";
import { getDashboardStats, mockUsers } from "@/data/adminData";
import {
  useGetAdminDashboardHome,
  useGetAdminLowStockProducts,
  useGetAdminOrderStatusSummary,
  useGetAdminRecentOrders,
  useGetAdminRevenueTimeline,
  useGetAdminSalesByCategory,
} from "@/services/admin/dashboard.query";
import type { RevenueGroupBy } from "@/services/admin/dashboard.types";

const conversionData = [
  { day: "Mon", visitors: 1200, conversions: 48 },
  { day: "Tue", visitors: 1400, conversions: 63 },
  { day: "Wed", visitors: 1100, conversions: 41 },
  { day: "Thu", visitors: 1600, conversions: 72 },
  { day: "Fri", visitors: 1900, conversions: 95 },
  { day: "Sat", visitors: 2200, conversions: 110 },
  { day: "Sun", visitors: 1800, conversions: 81 },
];

const Dashboard = () => {
  const toDateInputValue = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  };

  const today = useMemo(() => new Date(), []);
  const firstDayOfMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today],
  );

  const [fromDate, setFromDate] = useState<string>(
    toDateInputValue(firstDayOfMonth),
  );
  const [toDate, setToDate] = useState<string>(toDateInputValue(today));
  const [revenueGroupBy, setRevenueGroupBy] = useState<RevenueGroupBy>("week");

  const dashboardQueryParams = useMemo(() => {
    if (!fromDate && !toDate) return undefined;

    const from = fromDate
      ? new Date(`${fromDate}T00:00:00.000Z`).toISOString()
      : undefined;
    const to = toDate
      ? new Date(`${toDate}T23:59:59.999Z`).toISOString()
      : undefined;

    return { from, to };
  }, [fromDate, toDate]);

  const {
    data: dashboardResponse,
    isLoading,
    isFetching,
  } = useGetAdminDashboardHome(dashboardQueryParams);
  const {
    data: revenueTimelineResponse,
    isLoading: isRevenueLoading,
    isFetching: isRevenueFetching,
  } = useGetAdminRevenueTimeline({
    ...dashboardQueryParams,
    group_by: revenueGroupBy,
  });
  const {
    data: salesByCategoryResponse,
    isLoading: isSalesByCategoryLoading,
    isFetching: isSalesByCategoryFetching,
  } = useGetAdminSalesByCategory(dashboardQueryParams);
  const {
    data: orderStatusResponse,
    isLoading: isOrderStatusLoading,
    isFetching: isOrderStatusFetching,
  } = useGetAdminOrderStatusSummary(dashboardQueryParams);
  const {
    data: recentOrdersResponse,
    isLoading: isRecentOrdersLoading,
    isFetching: isRecentOrdersFetching,
  } = useGetAdminRecentOrders({
    ...dashboardQueryParams,
    limit: 5,
  });
  const {
    data: lowStockResponse,
    isLoading: isLowStockLoading,
    isFetching: isLowStockFetching,
  } = useGetAdminLowStockProducts({
    limit: 5,
    stock_type: "all",
  });

  const loading = isLoading || isFetching;
  const revenueLoading = isRevenueLoading || isRevenueFetching;
  const salesByCategoryLoading =
    isSalesByCategoryLoading || isSalesByCategoryFetching;
  const orderStatusLoading = isOrderStatusLoading || isOrderStatusFetching;
  const recentOrdersLoading = isRecentOrdersLoading || isRecentOrdersFetching;
  const lowStockLoading = isLowStockLoading || isLowStockFetching;
  const stats = getDashboardStats();

  const summary = dashboardResponse?.data?.summary;
  const growth = dashboardResponse?.data?.growth_vs_previous_period;
  const revenueSeries = revenueTimelineResponse?.data?.series ?? [];
  const categorySeries = salesByCategoryResponse?.data?.categories ?? [];
  const orderStatusSeries = orderStatusResponse?.data?.statuses ?? [];
  const recentOrders = recentOrdersResponse?.data?.orders ?? [];
  const lowStockProducts = lowStockResponse?.data?.products ?? [];

  const getGrowthMeta = (value: number | null | undefined) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return undefined;
    }

    const sign = value > 0 ? "+" : value < 0 ? "-" : "";
    const absolute = Math.abs(value);
    const formatted = Number.isInteger(absolute)
      ? `${absolute}`
      : absolute
          .toFixed(2)
          .replace(/\.0+$/, "")
          .replace(/(\.\d*[1-9])0+$/, "$1");

    const changeType: "up" | "down" = value >= 0 ? "up" : "down";

    return {
      change: `${sign}${formatted}%`,
      changeType,
    };
  };

  const avgOrderValue = summary
    ? summary.avg_order_value
    : stats.totalRevenue / (stats.totalOrders || 1);

  const fallbackConversionRate = (
    (conversionData.reduce((s, d) => s + d.conversions, 0) /
      conversionData.reduce((s, d) => s + d.visitors, 0)) *
    100
  ).toFixed(1);

  const conversionRate =
    summary?.conversion_rate !== undefined && summary?.conversion_rate !== null
      ? summary.conversion_rate.toFixed(2)
      : fallbackConversionRate;

  const revenueGrowth = getGrowthMeta(growth?.total_revenue);
  const orderGrowth = getGrowthMeta(growth?.total_orders);
  const userGrowth = getGrowthMeta(growth?.total_users);
  const productGrowth = getGrowthMeta(growth?.total_products);

  const topCustomers = [...mockUsers]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  const topProducts = (stats?.topProducts ?? []).map((product) => ({
    id: String(product.id),
    name: product.name,
    image: product.image,
    reviews: product.reviews,
    price: product.price,
  }));

  const mappedCategorySeries = categorySeries.map((category) => ({
    ...category,
    category_id: String(category.category_id),
  }));

  const mappedLowStockProducts = lowStockProducts.map((product) => ({
    ...product,
    product_id: String(product.product_id),
    product_variant_id: String(product.product_variant_id),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your store performance
          </p>
        </div>

        <DashboardFilters
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onReset={() => {
            setFromDate(toDateInputValue(firstDayOfMonth));
            setToDate(toDateInputValue(today));
          }}
        />
      </div>

      {/* Overview Section */}
      <OverviewSection
        loading={loading}
        totalRevenue={summary?.total_revenue ?? 0}
        totalOrders={summary?.total_orders ?? 0}
        totalUsers={summary?.total_users ?? 0}
        totalProducts={summary?.total_products ?? 0}
        revenueGrowth={revenueGrowth}
        orderGrowth={orderGrowth}
        userGrowth={userGrowth}
        productGrowth={productGrowth}
      />

      {/* Secondary Stats */}
      <SecondaryStats
        loading={loading}
        avgOrderValue={avgOrderValue}
        conversionRate={conversionRate}
        activeCustomers={
          summary?.active_customers ??
          mockUsers.filter((u) => u.status === "active").length
        }
      />

      {/* Revenue & Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart
          loading={revenueLoading}
          data={revenueSeries}
          groupBy={revenueGroupBy}
          onGroupByChange={setRevenueGroupBy}
        />
        <TopProductsCard loading={loading} products={topProducts} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitorsConversionsChart loading={loading} data={conversionData} />
        <SalesByCategoryChart
          loading={salesByCategoryLoading}
          data={mappedCategorySeries}
        />
      </div>

      {/* Order Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OrderStatusCard
          loading={orderStatusLoading}
          data={orderStatusSeries}
        />
        <RecentOrdersCard loading={recentOrdersLoading} orders={recentOrders} />
        <LowStockAlertsCard
          loading={lowStockLoading}
          products={mappedLowStockProducts}
        />
      </div>

      {/* Top Customers Section */}
      <TopCustomersCard loading={loading} customers={topCustomers} />
    </div>
  );
};

export default Dashboard;
